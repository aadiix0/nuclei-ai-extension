browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'sendSelectedText',
      title: 'Generate Nuclei Template',
      contexts: ['selection'],
    });
  });
      
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'sendSelectedText') {
      const selectedText = info.selectionText;
      browser.tabs.sendMessage(tab.id, { message: 'GenerateNucleiTemplate', selectedText: selectedText });
    }
  });
      
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      browser.tabs.sendMessage(tabId, { message: 'TabUpdated' });
    }
  });
  
  browser.action.onClicked.addListener((tab) => {
    browser.tabs.sendMessage(tab.id, { message: 'ToggleIframeVisibility' });
  });
