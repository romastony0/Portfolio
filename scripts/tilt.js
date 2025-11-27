export function initTilt() {
    // Initialize VanillaTilt on all elements with .tilt class
    // We use a MutationObserver to handle dynamically loaded content if needed,
    // but since we init after load in main.js, simple selection works.
    
    // We will add the .tilt class to our glass cards in the HTML components
    
    // Wait a bit for DOM to be fully painted if needed, or just run it
    setTimeout(() => {
        const tiltElements = document.querySelectorAll(".glass-card");
        VanillaTilt.init(tiltElements, {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }, 500); // Small delay to ensure elements are in DOM
}
