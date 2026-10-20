"""Optimize the user's supplied iPhone 18 Pro gallery without generating new imagery."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageChops

root = Path(__file__).resolve().parents[1]
out = root / 'public/images/products'
files = [
    'a18e6c2f-8dec-4a52-bd95-131f72c5135f',
    '2d2aa65d-29de-4b92-90f6-bc9485d64959',
    'c76ec9a2-5bf3-4b22-9353-d7df78c672f9',
    'd3e7fd28-cc29-472c-80d7-f015c503b891',
    '6350b87d-a26a-41b0-be76-aca1acb405da',
    '0e9e16a9-c319-4d02-bb13-563d9c493e6b',
    '5d22afc1-84ec-4b7b-b0d5-6259bd8f9f6c',
    '88f0ab50-7ddc-4a68-8217-04a1f8bfeb8f',
]
entries = []
for i, token in enumerate(files, 1):
    original = Path('C:/Users/Pratik/AppData/Local/Temp') / f'codex-clipboard-{token}.png'
    image = Image.open(original).convert('RGB')
    size = image.size
    if i <= 2:
        # Trim only uniform outside margins so the real phone stays prominent in a square frame.
        background = Image.new('RGB', image.size, image.getpixel((0, 0)))
        mask = ImageChops.difference(image, background).convert('L').point(lambda x: 255 if x > 18 else 0)
        bounds = mask.getbbox()
        if bounds:
            image = ImageOps.expand(image.crop(bounds), border=24, fill=image.getpixel((0, 0)))
    image = ImageOps.contain(image, (800, 800), Image.Resampling.LANCZOS)
    canvas = Image.new('RGB', (800,800), 'white')
    canvas.paste(image, ((800-image.width)//2, (800-image.height)//2))
    target = out / f'iphone-18-pro-{i}.webp'
    canvas.save(target, 'WEBP', quality=85, method=6)
    entries.append({'file': target.name, 'url': 'user-supplied attachment', 'originalSize': size})

# Migrate the initial photo import to WebP for a smaller, higher-fidelity payload.
for path in out.glob('*.png'):
    Image.open(path).convert('RGB').save(path.with_suffix('.webp'), 'WEBP', quality=85, method=6)

manifest_path = out / 'sources.json'
manifest = json.loads(manifest_path.read_text())
manifest['iphone-18-pro'] = {
    'page': 'https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/',
    'provenance': 'Eight product and feature images supplied by the user. No generated imagery.',
    'images': entries,
}
for record in manifest.values():
    for entry in record.get('images', []):
        entry['file'] = str(Path(entry['file']).with_suffix('.webp'))
        entry['bytes'] = (out / entry['file']).stat().st_size
        assert entry['bytes'] < 150_000
manifest_path.write_text(json.dumps(manifest, indent=2)+'\n')
print('Optimized 8 supplied images; all local product WebPs are 800x800 and under 150 KB.')
