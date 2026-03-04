document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Matrix Digital Rain Background
       ========================================= */
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters array (Katakana + Latin)
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Array of drops - one per column
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Drawing the characters
    function draw() {
        // Translucent black background to show trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

            // x = i*fontSize, y = value of drops[i]*fontSize
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Sending the drop back to the top randomly after it has crossed the screen
            // Adding randomness to the reset to make the drops scattered on the Y axis
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Increment Y coordinate
            drops[i]++;
        }
    }

    // Update Matrix background every 30ms
    setInterval(draw, 30);

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    /* =========================================
       2. Typewriter Effect
       ========================================= */
    function typeWriter(element, text, speed) {
        let i = 0;
        element.innerHTML = '';

        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.parentNode.insertBefore(cursor, element.nextSibling);

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Remove cursor after typing is done (optional, leaving it for effect)
                // cursor.remove();
            }
        }
        type();
    }

    /* =========================================
       3. Intersection Observer (Scroll Reveal)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                // Trigger Typewriter for paragraphs within the revealed section
                const typingElements = entry.target.querySelectorAll('.typewriter-text');
                typingElements.forEach((el, index) => {
                    // Stagger the typing effect for multiple paragraphs
                    setTimeout(() => {
                        const text = el.getAttribute('data-text');
                        typeWriter(el, text, 30);
                        el.removeAttribute('data-text'); // Prevent re-typing
                        el.classList.remove('typewriter-text');
                    }, index * 1500); // 1.5s delay between paragraphs
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.terminal-section');
    sections.forEach(sec => observer.observe(sec));

    /* =========================================
       4. Smooth Scrolling for Navigation
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
