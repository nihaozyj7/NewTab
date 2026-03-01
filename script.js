// 主题
function isDark() {
  return localStorage.getItem('theme') === 'dark'
}

function setTheme(dark = true) {
  if (dark) {
    localStorage.setItem('theme', 'dark')
    document.body.className = 'dark'
  }
  else {
    localStorage.setItem('theme', 'light')
    document.body.className = ''
  }

  // 确保搜索引擎列表在主题切换后正确显示
  const searchEngineList = document.querySelector('.search-engine-list')
  if (searchEngineList && searchEngineList.style.display === 'flex') {
    // 如果列表当前是可见的，重新设置主题类以确保样式正确
    if (dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }
}

// 搜索框顶部高度
function getSearchBoxTopHeight() {
  const height = localStorage.getItem('searchBoxTopHeight') || '0'
  return parseInt(height)
}

function setSearchBoxTopHeight(height) {
  localStorage.setItem('searchBoxTopHeight', height)
}

//搜索框宽度
function getSearchBoxWidth() {
  return localStorage.getItem('searchBoxWidth') || '600px'
}

function setSearchBoxWidth(width) {
  localStorage.setItem('searchBoxWidth', width + 'px')
}


// 搜索框圆角大小
function getSearchBoxRadiusSize() {
  const size = localStorage.getItem('searchBoxRadiusSize') || '0'
  return parseInt(size)
}

function setSearchBoxRadiusSize(size) {
  localStorage.setItem('searchBoxRadiusSize', size)
}

// 搜索框字体大小
function getSearchBoxFontSize() {
  const size = localStorage.getItem('searchBoxFontSize') || '16'
  return parseInt(size)
}

function setSearchBoxFontSize(size) {
  localStorage.setItem('searchBoxFontSize', size)
}

// 搜索框高度
function getSearchBoxHeight() {
  const height = localStorage.getItem('searchBoxHeight') || '40'
  return parseInt(height)
}

function setSearchBoxHeight(height) {
  localStorage.setItem('searchBoxHeight', height)
}

// 搜索行为设置
function getSearchTarget() {
  return localStorage.getItem('searchTarget') || '_blank'
}

function setSearchTarget(target) {
  localStorage.setItem('searchTarget', target)
}

// 搜索引擎列表
function getSearchEngineList() {
  return JSON.parse(localStorage.getItem('searchEngineList')) || []
}

function setSearchEngineList(list) {
  localStorage.setItem('searchEngineList', JSON.stringify(list))
  // 可用引擎为空则重置
  if (list.length === 0) resetSearchEngineList()
}

function addSearchEngine(engine) {
  const list = getSearchEngineList()
  list.push(engine)
  setSearchEngineList(list)
}

function setSearchEngine(engine) {
  if (typeof engine !== 'string') {
    engine = JSON.stringify(engine)
  }
  localStorage.setItem('searchEngine', engine)
}

function getSearchEngine() {
  return JSON.parse(localStorage.getItem('searchEngine')) || getSearchEngineList()[0]
}

// 重置
function reset() {
  localStorage.clear()
  setTheme()

  setSearchBoxTopHeight("0")
  setSearchBoxWidth("600px")
  setSearchBoxHeight("40")
  setSearchBoxRadiusSize("0")
  setSearchBoxFontSize("16")
  setSearchTarget("_blank")
  resetSearchEngineList()
  setSearchEngine(getSearchEngineList()[0])
  localStorage.setItem('InitializeFlag', 'True')
}

function resetSearchEngineList() {
  setSearchEngineList([

    {
      name: "必应",
      url: "https://cn.bing.com/search?q=%d"
    },
    {
      name: "谷歌",
      url: "https://www.google.com/search?q=%d"
    },
    {
      name: "搜狗",
      url: "https://www.sogou.com/web?query=%d"
    },
    {
      name: "百度",
      url: "https://www.baidu.com/s?wd=%d"
    },
    {
      name: "360",
      url: "https://www.so.com/s?q=%d"
    },
    {
      name: "Yandex",
      url: "https://yandex.com/search/?text=%d"
    }
  ])
}

// 初始化检查
if (localStorage.getItem('InitializeFlag') !== "True") {
  reset()
  localStorage.setItem('InitializeFlag', "True")
} else {
  //应用现有设置
  applyInitialSettings()
}

// 延迟添加过渡效果，避免首次加载时的颜色闪烁
setTimeout(() => {
  document.querySelector('body').style.transition = 'all .5s'
}, 1000)

document.querySelector('.search-engine-list').addEventListener('click', function (e) {
  if (e.target.classList.contains('item')) {
    setSearchEngine({
      name: e.target.innerText,
      url: e.target.dataset.url
    })
    document.getElementById('currentSearchEngine').textContent = getSearchEngine().name

    document.querySelector('.search-engine-list').style.display = 'none'
  }
})

document.getElementById('currentSearchEngine').addEventListener('click', function () {
  const ne = getSearchEngine()

  document.querySelector('.search-engine-list').innerHTML = getSearchEngineList().map(
    engine => {
      if (ne.name === engine.name && ne.url === engine.url)
        return `<div class="item active" data-url="${engine.url}">${engine.name}</div>`
      else
        return `<div class="item" data-url="${engine.url}">${engine.name}</div>`
    }
  ).join('')

  document.querySelector('.search-engine-list').style.display = 'flex'

  // 确保列表出现在正确的主题模式下
  if (isDark()) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
})

document.getElementById('currentSearchEngine').textContent = getSearchEngine().name



// 设置界面相关功能
document.getElementById('settingsBtn').addEventListener('click', function () {
  document.getElementById('settingsPanel').style.display = 'block'
  loadSettings()
})

document.getElementById('closeSettings').addEventListener('click', function () {
  document.getElementById('settingsPanel').style.display = 'none'
})

document.querySelector('.settings-overlay').addEventListener('click', function () {
  document.getElementById('settingsPanel').style.display = 'none'
})

// 加载设置
function loadSettings() {
  // 主题设置
  document.getElementById('themeSelect').value = isDark() ? 'dark' : 'light'

  // 搜索框样式设置
  document.getElementById('widthSlider').value = parseInt(getSearchBoxWidth())
  document.getElementById('widthValue').textContent = getSearchBoxWidth()

  document.getElementById('heightSlider').value = getSearchBoxHeight()
  document.getElementById('heightValue').textContent = getSearchBoxHeight() + 'px'

  document.getElementById('radiusSlider').value = getSearchBoxRadiusSize()
  document.getElementById('radiusValue').textContent = getSearchBoxRadiusSize() + 'px'

  document.getElementById('fontSizeSlider').value = getSearchBoxFontSize()
  document.getElementById('fontSizeValue').textContent = getSearchBoxFontSize() + 'px'

  // 更新顶部间距滑块的最大值
  updateTopHeightSliderMax()

  document.getElementById('topHeightSlider').value = getSearchBoxTopHeight()
  document.getElementById('topHeightValue').textContent = getSearchBoxTopHeight() + 'px'

  // 搜索行为设置
  document.getElementById('searchTargetSelect').value = getSearchTarget()

  // 加载搜索引擎列表
  loadEngineList()
}

// 搜索引擎列表管理
function loadEngineList() {
  const engines = getSearchEngineList()
  const container = document.getElementById('engineList')
  container.innerHTML = ''

  engines.forEach((engine, index) => {
    const engineItem = document.createElement('div')
    engineItem.className = 'engine-item'
    engineItem.innerHTML = `
      <div class="engine-info">
        <div class="engine-name">${engine.name}</div>
        <div class="engine-url">${engine.url}</div>
      </div>
      <div class="engine-actions">
        <button class="engine-btn edit-btn" data-index="${index}">编辑</button>
        <button class="engine-btn delete-btn" data-index="${index}">删除</button>
      </div>
    `
    container.appendChild(engineItem)
  })

  //绑定编辑和删除事件
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index)
      editEngine(index)
    })
  })

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index)
      deleteEngine(index)
    })
  })
}

