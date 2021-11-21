// Unsure if this works, info used is linked below. We'd also need a way to call this.
// If this *does* work, then all it does is inject user select styles into every div.
// We may need to do this for other tags like <p>.
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

// module.exports = {
//     user_select_auto, pointer_events_auto
// }