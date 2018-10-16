function fade_in_element(el){
    var element = document.getElementById(el)
    element.style.transition = "opacity 3.0s";
    element.style['transition-timing-function'] = 'cubic-bezier(0.3, 0.3, 0.5, 0.8)';
    element.style.opacity = 1;
}

function new_tab_page(url) {
    window.open(url, '_blank')
}