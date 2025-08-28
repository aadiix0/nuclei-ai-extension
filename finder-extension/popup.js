document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('checkbox');
  const scanBtn = document.getElementById('scan-btn');
  const extractLinksBtn = document.getElementById('extract-links-btn');
  const extractDomainsBtn = document.getElementById('extract-domains-btn');
  const resultsDiv = document.getElementById('results');

  // Dark mode toggle
  themeSwitch.addEventListener('change', async () => {
    if (themeSwitch.checked) {
      document.body.classList.add('dark');
      await browser.storage.sync.set({ theme: 'dark' });
    } else {
      document.body.classList.remove('dark');
      await browser.storage.sync.set({ theme: 'light' });
    }
  });

  // Load saved theme
  (async () => {
    const data = await browser.storage.sync.get('theme');
    if (data.theme === 'dark') {
      document.body.classList.add('dark');
      themeSwitch.checked = true;
    }
  })();

  // Extract Links button
  extractLinksBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML = 'Extracting links...';
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      const response = await browser.tabs.sendMessage(tab.id, { action: 'extractLinks' });
      if (response && response.links) {
        displayResults(response.links, 'Links Found:');
      } else {
        resultsDiv.innerHTML = 'Could not extract links.';
      }
    } catch (err) {
      resultsDiv.innerHTML = 'Error: ' + err.message;
    }
  });

  // Extract Domains button
  extractDomainsBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML = 'Extracting domains...';
    try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        const response = await browser.tabs.sendMessage(tab.id, { action: 'extractDomains' });
        if (response && response.domains) {
            displayResults(response.domains, 'Domains Found:');
        } else {
            resultsDiv.innerHTML = 'Could not extract domains.';
        }
    } catch (err) {
        resultsDiv.innerHTML = 'Error: ' + err.message;
    }
  });

  // Scan button click listener (for secrets)
  scanBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML = 'Scanning for secrets...';
    try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        const response = await browser.tabs.sendMessage(tab.id, { action: 'findSecrets' });
        if (response && response.secrets) {
            displayResults(response.secrets, 'Secrets Found:');
        } else {
            resultsDiv.innerHTML = 'Could not find secrets.';
        }
    } catch (err) {
        resultsDiv.innerHTML = 'Error: ' + err.message;
    }
  });

  function displayResults(items, title) {
    if (items.length === 0) {
      resultsDiv.innerHTML = 'No items found.';
      return;
    }
    const header = document.createElement('h4');
    header.textContent = title;
    const list = document.createElement('ul');
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      list.appendChild(listItem);
    });
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(header);
    resultsDiv.appendChild(list);
  }
});
