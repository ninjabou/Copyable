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
            whitelist_text.innerHTML += `<div class='whitelist-item'><p>${elem}</p><span>×</span></div>`
        });
    }

    var remove_buttons = document.getElementsByClassName('whitelist-item');

    for (var i = 0; i < remove_buttons.length; i++) {
        remove_buttons[i].addEventListener('click', function (event) {
            updateWhitelist(true, event)
        });
    }
}

/*
    Validate that a given string is a proper URL. If the string
    does not include http:// or https://, then it will be added *before* testing.
*/
function validateUrl(str){
    if(str.length > 0){
        if(str.substring(0,7) !== "http://" && str.substring(0,8) !== "https://"){
            str = "https://" + str;
        }
    }

    let url;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
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
        
        var input_field = document.getElementById('URL');
        input_field.value = "";
    });
}


chrome.storage.sync.get({ copyable_data: default_value }, function (data) {
    // data.copyable_data will be either the stored value, or default_value if nothing is set 
    chrome.storage.sync.set({ copyable_data: data.copyable_data }, function () {
        var whitelist_elements = JSON.parse(data.copyable_data).list;

        addListItems(whitelist_elements);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var add_button = document.getElementById('save-button');
    var test_button = document.getElementById('test-button');
    var input_field = document.getElementById('URL');

    add_button.addEventListener('click', function (event) {
        updateWhitelist(false, event);
    }, false);

    test_button.addEventListener('click', function () {
        user_select_auto();
        pointer_events_auto();
    }, false);

    input_field.addEventListener('keypress', function(event) {
        if(event.key === 'Enter'){
            updateWhitelist(false, event);
        }
    });


}, false);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "copyable_data") {
            var list = JSON.parse(newValue).list;
            addListItems(list);
        }
    }
});
