"""
简单的图标生成脚本，用于创建Edge扩展所需的图标
需要先安装Pillow库：pip install Pillow
"""

import os
from PIL import Image, ImageDraw, ImageFont


def create_icon(size, filename):
    """创建指定尺寸的图标"""
    # 创建一个新的图像
    img = Image.new('RGBA', (size, size), color=(64, 128, 200, 255))

    # 创建绘制对象
    draw = ImageDraw.Draw(img)

    # 绘制背景圆形
    draw.ellipse([(0, 0), (size, size)], fill=(41, 128, 185, 255))

    # 绘制放大镜形状
    # 手柄
    handle_color = (240, 240, 240, 255)
    if size >= 32:
        # 较大尺寸的精细绘制
        draw.rectangle([(int(size*0.65), int(size*0.65)),
                       (int(size*0.8), int(size*0.85))], fill=handle_color)
        # 镜片外圈
        draw.ellipse([(int(size*0.2), int(size*0.2)), (int(size*0.7),
                     int(size*0.7))], outline=handle_color, width=max(2, size//20))
        # 镜片内圈
        draw.ellipse([(int(size*0.25), int(size*0.25)), (int(size*0.65),
                     int(size*0.65))], outline=(200, 230, 255, 200), width=max(1, size//30))
    else:
        # 较小尺寸的简化绘制
        draw.rectangle([(int(size*0.6), int(size*0.6)),
                       (int(size*0.8), int(size*0.8))], fill=handle_color)
        draw.ellipse([(int(size*0.2), int(size*0.2)), (int(size*0.75),
                     int(size*0.75))], outline=handle_color, width=max(1, size//15))

    # 保存图像
    img.save(filename)
    print(f"已创建图标: {filename} ({size}x{size})")


def main():
    # 确保图标目录存在
    icon_dir = "icon"
    if not os.path.exists(icon_dir):
        os.makedirs(icon_dir)
        print(f"已创建目录: {icon_dir}")

    # 定义需要的图标尺寸
    sizes_and_names = [
        (16, "icon/icon16.png"),
        (48, "icon/icon48.png"),
        (128, "icon/icon128.png")
    ]

    print("正在生成Edge扩展所需图标...")

    for size, filename in sizes_and_names:
        create_icon(size, filename)

    print("\n所有图标生成完成！")
    print("现在您可以安装Edge扩展了。")


if __name__ == "__main__":
    try:
        from PIL import Image, ImageDraw
        main()
    except ImportError:
        print("错误：需要安装Pillow库来生成图标")
        print("请运行以下命令安装：")
        print("pip install Pillow")
