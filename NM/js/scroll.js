function closeLightbox() {
    const currentScrollY = window.scrollY;
    location.hash = '';
    setTimeout(function() {
        window.scrollTo(0, currentScrollY);
    }, 10);
}

(function(){
    document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (location.hash && location.hash.indexOf('lb-') === 1) {
                closeLightbox();
            }
        }
    });
})();