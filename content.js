// 搜索引擎内容脚本 - 在搜索结果页面显示多引擎切换工具条

(function() {
  console.log('[多引擎工具条] 脚本开始执行...');
  console.log('[多引擎工具条] 当前域名:', window.location.hostname);
  console.log('[多引擎工具条] 当前 URL:', window.location.href);

  // 工具条 CSS 样式
  const toolbarStyles = `
    <style>
      #multi-engine-toolbar {
        position: fixed;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        gap: 8px;
        padding: 12px 16px;
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 999999 !important;
        max-width: 80%;
        max-height: 80vh;
        cursor: move;
        user-select: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        transition: all 0.3s ease;
      }

      #multi-engine-toolbar.vertical {
        flex-direction: column;
        max-width: 200px;
      }

      #multi-engine-toolbar.dark {
        background-color: rgba(45, 45, 45, 0.95);
        border-color: #555;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      #multi-engine-toolbar .engine-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        background-color: #0078D4;
        color: white;
        transition: all 0.2s;
        white-space: nowrap;
        flex-shrink: 0;
      }

      #multi-engine-toolbar .engine-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 120, 212, 0.4);
        background-color: #005a9e;
      }

      #multi-engine-toolbar .engine-btn.active {
        background-color: #28a745;
        box-shadow: 0 2px 6px rgba(40, 167, 69, 0.4);
      }

      #multi-engine-toolbar .engine-btn.active:hover {
        background-color: #218838;
      }

      #multi-engine-toolbar .toolbar-close {
        font-size: 18px;
        cursor: pointer;
        color: #666;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
        line-height: 1;
        flex-shrink: 0;
      }

      #multi-engine-toolbar .toolbar-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
        color: #333;
      }

      #multi-engine-toolbar.dark .toolbar-close {
        color: #aaa;
      }

      #multi-engine-toolbar.dark .toolbar-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      #multi-engine-toolbar .toolbar-toggle {
        font-size: 16px;
        cursor: pointer;
        color: #666;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
        line-height: 1;
        flex-shrink: 0;
        background: none;
        border: none;
      }

      #multi-engine-toolbar .toolbar-toggle:hover {
        background-color: rgba(0, 0, 0, 0.1);
        color: #333;
      }

      #multi-engine-toolbar.dark .toolbar-toggle {
        color: #aaa;
      }

      #multi-engine-toolbar.dark .toolbar-toggle:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    </style>
  `;

  // 注入样式
  document.head.insertAdjacentHTML('beforeend', toolbarStyles);
  console.log('[多引擎工具条] 样式已注入');

  // 搜索引擎配置
  const searchEngines = [
    { name: "必应", url: "https://cn.bing.com/search?q=%d", domain: "cn.bing.com" },
    { name: "谷歌", url: "https://www.google.com/search?q=%d", domain: "www.google.com" },
    { name: "百度", url: "https://www.baidu.com/s?wd=%d", domain: "www.baidu.com" },
    { name: "搜狗", url: "https://www.sogou.com/web?query=%d", domain: "www.sogou.com" },
    { name: "360", url: "https://www.so.com/s?q=%d", domain: "www.so.com" },
    { name: "Yandex", url: "https://yandex.com/search/?text=%d", domain: "yandex.com" }
  ];

  // 从 URL 提取搜索关键词
  function extractSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 不同搜索引擎的参数名
    const queryParam = urlParams.get('q') || 
                       urlParams.get('wd') || 
                       urlParams.get('query') || 
                       urlParams.get('text') || 
                       '';
    
    const query = decodeURIComponent(queryParam);
    console.log('[多引擎工具条] 提取搜索关键词:', query);
    return query;
  }

  // 获取当前搜索引擎
  function getCurrentEngine() {
    const domain = window.location.hostname;
    const engine = searchEngines.find(e => e.domain === domain);
    console.log('[多引擎工具条] 当前引擎域名:', domain, '匹配结果:', engine);
    return engine || searchEngines[0];
  }

  // 工具条拖动功能
  function initToolbarDrag(toolbar) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    console.log('[多引擎工具条] 初始化拖动功能');

    toolbar.addEventListener('mousedown', function(e) {
      console.log('[多引擎工具条] mousedown 事件触发，目标:', e.target.className);
      
      // 如果点击的是关闭按钮或引擎按钮，不启动拖动
      if (e.target.classList.contains('toolbar-close') ||
          e.target.classList.contains('engine-btn') ||
          e.target.classList.contains('toolbar-hint')) {
        console.log('[多引擎工具条] 点击的是按钮，不拖动');
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      // 获取当前位置
      const rect = toolbar.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      console.log('[多引擎工具条] 开始拖动，初始位置:', initialLeft, initialTop);

      // 移除 right 属性以便使用 left 定位
      toolbar.style.right = 'auto';
      toolbar.style.left = initialLeft + 'px';
      toolbar.style.top = initialTop + 'px';

      e.preventDefault();
    }, true);

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      toolbar.style.left = (initialLeft + dx) + 'px';
      toolbar.style.top = (initialTop + dy) + 'px';
    }, true);

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        const rect = toolbar.getBoundingClientRect();
        console.log('[多引擎工具条] 拖动结束，保存位置:', rect.left, rect.top);
        // 使用 chrome.storage 保存位置
        chrome.storage.local.set({
          toolbarLeft: rect.left + 'px',
          toolbarTop: rect.top + 'px'
        });
      }
    }, true);
  }

  // 创建工具条
  function createToolbar() {
    console.log('[多引擎工具条] 开始创建工具条...');
    
    // 使用 chrome.storage.local 读取设置
    chrome.storage.local.get(['multiEngineMode', 'searchEngineList', 'theme', 'toolbarLeft', 'toolbarTop'], (result) => {
      console.log('[多引擎工具条] 读取设置结果:', result);
      
      const mode = result.multiEngineMode || 'off';
      console.log('[多引擎工具条] 多引擎模式:', mode);
      
      if (mode !== 'on') {
        console.log('[多引擎工具条] 多引擎模式未开启，不显示工具条');
        return;
      }

      // 获取搜索关键词
      const query = extractSearchQuery();
      if (!query) {
        console.log('[多引擎工具条] 未找到搜索关键词，不显示工具条');
        return;
      }

      // 获取引擎列表
      const engines = (result.searchEngineList && Array.isArray(result.searchEngineList) && result.searchEngineList.length > 0) 
                      ? result.searchEngineList 
                      : searchEngines;
      const theme = result.theme || 'light';
      const currentEngine = getCurrentEngine();

      console.log('[多引擎工具条] 引擎列表:', engines);
      console.log('[多引擎工具条] 主题:', theme);
      console.log('[多引擎工具条] 当前引擎:', currentEngine);

      // 创建工具条 HTML
      const toolbar = document.createElement('div');
      toolbar.id = 'multi-engine-toolbar';
      if (theme === 'dark') {
        toolbar.classList.add('dark');
      }

      // 从结果中加载方向
      const savedDirection = result.toolbarDirection || 'horizontal';
      if (savedDirection === 'vertical') {
        toolbar.classList.add('vertical');
      }

      // 关闭按钮
      const closeBtn = document.createElement('span');
      closeBtn.className = 'toolbar-close';
      closeBtn.textContent = '×';
      closeBtn.title = '关闭工具条';
      toolbar.appendChild(closeBtn);

      // 切换方向按钮 (使用 UTF 表情符号)
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'toolbar-toggle';
      toggleBtn.textContent = savedDirection === 'vertical' ? '⬆️' : '⬇️';
      toggleBtn.title = savedDirection === 'vertical' ? '切换为横向' : '切换为竖向';
      
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isVertical = toolbar.classList.toggle('vertical');
        toggleBtn.textContent = isVertical ? '⬆️' : '⬇️';
        toggleBtn.title = isVertical ? '切换为横向' : '切换为竖向';
        // 保存方向设置
        chrome.storage.local.set({ toolbarDirection: isVertical ? 'vertical' : 'horizontal' });
        console.log('[多引擎工具条] 切换方向:', isVertical ? '竖向' : '横向');
      });
      
      toolbar.appendChild(toggleBtn);

      // 引擎按钮
      engines.forEach(engine => {
        const btn = document.createElement('button');
        btn.className = 'engine-btn';
        btn.textContent = engine.name || '未知引擎';

        // 如果是当前引擎，添加 active 类
        if (engine.name === currentEngine.name) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[多引擎工具条] 切换到引擎:', engine.name);
          // 切换到新搜索引擎
          if (!engine.url) {
            console.error('[多引擎工具条] 引擎 URL 为空:', engine);
            return;
          }
          const newUrl = engine.url.replace('%d', encodeURIComponent(query));
          window.location.href = newUrl;
        });

        toolbar.appendChild(btn);
      });

      document.body.appendChild(toolbar);
      console.log('[多引擎工具条] 工具条已添加到页面');

      // 从结果中加载位置
      const savedLeft = result.toolbarLeft;
      const savedTop = result.toolbarTop;

      if (savedLeft && savedTop) {
        toolbar.style.left = savedLeft;
        toolbar.style.top = savedTop;
        console.log('[多引擎工具条] 使用保存的位置:', savedLeft, savedTop);
      } else {
        // 默认位置：页面右上角
        toolbar.style.right = '20px';
        toolbar.style.top = '80px';
        console.log('[多引擎工具条] 使用默认位置：右上角');
      }

      // 初始化工具条拖动功能
      initToolbarDrag(toolbar);

      // 关闭按钮事件
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[多引擎工具条] 关闭工具条');
        toolbar.remove();
      });
    });
  }

  // 页面加载完成后创建工具条
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToolbar);
  } else {
    createToolbar();
  }

  console.log('[多引擎工具条] 脚本执行完成');
})();
