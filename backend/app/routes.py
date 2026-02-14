from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, Product, Order, Category, Customer, Cart, CartItem, Setting
from app.schemas import (
    UserCreate, UserResponse,
    ProductCreate, ProductResponse,
    OrderCreate, OrderResponse,
    CategoryCreate, CategoryResponse,
    CustomerCreate, CustomerResponse,
    DashboardStats,
    CartResponse, CartItemResponse, CartItemCreate, AddToCartRequest, UpdateCartItemRequest, CartProductResponse
)
from app.auth import get_password_hash
import httpx

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Prodex Admin API", "version": "1.0.0"}


@router.get("/proxy-image")
async def proxy_image(url: str):
    """Proxy image URL to bypass CORS issues"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, 
                timeout=10.0,
                headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                }
            )
            if response.status_code != 200:
                raise HTTPException(status_code=404, detail=f"Image not found: {response.status_code}")
            
            content_type = response.headers.get("content-type", "image/jpeg")
            return Response(
                content=response.content,
                media_type=content_type,
                headers={
                    "Cache-Control": "public, max-age=86400",
                }
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")


@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    user_count = await db.scalar(select(func.count(User.id)))
    product_count = await db.scalar(select(func.count(Product.id)))
    order_count = await db.scalar(select(func.count(Order.id)))
    total_revenue = await db.scalar(select(func.sum(Order.total_amount))) or 0

    recent_orders = await db.execute(
        select(Order).order_by(Order.created_at.desc()).limit(5)
    )
    recent_orders = recent_orders.scalars().all()

    top_products = await db.execute(
        select(Product).order_by(Product.created_at.desc()).limit(5)
    )
    top_products = top_products.scalars().all()

    return DashboardStats(
        total_users=user_count or 0,
        total_products=product_count or 0,
        total_orders=order_count or 0,
        total_revenue=total_revenue,
        recent_orders=[OrderResponse.model_validate(o) for o in recent_orders],
        top_products=[ProductResponse.model_validate(p) for p in top_products]
    )


@router.get("/users", response_model=list[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()


@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.get("/products", response_model=list[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    return result.scalars().all()


@router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    
    await db.commit()
    await db.refresh(db_product)
    return db_product


@router.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(db_product)
    await db.commit()
    return {"message": "Product deleted successfully"}


@router.get("/orders", response_model=list[OrderResponse])
async def get_orders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).order_by(Order.created_at.desc()))
    return result.scalars().all()


@router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    db_order = Order(**order.model_dump())
    db.add(db_order)
    await db.commit()
    await db.refresh(db_order)
    return db_order


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order(order_id: int, order: OrderCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for key, value in order.model_dump().items():
        setattr(db_order, key, value)
    
    await db.commit()
    await db.refresh(db_order)
    return db_order


@router.delete("/orders/{order_id}")
async def delete_order(order_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await db.delete(db_order)
    await db.commit()
    return {"message": "Order deleted successfully"}


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    return result.scalars().all()


@router.post("/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: AsyncSession = Depends(get_db)):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.get("/categories/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, category: CategoryCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.model_dump().items():
        setattr(db_category, key, value)
    
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.delete(db_category)
    await db.commit()
    return {"message": "Category deleted successfully"}


@router.get("/customers", response_model=list[CustomerResponse])
async def get_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer))
    return result.scalars().all()


@router.post("/customers", response_model=CustomerResponse)
async def create_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    db_customer = Customer(**customer.model_dump())
    db.add(db_customer)
    await db.commit()
    await db.refresh(db_customer)
    return db_customer


@router.get("/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(customer_id: int, customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    db_customer = result.scalar_one_or_none()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for key, value in customer.model_dump().items():
        setattr(db_customer, key, value)
    
    await db.commit()
    await db.refresh(db_customer)
    return db_customer


@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    db_customer = result.scalar_one_or_none()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    await db.delete(db_customer)
    await db.commit()
    return {"message": "Customer deleted successfully"}


@router.get("/cart", response_model=CartResponse)
async def get_cart(
    customer_id: int | None = None,
    session_id: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    if not customer_id and not session_id:
        raise HTTPException(status_code=400, detail="customer_id or session_id required")
    
    if customer_id:
        result = await db.execute(select(Cart).where(Cart.customer_id == customer_id))
    else:
        result = await db.execute(select(Cart).where(Cart.session_id == session_id))
    
    cart = result.scalar_one_or_none()
    
    if not cart:
        return CartResponse(id=0, customer_id=customer_id, session_id=session_id, items=[], total_amount=0)
    
    items_result = await db.execute(
        select(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .where(CartItem.cart_id == cart.id)
    )
    
    items = []
    total = 0
    for item, product in items_result.all():
        items.append(CartItemResponse(
            id=item.id,
            cart_id=item.cart_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            product=CartProductResponse(
                id=product.id,
                name=product.name,
                thumbnail=product.thumbnail,
                image_url=product.image_url,
                price=product.price
            ),
            created_at=item.created_at
        ))
        total += item.price * item.quantity
    
    return CartResponse(
        id=cart.id,
        customer_id=cart.customer_id,
        session_id=cart.session_id,
        items=items,
        total_amount=total,
        created_at=cart.created_at,
        updated_at=cart.updated_at
    )


@router.post("/cart/add", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,
    db: AsyncSession = Depends(get_db)
):
    customer_id = request.customer_id
    session_id = request.session_id
    
    if not customer_id and not session_id:
        raise HTTPException(status_code=400, detail="customer_id or session_id required")
    
    if customer_id:
        result = await db.execute(select(Cart).where(Cart.customer_id == customer_id))
    else:
        result = await db.execute(select(Cart).where(Cart.session_id == session_id))
    
    cart = result.scalar_one_or_none()
    
    if not cart:
        cart = Cart(customer_id=customer_id, session_id=session_id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    
    product_result = await db.execute(select(Product).where(Product.id == request.product_id))
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    item_result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart.id,
            CartItem.product_id == request.product_id
        )
    )
    existing_item = item_result.scalar_one_or_none()
    
    if existing_item:
        existing_item.quantity += request.quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=request.product_id,
            quantity=request.quantity,
            price=product.price
        )
        db.add(new_item)
    
    await db.commit()
    
    return await get_cart(customer_id, session_id, db)


@router.put("/cart/item/{item_id}", response_model=CartResponse)
async def update_cart_item(
    item_id: int,
    request: UpdateCartItemRequest,
    customer_id: int | None = None,
    session_id: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if request.quantity <= 0:
        await db.delete(item)
    else:
        item.quantity = request.quantity
    
    await db.commit()
    
    return await get_cart(customer_id, session_id, db)


@router.delete("/cart/item/{item_id}")
async def remove_cart_item(
    item_id: int,
    customer_id: int | None = None,
    session_id: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    await db.delete(item)
    await db.commit()
    
    return await get_cart(customer_id, session_id, db)


@router.delete("/cart/clear")
async def clear_cart(
    customer_id: int | None = None,
    session_id: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    if customer_id:
        result = await db.execute(select(Cart).where(Cart.customer_id == customer_id))
    else:
        result = await db.execute(select(Cart).where(Cart.session_id == session_id))
    
    cart = result.scalar_one_or_none()
    if cart:
        items_result = await db.execute(select(CartItem).where(CartItem.cart_id == cart.id))
        for item in items_result.scalars().all():
            await db.delete(item)
        await db.commit()
    
    return {"message": "Cart cleared"}


@router.get("/settings")
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting))
    settings = result.scalars().all()
    return {s.setting_key: s.setting_value for s in settings}


@router.put("/settings/{key}")
async def update_setting(key: str, value: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting).where(Setting.setting_key == key))
    setting = result.scalar_one_or_none()
    
    if setting:
        setting.setting_value = value
    else:
        setting = Setting(setting_key=key, setting_value=value)
        db.add(setting)
    
    await db.commit()
    return {"message": "Setting updated", "key": key, "value": value}
