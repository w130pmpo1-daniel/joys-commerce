import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, delete
from datetime import datetime

Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(2000))
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    category = Column(String(100))
    sku = Column(String(100), unique=True)
    brand = Column(String(100))
    model = Column(String(100))
    image_url = Column(String(500))
    gallery = Column(String(2000))
    specifications = Column(String(2000))
    features = Column(String(2000))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


engine = create_async_engine("mysql+aiomysql://root:@localhost/prodex", echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

LG_PRODUCTS = [
    {
        "category": "Refrigerators",
        "products": [
            {
                "name": "LG InstaView Door-in-Door Refrigerator",
                "description": "Experience the future of refrigeration with LG's innovative InstaView technology. Simply knock twice to see inside without opening the door.",
                "price": 2499.99,
                "stock": 15,
                "sku": "RF28R7551SR",
                "brand": "LG",
                "model": "InstaView",
                "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
                "gallery": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800,https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800,https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
                "features": "InstaView Door-in-Door|Moist Balance Crisper|LinearCooling|Door Cooling+|Smart Diagnosis|Energy Star Certified",
                "specifications": "Capacity: 28 cu. ft.|Dimensions: 35.75\" W x 70\" H x 36.25\" D|Energy Usage: 715 kWh/year|Cooling Type: Multi-Air Flow|Warranty: 1 Year Parts & Labor, 5 Years Sealed System"
            },
            {
                "name": "LG Side-by-Side Refrigerator",
                "description": "Spacious side-by-side refrigerator with ice and water dispenser, perfect for large families.",
                "price": 1799.99,
                "stock": 20,
                "sku": "LSXS28666S",
                "brand": "LG",
                "model": "Side-by-Side",
                "image_url": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
                "gallery": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800,https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
                "features": "Ice & Water Dispenser|Multi-Air Flow Cooling|LED Lighting|SpillProof Shelves|Smart Diagnosis",
                "specifications": "Capacity: 28 cu. ft.|Dimensions: 35.75\" W x 69.75\" H x 33.75\" D|Energy Usage: 730 kWh/year|Cooling Type: Multi-Air Flow|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Bottom Freezer Refrigerator",
                "description": "Modern bottom freezer design puts fresh food at eye level for easy access.",
                "price": 1599.99,
                "stock": 18,
                "sku": "LBNC152XXV",
                "brand": "LG",
                "model": "Bottom-Freezer",
                "image_url": "https://images.unsplash.com/photo-1533130093217-aa10cdcf0dbc?w=800",
                "gallery": "https://images.unsplash.com/photo-1533130093217-aa10cdcf0dbc?w=800,https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
                "features": "Fresh Access Door|BioShield Anti-Bacterial Gasket|Fresh 0 Degree Zone|LED Interior Lighting|Glide N' Serve Pantry",
                "specifications": "Capacity: 25.5 cu. ft.|Dimensions: 32.75\" W x 68.5\" H x 33\" D|Energy Usage: 560 kWh/year|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Single Door Refrigerator",
                "description": "Elegant single door refrigerator with Nature Fresh technology for superior food preservation.",
                "price": 899.99,
                "stock": 25,
                "sku": "GL-B207HSQV",
                "brand": "LG",
                "model": "Nature Fresh",
                "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
                "gallery": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800,https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
                "features": "Smart Inverter Compressor|Base Stand Drawer|Fresh 0 Zone|Large Capacity|Bacteria Free",
                "specifications": "Capacity: 190 L|Dimensions: 535mm W x 1140mm H x 632mm D|Energy Rating: 4 Star|Warranty: 10 Years Compressor"
            }
        ]
    },
    {
        "category": "Washing Machines",
        "products": [
            {
                "name": "LG Front Load Washer",
                "description": "Advanced front loading washing machine with AI DD technology that automatically detects fabric type for optimal wash.",
                "price": 1299.99,
                "stock": 30,
                "sku": "WM4200HWA",
                "brand": "LG",
                "model": "AI DD",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "gallery": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800,https://images.unsplash.com/photo-1626806720052-5c5c6eb4986f?w=800",
                "features": "AI DD Technology|Steam+|TurboWash 360|Add Items Feature|Smart Diagnosis|Wi-Fi Enabled",
                "specifications": "Capacity: 4.5 cu. ft.|Dimensions: 27\" W x 39\" H x 30.25\" D|Speed: 1300 RPM|Energy Star Certified|Warranty: 1 Year Parts, 10 Years Motor"
            },
            {
                "name": "LG Top Load Washer",
                "description": "Convenient top load washing machine with innovative agitator design for thorough cleaning.",
                "price": 799.99,
                "stock": 35,
                "sku": "WT7305CW",
                "brand": "LG",
                "model": "Top Load",
                "image_url": "https://images.unsplash.com/photo-1626806720052-5c5c6eb4986f?w=800",
                "gallery": "https://images.unsplash.com/photo-1626806720052-5c5c6eb4986f?w=800,https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "features": "ColdWash Technology|Smart Inverter Motor|TurboDrum|LoDecibel Quiet Operation|Fuzzy Logic Control",
                "specifications": "Capacity: 5.0 cu. ft.|Dimensions: 27\" W x 44.5\" H x 28.4\" D|Speed: 800 RPM|Energy Star Certified|Warranty: 1 Year Parts, 10 Years Motor"
            },
            {
                "name": "LG WashTower",
                "description": "All-in-one laundry solution with washer and dryer in one space-saving tower design.",
                "price": 2499.99,
                "stock": 12,
                "sku": "WT9201CW",
                "brand": "LG",
                "model": "WashTower",
                "image_url": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
                "gallery": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800,https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "features": "Center Control Panel|Side-by-Side or Stacked|Steam Technology|Auto-Dispensing|Smart Pairing",
                "specifications": "Washer: 4.5 cu. ft., Dryer: 7.4 cu. ft.|Dimensions: 27\" W x 74.4\" H x 30.3\" D|Heat Pump Drying|Energy Star Certified|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Front Load Washer & Dryer Set",
                "description": "Premium front load washer and dryer set with steam功能和热泵烘干技术。",
                "price": 2199.99,
                "stock": 15,
                "sku": "F4V5VYP2T",
                "brand": "LG",
                "model": "TwinWash",
                "image_url": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
                "gallery": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800,https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "features": "Steam+|TurboWash|Heat Pump Dryer|Dual Dryer|Wi-Fi Remote Control",
                "specifications": "Washer: 4.0 cu. ft., Dryer: 7.4 cu. ft.|Dimensions: 27\" W x 39\" H x 30.25\" D|Energy Star Certified|Warranty: 1 Year Parts & Labor"
            }
        ]
    },
    {
        "category": "Air Conditioners",
        "products": [
            {
                "name": "LG Split AC with DUAL Inverter",
                "description": "Energy-efficient split air conditioner with DUAL Inverter technology for fast and whisper-quiet cooling.",
                "price": 1299.99,
                "stock": 40,
                "sku": "LS-Q18ENZA",
                "brand": "LG",
                "model": "DUAL Inverter",
                "image_url": "https://images.unsplash.com/photo-1631545806609-35f9b004e3de?w=800",
                "gallery": "https://images.unsplash.com/photo-1631545806609-35f9b004e3de?w=800,https://images.unsplash.com/photo-1631545806609-35f9b004e3de?w=800",
                "features": "DUAL Inverter Compressor|100% Copper Coil|Active Energy Control|Himalaya Cool|Jet Cool|Air Purification",
                "specifications": "Capacity: 1.5 Ton|Star Rating: 5 Star|Cooling Capacity: 5200 W|Power Consumption: 1580 W|Warranty: 1 Year Comprehensive, 10 Years Compressor"
            },
            {
                "name": "LG Window AC",
                "description": "Reliable window air conditioner perfect for rooms up to 350 sq ft.",
                "price": 599.99,
                "stock": 30,
                "sku": "LW6017R",
                "brand": "LG",
                "model": "Window",
                "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
                "gallery": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800,https://images.unsplash.com/photo-1631545806609-35f9b004e3de?w=800",
                "features": "3-in-1 Air Filtration|Automatic Restart|Cool|Heat & Dry Mode|Dehumidification",
                "specifications": "Capacity: 1.5 Ton|Cooling Capacity: 12000 BTU|For Room: Up to 350 sq ft|Energy Rating: 3 Star|Warranty: 1 Year Comprehensive"
            },
            {
                "name": "LG Portable AC",
                "description": "Mobile air conditioner that cools any room without permanent installation.",
                "price": 699.99,
                "stock": 20,
                "sku": "LP1419IVSM",
                "brand": "LG",
                "model": "Portable",
                "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
                "gallery": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800,https://images.unsplash.com/photo-1631545806609-35f9b004e3de?w=800",
                "features": "Dual Hose System|Built-in Dehumidifier|24-Hour Timer|Remote Control|Wi-Fi Enabled",
                "specifications": "Capacity: 14000 BTU|Cooling Area: Up to 500 sq ft|Energy Efficiency Ratio: 10.9|Warranty: 1 Year Parts & Labor"
            }
        ]
    },
    {
        "category": "Microwaves",
        "products": [
            {
                "name": "LG Smart Inverter Microwave",
                "description": "Precision cooking with smart inverter technology for even heating and defrosting.",
                "price": 299.99,
                "stock": 45,
                "sku": "LMHM2037G",
                "brand": "LG",
                "model": "Smart Inverter",
                "image_url": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800",
                "gallery": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800,https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
                "features": "Smart Inverter Technology|NeoChef Grill|Even Defrost|Quick Start|Child Lock",
                "specifications": "Capacity: 2.0 cu. ft.|Power: 1200 Watts|Turntable: 16\"|10 Power Levels|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Over-the-Range Microwave",
                "description": "Space-saving over-the-range microwave with powerful ventilation system.",
                "price": 449.99,
                "stock": 25,
                "sku": "MVEM1837G",
                "brand": "LG",
                "model": "Over-the-Range",
                "image_url": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
                "gallery": "https://images.unsplash.com/photo-1585515320310-259814833e2?w=800,https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800",
                "features": "Sensor Cooking|ExtendaVent|Vibrant Ring|WideGrill|LED Cavity Light",
                "specifications": "Capacity: 1.8 cu. ft.|Power: 1000 Watts|Vent CFM: 400|4 Speed Fan|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Solo Microwave",
                "description": "Compact and efficient solo microwave for everyday cooking needs.",
                "price": 149.99,
                "stock": 50,
                "sku": "MS2043W",
                "brand": "LG",
                "model": "Solo",
                "image_url": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
                "gallery": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800,https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800",
                "features": "EasyClean Interior|I-Wave Technology|Quick 30|Child Lock|Multiple Cooking Modes",
                "specifications": "Capacity: 0.9 cu. ft.|Power: 800 Watts|Turntable: 12\"|5 Power Levels|Warranty: 1 Year Parts & Labor"
            }
        ]
    },
    {
        "category": "Dishwashers",
        "products": [
            {
                "name": "LG QuadWash Dishwasher",
                "description": "Revolutionary dishwasher with four spray arms providing superior cleaning performance.",
                "price": 899.99,
                "stock": 20,
                "sku": "LDP6809SS",
                "brand": "LG",
                "model": "QuadWash",
                "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
                "gallery": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800,https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
                "features": "QuadWash Technology|Steam Finish|LoDecibel Quiet|Delay Start|Inverter Direct Drive",
                "specifications": "Capacity: 15 Place Settings|Energy Star: Yes|Dimensions: 24\" W x 33.6\" H x 24.6\" D|Cycle Time: 55 min|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG Top Control Dishwasher",
                "description": "Premium dishwasher with sleek top control panel and multiple wash cycles.",
                "price": 749.99,
                "stock": 25,
                "sku": "LDFN454HT",
                "brand": "LG",
                "model": "Top Control",
                "image_url": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
                "gallery": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800,https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
                "features": "EasyRack Plus|Smart Diagnosis|Height Adjustable 3rd Rack|Steam Dual Zone|Auto Open Dry",
                "specifications": "Capacity: 14 Place Settings|Energy Star: Yes|Dimensions: 24\" W x 33\" H x 24.6\" D|Cycle Time: 60 min|Warranty: 1 Year Parts & Labor"
            }
        ]
    },
    {
        "category": "TVs",
        "products": [
            {
                "name": "LG OLED evo C3 TV",
                "description": "Self-lit OLED pixels for perfect blacks and infinite contrast with enhanced brightness.",
                "price": 2499.99,
                "stock": 15,
                "sku": "OLED77C3PUB",
                "brand": "LG",
                "model": "OLED evo C3",
                "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                "gallery": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800,https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800",
                "features": "OLED evo Technology|a9 AI Processor 4K|Dolby Vision IQ|webOS 23|Gaming Optimizer|AI Sound Pro",
                "specifications": "Screen: 77\" 4K OLED|Panel Refresh: 120Hz|HDR: Dolby Vision, HDR10, HLG|WiSA Ready|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG NanoCell 4K TV",
                "description": "Pure colors and dynamic enhancement for an immersive viewing experience.",
                "price": 1299.99,
                "stock": 20,
                "sku": "65NANO90SPA",
                "brand": "LG",
                "model": "NanoCell 90",
                "image_url": "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800",
                "gallery": "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800,https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                "features": "NanoCell Technology|a7 AI Processor 4K|Full Array Dimming|ThinQ AI|Game Optimizer| Sports Alert",
                "specifications": "Screen: 65\" 4K NanoCell|Panel Refresh: 120Hz|HDR: Dolby Vision, HDR10|Built-in WiFi|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG QNED Mini LED TV",
                "description": "Quantum Dot + NanoCell + Mini LED for the ultimate color and contrast experience.",
                "price": 1999.99,
                "stock": 12,
                "sku": "75QNED90SPA",
                "brand": "LG",
                "model": "QNED Mini LED",
                "image_url": "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800",
                "gallery": "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800,https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                "features": "Mini LED Backlight|Quantum Dot NanoCell|a7 AI Processor 8K|Full Array Local Dimming Pro|Dolby Vision IQ",
                "specifications": "Screen: 75\" 4K QNED|Panel Refresh: 120Hz|Mini LED Zones: 2500+|HDR: All Major Formats|Warranty: 1 Year Parts & Labor"
            }
        ]
    },
    {
        "category": "Vacuum Cleaners",
        "products": [
            {
                "name": "LG CordZero A9 Kompressor",
                "description": "Powerful cordless stick vacuum with Kompressor technology that compresses dust.",
                "price": 799.99,
                "stock": 25,
                "sku": "A959KBML",
                "brand": "LG",
                "model": "CordZero A9",
                "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800",
                "gallery": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800,https://images.unsplash.com/photo-1584821650974-db89bb9d7f4a?w=800",
                "features": "Kompressor Technology|5-Step Filtration|LED Lighting Head|Power Mop Attachment|2-in-1 Charging",
                "specifications": "Battery: 2 Lithium-Ion|Power: 200W Suction|Runtime: 80 min|Weight: 6.3 lbs|Warranty: 10 Years Motor"
            },
            {
                "name": "LG Robot Vacuum R9",
                "description": "AI-powered robot vacuum with 3D sensor and automatic dust emptying.",
                "price": 1299.99,
                "stock": 15,
                "sku": "R9TMAX",
                "brand": "LG",
                "model": "Robot Vacuum R9",
                "image_url": "https://images.unsplash.com/photo-1584821650974-db89bb9d7f4a?w=800",
                "gallery": "https://images.unsplash.com/photo-1584821650974-db89bb9d7f4a?w=800,https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800",
                "features": "3D Object Recognition|Automatic Dust Emptying|Lidar Mapping|Voice Control|Washable Filter",
                "specifications": "Suction Power: 4000Pa|Battery: 5200mAh|Dust Bag: 4L|Mapping: LiDAR|Warranty: 1 Year Parts & Labor"
            },
            {
                "name": "LG CordZero Canister Vacuum",
                "description": "Powerful canister vacuum with HEPA filter for whole-home cleaning.",
                "price": 599.99,
                "stock": 20,
                "sku": "VC73201UHW",
                "brand": "LG",
                "model": "CordZero Canister",
                "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800",
                "gallery": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800,https://images.unsplash.com/photo-1584821650974-db89bb9d7f4a?w=800",
                "features": "Powerful 2800W Motor|HEPA 14 Filter|Telescopic Wand|Variable Speed Control|Multiple Attachments",
                "specifications": "Power: 2800W|Cord Length: 9m|Dust Capacity: 2.5L|Filter: HEPA 14|Warranty: 10 Years Motor"
            }
        ]
    }
]


async def load_products():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as session:
        await session.execute(delete(Product))
        await session.commit()

        all_products = []
        for cat_data in LG_PRODUCTS:
            category = cat_data["category"]
            for prod in cat_data["products"]:
                product = Product(
                    name=prod["name"],
                    description=prod["description"],
                    price=prod["price"],
                    stock=prod["stock"],
                    category=category,
                    sku=prod["sku"],
                    brand=prod["brand"],
                    model=prod["model"],
                    image_url=prod["image_url"],
                    gallery=prod["gallery"],
                    features=prod["features"],
                    specifications=prod["specifications"],
                    is_active=True
                )
                all_products.append(product)

        session.add_all(all_products)
        await session.commit()
        print(f"Loaded {len(all_products)} products successfully!")


if __name__ == "__main__":
    asyncio.run(load_products())
