// ==================== INICIALIZAÇÃO DE IDIOMA ====================
(function () {
    // Detectar idioma salvo ou idioma do navegador
    const savedLang = localStorage.getItem('preferred-language') || 'pt'; // Default to 'pt' if null

    // Aplicar tradução inicial
    if (typeof translatePage === 'function') {
        translatePage(savedLang);
    }

    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageBtn && languageDropdown) {
        // Toggle dropdown ao clicar no botão
        languageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });

        // Fechar dropdown ao clicar fora (apenas desktop)
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 968) {
                if (!e.target.closest('.language-selector')) {
                    languageDropdown.classList.remove('active');
                }
            }
        });
    }

    // Trocar idioma ao clicar nas opções
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            if (typeof translatePage === 'function') {
                translatePage(lang);
            }
            if (languageDropdown) {
                languageDropdown.classList.remove('active');
            }
        });
    });
})();

// ==================== MENU MOBILE ====================
(function () {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    const menuLinks = document.querySelectorAll('.navbar-menu a');

    if (toggle && menu) {
        // Toggle menu
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Fechar menu ao clicar em links
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    // Scroll navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
})();

// ==================== CARROSSEL ====================
(function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Criar dots
    if (dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    // Atualizar carrossel
    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    // Ir para slide
    const goToSlide = (n) => {
        currentIndex = (n + totalSlides) % totalSlides;
        updateCarousel();
    };

    // Botões anterior/próximo
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Autoplay
    let autoplay = setInterval(() => goToSlide(currentIndex + 1), 5000);
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
        carousel.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });

        // Navegação touch
        let touchStart = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStart = e.changedTouches[0].screenX;
        });
        carousel.addEventListener('touchend', (e) => {
            const touchEnd = e.changedTouches[0].screenX;
            if (touchEnd < touchStart - 50) goToSlide(currentIndex + 1);
            if (touchEnd > touchStart + 50) goToSlide(currentIndex - 1);
        });
    }

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
})();

// ==================== SCROLL REVEAL ====================
(function () {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animar apenas uma vez
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
})();
