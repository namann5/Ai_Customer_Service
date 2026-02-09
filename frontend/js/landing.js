/**
 * Landing page - minimal JS
 * CTA scroll + scroll-triggered animations
 */
(function () {
    'use strict';

    // Smooth scroll for "See How It Works"
    var seeHowBtn = document.getElementById('see-how-btn');
    if (seeHowBtn) {
        seeHowBtn.addEventListener('click', function (e) {
            var target = document.getElementById('demo');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Scroll-triggered animations
    var animated = document.querySelectorAll('.animate-on-scroll');
    if (animated.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

        animated.forEach(function (el) {
            observer.observe(el);
        });
    }
})();
