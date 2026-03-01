// 搜索引擎内容脚本 - 在搜索结果页面显示多引擎切换工具条

(function() {
  console.log('[多引擎工具条] 脚本开始执行...');
  console.log('[多引擎工具条] 当前域名:', window.location.hostname);
  console.log('[多引擎工具条] 当前 URL:', window.location.href);
  console.log('[多引擎工具条] 当前 DOM 状态:', document.readyState);

  // 工具条 CSS 样式
  const toolbarStyles = `
    <style>
      #multi-engine-toolbar {
        position: fixed;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        gap: 8px;
        padding: 8px 12px;
        background-color: rgba(255, 255, 255, 0.98);
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 2147483647 !important;
        max-width: 80%;
        max-height: 80vh;
        cursor: grab;
        user-select: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        will-change: transform;
        transform: translateZ(0);
      }

      #multi-engine-toolbar:active {
        cursor: grabbing;
      }

      #multi-engine-toolbar.vertical {
        flex-direction: column;
        max-width: 200px;
      }

      #multi-engine-toolbar.dragging {
        transition: none !important;
        pointer-events: none;
      }

      #multi-engine-toolbar.dark {
        background-color: rgba(45, 45, 45, 0.98);
        border-color: #555;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }

      #multi-engine-toolbar .engine-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        background-color: #0078D4;
        color: white;
        transition: all 0.2s;
        white-space: nowrap;
        flex-shrink: 0;
      }

      #multi-engine-toolbar .engine-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 120, 212, 0.4);
        background-color: #005a9e;
      }

      #multi-engine-toolbar .engine-btn.active {
        background-color: #28a745;
        box-shadow: 0 2px 6px rgba(40, 167, 69, 0.4);
      }

      #multi-engine-toolbar .engine-btn.active:hover {
        background-color: #218838;
      }

      #multi-engine-toolbar .toolbar-toggle {
        font-size: 14px;
        cursor: pointer;
        color: #666;
        padding: 4px 6px;
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

  // 立即注入样式到 documentElement
  const docElement = document.documentElement;
  if (docElement) {
    const styleEl = document.createElement('style');
    styleEl.textContent = toolbarStyles.replace(/<style>/g, '').replace(/<\/style>/g, '');
    docElement.insertBefore(styleEl, docElement.firstChild);
    console.log('[多引擎工具条] 样式已注入');
  }

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
    let rafId = null;

    toolbar.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('engine-btn') ||
          e.target.classList.contains('toolbar-toggle')) {
        return;
      }

      isDragging = true;
      toolbar.classList.add('dragging');

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = toolbar.offsetLeft;
      const startTop = toolbar.offsetTop;

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        if (rafId) return;
        
        rafId = requestAnimationFrame(function() {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          
          toolbar.style.left = (startLeft + dx) + 'px';
          toolbar.style.top = (startTop + dy) + 'px';
          toolbar.style.right = 'auto';
          rafId = null;
        });
      }

      function onMouseUp() {
        if (!isDragging) return;
        
        isDragging = false;
        toolbar.classList.remove('dragging');
        
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        const rect = toolbar.getBoundingClientRect();
        chrome.storage.local.set({
          toolbarLeft: rect.left + 'px',
          toolbarTop: rect.top + 'px'
        });
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      e.preventDefault();
    });
  }

  // 创建工具条
  function createToolbar() {
    console.log('[多引擎工具条] 开始创建工具条...');
    
    // 先创建工具条（无内容），让它立即显示
    const toolbar = document.createElement('div');
    toolbar.id = 'multi-engine-toolbar';
    toolbar.style.display = 'flex';
    
    // 切换方向按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toolbar-toggle';
    toggleBtn.textContent = '🔶';
    toggleBtn.title = '加载中...';
    toolbar.appendChild(toggleBtn);
    
    // 加载提示
    const loadingBtn = document.createElement('span');
    loadingBtn.textContent = '正在加载...';
    loadingBtn.style.cssText = 'padding: 6px 12px; color: #666; font-size: 13px;';
    toolbar.appendChild(loadingBtn);
    
    document.body.appendChild(toolbar);
    console.log('[多引擎工具条] 工具条已显示（加载中）');

    // 从 chrome.storage 读取设置
    chrome.storage.local.get(['multiEngineMode', 'searchEngineList', 'theme', 'toolbarLeft', 'toolbarTop', 'toolbarDirection'], (result) => {
      console.log('[多引擎工具条] 读取设置结果:', result);
      
      const mode = result.multiEngineMode || 'off';
      console.log('[多引擎工具条] 多引擎模式:', mode);
      
      if (mode !== 'on') {
        console.log('[多引擎工具条] 多引擎模式未开启，隐藏工具条');
        toolbar.style.display = 'none';
        return;
      }

      // 获取搜索关键词
      const query = extractSearchQuery();
      if (!query) {
        console.log('[多引擎工具条] 未找到搜索关键词，隐藏工具条');
        toolbar.style.display = 'none';
        return;
      }

      // 获取引擎列表和主题
      const engines = (result.searchEngineList && Array.isArray(result.searchEngineList) && result.searchEngineList.length > 0) 
                      ? result.searchEngineList 
                      : searchEngines;
      const theme = result.theme || 'light';
      const currentEngine = getCurrentEngine();
      const savedDirection = result.toolbarDirection || 'horizontal';

      console.log('[多引擎工具条] 引擎列表:', engines);
      console.log('[多引擎工具条] 主题:', theme);
      console.log('[多引擎工具条] 当前引擎:', currentEngine);

      // 应用主题
      if (theme === 'dark') {
        toolbar.classList.add('dark');
      }

      // 应用方向
      if (savedDirection === 'vertical') {
        toolbar.classList.add('vertical');
        toggleBtn.style.transform = 'rotate(90deg)';
      }
      toggleBtn.title = savedDirection === 'vertical' ? '切换为横向' : '切换为竖向';

      // 移除加载提示，添加引擎按钮
      toolbar.removeChild(loadingBtn);

      // 引擎按钮
      engines.forEach(engine => {
        const btn = document.createElement('button');
        btn.className = 'engine-btn';
        btn.textContent = engine.name || '未知引擎';

        if (engine.name === currentEngine.name) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (!engine.url) {
            console.error('[多引擎工具条] 引擎 URL 为空:', engine);
            return;
          }
          const newUrl = engine.url.replace('%d', encodeURIComponent(query));
          window.location.href = newUrl;
        });

        toolbar.appendChild(btn);
      });

      // 切换方向按钮事件
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isVertical = toolbar.classList.toggle('vertical');
        toggleBtn.title = isVertical ? '切换为横向' : '切换为竖向';
        toggleBtn.style.transform = isVertical ? 'rotate(90deg)' : 'rotate(0deg)';
        chrome.storage.local.set({ toolbarDirection: isVertical ? 'vertical' : 'horizontal' });
      });

      // 从结果中加载位置
      const savedLeft = result.toolbarLeft;
      const savedTop = result.toolbarTop;

      if (savedLeft && savedTop) {
        toolbar.style.left = savedLeft;
        toolbar.style.top = savedTop;
      } else {
        toolbar.style.right = '20px';
        toolbar.style.top = '80px';
      }

      // 初始化工具条拖动功能
      initToolbarDrag(toolbar);

      console.log('[多引擎工具条] 工具条加载完成');
    });
  }

  // 立即执行
  if (document.body) {
    createToolbar();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      createToolbar();
    });
  }

  console.log('[多引擎工具条] 脚本执行完成');
})();
