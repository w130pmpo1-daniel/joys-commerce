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
    thumbnail = Column(String(500))
    gallery = Column(String(2000))
    specifications = Column(String(2000))
    features = Column(String(2000))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


engine = create_async_engine("mysql+aiomysql://root:@localhost/prodex", echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

NOTEBOOK_THERAPY_PRODUCTS = [
    {
        "category": "Notebooks",
        "products": [
            {
                "name": "Tsuki Four Seasons: Autumn Collector's Edition 2025 Square Bullet Journal",
                "description": "Introducing the Tsuki Four Seasons: Autumn Collector's Edition 2025 Square Bullet Journal. Features beautiful autumn-inspired designs perfect for planning, self-reflection, and creative expression.",
                "price": 49.48,
                "stock": 50,
                "sku": "NT-AUTO-2025",
                "brand": "NotebookTherapy",
                "model": "Tsuki Four Seasons",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/autumn-bullet-journal.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/autumn-bullet-journal_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/autumn-bullet-journal.jpg,https://notebooktherapy.com/cdn/shop/files/autumn-bullet-journal-2.jpg",
                "features": "Square format|192 pages|Durable hardcover|Acid-free paper|Yearly, monthly, weekly spreads",
                "specifications": "Size: 176mm x 176mm|Format: Square|Pages: 192|Cover: Hardcover|Binding: Smyth Sewn"
            },
            {
                "name": "Tsuki Four Seasons: Summer Collector's Edition 2025 Square Bullet Journal",
                "description": "Introducing the Tsuki Four Seasons: Summer Collector's Edition 2025 Square Bullet Journal. Features vibrant summer-inspired designs.",
                "price": 49.48,
                "stock": 50,
                "sku": "NT-SUM-2025",
                "brand": "NotebookTherapy",
                "model": "Tsuki Four Seasons",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/summer-bullet-journal.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/summer-bullet-journal_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/summer-bullet-journal.jpg",
                "features": "Square format|192 pages|Durable hardcover|Acid-free paper|Summer themed designs",
                "specifications": "Size: 176mm x 176mm|Format: Square|Pages: 192|Cover: Hardcover|Binding: Smyth Sewn"
            },
            {
                "name": "Tsuki Celestial Dream Travel Notebook",
                "description": "Tsuki 'Celestial Dream' Travel Notebook - Perfect for documenting your adventures with celestial-themed designs.",
                "price": 37.38,
                "stock": 40,
                "sku": "NT-TRAVEL-CD",
                "brand": "NotebookTherapy",
                "model": "Tsuki Celestial",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/celestial-dream-travel.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/celestial-dream-travel_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/celestial-dream-travel.jpg",
                "features": "Travel size|144 pages|Elastic closure|Back pocket|Acid-free paper",
                "specifications": "Size: A5|Pages: 144|Cover: Soft|Layout: Dot Grid"
            },
            {
                "name": "Tsuki La Lune Collector's Edition Moon Planner Travel Notebook",
                "description": "Tsuki 'La Lune' Collector's Edition Moon Planner Travel Notebook with beautiful moon-themed designs.",
                "price": 43.98,
                "stock": 35,
                "sku": "NT-MOON-LA",
                "brand": "NotebookTherapy",
                "model": "Tsuki Moon",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/la-lune-travel.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/la-lune-travel_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/la-lune-travel.jpg",
                "features": "Moon phase tracker|192 pages|Travel size|Lay-flat binding|Moon-themed artwork",
                "specifications": "Size: A5|Pages: 192|Cover: Hardcover|Binding: Lay-flat"
            },
            {
                "name": "Tsuki Moonmist Meadow Limited Edition Travel Notebook",
                "description": "Tsuki 'Moonmist Meadow' Limited Edition Travel Notebook - dreamy meadow designs.",
                "price": 37.38,
                "stock": 45,
                "sku": "NT-MOON-MIST",
                "brand": "NotebookTherapy",
                "model": "Tsuki Moonmist",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/moonmist-meadow.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/moonmist-meadow_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/moonmist-meadow.jpg",
                "features": "Limited edition|144 pages|Dreamy meadow art|Compact size|High quality paper",
                "specifications": "Size: A6|Pages: 144|Cover: Softtouch|Layout: Dot Grid"
            }
        ]
    },
    {
        "category": "Bullet Journals",
        "products": [
            {
                "name": "Tsuki Bullet Journal Stencil Set",
                "description": "The ultimate bullet journal tool for planning, doodling and tracking. Designed exclusively by Notebook Therapy team.",
                "price": 34.08,
                "stock": 60,
                "sku": "NT-BJO-STENCIL",
                "brand": "NotebookTherapy",
                "model": "Tsuki Stencil",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/stencil-set.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/stencil-set_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/stencil-set.jpg,https://notebooktherapy.com/cdn/shop/files/stencil-set-2.jpg",
                "features": "50+ stencils|Grid and dotted patterns|Planning elements|Doodling guides|Durable plastic",
                "specifications": "Material: PVC|Size: A5|Quantity: 50 sheets|Patterns: Grid, Dots, Lines"
            },
            {
                "name": "Tsuki 'Enchanted Fox' Special Edition Bullet Journal",
                "description": "Tsuki 'Enchanted Fox' Special Edition Bullet Journal - inspired by magical fox designs.",
                "price": 42.88,
                "stock": 40,
                "sku": "NT-BJO-FOX",
                "brand": "NotebookTherapy",
                "model": "Tsuki Enchanted",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/enchanted-fox.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/enchanted-fox_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/enchanted-fox.jpg",
                "features": "Special edition|192 pages|Fox themed art|Index pages|Yearly planning spreads",
                "specifications": "Size: B5|Pages: 192|Cover: Hardcover|Layout: Dot Grid"
            },
            {
                "name": "Tsuki 'Wise Owl' Special Edition Bullet Journal",
                "description": "Tsuki 'Wise Owl' Special Edition Bullet Journal - elegant owl designs for organized planning.",
                "price": 42.88,
                "stock": 40,
                "sku": "NT-BJO-OWL",
                "brand": "NotebookTherapy",
                "model": "Tsuki Wise Owl",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/wise-owl.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/wise-owl_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/wise-owl.jpg",
                "features": "Special edition|192 pages|Wisdom themed|Owl artwork|Comprehensive layouts",
                "specifications": "Size: B5|Pages: 192|Cover: Hardcover|Layout: Dot Grid"
            },
            {
                "name": "Tsuki 'Maple Moon' Limited Edition Bullet Journal",
                "description": "Tsuki 'Maple Moon' Limited Edition Bullet Journal - beautiful autumn maple leaf designs.",
                "price": 34.08,
                "stock": 45,
                "sku": "NT-BJO-MAPLE",
                "brand": "NotebookTherapy",
                "model": "Tsuki Maple Moon",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/maple-moon.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/maple-moon_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/maple-moon.jpg",
                "features": "Limited edition|192 pages|Maple leaf art|Autumn colors|Collection pages",
                "specifications": "Size: B5|Pages: 192|Cover: Hardcover|Layout: Dot Grid"
            },
            {
                "name": "Tsuki 'Sweet Bunny' Special Edition Bullet Journal in A5",
                "description": "Tsuki 'Sweet Bunny' Special Edition Bullet Journal - adorable bunny themed design.",
                "price": 46.18,
                "stock": 35,
                "sku": "NT-BJO-BUNNY",
                "brand": "NotebookTherapy",
                "model": "Tsuki Sweet Bunny",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/sweet-bunny.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/sweet-bunny_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/sweet-bunny.jpg",
                "features": "A5 size|192 pages|Cute bunny designs|Story pages|Trackers included",
                "specifications": "Size: A5|Pages: 192|Cover: Hardcover|Layout: Dot Grid"
            },
            {
                "name": "Tsuki 'Nightbloom Spell' Limited Edition Bullet Journal",
                "description": "Tsuki 'Nightbloom Spell' Limited Edition Bullet Journal - mystical night floral designs.",
                "price": 42.88,
                "stock": 30,
                "sku": "NT-BJO-NIGHT",
                "brand": "NotebookTherapy",
                "model": "Tsuki Nightbloom",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/nightbloom-spell.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/nightbloom-spell_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/nightbloom-spell.jpg",
                "features": "Limited edition|192 pages|Mystical designs|Floral patterns|Spell pages",
                "specifications": "Size: B5|Pages: 192|Cover: Hardcover|Layout: Dot Grid"
            }
        ]
    },
    {
        "category": "Washi Tape",
        "products": [
            {
                "name": "Tsuki 'Journey in Japan' Washi Tape Set",
                "description": "Introducing the Tsuki 'Journey in Japan' Washi Tape Set - inspired by Japanese landscapes and culture.",
                "price": 46.18,
                "stock": 55,
                "sku": "NT-WASHI-JAPAN",
                "brand": "NotebookTherapy",
                "model": "Tsuki Journey",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/journey-japan-washi.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/journey-japan-washi_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/journey-japan-washi.jpg",
                "features": "6 rolls|15mm width|Made in Japan|Easy tear|Premium quality",
                "specifications": "Quantity: 6 rolls|Width: 15mm|Length: 5m each|Material: Rice paper|Origin: Japan"
            },
            {
                "name": "Tsuki 'Forest Friends' Washi Tape Set",
                "description": "Tsuki 'Forest Friends' Washi Tape - inspired by woodland creatures and forest beauty.",
                "price": 48.38,
                "stock": 50,
                "sku": "NT-WASHI-FOREST",
                "brand": "NotebookTherapy",
                "model": "Tsuki Forest",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/forest-friends-washi.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/forest-friends-washi_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/forest-friends-washi.jpg",
                "features": "6 rolls|Woodland themed|15mm width|Repositionable|Durable",
                "specifications": "Quantity: 6 rolls|Width: 15mm|Length: 5m each|Material: Rice paper"
            },
            {
                "name": "Tsuki 'Moonflower Magic' Washi Tape Set",
                "description": "Tsuki 'Moonflower Magic' Washi Tape Set - dreamy moon and flower designs.",
                "price": 46.18,
                "stock": 45,
                "sku": "NT-WASHI-MOON",
                "brand": "NotebookTherapy",
                "model": "Tsuki Moonflower",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/moonflower-washi.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/moonflower-washi_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/moonflower-washi.jpg",
                "features": "6 rolls|Moon and flower art|15mm width|Subtle colors|High quality",
                "specifications": "Quantity: 6 rolls|Width: 15mm|Length: 5m each|Material: Rice paper"
            }
        ]
    },
    {
        "category": "Stickers",
        "products": [
            {
                "name": "Tsuki 'Neko Cafe' 3D Puffy Sticker Set",
                "description": "Tsuki 'Neko Cafe' 3D Puffy Sticker Set - adorable cat cafe themed stickers.",
                "price": 16.48,
                "stock": 80,
                "sku": "NT-STICKER-NEKO",
                "brand": "NotebookTherapy",
                "model": "Tsuki Neko Cafe",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/neko-cafe-stickers.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/neko-cafe-stickers_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/neko-cafe-stickers.jpg",
                "features": "3D puffy effect|Cat designs|Cafe theme|Multiple sizes|Durable",
                "specifications": "Quantity: 50+ stickers|Material: PVC|Theme: Cat Cafe"
            },
            {
                "name": "Japanese Landscapes Stickers",
                "description": "Japanese Landscapes Stickers - beautiful Japanese scenery designs.",
                "price": 10.98,
                "stock": 70,
                "sku": "NT-STICKER-JP",
                "brand": "NotebookTherapy",
                "model": "Japanese Landscapes",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/japanese-stickers.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/japanese-stickers_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/japanese-stickers.jpg",
                "features": "Japanese themed|High quality vinyl|Weather resistant|Multiple designs",
                "specifications": "Quantity: 40+ stickers|Material: Vinyl|Theme: Japanese Landscapes"
            },
            {
                "name": "Travel The World Stickers",
                "description": "Travel The World Stickers - perfect for travel journals and planners.",
                "price": 10.98,
                "stock": 65,
                "sku": "NT-STICKER-TRAVEL",
                "brand": "NotebookTherapy",
                "model": "Travel World",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/travel-world-stickers.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/travel-world-stickers_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/travel-world-stickers.jpg",
                "features": "Travel themed|40+ stickers|Glossy finish|Easy to apply",
                "specifications": "Quantity: 40+ stickers|Material: Vinyl|Theme: Travel"
            },
            {
                "name": "Kawaii Sticky Notes - Set of 4!",
                "description": "Kawaii Sticky Notes Set of 4 - adorable Japanese style sticky notes.",
                "price": 10.98,
                "stock": 90,
                "sku": "NT-STICKER-KAWAII",
                "brand": "NotebookTherapy",
                "model": "Kawaii Notes",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/kawaii-notes.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/kawaii-notes_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/kawaii-notes.jpg",
                "features": "4 designs|Kawaii art|Cute colors|Sticky backing|Multiple sizes",
                "specifications": "Quantity: 4 pads|Size: Various|Theme: Kawaii"
            }
        ]
    },
    {
        "category": "Stamps",
        "products": [
            {
                "name": "Tsuki 'Forest Friends' Bullet Journal Stamp Set",
                "description": "Tsuki 'Forest Friends' Bullet Journal Stamp Set - woodland creature stamps.",
                "price": 36.28,
                "stock": 40,
                "sku": "NT-STAMP-FOREST",
                "brand": "NotebookTherapy",
                "model": "Tsuki Forest Stamps",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/forest-stamps.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/forest-stamps_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/forest-stamps.jpg",
                "features": "10 stamps|Woodland designs|Clear stamps|Easy storage|For bullet journals",
                "specifications": "Quantity: 10 stamps|Material: Clear acrylic|Theme: Forest"
            }
        ]
    },
    {
        "category": "Bags",
        "products": [
            {
                "name": "Cord Tote Bag",
                "description": "Cord Tote Bag - stylish and practical everyday tote.",
                "price": 26.38,
                "stock": 50,
                "sku": "NT-BAG-CORD",
                "brand": "NotebookTherapy",
                "model": "Cord Tote",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/cord-tote.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/cord-tote_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/cord-tote.jpg",
                "features": "Cotton canvas|Adjustable strap|Interior pocket|Brand tag",
                "specifications": "Material: Cotton Canvas|Size: 38cm x 35cm|Strap: Adjustable"
            },
            {
                "name": "Large Cord Eco Tote Bag",
                "description": "Large Cord Eco Tote Bag - eco-friendly large shopping bag.",
                "price": 25.28,
                "stock": 55,
                "sku": "NT-BAG-CORD-L",
                "brand": "NotebookTherapy",
                "model": "Cord Eco Large",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/cord-eco-large.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/cord-eco-large_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/cord-eco-large.jpg",
                "features": "Eco-friendly|Large capacity|Cotton|Canvas strap|Reinforced handle",
                "specifications": "Material: Cotton|Size: 45cm x 40cm|Capacity: 15L"
            },
            {
                "name": "Tsuki 'Vintage Neko' Limited Edition Embroidered Tote Bag",
                "description": "Tsuki 'Vintage Neko' Limited Edition Tote Bag - embroidered cat design.",
                "price": 35.18,
                "stock": 30,
                "sku": "NT-BAG-NEKO-V",
                "brand": "NotebookTherapy",
                "model": "Vintage Neko",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/vintage-neko-tote.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/vintage-neko-tote_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/vintage-neko-tote.jpg",
                "features": "Limited edition|Embroidered cat|Cotton canvas|Interior pocket",
                "specifications": "Material: Cotton Canvas|Size: 40cm x 38cm|Closure: Open"
            },
            {
                "name": "Solid Corduroy Shoulder Bag",
                "description": "Solid Corduroy Shoulder Bag - comfortable everyday shoulder bag.",
                "price": 26.38,
                "stock": 45,
                "sku": "NT-BAG-CORDUROY",
                "brand": "NotebookTherapy",
                "model": "Corduroy Shoulder",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/corduroy-bag.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/corduroy-bag_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/corduroy-bag.jpg",
                "features": "Corduroy material|Shoulder strap|One size|Soft texture",
                "specifications": "Material: Corduroy|Size: 35cm x 30cm|Strap: Fixed"
            },
            {
                "name": "Cici Pouch Bag",
                "description": "Cici Pouch Bag - versatile pouch that doubles as a bag.",
                "price": 20.88,
                "stock": 60,
                "sku": "NT-BAG-CICI",
                "brand": "NotebookTherapy",
                "model": "Cici Pouch",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/cici-pouch.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/cici-pouch_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/cici-pouch.jpg",
                "features": "Multi-use|Convertible|Zipper closure|Compact",
                "specifications": "Material: Canvas|Size: 25cm x 18cm|Closure: Zipper"
            }
        ]
    },
    {
        "category": "Pens",
        "products": [
            {
                "name": "MUJI Style Gel Pens - Set of 12",
                "description": "MUJI Style Gel Pens - Set of 12 smooth writing gel pens.",
                "price": 21.99,
                "stock": 75,
                "sku": "NT-PEN-MUJI-12",
                "brand": "NotebookTherapy",
                "model": "MUJI Style",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/muji-pens.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/muji-pens_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/muji-pens.jpg",
                "features": "12 colors|Smooth gel ink|0.5mm tip|Refillable",
                "specifications": "Quantity: 12|Color: assorted|Tip: 0.5mm|Ink: Gel"
            },
            {
                "name": "Watercolour Brush Pens - Set of 20",
                "description": "Watercolour Brush Pens - Set of 20 brush pens for art and journaling.",
                "price": 36.28,
                "stock": 50,
                "sku": "NT-PEN-WATER-20",
                "brand": "NotebookTherapy",
                "model": "Watercolor Brush",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/watercolor-brush.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/watercolor-brush_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/watercolor-brush.jpg",
                "features": "20 colors|Brush tip|Water-soluble|Dual tip|For art journaling",
                "specifications": "Quantity: 20|Color: 20 colors|Tip: Brush"
            },
            {
                "name": "Desk Organiser for Pens",
                "description": "Desk Organiser for Pens - keep your stationery organized.",
                "price": 14.28,
                "stock": 40,
                "sku": "NT-ORG-DESK",
                "brand": "NotebookTherapy",
                "model": "Desk Organiser",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/desk-organiser.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/desk-organiser_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/desk-organiser.jpg",
                "features": "Multi-compartment|Desktop use|Sturdy base|Compact",
                "specifications": "Material: Metal|Size: 15cm x 10cm|Compartments: 6"
            }
        ]
    },
    {
        "category": "Pencil Cases",
        "products": [
            {
                "name": "Tsuki Pop-up Pencil Case",
                "description": "Tsuki Pop-up Pencil Case - innovative expandable pencil case.",
                "price": 21.98,
                "stock": 55,
                "sku": "NT-PCASE-POP",
                "brand": "NotebookTherapy",
                "model": "Tsuki Pop-up",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/popup-pencil.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/popup-pencil_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/popup-pencil.jpg",
                "features": "Pop-up design|Expandable|Multiple compartments|Zipper closure",
                "specifications": "Size: 22cm x 8cm|Material: Canvas|Closure: Zipper"
            },
            {
                "name": "Tsuki 'Ocean Edition' Pop-up Pencil Case",
                "description": "Tsuki 'Ocean Edition' Pop-up Pencil Case - ocean themed expandable case.",
                "price": 24.18,
                "stock": 45,
                "sku": "NT-PCASE-OCEAN",
                "brand": "NotebookTherapy",
                "model": "Tsuki Ocean",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/ocean-pencil.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/ocean-pencil_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/ocean-pencil.jpg",
                "features": "Ocean themed|Pop-up mechanism|Expandable|Sea designs",
                "specifications": "Size: 22cm x 8cm|Material: Canvas|Closure: Zipper"
            }
        ]
    },
    {
        "category": "Accessories",
        "products": [
            {
                "name": "3 Layer Bento Lunch Box",
                "description": "3 Layer Bento Lunch Box - Japanese style compartmentalized lunch box.",
                "price": 21.98,
                "stock": 35,
                "sku": "NT-ACC-BENTO",
                "brand": "NotebookTherapy",
                "model": "Bento Box",
                "image_url": "https://notebooktherapy.com/cdn/shop/files/bento-lunch.jpg",
                "thumbnail": "https://notebooktherapy.com/cdn/shop/files/bento-lunch_200x.jpg",
                "gallery": "https://notebooktherapy.com/cdn/shop/files/bento-lunch.jpg",
                "features": "3 compartments|Lid included|Microwave safe|BPA free",
                "specifications": "Layers: 3|Capacity: 900ml|Material: PP|Brand: NotebookTherapy"
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
        for cat_data in NOTEBOOK_THERAPY_PRODUCTS:
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
                    thumbnail=prod["thumbnail"],
                    gallery=prod.get("gallery", ""),
                    features=prod.get("features", ""),
                    specifications=prod.get("specifications", ""),
                    is_active=True
                )
                all_products.append(product)

        session.add_all(all_products)
        await session.commit()
        print(f"Loaded {len(all_products)} NotebookTherapy products successfully!")


if __name__ == "__main__":
    asyncio.run(load_products())
