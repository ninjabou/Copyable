export function user_select_auto(){
    var CSSInjection = "*{ user-select: auto !important; }"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            css: CSSInjection
        });
    });
}

export function pointer_events_auto(){
    var CSSInjection = "*{ pointer-events: auto !important; }"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            css: CSSInjection
        });
    });
}