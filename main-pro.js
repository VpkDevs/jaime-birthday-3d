// Professional 3D Birthday Experience for Jaime Delgado
// Enhanced with cinematic quality and professional polish

let scene, camera, renderer, composer;
let controls;
let birthdayText, nameText, celebrationText;
let balloons = [];
let stars = [];
let cakes = [];
let time = 0;
let musicPlaying = false;
let visualizerActive = false;
let currentSongIndex = 0;

// Professional color palette
const palette = {
    gold: 0xffd700,
    silver: 0xc0c0c0,
    purple: 0x9b59b6,
    blue: 0x3498db,
    pink: 0xe91e63,
    white: 0xffffff
};

// Initialize the professional scene
function init() {
    // Scene setup with better fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000033, 0.008);
    
    // Professional camera setup
    camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 8, 25);
    camera.lookAt(0, 0, 0);
    
    // High-quality renderer setup
    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Smooth camera controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 40;
    controls.minDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enablePan = false;
    
    // Professional post-processing
    setupProfessionalPostProcessing();
    
    // Cinematic lighting
    setupCinematicLights();
    
    // Create professional scene elements
    createProfessionalGround();
    createElegantText();
    createPremiumBalloons();
    createStarfield();
    createAmbientParticles();
    createSpotlights();
    
    // Initialize systems
    if (typeof initPhysics !== 'undefined') {
        initPhysics();
    }
    
    if (typeof initParticles !== 'undefined') {
        initParticles();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Professional loading sequence
    gsap.timeline()
        .to('#loading', {
            opacity: 0,
            duration: 1,
            delay: 1.5,
            onComplete: () => {
                document.getElementById('loading').style.display = 'none';
            }
        })
        .from(camera.position, {
            z: 50,
            y: 20,
            duration: 3,
            ease: "power3.inOut"
        }, "-=0.5")
        .from(controls.target, {
            y: -5,
            duration: 3,
            ease: "power3.inOut",
            onUpdate: () => controls.update()
        }, "<");
    
    // Start the render loop
    animate();
}

function setupProfessionalPostProcessing() {
    composer = new THREE.EffectComposer(renderer);
    
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Subtle bloom for elegance
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,  // Reduced strength for subtlety
        0.5,  // radius
        0.4   // threshold
    );
    composer.addPass(bloomPass);
}

function setupCinematicLights() {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Key light - main illumination
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(15, 25, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    
    // Fill light - soften shadows
    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.4);
    fillLight.position.set(-10, 15, -10);
    scene.add(fillLight);
    
    // Rim light - highlight edges
    const rimLight = new THREE.DirectionalLight(palette.gold, 0.3);
    rimLight.position.set(0, 10, -20);
    scene.add(rimLight);
    
    // Elegant moving accent lights
    createMovingLights();
}

function createMovingLights() {
    const lightColors = [palette.gold, palette.blue, palette.pink, palette.purple];
    
    lightColors.forEach((color, i) => {
        const light = new THREE.PointLight(color, 0.4, 25);
        const angle = (i / lightColors.length) * Math.PI * 2;
        light.position.set(
            Math.cos(angle) * 12,
            4,
            Math.sin(angle) * 12
        );
        scene.add(light);
        
        // Smooth orbital motion
        gsap.to(light.position, {
            duration: 20,
            repeat: -1,
            ease: "none",
            onUpdate: function() {
                const t = this.progress();
                const a = angle + t * Math.PI * 2;
                light.position.x = Math.cos(a) * 12;
                light.position.z = Math.sin(a) * 12;
                light.position.y = 4 + Math.sin(t * Math.PI * 4) * 2;
            }
        });
    });
}

