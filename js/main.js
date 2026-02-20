// Three.js Background - Plexus Network Effect
const initThreeJS = () => {
    const container = document.getElementById('three-bg');
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; // Zoom out a bit

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // PARTICLES / PLEXUS
    const particleCount = 200; // Fewer particles for line connections performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const range = 40;

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * range;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * range;   // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * range;   // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material for Dots
    const pMaterial = new THREE.PointsMaterial({
        color: 0x38bdf8, // Sky 400
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Lines geometry (dynamic)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15 // Faint lines
    });

    const linesGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lineMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });

    // ANIMATION LOOP
    const animate = () => {
        // Update particles
        const posAttribute = particles.getAttribute('position');
        const posArray = posAttribute.array;

        // Move particles
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i].x;
            posArray[i * 3 + 1] += velocities[i].y;
            posArray[i * 3 + 2] += velocities[i].z;

            // Bounce off "walls" (soft limits)
            if (Math.abs(posArray[i * 3]) > range / 2) velocities[i].x *= -1;
            if (Math.abs(posArray[i * 3 + 1]) > range / 2) velocities[i].y *= -1;
            if (Math.abs(posArray[i * 3 + 2]) > range / 2) velocities[i].z *= -1;
        }
        posAttribute.needsUpdate = true;

        // Create Lines (Distance check)
        const linePositions = [];
        const connectionDistance = 6;

        // Brute force distance check (O(n^2)) - okay for 200 particles
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = posArray[i * 3] - posArray[j * 3];
                const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    linePositions.push(
                        posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                        posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                    );
                }
            }
        }

        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Gentle rotation based on mouse
        particleSystem.rotation.y += 0.001;
        lineMesh.rotation.y += 0.001;

        particleSystem.rotation.x += (mouseY * 0.001 - particleSystem.rotation.x) * 0.1;
        particleSystem.rotation.y += (mouseX * 0.001 - particleSystem.rotation.y) * 0.1;

        lineMesh.rotation.x = particleSystem.rotation.x;
        lineMesh.rotation.y = particleSystem.rotation.y; // Sync rotation

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // RESIZE
    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Dexie.js - Contact Form Drafts
const initDB = async () => {
    // Ensure db is available
    if (typeof db === 'undefined') {
        console.error("Dexie DB not initialized. Check db.js loading.");
        return;
    }

    const form = document.getElementById('contact-form');
    // Elements might not exist if we are on a different page (though this is single page)
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const statusSpan = document.getElementById('form-status');

    // Load Draft
    try {
        // We use a fixed ID 'draft_1' or similar for simplicity, or just the last entry.
        // Let's use a key 'current_draft' if we want a singleton, or just ID 1.
        // In db.js we defined drafts: "++id, ..."
        const draft = await db.drafts.get(1);
        if (draft) {
            if (nameInput) nameInput.value = draft.name || '';
            if (emailInput) emailInput.value = draft.email || '';
            if (messageInput) messageInput.value = draft.message || '';
            console.log("Draft loaded:", draft);
        }
    } catch (e) {
        console.error("Error loading draft:", e);
    }

    // Save Draft Logic
    const saveDraft = async () => {
        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;

        try {
            await db.drafts.put({
                id: 1, // Force ID 1 to act as a singleton draft
                name,
                email,
                message,
                timestamp: new Date()
            });
        } catch (e) {
            console.error("Error saving draft:", e);
        }
    };

    if (nameInput) nameInput.addEventListener('input', saveDraft);
    if (emailInput) emailInput.addEventListener('input', saveDraft);
    if (messageInput) messageInput.addEventListener('input', saveDraft);

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = 'Sending...';

        // Simulate network delay
        setTimeout(async () => {
            btn.innerHTML = 'Sent! <i data-lucide="check" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();

            if (statusSpan) {
                statusSpan.textContent = "Thanks for reaching out!";
                statusSpan.classList.remove('hidden');
                statusSpan.classList.add('text-green-400');
            }

            // Clear Draft
            try {
                await db.drafts.delete(1);
            } catch (e) { console.error("Error clearing draft", e); }

            form.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                if (statusSpan) statusSpan.classList.add('hidden');
                if (window.lucide) window.lucide.createIcons();
            }, 3000);
        }, 1500);
    });
};

// Theme Toggle Logic
const initTheme = () => {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    // Check saved preference
    // We default to 'dark' every time the page loads as requested.
    // To enable memory again, uncomment: const savedTheme = localStorage.getItem('theme');
    const savedTheme = 'dark';

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (icon) {
            icon.setAttribute('data-lucide', 'sun');
        }
    } else {
        // Default Dark
        body.classList.remove('light-mode');
        if (icon) icon.setAttribute('data-lucide', 'moon');
    }

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Update Icon
        if (icon) {
            icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
            if (window.lucide) window.lucide.createIcons();
        }

        // Update Three.js background color based on theme
        // We can dispatch a custom event or check css var
        // But for simplicity, we can let the user refresh or re-init the scene if strict color needed.
        // Actually, let's just update the particle color if we can access it.
    });
};

const initScrollReveal = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Text fade-in once
            }
        });
    }, observerOptions);

    // Auto-add reveal class to maximize impact without manual HTML editing
    const revealElements = document.querySelectorAll('.glass-panel, .project-card, h2, h3, h4, p, span.skill-tag, .btn-primary, .btn-secondary');

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add random slight delays for natural feel
        if (Math.random() > 0.5) el.classList.add('reveal-delay-100');
        observer.observe(el);
    });
};

const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
        const isClosed = mobileMenu.classList.contains('pointer-events-none');
        if (isClosed) {
            // Open
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            // Close
            mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
            document.body.style.overflow = ''; // Unlock scroll
        }
    };

    menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(); // Close on link click
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThreeJS();
    initDB();
    initScrollReveal();
    initMobileMenu();
    if (window.lucide) window.lucide.createIcons();
});
