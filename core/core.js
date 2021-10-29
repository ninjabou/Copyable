// Unsure if this works, info used is linked below. We'd also need a way to call this.
// If this *does* work, then all it does is inject user select styles into every div.
// We may need to do this for other tags like <p>.
function user_select_all(){
    var CSSInjection = "div{ user-select: all; }"
    chrome.scripting.insertCSS({
        injection: CSSInjection
    });
} // https://developer.chrome.com/docs/extensions/reference/scripting/#method-insertCSS