function createProfessionalGround() {
    // Elegant reflective floor
    const floorGeometry = new THREE.CircleGeometry(35, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Elegant radial pattern
    const ringCount = 5;
    for (let i = 1; i <= ringCount; i++) {
        const ringGeometry = new THREE.RingGeometry(
            i * 5 - 0.1,
            i * 5,
            64
        );
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: palette.gold,
            metalness: 0.8,
            roughness: 0.3,
            transparent: true,
            opacity: 0.3 - (i * 0.05),
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.01;
        scene.add(ring);
    }
}

function createElegantText() {
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        // Main birthday text with gold material
        const textGeometry1 = new THREE.TextGeometry('HAPPY BIRTHDAY', {
            font: font,
            size: 2.5,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelSegments: 8
        });
        
        textGeometry1.center();
        
        const goldMaterial = new THREE.MeshPhongMaterial({
            color: palette.gold,
            emissive: palette.gold,
            emissiveIntensity: 0.2,
            shininess: 200,
            specular: palette.white
        });
        
        birthdayText = new THREE.Mesh(textGeometry1, goldMaterial);
        birthdayText.position.y = 7;
        birthdayText.castShadow = true;
        scene.add(birthdayText);
        
        // Name text with elegant animation
        const textGeometry2 = new THREE.TextGeometry('JAIME DELGADO', {
            font: font,
            size: 3,
            height: 0.6,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.08,
            bevelSegments: 8
        });
        
        textGeometry2.center();
        
        const silverMaterial = new THREE.MeshPhongMaterial({
            color: palette.silver,
            emissive: palette.blue,
            emissiveIntensity: 0.1,
            shininess: 300,
            specular: palette.white
        });
        
        nameText = new THREE.Mesh(textGeometry2, silverMaterial);
        nameText.position.y = 3.5;
        nameText.castShadow = true;
        scene.add(nameText);
        
        // Celebration year text
        const yearGeometry = new THREE.TextGeometry('2025', {
            font: font,
            size: 1.5,
            height: 0.3,
            curveSegments: 8,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.03,
            bevelSegments: 5
        });
        
        yearGeometry.center();
        
        celebrationText = new THREE.Mesh(yearGeometry, goldMaterial.clone());
        celebrationText.position.y = 1;
        celebrationText.castShadow = true;
        scene.add(celebrationText);
        
        // Professional text animations
        animateElegantText();
    });
}

function animateElegantText() {
    // Smooth floating for birthday text
    gsap.to(birthdayText.position, {
        y: 7.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    // Gentle rotation for name
    gsap.to(nameText.rotation, {
        y: Math.PI * 2,
        duration: 30,
        repeat: -1,
        ease: "none"
    });
    
    // Subtle scale pulse for year
    gsap.to(celebrationText.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

function createPremiumBalloons() {
    const balloonColors = [palette.gold, palette.silver, palette.blue, palette.pink, palette.purple];
    const balloonCount = 12;
    
    for (let i = 0; i < balloonCount; i++) {
        const balloonGroup = new THREE.Group();
        
        // High-quality balloon with realistic material
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: balloonColors[i % balloonColors.length],
            metalness: 0.3,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            reflectivity: 1,
            envMapIntensity: 1
        });
        
        const balloon = new THREE.Mesh(geometry, material);
        balloon.castShadow = true;
        balloon.receiveShadow = true;
        balloonGroup.add(balloon);
        
        // Elegant ribbon
        const ribbonCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2, -1, 0.1),
            new THREE.Vector3(-0.2, -2, -0.1),
            new THREE.Vector3(0.1, -3, 0.2),
            new THREE.Vector3(0, -4, 0)
        ]);
        
        const ribbonGeometry = new THREE.TubeGeometry(ribbonCurve, 20, 0.02, 8, false);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 100
        });
        const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        balloonGroup.add(ribbon);
        
        // Position in elegant formation
        const angle = (i / balloonCount) * Math.PI * 2;
        const radius = 8 + Math.random() * 4;
        balloonGroup.position.set(
            Math.cos(angle) * radius,
            8 + Math.random() * 3,
            Math.sin(angle) * radius
        );
        
        balloons.push(balloonGroup);
        scene.add(balloonGroup);
        
        // Smooth floating animation
        gsap.to(balloonGroup.position, {
            y: balloonGroup.position.y + Math.random() + 0.5,
            duration: 4 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        
        // Gentle rotation
        gsap.to(balloonGroup.rotation, {
            y: Math.PI * 2,
            duration: 20 + Math.random() * 10,
            repeat: -1,
            ease: "none"
        });
    }
}

function createStarfield() {
    // Premium particle starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Spherical distribution
        const radius = 30 + Math.random() * 70;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.cos(phi);
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        // Varying star colors
        const starColor = new THREE.Color();
        starColor.setHSL(0.6, 0.1, 0.5 + Math.random() * 0.5);
        colors[i3] = starColor.r;
        colors[i3 + 1] = starColor.g;
        colors[i3 + 2] = starColor.b;
        
        sizes[i] = Math.random() * 2;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
    stars.push(starField);
    
    // Slow rotation for depth
    gsap.to(starField.rotation, {
        y: Math.PI * 2,
        duration: 200,
        repeat: -1,
        ease: "none"
    });
}

function createAmbientParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = (Math.random() - 0.5) * 30;
        positions[i3 + 1] = Math.random() * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;
        
        const color = new THREE.Color(palette.gold);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Elegant drift animation
    gsap.to(particles.rotation, {
        y: Math.PI * 2,
        x: Math.PI * 0.5,
        duration: 60,
        repeat: -1,
        ease: "none"
    });
}

