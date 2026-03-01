@echo off
echo 正在启动本地服务器以测试新标签页扩展...
echo 请在浏览器中访问 http://localhost:8000/index.html 来预览效果
echo.
echo 按 Ctrl+C 可停止服务器
echo.
python -m http.server 8000