function editEngine(index) {
  const engines = getSearchEngineList()
  const engine = engines[index]

  const form = document.createElement('div')
  form.className = 'engine-form'
  form.innerHTML = `
    <input type="text" id="editEngineName" placeholder="搜索引擎名称" value="${engine.name}">
    <input type="text" id="editEngineUrl" placeholder="搜索URL (使用 %d 作为搜索词占位符)" value="${engine.url}">
    <div class="engine-form-buttons">
      <button class="engine-btn save-btn" id="saveEdit">保存</button>
      <button class="engine-btn cancel-btn" id="cancelEdit">取消</button>
    </div>
  `

  const container = document.getElementById('engineList')
  container.insertBefore(form, container.children[index])

  document.getElementById('saveEdit').addEventListener('click', function () {
    const name = document.getElementById('editEngineName').value.trim()
    const url = document.getElementById('editEngineUrl').value.trim()

    if (name && url) {
      engines[index] = { name, url }
      setSearchEngineList(engines)
      loadEngineList()

      // 如果编辑的是当前搜索引擎，更新显示
      const currentEngine = getSearchEngine()
      if (currentEngine.name === name && currentEngine.url === url) {
        setSearchEngine(engines[index])
        document.getElementById('currentSearchEngine').textContent = name
      }
    }
  })

  document.getElementById('cancelEdit').addEventListener('click', function () {
    form.remove()
  })
}

