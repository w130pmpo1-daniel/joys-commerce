#!/usr/bin/env python3
import asyncio
from app.database import async_session, init_db
from app.models import Product, Category

LG_PRODUCTS = [
    # Refrigerators
    {"name": "LG InstaView Door-in-Door Refrigerator", "category": "Refrigerators", "brand": "LG", "model": "GC-B257KQJW", "price": 2499.99, "stock": 15, "description": "664L capacity with InstaView door-in-door technology", "features": "Door-in-Door, LED Lighting, Smart Diagnosis, LINEAR Cooling, Multi Air Flow", "specifications": "664L, Essence Graphite Color, Inverter Linear Compressor"},
    {"name": "LG Side-by-Side Refrigerator", "category": "Refrigerators", "brand": "LG", "model": "GC-B247QJWT", "price": 1799.99, "stock": 20, "description": "Standard side-by-side refrigerator with ample storage", "features": "LED Lighting, Smart Diagnosis, Multi Air Flow", "specifications": "600L, Modern Silver Color, Inverter Compressor"},
    {"name": "LG Top Freezer Refrigerator", "category": "Refrigerators", "brand": "LG", "model": "GL-B201ASKD", "price": 899.99, "stock": 25, "description": "Single door top freezer with 190L capacity", "features": "Smart Inverter, LED Lighting, Toughened Glass Shelves", "specifications": "190L, Scarlet Glass Color"},
    {"name": "LG Bottom Freezer Refrigerator", "category": "Refrigerators", "brand": "LG", "model": "GN-B202DSLD", "price": 1099.99, "stock": 18, "description": "Bottom freezer with 200L capacity", "features": "Smart Inverter, Door Cooling, Moist Balance Crisper", "specifications": "200L, Dispansar Silver"},
    {"name": "LG French Door Refrigerator", "category": "Refrigerators", "brand": "LG", "model": "GF-L247PLCL", "price": 2199.99, "stock": 12, "description": "French door refrigerator with 242L capacity", "features": "Door-in-Door, InstaView, Multi Air Flow, Hygiene Fresh+", "specifications": "242L, Platinum Silver"},
    
    # Washing Machines
    {"name": "LG WashTower", "category": "Washing Machines", "brand": "LG", "model": "WT7V3123W", "price": 1899.99, "stock": 10, "description": "All-in-one washer and dryer tower", "features": "AI DD, Steam+, WiFi, TurboWash 360", "specifications": "7.4 cu.ft. Front Load, 5.0 cu.ft. Top Load"},
    {"name": "LG Front Load Washer", "category": "Washing Machines", "brand": "LG", "model": "WM4200HWA", "price": 1299.99, "stock": 22, "description": "Front load washing machine with 4.5 cu.ft. capacity", "features": "AI DD, Steam+, TurboWash 360, WiFi", "specifications": "4.5 cu.ft., Graphite Steel"},
    {"name": "LG Top Load Washer", "category": "Washing Machines", "brand": "LG", "model": "WT7900HBA", "price": 899.99, "stock": 30, "description": "Top load washing machine with 5.5 cu.ft. capacity", "features": "TurboWash 3D, Steam+, WiFi, ColdWash", "specifications": "5.5 cu.ft., Graphite Steel"},
    {"name": "LG Twin Tub Washing Machine", "category": "Washing Machines", "brand": "LG", "model": "WT-T80SP", "price": 299.99, "stock": 40, "description": "Portable twin tub washing machine", "features": "Dual Wash System, Air Dry", "specifications": "8kg Wash, 5kg Spin"},
    {"name": "LG Front Load Washer Dryer Combo", "category": "Washing Machines", "brand": "LG", "model": "WD147V3205W", "price": 1599.99, "stock": 15, "description": "All-in-one washer dryer combo", "features": "AI DD, Steam+, TurboWash, WiFi", "specifications": "4.5 cu.ft. Wash, 7 cu.ft. Dry"},
    
    # Dishwashers
    {"name": "LG QuadWash Dishwasher", "category": "Dishwashers", "brand": "LG", "model": "LDFN4542W", "price": 799.99, "stock": 25, "description": "Smart dishwasher with QuadWash technology", "features": "QuadWash, Steam, WiFi, EasyRack Plus", "specifications": "15 Place Settings, Stainless Steel"},
    {"name": "LG Slim Dishwasher", "category": "Dishwashers", "brand": "LG", "model": "LDPN450WW", "price": 549.99, "stock": 20, "description": "Slim line dishwasher for compact spaces", "features": "Dual Zone, Half Load, Energy Saver", "specifications": "10 Place Settings, White"},
    
    # Microwaves
    {"name": "LG NeoChef Microwave", "category": "Microwaves", "brand": "LG", "model": "MS2592W", "price": 199.99, "stock": 50, "description": "Countertop microwave with Smart Inverter", "features": "Smart Inverter, EasyClean, Antibacterial Coating", "specifications": "25L, White"},
    {"name": "LG Grill Microwave", "category": "Microwaves", "brand": "LG", "model": "MC2846W", "price": 249.99, "stock": 35, "description": "Microwave with grill function", "features": "Grill Function, Smart Inverter, Eco On", "specifications": "28L, White"},
    {"name": "LG Convection Microwave", "category": "Microwaves", "brand": "LG", "model": "MC769W", "price": 349.99, "stock": 28, "description": "Convection microwave with baking function", "features": "Convection, Grill, Fry, Bake, Roasting", "specifications": "32L, White"},
    
    # Air Conditioners
    {"name": "LG Dual Inverter AC 1.5 Ton", "category": "Air Conditioners", "brand": "LG", "model": "LS-Q18APZA", "price": 699.99, "stock": 45, "description": "Split AC with dual inverter technology", "features": "Dual Inverter, WiFi, 4-in-1 Convertible, PM 2.5 Filter", "specifications": "1.5 Ton, 5 Star, R32"},
    {"name": "LG Dual Inverter AC 2 Ton", "category": "Air Conditioners", "brand": "LG", "model": "LS-Q24APZA", "price": 849.99, "stock": 30, "description": "Split AC with dual inverter technology", "features": "Dual Inverter, WiFi, HD Filter, Ocean Black Fin", "specifications": "2 Ton, 5 Star, R32"},
    {"name": "LG Window AC 1.5 Ton", "category": "Air Conditioners", "brand": "LG", "model": "L-W15AHPZ", "price": 449.99, "stock": 25, "description": "Window air conditioner", "features": "Hi-Groove Copper, Anti-Corrosion", "specifications": "1.5 Ton, 3 Star"},
    
    # Cooking Appliances
    {"name": "LG Built-In Oven", "category": "Cooking Appliances", "brand": "LG", "model": "OB-N254DP", "price": 899.99, "stock": 15, "description": "Built-in electric oven with convection", "features": "Convection, Grill, Rotisserie, Self-Clean", "specifications": "76L, Black Glass"},
    {"name": "LG Induction Cooktop", "category": "Cooking Appliances", "brand": "LG", "model": "Z母IH-TT", "price": 299.99, "stock": 30, "description": "Portable induction cooktop", "features": "Touch Control, Timer, Auto Shut Off", "specifications": "2000W, Black"},
    {"name": "LG Gas Hob", "category": "Cooking Appliances", "brand": "LG", "model": "HB-122G", "price": 399.99, "stock": 20, "description": "Built-in gas hob with 4 burners", "features": "Auto Ignition, Flame Failure Safety", "specifications": "4 Burners, Stainless Steel"},
    
    # Vacuum Cleaners
    {"name": "LG Cordless Vacuum Cleaner", "category": "Vacuum Cleaners", "brand": "LG", "model": "A939KBW", "price": 599.99, "stock": 22, "description": "Cordless stick vacuum with brush", "features": "Cordless, Multi-Cyclone, LED Brush", "specifications": "60min Runtime, 280W"},
    {"name": "LG Robot Vacuum", "category": "Vacuum Cleaners", "brand": "LG", "model": "VR6690VBWT", "price": 799.99, "stock": 18, "description": "Smart robot vacuum with mapping", "features": "LiDAR Mapping, WiFi, Voice Control", "specifications": "120min Runtime, 3200Pa Suction"},
]

