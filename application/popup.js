import { user_select_auto, pointer_events_auto } from "../core/core.js"
var default_value = JSON.stringify({ "list": [] });

chrome.storage.sync.get({ copyable_data: default_value }, function (data) {
    // data.copyable_data will be either the stored value, or default_value if nothing is set 
    chrome.storage.sync.set({ copyable_data: data.copyable_data }, function () {
        var whitelist_text = document.getElementById("whitelist-box");
        var whitelist_elements = JSON.parse(data.copyable_data).list;

        if (whitelist_elements.length == 0) {
            whitelist_text.innerHTML = '<p></p>'
        } else {
            // alert(whitelist_elements);
            whitelist_elements.map(elem => {
                whitelist_text.innerHTML += `<p class='whitelist-item'>${elem}<span class='remove-button'>×</span></p>`
            });
        }

        var remove_buttons = document.getElementsByClassName('whitelist-item');

        for (var i = 0; i < remove_buttons.length; i++) {
            remove_buttons[i].addEventListener('click', function (event) {
                alert(event.target.innerHTML);            
            })
        }

        // whitelist_text.innerHTML = 
        // console.log(whitelist_text);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var add_button = document.getElementById('save-button');
    var input_URL = document.getElementById('URL');
    var test_button = document.getElementById('test-button');


    add_button.addEventListener('click', function () {
        if (input_URL.value.length > 0) {
            chrome.storage.sync.get(['copyable_data'], function (result) {
                var data = JSON.parse(result.copyable_data);
                data.list.push(input_URL.value);
                chrome.storage.sync.set({ copyable_data: JSON.stringify(data) }, function () { });
            });
        }
    }, false);

    test_button.addEventListener('click', function () {
        user_select_auto();
        pointer_events_auto();
    }, false);


}, false);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "copyable_data") {
            var whitelist_text = document.getElementById("whitelist-box");
            whitelist_text.innerHTML = "";
            for (var element in JSON.parse(newValue).list) {
                whitelist_text.innerHTML += "" + element + "\n"
            }
        }
    }
});
