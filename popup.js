var default_value = JSON.stringify({"list":[]});
chrome.storage.sync.get({copyable_data: default_value}, function(data) {
  // data.copyable_data will be either the stored value, or default_value if nothing is set
  chrome.storage.sync.set({copyable_data: data.copyable_data}, function() {
    // The value is now stored, so you don't have to do this again
  });
});

document.addEventListener('DOMContentLoaded', function(){
    var add_button = document.getElementById('save-button');
    var input_URL = document.getElementById('URL');

    add_button.addEventListener('click', function(){
        chrome.storage.sync.get(['copyable_data'], function(result) {
            var data = JSON.parse(result.copyable_data);
            data.list.push(input_URL.value);
            chrome.storage.sync.set({copyable_data: JSON.stringify(data)}, function(){});
        });
    }, false);
}, false);