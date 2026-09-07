
(function fireflies() {
    const canvas = document.getElementById('fireflyCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const fireflies = [];
    const COUNT = 40;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Firefly {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = 3 + Math.random() * 5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.phase = Math.random() * Math.PI * 2;
            this.baseAlpha = 0.3 + Math.random() * 0.5;
            this.color = `hsla(${60 + Math.random() * 40}, 80%, 70%, `; 
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.phase += 0.02;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;

            this.speedX += (Math.random() - 0.5) * 0.01;
            this.speedY += (Math.random() - 0.5) * 0.01;
            const maxSpeed = 0.6;
            let sp = Math.hypot(this.speedX, this.speedY);
            if (sp > maxSpeed) {
                this.speedX = (this.speedX / sp) * maxSpeed;
                this.speedY = (this.speedY / sp) * maxSpeed;
            }
        }
        draw(ctx) {
            const alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.phase));
            const glow = this.size * 1.8;

            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glow);
            grad.addColorStop(0, `rgba(255, 240, 180, ${alpha * 0.9})`);
            grad.addColorStop(0.4, `rgba(200, 220, 100, ${alpha * 0.5})`);
            grad.addColorStop(1, `rgba(200, 220, 100, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 230, ${alpha * 0.9})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) {
        fireflies.push(new Firefly());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        fireflies.forEach(f => {
            f.update();
            f.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

const toggleBtn = document.getElementById('theme-toggle');
const icon = toggleBtn.querySelector('i');

let darkMode = true; 

const saved = localStorage.getItem('darkMode');
if (saved !== null) {
    darkMode = saved === 'true';
} else {
    darkMode = true;
}

function applyTheme() {
    if (darkMode) {
        document.body.classList.remove('light-mode');
        icon.className = 'fas fa-moon';
    } else {
        document.body.classList.add('light-mode');
        icon.className = 'fas fa-sun';
    }
    localStorage.setItem('darkMode', darkMode);
}

applyTheme();

toggleBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
});

function updateHrtDuration() {
    const startDate = new Date('2025-07-03'); 
    const now = new Date();
    const diffMs = now - startDate;

    const durationSpan = document.getElementById('hrt-duration');
    const dateSpan = document.getElementById('hrt-date');

    if (diffMs < 0) {
        durationSpan.textContent = '⏳ Start steht noch aus';
        dateSpan.textContent = '??.??.????';
        return;
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);

    let parts = [];
    if (years > 0) parts.push(`${years} Jahr${years > 1 ? 'e' : ''}`);
    if (months > 0) parts.push(`${months} Monat${months > 1 ? 'e' : ''}`);
    if (days > 0 || (years === 0 && months === 0)) parts.push(`${days} Tag${days > 1 ? 'e' : ''}`);

    durationSpan.textContent = parts.join(' ') || '0 Tage';
}

updateHrtDuration();
setInterval(updateHrtDuration, 86400000); 