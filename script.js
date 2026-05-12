/* ====================================================
   HUZAIFA IBRAR — PORTFOLIO · MOTION & INTERACTION
   ==================================================== */

gsap.registerPlugin(ScrollTrigger);

let isMobile = window.innerWidth <= 768;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    ScrollTrigger.refresh();
});

/* ----------------------------------------------------
   Mobile Navigation
   ---------------------------------------------------- */
const mobileToggle = document.getElementById('mobile-toggle');
const sideNav = document.getElementById('side-nav');

mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    sideNav.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sideNav.classList.contains('active')) {
        if (!sideNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            sideNav.classList.remove('active');
        }
    }
});

/* ----------------------------------------------------
   Active Nav on Scroll
   ---------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset + 200;

    sections.forEach(section => {
        if (scrollY >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ----------------------------------------------------
   Smooth Scroll for Nav
   ---------------------------------------------------- */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            if (window.innerWidth <= 768) sideNav.classList.remove('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.classList.contains('nav-link')) return;
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
    });
});

/* ----------------------------------------------------
   Scroll Progress Bar
   ---------------------------------------------------- */
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = ((window.pageYOffset / h) * 100) + '%';
}, { passive: true });

/* ----------------------------------------------------
   GSAP — Hero Entrance
   ---------------------------------------------------- */
if (!reduced) {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTL.from('.hero-kicker', { y: 20, opacity: 0, duration: 0.7 })
          .from('.hero-title .line', { y: 50, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.4')
          .from('.hero-description', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.role-pill', { y: 20, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.4')
          .from('.hero-buttons .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.3')
          .from('.meta-item', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
          .from('.portrait-frame', { x: 60, opacity: 0, duration: 1.1, ease: 'power4.out' }, 0.2)
          .from('.portrait-card', { y: 20, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.6)' }, '-=0.6')
          .from('.portrait-tag', { y: 10, opacity: 0, duration: 0.5 }, '-=0.4');
}

/* ----------------------------------------------------
   GSAP — Section reveals
   ---------------------------------------------------- */
if (!reduced) {
    // Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: { trigger: header, start: 'top 80%' },
            y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
        });
    });

    // About — text paragraphs
    gsap.utils.toArray('.about-text p, .about-text .lead-text').forEach((p, i) => {
        gsap.from(p, {
            scrollTrigger: { trigger: p, start: 'top 85%' },
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
    });

    // About cards
    gsap.utils.toArray('.about-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            y: 40, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out'
        });
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 82%' },
            x: -40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
    });

    // Bento — staggered reveal
    gsap.utils.toArray('.bento').forEach((bento, i) => {
        gsap.from(bento, {
            scrollTrigger: { trigger: bento, start: 'top 88%' },
            y: 60, opacity: 0, duration: 0.95, ease: 'power3.out',
            delay: (i % 3) * 0.08
        });
    });

    // Inside flagship — phone + browser mock
    gsap.from('.phone-mock', {
        scrollTrigger: { trigger: '.bento--flagship', start: 'top 70%' },
        y: 80, opacity: 0, duration: 1.1, ease: 'power4.out'
    });
    gsap.from('.browser-mock', {
        scrollTrigger: { trigger: '.bento--flagship', start: 'top 70%' },
        x: 60, opacity: 0, duration: 1.1, delay: 0.2, ease: 'power4.out'
    });
    gsap.from('.hl-item', {
        scrollTrigger: { trigger: '.bento-highlights', start: 'top 80%' },
        x: -20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out'
    });

    // Contact rows
    gsap.utils.toArray('.contact-row').forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: { trigger: row, start: 'top 88%' },
            y: 30, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out'
        });
    });

    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
    });

    // Marquee subtle slowdown on hover
    const marquee = document.querySelector('.marquee-track');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
        marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
    }
}

/* ----------------------------------------------------
   3D Tilt on Bento Cards (Desktop only)
   ---------------------------------------------------- */