function createSpotlights() {
    // Stage spotlights for dramatic effect
    const spotlightPositions = [
        { x: -10, z: 10 },
        { x: 10, z: 10 },
        { x: 0, z: -15 }
    ];
    
    spotlightPositions.forEach((pos, i) => {
        const spotlight = new THREE.SpotLight(palette.white, 0.5);
        spotlight.position.set(pos.x, 20, pos.z);
        spotlight.target.position.set(0, 0, 0);
        spotlight.angle = Math.PI / 6;
        spotlight.penumbra = 0.3;
        spotlight.decay = 2;
        spotlight.distance = 50;
        spotlight.castShadow = true;
        scene.add(spotlight);
        scene.add(spotlight.target);
        
        // Animated spotlight sweep
        gsap.to(spotlight.position, {
            x: -pos.x,
            z: -pos.z,
            duration: 10 + i * 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    });
}

function createProfessionalCake() {
    const cakeGroup = new THREE.Group();
    
    // Multi-tier cake with elegant design
    const tiers = [
        { radius: 2.5, height: 1, y: 0.5, color: 0x8B4513 },
        { radius: 2, height: 0.8, y: 1.5, color: 0xFFFFFF },
        { radius: 1.5, height: 0.8, y: 2.5, color: 0xFFB6C1 },
        { radius: 1, height: 0.6, y: 3.4, color: 0xFFD700 }
    ];
    
    tiers.forEach(tier => {
        const geometry = new THREE.CylinderGeometry(tier.radius, tier.radius, tier.height, 32);
        const material = new THREE.MeshPhongMaterial({
            color: tier.color,
            shininess: 100
        });
        const tierMesh = new THREE.Mesh(geometry, material);
        tierMesh.position.y = tier.y;
        tierMesh.castShadow = true;
        tierMesh.receiveShadow = true;
        cakeGroup.add(tierMesh);
    });
    
    // Elegant candles with realistic flames
    const candleCount = 8;
    for (let i = 0; i < candleCount; i++) {
        const angle = (i / candleCount) * Math.PI * 2;
        
        // Candle
        const candleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFF8DC });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(
            Math.cos(angle) * 0.8,
            4.2,
            Math.sin(angle) * 0.8
        );
        cakeGroup.add(candle);
        
        // Flame with glow effect
        const flameGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFA500,
            emissive: 0xFF6600,
            emissiveIntensity: 2
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(
            Math.cos(angle) * 0.8,
            4.5,
            Math.sin(angle) * 0.8
        );
        cakeGroup.add(flame);
        
        // Flame animation
        gsap.to(flame.scale, {
            x: 1.2,
            y: 0.8,
            z: 1.2,
            duration: 0.3 + Math.random() * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
    
    return cakeGroup;
}

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (composer) {
            composer.setSize(window.innerWidth, window.innerHeight);
        }
    });
    
    // Professional controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            createElegantFireworks();
        }
    });
    
    // Button event listeners
    setupButtonListeners();
    
    // Auto-play next song when current ends
    const audio = document.getElementById('birthday-music');
    audio.addEventListener('ended', () => {
        nextSong();
    });
}

