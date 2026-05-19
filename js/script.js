/* ============================================================
   HiDRI Website — Main Script (Enhanced Animations)
   ============================================================ */

(function () {
    'use strict';

    /* ── Navbar scroll ── */
    const navbar   = document.getElementById('navbar');
    const backToTop= document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    /* ── Mobile menu ── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }));
        document.addEventListener('click', e => {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });
    }

    /* Custom cursor disabled — using default browser cursor */

    /* ── Ripple on buttons ── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const r = document.createElement('span');
            r.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
            this.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });

    /* ── Hero word-by-word reveal ── */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.perspective = '600px';
        const html = heroTitle.innerHTML;
        // Wrap each text word (skip HTML tags)
        heroTitle.innerHTML = html.replace(/(<[^>]+>)|([^\s<]+)/g, (match, tag, word) => {
            if (tag) return tag;
            return `<span class="hero-word">${word}</span>`;
        });
        const words = heroTitle.querySelectorAll('.hero-word');
        words.forEach((w, i) => {
            setTimeout(() => w.classList.add('visible'), 200 + i * 100);
        });
    }

    /* Hero badge pop */
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            heroBadge.style.opacity = '1';
        }, 100);
    }

    /* Hero sub & protect fade-up */
    ['.hero-sub', '.hero-protect', '.hero-actions'].forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${0.7 + i * 0.15}s, transform 0.6s ease ${0.7 + i * 0.15}s`;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
    });

    /* ── Ambient hero particles ── */
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'hero-particle';
            const size = Math.random() * 10 + 4;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                animation-duration:${Math.random()*6+5}s;
                animation-delay:${Math.random()*6}s;
                opacity:${Math.random()*0.5+0.1};
            `;
            hero.appendChild(p);
        }
    }

    /* ── Section header reveal ── */
    const headerObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); headerObserver.unobserve(e.target); } });
    }, { threshold: 0.3 });
    document.querySelectorAll('.section-header').forEach(h => {
        h.querySelector('.section-badge') && (h.querySelector('.section-badge').style.opacity = '0');
        headerObserver.observe(h);
    });

    /* ── About section slide-in ── */
    const aboutObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.about-image, .about-content').forEach(el => el.classList.add('in-view'));
                aboutObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.about-inner').forEach(el => aboutObserver.observe(el));

    /* ── Product cards staggered entrance ── */
    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const cards = e.target.querySelectorAll('.product-card');
                cards.forEach((c, i) => setTimeout(() => c.classList.add('in-view'), i * 100));
                cardObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.products-grid').forEach(g => cardObserver.observe(g));

    /* ── Blog cards staggered entrance ── */
    const blogObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const cards = e.target.querySelectorAll('.blog-card');
                cards.forEach((c, i) => setTimeout(() => c.classList.add('in-view'), i * 120));
                blogObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.blogs-grid').forEach(g => blogObserver.observe(g));

    /* ── Industry cards staggered ── */
    const industryObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                industryObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.industry-item').forEach(el => industryObserver.observe(el));

    /* ── 3D card tilt on mouse move ── */
    document.querySelectorAll('.product-card, .blog-card').forEach(card => {
        // Inject shine layer
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.style.position = 'relative';
        card.appendChild(shine);

        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const cx    = rect.left + rect.width  / 2;
            const cy    = rect.top  + rect.height / 2;
            const dx    = (e.clientX - cx) / (rect.width  / 2);
            const dy    = (e.clientY - cy) / (rect.height / 2);
            const rotX  = -dy * 8;
            const rotY  =  dx * 8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
            shine.style.background = `radial-gradient(circle at ${(dx+1)*50}% ${(dy+1)*50}%, rgba(255,255,255,0.18), transparent 65%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => card.style.transition = '', 500);
        });
    });

    /* ── Parallax on about image ── */
    const aboutImg = document.querySelector('.about-image img');
    if (aboutImg) {
        aboutImg.classList.add('parallax-img');
        window.addEventListener('scroll', () => {
            const rect  = aboutImg.getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.bottom < 0 || rect.top > viewH) return;
            const progress = (viewH - rect.top) / (viewH + rect.height);
            aboutImg.style.transform = `translateY(${(progress - 0.5) * 30}px)`;
        }, { passive: true });
    }

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }
        });
    });

    /* ── Active nav on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(s => sectionObserver.observe(s));

    /* ── Contact form ── */
    const contactForm = document.getElementById('contactForm');
    const formSuccess  = document.getElementById('formSuccess');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name  = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            if (!name.value.trim() || !email.value.trim()) {
                [name, email].forEach(f => {
                    if (!f.value.trim()) {
                        f.style.borderColor = '#e53935';
                        f.addEventListener('input', () => f.style.borderColor = '', { once: true });
                    }
                });
                return;
            }
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                if (formSuccess) formSuccess.classList.add('show');
                contactForm.reset();
                setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 5000);
            }, 1200);
        });
    }

})();
