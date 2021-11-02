// Unsure if this works, info used is linked below. We'd also need a way to call this.
// If this *does* work, then all it does is inject user select styles into every div.
// We may need to do this for other tags like <p>.
export function user_select_all(){
    var CSSInjection = "p{ user-select: auto !important; }"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            css: CSSInjection
        });
    });
} // https://developer.chrome.com/docs/extensions/reference/scripting/#method-insertCSS