function applyTilt(el, maxDeg = 5) {
    if (isMobile || reduced) return;

    let rafId = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let hovering = false;

    function update() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        const dx = Math.abs(targetX - currentX);
        const dy = Math.abs(targetY - currentY);

        if (hovering) {
            el.style.transform = `perspective(1200px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateY(-6px) translateZ(0)`;
            rafId = requestAnimationFrame(update);
        } else if (dx > 0.04 || dy > 0.04) {
            el.style.transform = `perspective(1200px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateY(0) translateZ(0)`;
            rafId = requestAnimationFrame(update);
        } else {
            el.style.transform = '';
            rafId = null;
        }
    }

    el.addEventListener('mouseenter', () => {
        hovering = true;
        if (!rafId) rafId = requestAnimationFrame(update);
    });

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = -x * maxDeg;
        targetY =  y * maxDeg;
    });

    el.addEventListener('mouseleave', () => {
        hovering = false;
        targetX = 0; targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(update);
    });
}

document.querySelectorAll('.bento--media, .bento--small, .bento--code')
        .forEach(b => applyTilt(b, 4));

document.querySelectorAll('.bento--flagship').forEach(b => applyTilt(b, 2.5));

document.querySelectorAll('.about-card, .timeline-body, .contact-row:not(.contact-row--static)')
        .forEach(b => applyTilt(b, 2));

/* ----------------------------------------------------
   Project Modal
   ---------------------------------------------------- */
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
let lastFocus = null;

function openModal(projectKey) {
    const tpl = document.getElementById(`tpl-${projectKey}`);
    if (!tpl) return;

    lastFocus = document.activeElement;
    modalContent.innerHTML = '';
    modalContent.appendChild(tpl.content.cloneNode(true));
    const scroll = modal.querySelector('.modal-scroll');
    if (scroll) scroll.scrollTop = 0;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => modal.querySelector('.modal-close')?.focus(), 100);
}

function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
}

// Open from CTAs
document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(btn.dataset.open);
    });
});

// Open from clicking a bento card itself (except links/buttons inside it)
document.querySelectorAll('.bento[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Ignore clicks on actual links/buttons inside the card
        if (e.target.closest('a, button')) return;
        openModal(card.dataset.project);
    });
});

// Close
modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', closeModal)
);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
    }
});

/* ----------------------------------------------------
   Contact Form
   ---------------------------------------------------- */
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Thanks — I'll get back to you within a day.");
    contactForm.reset();
});

function showToast(message) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    Object.assign(t.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: 'var(--ink-3)',
        color: 'var(--text)',
        border: '1px solid var(--accent-line)',
        padding: '0.9rem 1.5rem',
        borderRadius: '100px',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.95rem',
        fontWeight: '500',
        zIndex: '10000',
        opacity: '0',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        maxWidth: '90vw'
    });
    document.body.appendChild(t);

    requestAnimationFrame(() => {
        t.style.opacity = '1';
        t.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

/* ----------------------------------------------------
   Magnetic effect for primary buttons (Desktop only)
   ---------------------------------------------------- */
function applyMagnetic(el, strength = 0.25) {
    if (isMobile || reduced) return;

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
}

document.querySelectorAll('.hero-buttons .btn').forEach(b => applyMagnetic(b, 0.2));

/* ----------------------------------------------------
   Image fallback fix — show fallback after error
   ---------------------------------------------------- */
document.querySelectorAll('.bento-shot').forEach(img => {
    img.addEventListener('error', () => {
        img.classList.add('failed');
    });
    // Also handle case where image already errored before listener attached
    if (img.complete && img.naturalWidth === 0) {
        img.classList.add('failed');
    }
});

/* ----------------------------------------------------
   Initial state
   ---------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();

    // Refresh ScrollTrigger after a tick (in case fonts/images shift layout)
    setTimeout(() => ScrollTrigger.refresh(), 500);
});

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