CATEGORIES = [
    {"name": "Refrigerators", "description": "LG Refrigerators - InstaView, Side-by-Side, Top Freezer, Bottom Freezer, French Door"},
    {"name": "Washing Machines", "description": "LG Washers - Front Load, Top Load, WashTower, Twin Tub, Washer Dryer Combo"},
    {"name": "Dishwashers", "description": "LG Dishwashers - QuadWash, Slim, Built-in"},
    {"name": "Microwaves", "description": "LG Microwaves - Solo, Grill, Convection"},
    {"name": "Air Conditioners", "description": "LG Air Conditioners - Split, Window, Portable"},
    {"name": "Cooking Appliances", "description": "LG Cooking - Ovens, Cooktops, Hobs"},
    {"name": "Vacuum Cleaners", "description": "LG Vacuums - Cordless, Robot"},
]

async def load_products():
    await init_db()
    async with async_session() as session:
        # Add categories
        for cat_data in CATEGORIES:
            category = Category(name=cat_data["name"], description=cat_data["description"])
            session.add(category)
        
        await session.commit()
        
        # Add products
        for prod_data in LG_PRODUCTS:
            product = Product(**prod_data)
            session.add(product)
        
        await session.commit()
        print(f"Added {len(CATEGORIES)} categories and {len(LG_PRODUCTS)} products!")

if __name__ == "__main__":
    asyncio.run(load_products())
