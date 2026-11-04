'use strict';
(() => {
  // Author-only entry: ordinary visits keep the public page unchanged.
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const tools = document.getElementById('annotation-tools');
  const button = document.getElementById('annotation-toggle');
  const status = document.getElementById('annotation-status');
  const annotation = document.oai?.annotation;
  tools.hidden = false;
  if (!window.isSecureContext || window.top !== window) {
    status.textContent = '请在应用内浏览器中直接打开本站的 HTTPS 地址，或使用 localhost 预览。';
    return;
  }
  if (typeof annotation?.toggle !== 'function' || typeof annotation?.isActive !== 'function') {
    status.textContent = '当前浏览器未提供原生标注接口。请使用应用内浏览器的“标注”入口；若仍未显示，请更新应用后重试。';
    return;
  }
  function render(active) {
    button.textContent = active ? '退出标注' : '标注页面';
    button.setAttribute('aria-pressed', String(active));
    status.textContent = active ? '选择元素或区域并写下修改要求，保存后发送到聊天。按住空格可操作页面按钮。' : '点击按钮，使用应用原生标注选择需要修改的区域。';
  }
  document.addEventListener('oaiannotationmodechange', event => render(event.detail.active));
  button.addEventListener('click', () => {
    try {
      const result = annotation.toggle(!annotation.isActive());
      if (result?.accepted === false) status.textContent = '浏览器未接受标注请求，请检查应用的标注功能与本站权限。';
    } catch {
      status.textContent = '无法启动原生标注，请尝试浏览器工具栏中的“标注”入口。';
    }
  });
  render(annotation.isActive());
  button.hidden = false;
})();
