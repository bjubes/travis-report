// Saves options to chrome.storage
function save_options() {
  var failedOnly = document.getElementById('failed_only').checked;
  var newTab = document.getElementById('link_new_tab').checked;
  chrome.storage.sync.set({
    failedOnly: failedOnly,
    newTab: newTab
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default values given if non exist
  chrome.storage.sync.get({
    failedOnly: true,
    newTab: false
  }, function(items) {
    document.getElementById('failed_only').checked = items.failedOnly;
    document.getElementById('link_new_tab').checked = items.newTab;

  });
}

function close_page() {
  window.close();
}

// Hook up functions to options page
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('close').addEventListener('click',
    close_page);