// Responsive handling
let isMobile = window.innerWidth <= 768;

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset parallax on resize
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    
    if (heroLeft && window.innerWidth <= 768) {
        heroLeft.style.transform = '';
    }
    if (heroRight && window.innerWidth <= 768) {
        heroRight.style.transform = '';
    }
});

// Cursor Trail Effect (Desktop only)
const canvas = document.getElementById('cursor-trail');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
        if (this.size > 0.1) this.size -= 0.05;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('mousemove', (e) => {
    if (!isMobile) {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animate);
}

animate();

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const sideNav = document.getElementById('side-nav');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sideNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            sideNav.classList.remove('active');
        }
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navWidth = window.innerWidth > 768 ? 80 : 0;
            const offsetTop = targetSection.offsetTop;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            if (window.innerWidth <= 768) {
                sideNav.classList.remove('active');
            }
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success notification
        showNotification('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
        color: #0F0F0F;
        padding: 2rem 3rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5);
        z-index: 10000;
        font-size: 1.2rem;
        font-weight: 600;
        text-align: center;
        opacity: 0;
        transition: all 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
const animatedElements = document.querySelectorAll('.skill-column, .experience-card, .project-card, .contact-info-card');
animatedElements.forEach(el => {
    // Faster animation for skill columns on mobile
    const isMobileSkill = el.classList.contains('skill-column') && window.innerWidth <= 768;
    const duration = isMobileSkill ? '0.3s' : '0.8s';
    
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity ${duration} ease, transform ${duration} ease`;
    observer.observe(el);
});

// Parallax effect for hero section (Desktop only)
window.addEventListener('scroll', () => {
    if (!isMobile) {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection && scrolled < window.innerHeight) {
            const heroLeft = document.querySelector('.hero-left');
            const heroRight = document.querySelector('.hero-right');
            
            if (heroLeft) {
                heroLeft.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
            if (heroRight) {
                heroRight.style.transform = `translateY(${scrolled * -0.1}px)`;
            }
        }
    }
});

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateValue(entry.target, 0, parseInt(entry.target.textContent), 2000);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

function animateValue(element, start, end, duration) {
    const originalText = element.textContent;
    const hasPlus = originalText.includes('+');
    const numericEnd = parseInt(originalText);
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (numericEnd - start) + start);
        element.textContent = value + (hasPlus ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 3D Tilt effect for project cards (Desktop only)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (!isMobile) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Smooth reveal for text elements
const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.about-text p, .experience-achievements li').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    textObserver.observe(el);
});

// Add hover effect for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });
});

// Skill items animation
document.querySelectorAll('.skill-item').forEach((item, index) => {
    // Faster animation on mobile, especially for swipe
    const isMobile = window.innerWidth <= 768;
    const duration = isMobile ? '0.2s' : '0.5s';
    const delay = isMobile ? index * 0.02 : index * 0.05;
    
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity ${duration} ease ${delay}s, transform ${duration} ease ${delay}s`;
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: isMobile ? 0.1 : 0.5 });
    
    skillObserver.observe(item);
});

// Hero image parallax on mouse move (Desktop only)
const heroImage = document.querySelector('.hero-image-wrapper');
if (heroImage) {
    document.addEventListener('mousemove', (e) => {
        if (!isMobile && window.innerWidth > 768) {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;
            
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll progress indicator (optional)
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Add ripple effect on button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    
    // Initialize swipe functionality for mobile
    if (window.innerWidth <= 768) {
        initializeSwipe('skills-swipe-wrapper', 'skills-indicators');
        initializeSwipe('projects-swipe-wrapper', 'projects-indicators');
        initializeSwipe('contact-swipe-wrapper', 'contact-indicators');
    }
});

// Swipe Functionality for Mobile
function initializeSwipe(wrapperId, indicatorsId) {
    const wrapper = document.getElementById(wrapperId);
    const indicatorsContainer = document.getElementById(indicatorsId);
    
    if (!wrapper || !indicatorsContainer) return;
    
    const items = wrapper.querySelectorAll('.swipe-item');
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Create indicator dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('swipe-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });
    
    const dots = indicatorsContainer.querySelectorAll('.swipe-dot');
    
    function updateSlide() {
        // Calculate the actual item width including padding
        const itemWidth = items[0].offsetWidth;
        const offset = -currentIndex * itemWidth;
        wrapper.style.transform = `translateX(${offset}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Trigger animations immediately on slide change
        const currentItem = items[currentIndex];
        const skillItems = currentItem.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, items.length - 1));
        updateSlide();
    }
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        wrapper.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const itemWidth = items[0].offsetWidth;
        const offset = -currentIndex * itemWidth + diff;
        wrapper.style.transform = `translateX(${offset}px)`;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        wrapper.style.transition = 'transform 0.3s ease-out';
        
        const diff = currentX - startX;
        const itemWidth = items[0].offsetWidth;
        const threshold = itemWidth * 0.2; // 20% swipe threshold
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < items.length - 1) {
                currentIndex++;
            }
        }
        
        updateSlide();
        startX = 0;
        currentX = 0;
    }
    
    // Touch events
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: true });
    wrapper.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events for testing on desktop
    wrapper.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        wrapper.style.transition = 'none';
        e.preventDefault();
    });
    
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const diff = currentX - startX;
        const itemWidth = items[0].offsetWidth;
        const offset = -currentIndex * itemWidth + diff;
        wrapper.style.transform = `translateX(${offset}px)`;
    });
    
    wrapper.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        wrapper.style.transition = 'transform 0.3s ease-out';
        
        const diff = currentX - startX;
        const itemWidth = items[0].offsetWidth;
        const threshold = itemWidth * 0.2;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < items.length - 1) {
                currentIndex++;
            }
        }
        
        updateSlide();
        startX = 0;
        currentX = 0;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            wrapper.style.transition = 'transform 0.3s ease-out';
            updateSlide();
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', updateSlide);
}

// Reinitialize swipe on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        // Reinitialize swipe if switching to mobile
        if (isMobile && !wasMobile) {
            initializeSwipe('skills-swipe-wrapper', 'skills-indicators');
            initializeSwipe('projects-swipe-wrapper', 'projects-indicators');
            initializeSwipe('contact-swipe-wrapper', 'contact-indicators');
        }
    }, 250);
});
