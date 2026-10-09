// Types out the home page heading one character at a time.
// The full text is in the HTML, so it still shows without JS and screen readers read it whole.
const typed = document.querySelector('.typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typed && !reduceMotion) {
    const target = typed.querySelector('.typed-text');
    const text = target.textContent;
    typed.setAttribute('aria-label', text);
    target.setAttribute('aria-hidden', 'true');
    target.textContent = '';

    let i = 0;
    const tick = () => {
        target.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, 55 + Math.random() * 60);
    };
    setTimeout(tick, 400);
}
