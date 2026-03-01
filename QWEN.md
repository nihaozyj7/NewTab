# 项目上下文文档 (QWEN.md)

## 项目概述

这是一个 **Microsoft Edge 浏览器新标签页扩展**，基于 HTML/CSS/JavaScript 构建，采用 Manifest V3 规范。扩展提供了一个美观实用的搜索界面，支持多搜索引擎切换、主题设置和个性化定制功能。

### 技术栈
- **前端**: 原生 HTML5 + CSS3 + Vanilla JavaScript
- **扩展规范**: Chrome Extension Manifest V3
- **数据存储**: localStorage (本地存储)
- **打包工具**: 7-Zip/tar (通过 batch 脚本)

### 核心功能
- **多搜索引擎支持**: 内置必应、谷歌、百度、搜狗、360、Yandex，支持自定义添加
- **主题切换**: 深色/浅色模式
- **个性化设置**: 搜索框宽度、高度、圆角、字体大小、顶部间距
- **搜索行为**: 可选择在当前标签页或新标签页打开搜索结果
- **键盘快捷键**: `Ctrl+K` / `Alt+S` 快速聚焦搜索框

## 目录结构

```
新标签页/
├── index.html              # 主页面 (包含 UI 和 CSS 样式)
├── script.js               # JavaScript 逻辑文件
├── manifest.json           # 扩展配置文件 (Manifest V3)
├── README.md               # 项目说明文档
├── INSTALL_GUIDE.md        # 详细安装指南
├── test_server.bat         # 本地测试服务器脚本
├── package_extension.bat   # 扩展打包脚本
├── generate_icons.py       # 图标生成脚本 (Python + Pillow)
├── create_icons.txt        # 图标生成说明
├── icon/                   # 图标目录
│   ├── icon16.png          # 16x16 扩展图标
│   ├── icon48.png          # 48x48 扩展图标
│   └── icon128.png         # 128x128 扩展图标
└── QWEN.md                 # 本文件 - 项目上下文文档
```

## 构建与运行

### 开发环境要求
- Microsoft Edge 浏览器 (或其他 Chromium 浏览器)
- Python 3.x (可选，用于生成图标)
- Pillow 库 (可选，用于生成图标)

### 安装步骤

1. **生成图标** (如缺失):
   ```bash
   pip install Pillow
   python generate_icons.py
   ```

2. **加载扩展到 Edge**:
   - 打开 `edge://extensions/`
   - 开启"开发者模式"
   - 点击"加载解压的扩展"
   - 选择项目文件夹

3. **本地预览测试**:
   ```bash
   test_server.bat
   # 访问 http://localhost:8000/index.html
   ```

### 打包发布

```bash
package_extension.bat
# 生成 CustomNewTabPage.zip
```

## 开发约定

### 代码结构
- **HTML/CSS 混合**: 样式直接嵌入 `index.html` 的 `<style>` 标签中
- **JS 分离**: 所有 JavaScript 逻辑在 `script.js` 中，符合 CSP 规范
- **无外部依赖**: 纯原生实现，无需构建工具

### 数据存储规范
- 所有设置使用 `localStorage` 存储
- 搜索引擎列表使用 JSON 序列化存储
- 初始化标志：`InitializeFlag`

### 搜索引擎 URL 格式
使用 `%d` 作为搜索词占位符：
```javascript
{
  name: "必应",
  url: "https://cn.bing.com/search?q=%d"
}
```

### 配置项键名
| 配置项 | localStorage 键名 | 默认值 |
|--------|------------------|--------|
| 主题 | `theme` | 'light' |
| 搜索框宽度 | `searchBoxWidth` | '600px' |
| 搜索框高度 | `searchBoxHeight` | '40' |
| 圆角大小 | `searchBoxRadiusSize` | '0' |
| 字体大小 | `searchBoxFontSize` | '16' |
| 顶部间距 | `searchBoxTopHeight` | '0' |
| 打开方式 | `searchTarget` | '_blank' |
| 当前引擎 | `searchEngine` | 第一个引擎 |
| 引擎列表 | `searchEngineList` | 内置 6 个引擎 |

## 核心函数参考

### 主题相关
```javascript
isDark()                    // 检查是否为深色模式
setTheme(dark = true)       // 设置主题
```

### 样式设置
```javascript
getSearchBoxWidth()         // 获取搜索框宽度
setSearchBoxWidth(width)    // 设置搜索框宽度
getSearchBoxRadiusSize()    // 获取圆角大小
setSearchBoxRadiusSize(size)// 设置圆角大小
getSearchBoxFontSize()      // 获取字体大小
setSearchBoxFontSize(size)  // 设置字体大小
getSearchBoxHeight()        // 获取搜索框高度
setSearchBoxHeight(height)  // 设置搜索框高度
getSearchBoxTopHeight()     // 获取顶部间距
setSearchBoxTopHeight(height)// 设置顶部间距
```

### 搜索引擎管理
```javascript
getSearchEngineList()       // 获取引擎列表
setSearchEngineList(list)   // 设置引擎列表
addSearchEngine(engine)     // 添加引擎
getSearchEngine()           // 获取当前引擎
setSearchEngine(engine)     // 设置当前引擎
resetSearchEngineList()     // 重置为默认引擎
```

### 搜索行为
```javascript
getSearchTarget()           // 获取打开方式 (_self/_blank)
setSearchTarget(target)     // 设置打开方式
```

## 注意事项

1. **CSP 合规**: 无内联脚本，所有 JS 在外部文件中
2. **权限需求**: 需要 `storage` 权限保存设置
3. **图标要求**: 必须存在三种尺寸的图标文件
4. **浏览器行为**: 启动时地址栏会显示 extension:// URL，属正常现象
5. **本地存储**: 所有数据存储在本地，不会上传到服务器

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 扩展未生效 | 检查开发者模式是否开启，manifest.json 格式是否正确 |
| 图标缺失 | 运行 `generate_icons.py` 生成图标 |
| 设置不保存 | 检查 localStorage 权限，查看控制台错误 |
| 搜索无法打开 | 检查浏览器弹出窗口阻止设置 |
