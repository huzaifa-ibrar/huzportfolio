/* ====================================================
   HUZAIFA IBRAR — PORTFOLIO · LEAN INTERACTION
   No GSAP. No per-frame mouse handlers.
   ==================================================== */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
   Active Nav on Scroll (throttled via rAF)
   ---------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
let scrollTicking = false;

function updateActiveNav() {
    let current = '';
    const y = window.pageYOffset + 200;
    for (const section of sections) {
        if (y >= section.offsetTop) current = section.id;
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
}

function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        updateActiveNav();
        updateProgress();
        scrollTicking = false;
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ----------------------------------------------------
   Smooth Scroll for Anchors
   ---------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        if (window.innerWidth <= 768) sideNav.classList.remove('active');
    });
});

/* ----------------------------------------------------
   Scroll Progress Bar
   ---------------------------------------------------- */
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);

function updateProgress() {
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (h > 0 ? (window.pageYOffset / h) * 100 : 0) + '%';
}

/* ----------------------------------------------------
   Reveal on Scroll — IntersectionObserver (cheap)
   ---------------------------------------------------- */
if (!reduced && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
        '.section-header, .about-text p, .about-text .lead-text, .about-card, ' +
        '.timeline-item, .bento, .contact-row, .hl-item'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => io.observe(el));
}

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
    setTimeout(() => modal.querySelector('.modal-close')?.focus(), 80);
}

function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
}

document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(btn.dataset.open);
    });
});

document.querySelectorAll('.bento[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        openModal(card.dataset.project);
    });
});

modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', closeModal)
);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

/* ----------------------------------------------------
   Image fallback for thum.io screenshots
   ---------------------------------------------------- */
document.querySelectorAll('.bento-shot').forEach(img => {
    img.addEventListener('error', () => img.classList.add('failed'));
    if (img.complete && img.naturalWidth === 0) img.classList.add('failed');
});

/* ----------------------------------------------------
   Initial state
   ---------------------------------------------------- */
updateActiveNav();
updateProgress();