function deleteEngine(index) {
  if (confirm('确定要删除这个搜索引擎吗？')) {
    const engines = getSearchEngineList()
    const deletedEngine = engines[index]
    engines.splice(index, 1)
    setSearchEngineList(engines)
    loadEngineList()

    // 如果删除的是当前搜索引擎，切换到第一个
    const currentEngine = getSearchEngine()
    if (currentEngine.name === deletedEngine.name && currentEngine.url === deletedEngine.url) {
      if (engines.length > 0) {
        setSearchEngine(engines[0])
        document.getElementById('currentSearchEngine').textContent = engines[0].name
      }
    }
  }
}

document.getElementById('addEngineBtn').addEventListener('click', function () {
  const form = document.createElement('div')
  form.className = 'engine-form'
  form.innerHTML = `
    <input type="text" id="newEngineName" placeholder="搜索引擎名称">
    <input type="text" id="newEngineUrl" placeholder="搜索URL (使用 %d 作为搜索词占位符)">
    <div class="engine-form-buttons">
      <button class="engine-btn save-btn" id="saveNew">添加</button>
      <button class="engine-btn cancel-btn" id="cancelNew">取消</button>
    </div>
  `

  const container = document.getElementById('engineList')
  container.insertBefore(form, container.firstChild)

  document.getElementById('newEngineName').focus()

  document.getElementById('saveNew').addEventListener('click', function () {
    const name = document.getElementById('newEngineName').value.trim()
    const url = document.getElementById('newEngineUrl').value.trim()

    if (name && url) {
      addSearchEngine({ name, url })
      form.remove()
      loadEngineList()
    }
  })

  document.getElementById('cancelNew').addEventListener('click', function () {
    form.remove()
  })
})

//绑定设置滑块事件
document.getElementById('themeSelect').addEventListener('change', function () {
  setTheme(this.value === 'dark')
})

document.getElementById('searchTargetSelect').addEventListener('change', function () {
  setSearchTarget(this.value)
})

document.getElementById('widthSlider').addEventListener('input', function () {
  const width = this.value + 'px'
  document.getElementById('widthValue').textContent = width
  setSearchBoxWidth(parseInt(this.value))
  document.querySelector('main').style.width = width
})

document.getElementById('radiusSlider').addEventListener('input', function () {
  const radius = this.value + 'px'
  document.getElementById('radiusValue').textContent = radius
  setSearchBoxRadiusSize(this.value)
  updateSearchBoxRadius()
})

