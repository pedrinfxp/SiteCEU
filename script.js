document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Mobile Dropdown Expansion
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetId = href.split('#')[1];
            const target = document.getElementById(targetId);

            // If we are on index.html and the link is to a section on index.html, smooth scroll
            const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
            const isInternalLink = href.startsWith('#') || href.startsWith('index.html#');

            if (target && (isInternalLink && isHomePage)) {
                e.preventDefault();
                // Close mobile menu if open
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');

                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let sliderInterval;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    };

    const prevSlide = () => {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    };

    const startAutoPlay = () => {
        sliderInterval = setInterval(nextSlide, 5000);
    };

    const resetInterval = () => {
        clearInterval(sliderInterval);
        startAutoPlay();
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetInterval();
        });
    });

    startAutoPlay();

    // Tab switching for schedule
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.activity-card, .about-main-row, .pillar-card, .agenda-card, .s-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // Add revealed class style via JS to avoid separate CSS file for simple logic
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Lecture Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lectureCards = document.querySelectorAll('.lecture-card');

    const filterYear = (year) => {
        lectureCards.forEach(card => {
            const cardYear = card.getAttribute('data-year');
            if (year === 'all' || cardYear === year) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('revealed');
                }, 50);
            } else {
                card.style.display = 'none';
                card.classList.remove('revealed');
            }
        });
    };

    if (filterBtns.length > 0 && lectureCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const year = btn.getAttribute('data-year');
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterYear(year);
            });
        });

        // Initial filter on load based on active button
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            filterYear(activeBtn.getAttribute('data-year'));
        }
    }
});
