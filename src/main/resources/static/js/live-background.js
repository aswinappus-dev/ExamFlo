function initializeLiveBackground() {
    const canvas = document.getElementById('live-background-canvas');
    if (!canvas || canvas.dataset.initialized) { // Prevent double initialization
        return;
    }
    canvas.dataset.initialized = 'true'; // Mark as initialized

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    let particleCount = Math.floor((width * height) / 25000); // Recalculate based on current size
    let animationFrameId;

    function handleResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particleCount = Math.floor((width * height) / 25000); // Update particle count on resize
        createParticles(); // Recreate particles for new dimensions
    }

    window.addEventListener('resize', handleResize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = Math.random() * 0.8 - 0.4;
            this.vy = Math.random() * 0.8 - 0.4;
            this.radius = Math.random() * 1.5 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Use CSS variables or check theme for color adaptability
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? 'rgba(74, 144, 226, 0.5)' : 'rgba(74, 144, 226, 0.5)'; // Adjust if needed
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const isDark = document.documentElement.classList.contains('dark');
        const blue = isDark ? 'rgba(74, 144, 226, 0.5)' : 'rgba(74, 144, 226, 0.5)';
        const purple = isDark ? 'rgba(107, 92, 229, 0.5)' : 'rgba(107, 92, 229, 0.5)';
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const opacity = 1 - distance / 150;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = distance < 100 ? purple.replace('0.5', `${opacity * 0.5}`) : blue.replace('0.5', `${opacity * 0.5}`);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Cleanup function (optional, but good practice)
    // window.addEventListener('beforeunload', () => {
    //     cancelAnimationFrame(animationFrameId);
    //     window.removeEventListener('resize', handleResize);
    // });
}

// Initialize the background when the script loads
document.addEventListener('DOMContentLoaded', initializeLiveBackground);