function setupButtonListeners() {
    // Playlist toggle
    const playlistToggle = document.getElementById('playlist-toggle');
    const playlistPanel = document.getElementById('playlist-panel');
    
    if (playlistToggle) {
        playlistToggle.addEventListener('click', () => {
            if (playlistPanel.style.display === 'none') {
                playlistPanel.style.display = 'block';
                gsap.from(playlistPanel, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(playlistPanel, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        playlistPanel.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Update song titles
    const songTitles = [
        { title: "Happy Birthday Dude! 🎉", artist: "The Classic Jam" },
        { title: "Happy B-Day Jaime! 🎂", artist: "Party Remix" },
        { title: "Yo Jaime, It's Your Day! 🎈", artist: "Epic Birthday Mix" }
    ];
    
    songTitles.forEach((song, index) => {
        const songItem = document.querySelector(`[data-song="${index + 1}"]`);
        if (songItem) {
            songItem.querySelector('.song-title').textContent = song.title;
            songItem.querySelector('.song-artist').textContent = song.artist;
        }
    });
    
    // Music toggle with proper playlist functionality
    document.getElementById('music-toggle').addEventListener('click', () => {
        const audio = document.getElementById('birthday-music');
        
        if (musicPlaying) {
            // Fade out
            gsap.to(audio, {
                volume: 0,
                duration: 1,
                onComplete: () => {
                    audio.pause();
                }
            });
            document.getElementById('music-toggle').textContent = '🎵 Music';
            musicPlaying = false;
        } else {
            // Start playing current song
            playSong(currentSongIndex + 1);
        }
    });
    
    // Cake spawn button
    document.getElementById('cake-spawn').addEventListener('click', () => {
        const cake = createProfessionalCake();
        cake.position.set(
            (Math.random() - 0.5) * 10,
            15,
            (Math.random() - 0.5) * 10
        );
        scene.add(cake);
        cakes.push(cake);
        
        // Elegant drop animation
        gsap.to(cake.position, {
            y: 0,
            duration: 2,
            ease: "bounce.out"
        });
        
        gsap.to(cake.rotation, {
            y: Math.PI * 2,
            duration: 2,
            ease: "power2.out"
        });
    });
    
    // Confetti button
    document.getElementById('confetti-burst').addEventListener('click', () => {
        if (typeof createConfettiBurst !== 'undefined') {
            createConfettiBurst();
        }
    });
    
    // Fireworks button
    document.getElementById('fireworks').addEventListener('click', () => {
        createElegantFireworks();
    });
    
    // Visualizer toggle
    document.getElementById('visualizer-toggle').addEventListener('click', () => {
        if (visualizerActive) {
            if (typeof stopVisualizer !== 'undefined') {
                stopVisualizer();
            }
            document.getElementById('visualizer-toggle').textContent = '🎶 Visualizer OFF';
            document.getElementById('visualizer-controls').style.display = 'none';
            visualizerActive = false;
        } else {
            if (musicPlaying && typeof initVisualizer !== 'undefined') {
                try {
                    initVisualizer();
                    document.getElementById('visualizer-toggle').textContent = '🎶 Visualizer ON';
                    document.getElementById('visualizer-controls').style.display = 'block';
                    visualizerActive = true;
                } catch (e) {
                    console.log('Visualizer initialization failed:', e);
                }
            }
        }
    });
}

function createElegantFireworks() {
    const fireworkColors = [palette.gold, palette.silver, palette.blue, palette.pink];
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const x = (Math.random() - 0.5) * 20;
            const y = 10 + Math.random() * 10;
            const z = (Math.random() - 0.5) * 20;
            const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            
            createSingleFirework(x, y, z, color);
        }, i * 300);
    }
}

function createSingleFirework(x, y, z, color) {
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            Math.random() * 10,
            (Math.random() - 0.5) * 15
        );
        
        scene.add(particle);
        particles.push({ mesh: particle, velocity: velocity });
    }
    
    // Animate explosion
    const duration = 2;
    particles.forEach(p => {
        gsap.to(p.mesh.position, {
            x: p.mesh.position.x + p.velocity.x,
            y: p.mesh.position.y + p.velocity.y - 5,
            z: p.mesh.position.z + p.velocity.z,
            duration: duration,
            ease: "power2.out"
        });
        
        gsap.to(p.mesh.material, {
            opacity: 0,
            duration: duration,
            ease: "power2.in",
            onComplete: () => {
                scene.remove(p.mesh);
            }
        });
        
        gsap.to(p.mesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: duration,
            ease: "power2.in"
        });
    });
}

// Fixed playlist functionality
function playSong(songId) {
    const audio = document.getElementById('birthday-music');
    currentSongIndex = songId - 1;
    
    // Clear and set new source
    audio.src = `song${songId}.mp3`;
    audio.volume = 0;
    
    // Play with fade in
    audio.play().then(() => {
        gsap.to(audio, {
            volume: 0.5,
            duration: 2
        });
        
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔇 Mute';
        
        // Update UI
        updatePlaylistUI(currentSongIndex);
        
        // Start visualizer if not active
        if (!visualizerActive && typeof initVisualizer !== 'undefined') {
            setTimeout(() => {
                try {
                    initVisualizer();
                    visualizerActive = true;
                    document.getElementById('visualizer-toggle').textContent = '🎶 Visualizer ON';
                } catch(e) {
                    console.log('Visualizer init skipped');
                }
            }, 500);
        }
    }).catch(e => {
        console.error('Audio playback failed:', e);
        // Try fallback
        audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songId}.mp3`;
        audio.play();
    });
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % 3;
    playSong(currentSongIndex + 1);
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + 3) % 3;
    playSong(currentSongIndex + 1);
}

function shuffleSong() {
    const randomIndex = Math.floor(Math.random() * 3);
    playSong(randomIndex + 1);
}

function updatePlaylistUI(index) {
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-song="${index + 1}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Professional animation loop
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.008;
    
    // Smooth camera controls
    controls.update();
    
    // Elegant balloon movements
    balloons.forEach((balloon, i) => {
        balloon.rotation.y += 0.005;
        balloon.position.y += Math.sin(time * 0.5 + i) * 0.005;
    });
    
    // Cake rotations
    cakes.forEach(cake => {
        cake.rotation.y += 0.01;
    });
    
    // Text effects
    if (nameText) {
        nameText.material.emissiveIntensity = 0.1 + Math.sin(time * 2) * 0.05;
    }
    
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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
