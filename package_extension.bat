@echo off
echo 正在准备打包Edge扩展...
echo.

:: 检查是否安装了7-Zip，如果没有则提示用户手动打包
where /q tar
if %ERRORLEVEL% == 0 (
    echo 使用内置tar工具创建扩展包...
    tar -a -cf "CustomNewTabPage.zip" *.html *.js *.css icon\*
    echo.
    echo 扩展已打包为 CustomNewTabPage.zip
    echo 现在您可以前往 edge://extensions/ 并启用开发者模式来加载此扩展包
) else (
    echo 未找到压缩工具，创建打包说明...
    echo.
    echo 请手动创建ZIP压缩包，包含以下文件：
    echo.  - index.html
    echo.  - script.js
    echo.  - manifest.json
    echo.  - icon/ 文件夹及其内容
    echo.
    echo 完成后，前往 edge://extensions/ 启用开发者模式并加载扩展包
)

echo.
echo 按任意键退出...
pause > nul
