import { initCursor } from './cursor.js';
import { initScroll } from './scroll.js';
import { initParticles } from './particles.js';
import { initTilt } from './tilt.js';
import { initParallax } from './parallax.js';

// Component Loader
async function loadComponent(id, file) {
    try {
        const response = await fetch(`components/${file}`);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

async function initApp() {
    // Load all components
    await Promise.all([
        loadComponent('main-header', 'header.html'),
        loadComponent('hero', 'hero.html'),
        loadComponent('about', 'about.html'),
        loadComponent('skills', 'skills-section.html'),
        loadComponent('experience', 'experience.html'),
        loadComponent('projects', 'projects.html'),
        loadComponent('contact', 'contact.html'),
        loadComponent('main-footer', 'footer.html')
    ]);

    // Initialize features after DOM is ready
    initCursor();
    initScroll();
    initParticles();
    initTilt();
    initParallax();

    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('form-status');
            const originalBtnText = submitBtn.innerText;
            
            // Loading State
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            statusDiv.innerHTML = '';
            statusDiv.style.color = 'var(--text-color)';

            const formData = new FormData();
            formData.append('name', document.getElementById('contact-name').value);
            formData.append('email', document.getElementById('contact-email').value);
            formData.append('subject', document.getElementById('contact-subject').value);
            formData.append('message', document.getElementById('contact-message').value);

            try {
                const response = await fetch('contact_us.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    statusDiv.innerHTML = '✅ ' + result.message;
                    statusDiv.style.color = '#4caf50'; // Green
                    contactForm.reset();
                } else {
                    statusDiv.innerHTML = '❌ ' + result.message;
                    statusDiv.style.color = '#f44336'; // Red
                }
            } catch (error) {
                console.error('Error:', error);
                statusDiv.innerHTML = '❌ An error occurred. Please try again.';
                statusDiv.style.color = '#f44336';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    console.log('Portfolio Initialized');
}

document.addEventListener('DOMContentLoaded', initApp);
