var default_value = JSON.stringify({"list":[]});

chrome.storage.sync.get({copyable_data: default_value}, function(data) {
  // data.copyable_data will be either the stored value, or default_value if nothing is set
  chrome.storage.sync.set({copyable_data: data.copyable_data}, function() {
    var whitelist_text = document.getElementById("whitelist-box");
    whitelist_text.innerHTML = JSON.parse(data.copyable_data).list;
  });
});

document.addEventListener('DOMContentLoaded', function(){
    var add_button = document.getElementById('save-button');
    var input_URL = document.getElementById('URL');

    add_button.addEventListener('click', function(){
        if(input_URL.value.length > 0){
            chrome.storage.sync.get(['copyable_data'], function(result) {
                var data = JSON.parse(result.copyable_data);
                data.list.push(input_URL.value);
                chrome.storage.sync.set({copyable_data: JSON.stringify(data)}, function(){});
            });
        }
    }, false);
}, false);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if(key == "copyable_data"){
            var whitelist_text = document.getElementById("whitelist-box");
            whitelist_text.innerHTML = "";
            for(var element in JSON.parse(newValue).list){
                whitelist_text.innerHTML += "" + element + "\n"
            }
        }
    }
});