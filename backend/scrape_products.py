#!/usr/bin/env python3
"""
Script to scrape fresh product data from NotebookTherapy using Playwright
and update the database with correct Shopify CDN image URLs.
"""
import asyncio
import re
from playwright.async_api import async_playwright

async def scrape_notebooktherapy():
    """Scrape products from NotebookTherapy website"""
    
    categories = [
        ("Bullet Journals", "https://notebooktherapy.com/collections/bullet-journal"),
        ("Notebooks", "https://notebooktherapy.com/collections/all-notebooks"),
        ("Washi Tape", "https://notebooktherapy.com/collections/washi-tape"),
        ("Stickers", "https://notebooktherapy.com/collections/stickers"),
        ("Stamps", "https://notebooktherapy.com/collections/stamps"),
        ("Bags", "https://notebooktherapy.com/collections/bags"),
        ("Pens", "https://notebooktherapy.com/collections/pens"),
        ("Pencil Cases", "https://notebooktherapy.com/collections/pencil-cases"),
        ("Accessories", "https://notebooktherapy.com/collections/accessories"),
    ]
    
    all_products = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for category_name, category_url in categories:
            print(f"\n=== Scraping {category_name} ===")
            
            page = await browser.new_page()
            await page.goto(category_url)
            await page.wait_for_timeout(3000)
            
            # Get product links
            product_links = await page.evaluate('''() => {
                const links = document.querySelectorAll('a[href*="/products/"]');
                const urls = new Set();
                links.forEach(link => {
                    const href = link.href;
                    if (href.includes('/products/') && !href.includes('variant=')) {
                        urls.add(href);
                    }
                });
                return Array.from(urls);
            }''')
            
            print(f"Found {len(product_links)} product links")
            
            # Process each product (limit to first 5 per category for speed)
            for i, product_url in enumerate(product_links[:5]):
                print(f"  Processing product {i+1}: {product_url}")
                
                product_page = await browser.new_page()
                try:
                    await product_page.goto(product_url)
                    await product_page.wait_for_timeout(2000)
                    
                    # Extract product data
                    product_data = await product_page.evaluate('''() => {
                        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
                        
                        // Get all images from the page
                        const images = [];
                        const imgEls = document.querySelectorAll('img[src*="cdn.shopify.com"]');
                        imgEls.forEach(img => {
                            const src = img.src;
                            // Get higher resolution by removing size params
                            const highRes = src.replace(/_\\d+x\\d+/g, '').split('?')[0];
                            if (!images.includes(highRes)) {
                                images.push(highRes);
                            }
                        });
                        
                        return {
                            title: getText('h1') || getText('[class*="title"]'),
                            price: getText('[class*="price"]'),
                            description: getText('[class*="description"]') || getText('[id*="description"]'),
                            images: images.slice(0, 6) // Limit to 6 images
                        };
                    }''')
                    
                    if product_data['title'] and product_data['images']:
                        # Parse price
                        price_match = re.search(r'[\d,]+\.?\d*', product_data['price'] or '')
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        product = {
                            'name': product_data['title'],
                            'price': price,
                            'description': product_data['description'] or '',
                            'category': category_name,
                            'image_url': product_data['images'][0] if product_data['images'] else '',
                            'thumbnail': product_data['images'][0] if product_data['images'] else '',
                            'gallery': ','.join(product_data['images']) if product_data['images'] else '',
                            'sku': f'NT-{category_name[:3].upper()}-{len(all_products)+1:04d}',
                            'brand': 'NotebookTherapy',
                            'stock': 100
                        }
                        
                        all_products.append(product)
                        print(f"    ✓ {product['name'][:50]}... - ${price}")
                    
                except Exception as e:
                    print(f"    ✗ Error: {e}")
                finally:
                    await product_page.close()
            
            await page.close()
        
        await browser.close()
    
    return all_products

if __name__ == "__main__":
    products = asyncio.run(scrape_notebooktherapy())
    print(f"\n=== Total products scraped: {len(products)} ===")
    
    # Print first product as sample
    if products:
        print("\nSample product:")
        for k, v in products[0].items():
            print(f"  {k}: {str(v)[:80]}")