document.getElementById('fontSizeSlider').addEventListener('input', function () {
  const size = this.value + 'px'
  document.getElementById('fontSizeValue').textContent = size
  setSearchBoxFontSize(this.value)
  document.querySelector('.search-box').style.fontSize = size
})

document.getElementById('heightSlider').addEventListener('input', function () {
  const height = this.value + 'px'
  document.getElementById('heightValue').textContent = height
  setSearchBoxHeight(this.value)
  document.querySelector('main').style.height = height
})

document.getElementById('topHeightSlider').addEventListener('input', function () {
  const height = this.value + 'px'
  document.getElementById('topHeightValue').textContent = height
  setSearchBoxTopHeight(this.value)
  document.querySelector('main').style.marginTop = height
})

// 设置顶部间距滑块的最大值为窗口高度的一半
function updateTopHeightSliderMax() {
  const maxHeight = Math.floor(window.innerHeight / 2)
  const slider = document.getElementById('topHeightSlider')
  if (slider) {
    slider.max = maxHeight
  }
}

// 页面加载时设置滑块最大值
window.addEventListener('load', function () {
  updateTopHeightSliderMax()
})

// 窗口大小改变时更新滑块最大值
window.addEventListener('resize', function () {
  updateTopHeightSliderMax()
})

// 更新搜索框圆角样式
function updateSearchBoxRadius() {
  const radius = getSearchBoxRadiusSize()
  const main = document.querySelector('main')
  const searchEngine = document.querySelector('.search-engine')
  const buttonContainer = document.querySelector('.button')
  const searchButton = document.querySelector('.search-button')
  const searchEngineName = document.querySelector('.search-engine-name')

  main.style.borderRadius = radius + 'px'
  searchEngine.style.borderRadius = radius + 'px 0 0 ' + radius + 'px'
  buttonContainer.style.borderRadius = '0 ' + radius + 'px ' + radius + 'px 0'

  // 确保内部元素的圆角与容器同步
  if (searchButton) {
    searchButton.style.borderRadius = '0 ' + radius + 'px ' + radius + 'px 0'
  }

  if (searchEngineName) {
    searchEngineName.style.borderRadius = radius + 'px 0 0 ' + radius + 'px'
  }

  //确保按钮容器没有右侧空白
  buttonContainer.style.marginRight = '-1px'  //微对齐
}

//应用初始设置
function applyInitialSettings() {
  // 更新顶部间距滑块的最大值
  updateTopHeightSliderMax()

  document.querySelector('main').style.width = getSearchBoxWidth()
  document.querySelector('main').style.height = getSearchBoxHeight() + 'px'
  document.querySelector('main').style.marginTop = getSearchBoxTopHeight() + 'px'
  document.querySelector('.search-box').style.fontSize = getSearchBoxFontSize() + 'px'
  updateSearchBoxRadius()

  //确保按钮容器对齐
  const buttonContainer = document.querySelector('.button')
  buttonContainer.style.marginRight = '-1px'

  if (isDark()) {
    document.body.className = 'dark'
  } else {
    document.body.className = ''
  }
}

// 页面加载时应用设置
if (localStorage.getItem('InitializeFlag') === "True") {
  // 等待 DOM 加载完成后再应用初始设置
  document.addEventListener('DOMContentLoaded', function () {
    applyInitialSettings()
  })
}

// 页面加载完成后自动聚焦搜索框
window.addEventListener('load', function () {
  // 延迟一段时间以确保浏览器已完成其他初始化操作
  setTimeout(function () {
    focusSearchBox()
    // 如果常规方法失败，启动持续聚焦尝试
    setTimeout(keepTryingFocus, 300)
  }, 500)
})

// DOM内容加载完成后也尝试聚焦
document.addEventListener('DOMContentLoaded', function () {
  // 稍微延迟以确保DOM完全就绪
  setTimeout(function () {
    focusSearchBox()
    // 启动持续聚焦尝试
    setTimeout(keepTryingFocus, 200)
  }, 100)
})

