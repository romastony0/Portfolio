export function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth follower movement
    setInterval(() => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        
        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }, 10);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hover effects
    const hoverables = document.querySelectorAll('a, button, .glass-card, input, textarea');
    
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });
}
