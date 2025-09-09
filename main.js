// Main Three.js Scene Setup
let scene, camera, renderer, composer;
let controls;
let birthdayText, nameText;
let balloons = [];
let stars = [];
let cakes = [];
let time = 0;
let musicPlaying = false;

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x764ba2, 10, 100);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 5, 20);
    
    // Renderer setup with WebGL2 or fallback
    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.minDistance = 5;
    controls.maxPolarAngle = Math.PI / 2 + 0.3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Post-processing setup
    setupPostProcessing();
    
    // Lights
    setupLights();
    
    // Create scene objects
    createGround();
    createBirthdayText();
    createBalloons();
    createStars();
    createFloatingParticles();
    createRibbons();
    
    // Initialize physics
    if (typeof initPhysics !== 'undefined') {
        initPhysics();
    }
    
    // Initialize particles
    if (typeof initParticles !== 'undefined') {
        initParticles();
    }
    
    // Event listeners
    setupEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 2000);
    
    // Start animation
    animate();
}

function setupPostProcessing() {
    composer = new THREE.EffectComposer(renderer);
    
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);
}

function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    
    // Colored point lights for atmosphere
    const colors = [0xff00ff, 0x00ffff, 0xffff00, 0xff00aa];
    colors.forEach((color, i) => {
        const pointLight = new THREE.PointLight(color, 0.5, 30);
        pointLight.position.set(
            Math.cos(i * Math.PI / 2) * 15,
            5,
            Math.sin(i * Math.PI / 2) * 15
        );
        scene.add(pointLight);
        
        // Animate lights
        gsap.to(pointLight.position, {
            x: Math.cos(i * Math.PI / 2 + Math.PI) * 15,
            z: Math.sin(i * Math.PI / 2 + Math.PI) * 15,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    });
}

function createGround() {
    // Shiny reflective ground
    const groundGeometry = new THREE.CircleGeometry(50, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a1650,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add grid for depth
    const gridHelper = new THREE.GridHelper(40, 40, 0x8844aa, 0x4422aa);
    gridHelper.position.y = -1.9;
    scene.add(gridHelper);
}

function createBirthdayText() {
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        // "HAPPY BIRTHDAY" text
        const textGeometry1 = new THREE.TextGeometry('HAPPY BIRTHDAY', {
            font: font,
            size: 2,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelSegments: 5
        });
        
        textGeometry1.center();
        
        const textMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdd00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        
        birthdayText = new THREE.Mesh(textGeometry1, textMaterial);
        birthdayText.position.y = 5;
        birthdayText.castShadow = true;
        scene.add(birthdayText);
        
        // "JAIME DELGADO" text
        const textGeometry2 = new THREE.TextGeometry('JAIME DELGADO', {
            font: font,
            size: 2.5,
            height: 0.6,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.08,
            bevelSegments: 5
        });
        
        textGeometry2.center();
        
        const nameMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0xaa00aa,
            emissiveIntensity: 0.4,
            shininess: 100
        });
        
        nameText = new THREE.Mesh(textGeometry2, nameMaterial);
        nameText.position.y = 2;
        nameText.castShadow = true;
        scene.add(nameText);
        
        // Animate text
        animateText();
    });
}

function animateText() {
    // Floating animation for birthday text
    gsap.to(birthdayText.position, {
        y: 6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    
    gsap.to(birthdayText.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    
    // Pulsing animation for name
    gsap.to(nameText.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    
    // Color animation
    setInterval(() => {
        const hue = (Date.now() * 0.001) % 1;
        if (nameText && nameText.material) {
            nameText.material.color.setHSL(hue, 1, 0.5);
        }
    }, 50);
}

function createBalloons() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    for (let i = 0; i < 20; i++) {
        const balloonGroup = new THREE.Group();
        
        // Balloon sphere
        const geometry = new THREE.SphereGeometry(0.8, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            shininess: 100,
            specular: 0xffffff
        });
        const balloon = new THREE.Mesh(geometry, material);
        balloon.castShadow = true;
        balloonGroup.add(balloon);
        
        // String
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = -2;
        balloonGroup.add(string);
        
        // Position balloons
        balloonGroup.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 5 + 8,
            (Math.random() - 0.5) * 30
        );
        
        balloons.push(balloonGroup);
        scene.add(balloonGroup);
        
        // Animate balloons
        gsap.to(balloonGroup.position, {
            y: balloonGroup.position.y + Math.random() * 2 + 1,
            x: balloonGroup.position.x + (Math.random() - 0.5) * 5,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    
    for (let i = 0; i < 1000; i++) {
        starVertices.push(
            (Math.random() - 0.5) * 100,
            Math.random() * 50 + 10,
            (Math.random() - 0.5) * 100
        );
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    stars.push(starField);
}

function createFloatingParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 40,
            Math.random() * 20,
            (Math.random() - 0.5) * 40
        );
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.5);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Animate particles
    gsap.to(particles.rotation, {
        y: Math.PI * 2,
        duration: 60,
        repeat: -1,
        ease: "none"
    });
}

function createRibbons() {
    for (let i = 0; i < 5; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, 5, 0),
            new THREE.Vector3(-5, 8, 5),
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(5, 8, -5),
            new THREE.Vector3(10, 5, 0)
        ]);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(i / 5, 1, 0.5),
            shininess: 100
        });
        
        const ribbon = new THREE.Mesh(tubeGeometry, tubeMaterial);
        ribbon.position.y = Math.random() * 5;
        ribbon.rotation.z = Math.random() * Math.PI;
        scene.add(ribbon);
        
        // Animate ribbon
        gsap.to(ribbon.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            ease: "none"
        });
    }
}

