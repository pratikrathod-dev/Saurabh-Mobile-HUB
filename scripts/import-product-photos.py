"""One-time local asset import. Runtime never contacts these sources."""
import concurrent.futures
import io
import json
import re
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/images/products'
OUT.mkdir(parents=True, exist_ok=True)
PAGES = {
    'iphone-15': 'https://www.gsmarena.com/apple_iphone_15-pictures-12559.php',
    'iphone-15-pro': 'https://www.gsmarena.com/apple_iphone_15_pro-pictures-12557.php',
    'samsung-galaxy-s24': 'https://www.gsmarena.com/samsung_galaxy_s24-pictures-12773.php',
    'samsung-galaxy-a55': 'https://www.gsmarena.com/samsung_galaxy_a55-pictures-12824.php',
    'oneplus-12r': 'https://www.gsmarena.com/oneplus_12r-pictures-12727.php',
    'vivo-v30': 'https://www.gsmarena.com/vivo_v30-pictures-12818.php',
    'xiaomi-14': 'https://www.gsmarena.com/xiaomi_14-pictures-12626.php',
    'ipad-10th-gen': 'https://www.gsmarena.com/apple_ipad_%282022%29-pictures-11941.php',
}
DIRECT = {
    'airpods-pro-2': ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=800&hei=800&fmt=png-alpha'],
    'apple-20w-usb-c-adapter': ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHJE3?wid=800&hei=800&fmt=png-alpha'],
}

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=35).read()

def import_product(item):
    slug, page = item
    try:
        urls = DIRECT.get(slug)
        if urls is None:
            html = fetch(page).decode('utf-8')
            urls = list(dict.fromkeys(re.findall(r'https://fdn2.gsmarena.com/vv/pics/[^"\s<>]+', html)))[:2]
        if not urls:
            raise ValueError('No real product images found')
        files = []
        for i, url in enumerate(urls, 1):
            image = Image.open(io.BytesIO(fetch(url))).convert('RGBA')
            original_size = image.size
            image = ImageOps.contain(image, (736, 736), Image.Resampling.LANCZOS)
            canvas = Image.new('RGBA', (800, 800), 'white')
            canvas.alpha_composite(image, ((800-image.width)//2, (800-image.height)//2))
            # PNG is kept lossless where possible; palette quantization is used only for the size cap.
            canvas = canvas.convert('RGB')
            filename = f'{slug}-{i}.webp'
            target = OUT / filename
            canvas.save(target, 'WEBP', quality=85, method=6)
            if target.stat().st_size >= 150_000:
                raise ValueError('Image exceeds 150 KB budget')
            files.append({'file': filename, 'url': url, 'originalSize': original_size, 'bytes': target.stat().st_size})
        print(f'{slug}: {len(files)} real images', flush=True)
        return slug, {'page': page or urls[0], 'images': files}
    except Exception as exc:
        print(f'{slug}: FAILED {exc}', flush=True)
        return slug, {'error': str(exc)}

if __name__ == '__main__':
    jobs = list(PAGES.items()) + [(slug, None) for slug in DIRECT]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        manifest = dict(pool.map(import_product, jobs))
    manifest_path = OUT / 'sources.json'
    existing = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    existing.update(manifest)
    manifest_path.write_text(json.dumps(existing, indent=2) + '\n')
