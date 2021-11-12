import { user_select_auto, pointer_events_auto } from "../core/core.js"

var default_value = JSON.stringify({ "list": [] });

/*
    For each element in items, add element as a new paragraph tag
    to the given HTML element.
*/
function addListItems(items) {
    var whitelist_text = document.getElementById("whitelist-box");

    // If the input field empty, don't do anything.
    if (items == null || items.length == 0) {
        whitelist_text.innerHTML = '<p></p>'
    } else {
        whitelist_text.innerHTML = '';
        // For each element in the whitelist, add a new div and the domain.
        items.map(elem => {
            whitelist_text.innerHTML += `<div class='whitelist-item'><p>${elem}</p><span>×</span></div>`
        });
    }

    // Get all X icons located at the end of the whitelist box.
    var remove_buttons = document.getElementsByClassName('whitelist-item');

    // Add event listeners to the remove buttons.
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

/* 
    Helper function to check if the given domain exists in the whitelist and
    add to the whitelist if not. 
*/
function addDomain(domain, whitelist) {
    // Check if the domain is not an empty string and if it already exists in the whitelist.
    if (domain.length > 0 && !whitelist.includes(domain)) {
        whitelist.push(domain);
    }
}

/*
    This function removes/adds a new element to the whitelist
    and updates the front-end accordingly.
*/
function updateWhitelist(is_remove, event) {
    chrome.storage.sync.get(['copyable_data'], function (result) {
        var data = JSON.parse(result.copyable_data);

        if (is_remove) {
            // If this function is called on removal of an item, remove domain from list.
            var domain = event.target.innerText.split('×')[0];
            data.list = removeItem(domain, data.list);
        } else {
            // If it is an add operation, add domain to the list.
            var input_URL = document.getElementById('URL');
            addDomain(input_URL.value, data.list)
        }

        // Update chrome local storage with the updated list.
        chrome.storage.sync.set({ copyable_data: JSON.stringify(data) }, function () { });
        
        // Reset the input field.
        var input_field = document.getElementById('URL');
        input_field.value = "";
    });
}

/*
    This function runs when the extension is opened. It gets the whitelist data from
    the chrome local storage and updates the front-end with the existing whitelist.
*/
chrome.storage.sync.get({ copyable_data: default_value }, function (data) {
    // data.copyable_data will be either the stored value, or default_value if nothing is set 
    chrome.storage.sync.set({ copyable_data: data.copyable_data }, function () {
        var whitelist_elements = JSON.parse(data.copyable_data).list;

        addListItems(whitelist_elements);
    });
});

/*
    Runs on extension loaded. Adds event handlers to buttons and the input 
    field on the extension.
*/
document.addEventListener('DOMContentLoaded', function () {
    var add_button = document.getElementById('save-button');
    var test_button = document.getElementById('test-button');
    var current_button = document.getElementById('add-current-button');
    var input_field = document.getElementById('URL');

    add_button.addEventListener('click', function (event) {
        updateWhitelist(false, event);
    }, false);

    test_button.addEventListener('click', function () {
        user_select_auto();
        pointer_events_auto();
    }, false);

    current_button.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            input_field.value = tabs[0].url;
            updateWhitelist(false, event);
        });
    }, false);

    // Users can press enter instead of clicking add button to submit domain.
    input_field.addEventListener('keypress', function(event) {
        if(event.key === 'Enter'){
            updateWhitelist(false, event);
        }
    });
}, false);


/*
    Update the UI whenever an item is added/removed from the whitelist.
*/
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "copyable_data") {
            var list = JSON.parse(newValue).list;
            addListItems(list);
        }
    }
});