function spawnCake() {
    const cakeGroup = new THREE.Group();
    
    // Cake layers
    const layer1 = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0x8b4513 })
    );
    layer1.position.y = 0.5;
    cakeGroup.add(layer1);
    
    const layer2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    layer2.position.y = 1.5;
    cakeGroup.add(layer2);
    
    const layer3 = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0xff69b4 })
    );
    layer3.position.y = 2.5;
    cakeGroup.add(layer3);
    
    // Candles
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        candle.position.set(
            Math.cos(angle) * 0.7,
            3.2,
            Math.sin(angle) * 0.7
        );
        cakeGroup.add(candle);
        
        // Flame
        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({ 
                color: 0xff6600,
                emissive: 0xff6600,
                emissiveIntensity: 2
            })
        );
        flame.position.set(
            Math.cos(angle) * 0.7,
            3.5,
            Math.sin(angle) * 0.7
        );
        cakeGroup.add(flame);
    }
    
    cakeGroup.position.set(
        (Math.random() - 0.5) * 10,
        15,
        (Math.random() - 0.5) * 10
    );
    
    scene.add(cakeGroup);
    cakes.push(cakeGroup);
    
    // Animate cake falling
    gsap.to(cakeGroup.position, {
        y: 0,
        duration: 2,
        ease: "bounce.out"
    });
    
    gsap.to(cakeGroup.rotation, {
        y: Math.PI * 4,
        duration: 2,
        ease: "power2.out"
    });
}

function createFireworks(x, y, z) {
    const fireworkGroup = new THREE.Group();
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                emissive: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                emissiveIntensity: 2
            })
        );
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const velocity = 5 + Math.random() * 5;
        
        particle.userData.velocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * velocity,
            Math.cos(phi) * velocity,
            Math.sin(phi) * Math.sin(theta) * velocity
        );
        
        particle.position.set(x, y, z);
        fireworkGroup.add(particle);
    }
    
    scene.add(fireworkGroup);
    
    // Animate explosion
    const animateFirework = () => {
        fireworkGroup.children.forEach(particle => {
            particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.1));
            particle.userData.velocity.y -= 0.2; // gravity
            particle.material.opacity = particle.material.opacity || 1;
            particle.material.opacity -= 0.02;
            particle.material.transparent = true;
        });
        
        if (fireworkGroup.children[0].material.opacity > 0) {
            requestAnimationFrame(animateFirework);
        } else {
            scene.remove(fireworkGroup);
        }
    };
    
    animateFirework();
}

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            createFireworks(
                (Math.random() - 0.5) * 20,
                10 + Math.random() * 10,
                (Math.random() - 0.5) * 20
            );
            
            if (typeof createConfettiBurst !== 'undefined') {
                createConfettiBurst();
            }
        }
    });
    
    // Button controls
    document.getElementById('music-toggle').addEventListener('click', () => {
        const audio = document.getElementById('birthday-music');
        if (musicPlaying) {
            audio.pause();
            document.getElementById('music-toggle').textContent = '🎵 Music';
        } else {
            audio.play().catch(e => console.log('Audio play failed:', e));
            document.getElementById('music-toggle').textContent = '🔇 Mute';
        }
        musicPlaying = !musicPlaying;
    });
    
    document.getElementById('confetti-burst').addEventListener('click', () => {
        if (typeof createConfettiBurst !== 'undefined') {
            createConfettiBurst();
        }
    });
    
    document.getElementById('fireworks').addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFireworks(
                    (Math.random() - 0.5) * 30,
                    10 + Math.random() * 15,
                    (Math.random() - 0.5) * 30
                );
            }, i * 200);
        }
    });
    
    document.getElementById('cake-spawn').addEventListener('click', () => {
        spawnCake();
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    // Update controls
    controls.update();
    
    // Animate balloons
    balloons.forEach((balloon, i) => {
        balloon.rotation.y += 0.01;
        balloon.position.y += Math.sin(time + i) * 0.01;
    });
    
    // Animate stars twinkling
    stars.forEach(starField => {
        starField.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    });
    
    // Animate cakes rotation
    cakes.forEach(cake => {
        cake.rotation.y += 0.02;
    });
    
    // Update physics if available
    if (typeof updatePhysics !== 'undefined') {
        updatePhysics();
    }
    
    // Update particles if available
    if (typeof updateParticles !== 'undefined') {
        updateParticles();
    }
    
    // Render with post-processing
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