// 强制聚焦到搜索框的函数
function focusSearchBox() {
  const searchBox = document.querySelector('.search-box')
  if (searchBox) {
    // 尝试多次聚焦，以防第一次失败
    searchBox.focus({ preventScroll: true })
    searchBox.select()

    // 在下一个事件循环再次尝试聚焦，以覆盖浏览器的默认行为
    setTimeout(() => {
      searchBox.focus({ preventScroll: true })
      searchBox.select()

      // 再次尝试，确保焦点设置成功
      setTimeout(() => {
        searchBox.focus({ preventScroll: true })
        searchBox.select()
      }, 200)
    }, 100)
  }
}

// 持续尝试聚焦直到成功
function keepTryingFocus() {
  let attempts = 0
  const maxAttempts = 20 // 最多尝试20次（2秒）

  const interval = setInterval(() => {
    const searchBox = document.querySelector('.search-box')
    if (searchBox && document.hasFocus()) {
      searchBox.focus({ preventScroll: true })
      searchBox.select()

      // 检查是否真的获得了焦点
      if (document.activeElement === searchBox) {
        clearInterval(interval)
        console.log('搜索框已成功获得焦点')
      }
    }

    attempts++
    if (attempts >= maxAttempts) {
      clearInterval(interval)
    }
  }, 100) // 每100毫秒尝试一次

  return interval
}

// 监听页面可见性变化，如果页面变为可见状态且搜索框没有焦点，则聚焦
document.addEventListener('visibilitychange', function () {
  if (!document.hidden && document.querySelector('.search-box')) {
    setTimeout(() => {
      focusSearchBox()
      // 如果常规方法失败，启动持续聚焦尝试
      setTimeout(keepTryingFocus, 100)
    }, 100)
  }
})



// 添加搜索功能
document.querySelector('.button button').addEventListener('click', function () {
  const query = document.querySelector('.search-box').value.trim()
  if (query) {
    const engine = getSearchEngine()
    const searchUrl = engine.url.replace('%d', encodeURIComponent(query))
    const target = getSearchTarget()
    if (target === '_blank') {
      window.open(searchUrl, '_blank')
    } else {
      window.location.href = searchUrl
    }
  } else {
    // 如果搜索框为空，聚焦到搜索框
    document.querySelector('.search-box').focus()
  }
})

//移除搜索框焦点效果（用户要求去除难看的焦点框）
document.querySelector('.search-box').addEventListener('focus', function () {
  this.style.outline = 'none'
  this.style.boxShadow = 'none'
})

document.querySelector('.search-box').addEventListener('blur', function () {
  this.style.outline = 'none'
  this.style.boxShadow = 'none'
})

// 添加设置面板动画效果
document.getElementById('settingsBtn').addEventListener('mouseenter', function () {
  this.style.transform = 'scale(1.1)'
  this.style.transition = 'transform 0.2s'
})

document.getElementById('settingsBtn').addEventListener('mouseleave', function () {
  this.style.transform = 'scale(1)'
})

// 回车键搜索
document.querySelector('.search-box').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const query = this.value.trim()
    if (query) {
      const engine = getSearchEngine()
      const searchUrl = engine.url.replace('%d', encodeURIComponent(query))
      const target = getSearchTarget()
      if (target === '_blank') {
        window.open(searchUrl, '_blank')
      } else {
        window.location.href = searchUrl
      }
    }
  }
})

// 添加全局键盘快捷键来聚焦搜索框 (例如 Alt+S 或 Ctrl+K)
document.addEventListener('keydown', function (e) {
  // 检查是否按下 Alt+S 或 Ctrl+K 组合键
  if ((e.altKey && e.key === 's') || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
    e.preventDefault() // 阻止默认行为
    const searchBox = document.querySelector('.search-box')
    if (searchBox) {
      searchBox.focus()
      searchBox.select()
    }
  }
})

// 添加页面加载完成事件
window.addEventListener('load', function () {
  console.log('新标签页加载完成')
})

// 添加错误处理
window.addEventListener('error', function (e) {
  console.error('页面错误:', e.error)
})
