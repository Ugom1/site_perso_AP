(function() {
    if (typeof document === 'undefined') return;
    
    const images = document.querySelectorAll('.gallery-item img, .lb-target img');
    if (!images || !images.length) return;

    images.forEach((img, index) => {
        if (!img.hasAttribute('loading')) {
            if (index < 3) {
                img.setAttribute('fetchpriority', 'high');
                img.setAttribute('loading', 'eager');
            } else {
                img.setAttribute('loading', 'lazy');
            }
        }

        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }

        if (!img.getAttribute('width') || !img.getAttribute('height')) {
            const rect = img.getBoundingClientRect();
            if (rect.width && rect.height) {
                img.setAttribute('width', Math.round(rect.width));
                img.setAttribute('height', Math.round(rect.height));
                img.style.aspectRatio = `${rect.width} / ${rect.height}`;
            }
        }
    });
})();

function closeLightbox() {
    const currentScrollY = window.scrollY;
    location.hash = "";
    
    setTimeout(() => {
        window.scrollTo(0, currentScrollY);
    }, 10);
}

(function() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (location.hash && location.hash.indexOf('lb-') === 1) {
                closeLightbox();
            }
        }
    });
})();

function downloadImage(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
  