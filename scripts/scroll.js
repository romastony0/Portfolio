export function initScroll() {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // ScrollTrigger integration
    /* 
       Note: Since we are loading content dynamically, 
       we might need to refresh ScrollTrigger after content load.
       This is handled by the order of execution in main.js
    */

    // Example: Parallax for Hero Text
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 200,
        opacity: 0
    });

    // Section Headers Slide-in
    document.querySelectorAll('section h2').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 1
        });
    });

    // Navigation Click Handler (All internal links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Animate to section
                lenis.scrollTo(targetSection, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                
                // Optional: Highlight effect on target section
                gsap.fromTo(targetSection, 
                    { backgroundColor: "rgba(180, 154, 103, 0.1)" },
                    { backgroundColor: "transparent", duration: 1, delay: 0.5 }
                );
            }
        });
    });
}
