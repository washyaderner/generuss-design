import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask

# --- Configuration ---
WIDTH = 1200
HEIGHT = 750
BLEED = 75
DPI = 300

# Colors
C_BASE = (26, 26, 30, 255)         # #1A1A1E
C_SURFACE = (34, 34, 38, 255)      # #222226
C_SHADOW_DARK = (13, 13, 15, 255)   # #0D0D0F
C_SHADOW_LIGHT = (46, 46, 51, 255)  # #2E2E33
C_ACCENT = (0, 255, 239, 255)       # #00FFEF
C_TEXT_PRIMARY = (232, 232, 232, 255) # #E8E8E8
C_TEXT_SEC = (154, 154, 160, 255)   # #9A9AA0
C_TEXT_MUTED = (107, 107, 117, 255) # #6B6B75

# Paths
OUT_DIR = "dist/cards"
os.makedirs(OUT_DIR, exist_ok=True)

def get_font(size):
    try:
        # Try a common location or typical JetBrains Mono installation path if possible.
        # Otherwise fallback.
        return ImageFont.truetype("JetBrainsMono-Regular.ttf", size)
    except:
        return ImageFont.load_default()

def create_rounded_rect(width, height, radius, fill):
    """Create a rounded rectangle image with alpha."""
    img = Image.new("RGBA", (width, height), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((0, 0, width, height), radius=radius, fill=fill)
    return img

def drop_shadow(image, offset, blur_radius, color):
    """Create a drop shadow for a given image."""
    shadow = Image.new("RGBA", (image.width + abs(offset[0]) + blur_radius*2, 
                                image.height + abs(offset[1]) + blur_radius*2), (0,0,0,0))
    d = ImageDraw.Draw(shadow)
    # create solid mask
    alpha = image.split()[3]
    solid = Image.new("RGBA", image.size, color)
    solid.putalpha(alpha)
    
    paste_x = blur_radius + max(0, offset[0])
    paste_y = blur_radius + max(0, offset[1])
    shadow.paste(solid, (paste_x, paste_y), solid)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
    return shadow, paste_x, paste_y

def neumorphic_module(width, height, radius=16):
    """Returns (surface_img, mask_for_spot_uv, shadows_img, shadow_offset)."""
    # Create surface
    surface = create_rounded_rect(width, height, radius, C_SURFACE)
    
    # Shadows
    dark_shadow, dx, dy = drop_shadow(surface, (6, 6), 14, C_SHADOW_DARK)
    light_shadow, lx, ly = drop_shadow(surface, (-4, -4), 10, C_SHADOW_LIGHT)
    
    # Combine shadows
    max_w = max(dark_shadow.width, light_shadow.width)
    max_h = max(dark_shadow.height, light_shadow.height)
    shadows = Image.new("RGBA", (max_w, max_h), (0,0,0,0))
    # Paste light shadow
    shadows.paste(light_shadow, (0, 0), light_shadow)
    # Paste dark shadow
    shadows.paste(dark_shadow, (dx - lx, dy - ly), dark_shadow)
    
    # Module Top-Edge Highlight
    edge = Image.new("RGBA", (width, height), (0,0,0,0))
    draw = ImageDraw.Draw(edge)
    for x in range(width):
        alpha = int(255 * 0.08 * (1.0 - abs(x - width/2)/(width/2)))
        draw.point((x, 0), fill=(255, 255, 255, alpha))
        draw.point((x, 1), fill=(255, 255, 255, alpha//2))
    
    spot_uv = Image.new("RGBA", (width, height), (0,0,0,0))
    draw_uv = ImageDraw.Draw(spot_uv)
    draw_uv.line([(0,0), (width,0)], fill=(255,255,255,255), width=2)
    
    surface = Image.alpha_composite(surface, edge)
    return surface, spot_uv, shadows, lx, ly

def generate_front():
    # 0. Canvas
    base = Image.new("RGBA", (WIDTH, HEIGHT), C_BASE)
    spot_uv = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,255))
    
    # 1. Noise Texture
    noise_bytes = bytearray(os.urandom(WIDTH * HEIGHT * 4))
    for i in range(3, len(noise_bytes), 4):
        noise_bytes[i] = 6 
    noise = Image.frombytes('RGBA', (WIDTH, HEIGHT), bytes(noise_bytes))
    base = Image.alpha_composite(base, noise)
    
    # 2. Ambient Shine
    shine = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
    draw = ImageDraw.Draw(shine)
    for i in range(150):
        radius = int(800 * (i/150))
        alpha = int((0.04 * 255) * (1 - (i/150)**2))
        draw.ellipse((-radius, -radius, radius, radius), outline=(255,255,255,alpha), width=6)
    base = Image.alpha_composite(base, shine)
    
    # Module Setup
    mod_w, mod_h = 320, 280
    gap = 60
    center_y = HEIGHT // 2 - 40
    left_x = WIDTH // 2 - gap//2 - mod_w
    right_x = WIDTH // 2 + gap//2
    
    surf1, uv1, sh1, sx1, sy1 = neumorphic_module(mod_w, mod_h)
    surf2, uv2, sh2, sx2, sy2 = neumorphic_module(mod_w, mod_h)
    
    # 3. Shadows
    base.paste(sh1, (left_x - sx1, center_y - sy1), sh1)
    base.paste(sh2, (right_x - sx2, center_y - sy2), sh2)
    
    # 4. & 5. Module Fills + Highlights
    base.paste(surf1, (left_x, center_y), surf1)
    base.paste(surf2, (right_x, center_y), surf2)
    spot_uv.paste(uv1, (left_x, center_y), uv1)
    spot_uv.paste(uv2, (right_x, center_y), uv2)
    
    # 6. Logos (Placeholder for now)
    draw = ImageDraw.Draw(base)
    # Left
    draw.text((left_x + mod_w//2, center_y + mod_h//2), "generuss\ndesign", fill=C_ACCENT, font=get_font(24), anchor="mm", align="center")
    # Right
    draw.text((right_x + mod_w//2, center_y + mod_h//2), "generuss\nautomation", fill=C_ACCENT, font=get_font(24), anchor="mm", align="center")

    # 7. Cyan Status Bar
    bar_w = mod_w*2 + gap
    bar_h = 4
    bar_y = center_y + mod_h + 50
    bar_x = left_x
    draw.rectangle([bar_x, bar_y, bar_x+bar_w, bar_y+bar_h], fill=C_ACCENT)
    ImageDraw.Draw(spot_uv).rectangle([bar_x, bar_y, bar_x+bar_w, bar_y+bar_h], fill=(255,255,255,255))
    
    # 8. Bar Glow
    bar_img = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
    dl = ImageDraw.Draw(bar_img)
    dl.rectangle([bar_x, bar_y, bar_x+bar_w, bar_y+bar_h], fill=C_ACCENT)
    glow_up = bar_img.filter(ImageFilter.GaussianBlur(3))
    glow_down = bar_img.filter(ImageFilter.GaussianBlur(6))
    
    # Apply alpha adjustments via simple composite
    base = Image.alpha_composite(base, glow_down)
    base = Image.alpha_composite(base, glow_up)
    
    # 9. Progress Dots
    dot_y = bar_y - 15
    for i in range(5):
        dot_x = bar_x + bar_w - (5-i)*14
        color = C_ACCENT if i < 3 else C_TEXT_MUTED
        draw.ellipse([dot_x, dot_y, dot_x+6, dot_y+6], fill=color)
        if i < 3:
            ImageDraw.Draw(spot_uv).ellipse([dot_x, dot_y, dot_x+6, dot_y+6], fill=(255,255,255,255))
            
    # 10. Text
    draw.text((bar_x + bar_w - 74, dot_y - 5), "STATUS: ACTIVE", fill=C_TEXT_MUTED, font=get_font(12), anchor="rb")
    draw.text((WIDTH//2, bar_y + 30), "generuss.com", fill=C_TEXT_MUTED, font=get_font(14), anchor="mt")

    # 11. Corner brackets
    cb_size = 30
    m_top = 75
    m_left = 75
    draw.line([(m_left, m_top + cb_size), (m_left, m_top), (m_left + cb_size, m_top)], fill=C_SHADOW_LIGHT, width=2)
    draw.line([(WIDTH - m_left, m_top + cb_size), (WIDTH - m_left, m_top), (WIDTH - m_left - cb_size, m_top)], fill=C_SHADOW_LIGHT, width=2)
    draw.line([(m_left, HEIGHT - m_top - cb_size), (m_left, HEIGHT - m_top), (m_left + cb_size, HEIGHT - m_top)], fill=C_SHADOW_LIGHT, width=2)
    draw.line([(WIDTH - m_left, HEIGHT - m_top - cb_size), (WIDTH - m_left, HEIGHT - m_top), (WIDTH - m_left - cb_size, HEIGHT - m_top)], fill=C_SHADOW_LIGHT, width=2)

    base.save(os.path.join(OUT_DIR, "front_base.png"))
    spot_uv.save(os.path.join(OUT_DIR, "front_spot_uv.png"))
    print("Front side generated.")

def generate_back():
    base = Image.new("RGBA", (WIDTH, HEIGHT), C_BASE)
    spot_uv = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,255))
    
    # Noise Texture
    noise_bytes = bytearray(os.urandom(WIDTH * HEIGHT * 4))
    for i in range(3, len(noise_bytes), 4):
        noise_bytes[i] = 6 
    noise = Image.frombytes('RGBA', (WIDTH, HEIGHT), bytes(noise_bytes))
    base = Image.alpha_composite(base, noise)
    
    draw = ImageDraw.Draw(base)

    # QR Code Zone
    qr_w, qr_h = 240, 360
    qx = 120
    qy = 150
    surf1, uv1, sh1, sx1, sy1 = neumorphic_module(qr_w, qr_h)
    
    # Details Zone
    det_w, det_h = 680, qr_h
    dx = qx + qr_w + 40
    dy = qy
    surf2, uv2, sh2, sx2, sy2 = neumorphic_module(det_w, det_h)

    base.paste(sh1, (qx - sx1, qy - sy1), sh1)
    base.paste(sh2, (dx - sx2, dy - sy2), sh2)
    base.paste(surf1, (qx, qy), surf1)
    base.paste(surf2, (dx, dy), surf2)
    spot_uv.paste(uv1, (qx, qy), uv1)
    spot_uv.paste(uv2, (dx, dy), uv2)

    # QR Code
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=6, border=1)
    qr.add_data('https://generuss.com/connect')
    qr.make(fit=True)
    qr_img = qr.make_image(image_factory=StyledPilImage, color_mask=SolidFillColorMask(back_color=(34,34,38), front_color=(232,232,232))).convert("RGBA")
    
    # Paste QR
    qr_x = qx + (qr_w - qr_img.width)//2
    qr_y = qy + 50
    base.paste(qr_img, (qr_x, qr_y), qr_img)
    draw.text((qx + qr_w//2, qy + qr_h - 40), "SCAN TO CONNECT", fill=C_TEXT_MUTED, font=get_font(12), anchor="mb")

    # Name and Info
    draw.text((dx + 50, dy + 60), "Russell Gardner", fill=C_TEXT_PRIMARY, font=get_font(32), anchor="lt")
    draw.text((dx + 50, dy + 105), "SYSTEM ARCHITECT / DESIGNER", fill=C_ACCENT, font=get_font(14), anchor="lt")
    draw.text((dx + 50, dy + 160), "russ@generuss.com\n503.734.5502", fill=C_TEXT_SEC, font=get_font(16))
    draw.text((dx + 50, dy + 215), "generuss.com\ngenerussdesign.com", fill=C_TEXT_SEC, font=get_font(16))
    draw.text((dx + 50, dy + 270), "YT: @generussai", fill=C_ACCENT, font=get_font(16))

    # Dots below
    dot_y = dy + det_h - 40
    draw.ellipse([dx + 50, dot_y, dx+60, dot_y+10], fill=C_ACCENT)
    draw.text((dx + 70, dot_y + 11), "DESIGN", fill=C_TEXT_MUTED, font=get_font(12), anchor="lb")
    
    draw.ellipse([dx + 200, dot_y, dx+210, dot_y+10], fill=C_ACCENT)
    draw.text((dx + 220, dot_y + 11), "AUTOMATION", fill=C_TEXT_MUTED, font=get_font(12), anchor="lb")
    
    ImageDraw.Draw(spot_uv).ellipse([dx + 50, dot_y, dx+60, dot_y+10], fill=(255,255,255,255))
    ImageDraw.Draw(spot_uv).ellipse([dx + 200, dot_y, dx+210, dot_y+10], fill=(255,255,255,255))

    base.save(os.path.join(OUT_DIR, "back_base.png"))
    spot_uv.save(os.path.join(OUT_DIR, "back_spot_uv.png"))
    print("Back side generated.")

if __name__ == "__main__":
    print("Starting generation...")
    generate_front()
    generate_back()
    print("Done. Check dist/cards/.")
