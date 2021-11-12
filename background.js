chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    if (info.status === 'complete') {
        chrome.storage.sync.get(['copyable_data'], function (result) {
            var data = JSON.parse(result.copyable_data);
            if(data.list.includes(tab.url)){
                user_select_auto();
                pointer_events_auto();
            }
        });
    }
});

function user_select_auto(){
    var CSSInjection = "*{ user-select: auto !important; }"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            css: CSSInjection
        });
    });
}

function pointer_events_auto(){
    var CSSInjection = "*{ pointer-events: auto !important; }"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            css: CSSInjection
        });
    });
}