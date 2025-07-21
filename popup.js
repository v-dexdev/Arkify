document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-overlay');
  const statusText = document.getElementById('status-text');

  if (!toggleSwitch) return;

  // Initialize toggle state from storage
  chrome.storage.local.get(['overlayEnabled'], ({ overlayEnabled }) => {
    const enabled = overlayEnabled !== false; // default true
    toggleSwitch.checked = enabled;
  });

  toggleSwitch.addEventListener('change', () => {
    toggleSwitch.disabled = true;
    statusText.textContent = 'Saving...';
    statusText.style.opacity = '1';

    const newEnabled = toggleSwitch.checked;

    chrome.storage.local.set({ overlayEnabled: newEnabled }, () => {
      statusText.textContent = 'tada!! reloading!!';

      setTimeout(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
          toggleSwitch.disabled = false;
          statusText.style.opacity = '0';
        });
      }, 600);
    });
  });
});
