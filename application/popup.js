import { user_select_auto, pointer_events_auto } from "../core/core.js"

var default_value = JSON.stringify({ "list": [] });

/*
    For each element in items, add element as a new paragraph tag
    to the given HTML element.
*/
function addListItems(items) {
    var whitelist_text = document.getElementById("whitelist-box");

    if (items == null || items.length == 0) {
        whitelist_text.innerHTML = '<p></p>'
    } else {
        whitelist_text.innerHTML = '';
        items.map(elem => {
            whitelist_text.innerHTML += `<p class='whitelist-item'>${elem}<span class='remove-button'>×</span></p>`
        });
    }
}

/*
    Helper function to remove the given item from the given array.
    Returns a new array.
*/
function removeItem(item, array) {
    let newArr = [];

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== item.trim()) {
            newArr.push(array[i]);
        }
    }

    return newArr;
}


function updateWhitelist(is_remove, event) {
    chrome.storage.sync.get(['copyable_data'], function (result) {
        var data = JSON.parse(result.copyable_data);

        if (is_remove) {
            var domain = event.target.innerText.split('×')[0];
            data.list = removeItem(domain, data.list);
        } else {
            var input_URL = document.getElementById('URL');
            if (input_URL.value.length > 0) {
                data.list.push(input_URL.value);
            }
        }

        chrome.storage.sync.set({ copyable_data: JSON.stringify(data) }, function () { });
    });
}


chrome.storage.sync.get({ copyable_data: default_value }, function (data) {
    // data.copyable_data will be either the stored value, or default_value if nothing is set 
    chrome.storage.sync.set({ copyable_data: data.copyable_data }, function () {
        var whitelist_elements = JSON.parse(data.copyable_data).list;

        addListItems(whitelist_elements);

        var remove_buttons = document.getElementsByClassName('whitelist-item');

        for (var i = 0; i < remove_buttons.length; i++) {
            remove_buttons[i].addEventListener('click', function (event) {
                updateWhitelist(true, event)
            });
        }

        // whitelist_text.innerHTML = 
        // console.log(whitelist_text);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var add_button = document.getElementById('save-button');
    var test_button = document.getElementById('test-button');

    add_button.addEventListener('click', function (event) {
        updateWhitelist(false, event);
    }, false);

    test_button.addEventListener('click', function () {
        user_select_auto();
        pointer_events_auto();
    }, false);


}, false);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "copyable_data") {
            var list = JSON.parse(newValue).list;
            addListItems(list);
        }
    }
});
