document.addEventListener('DOMContentLoaded', () => {
    
    // --- Welcome.tsx Logic ---
    const contentRef = document.getElementById('welcome-content');
    const container = document.getElementById('welcome-container');
    const introText = document.getElementById('welcome-intro-text');
    const brandText = document.getElementById('welcome-brand-text');
    const taglineEl = document.getElementById('welcome-tagline');
    const studentButton = document.getElementById('student-button');
    const invigilatorButton = document.getElementById('invigilator-button');

    const tagline = "The seamless solution for exam seating.";

    // Check if this is the first visit (using sessionStorage)
    const isFirstVisit = !sessionStorage.getItem('hasVisitedWelcome');
    if (isFirstVisit) {
        sessionStorage.setItem('hasVisitedWelcome', 'true');
    }

    // Apply animation classes based on visit
    container.classList.add(isFirstVisit ? 'cinematic-welcome-container' : 'revisit-welcome-container');
    introText.classList.add(isFirstVisit ? 'welcome-intro-text' : 'revisit-intro-text');
    brandText.classList.add(isFirstVisit ? 'welcome-brand-text' : 'revisit-brand-text');
    taglineEl.classList.add(isFirstVisit ? 'welcome-tagline' : 'revisit-tagline');
    studentButton.classList.add(isFirstVisit ? 'welcome-button' : 'revisit-button');
    invigilatorButton.classList.add(isFirstVisit ? 'welcome-button' : 'revisit-button');

    // Animate tagline if first visit
    if (isFirstVisit) {
        tagline.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.style.animationDelay = `${2.5 + index * 0.03}s`;
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            taglineEl.appendChild(span);
        });
        studentButton.style.animationDelay = '2.8s';
        invigilatorButton.style.animationDelay = '3s';
    } else {
        taglineEl.textContent = tagline;
        // Apply revisit animation delays
        brandText.style.animationDelay = '0.1s';
        taglineEl.style.animationDelay = '0.2s';
        studentButton.style.animationDelay = '0.3s';
        invigilatorButton.style.animationDelay = '0.4s';
    }

    // Mouse move parallax effect
    window.addEventListener('mousemove', (e) => {
        if (!contentRef) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / 50;
        const y = (clientY - innerHeight / 2) / 50;
        contentRef.style.transform = `translate(${x}px, ${y}px)`;
    });

    // --- LiveBackground.tsx Logic ---
    const canvas = document.getElementById('live-background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let particles = [];
        const particleCount = Math.floor((width * height) / 25000);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createParticles();
        });

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
                ctx.fillStyle = 'rgba(74, 144, 226, 0.5)';
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
                        ctx.strokeStyle = distance < 100 ? `rgba(107, 92, 229, ${opacity * 0.5})` : `rgba(74, 144, 226, ${opacity * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        let animationFrameId;
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
    }
});