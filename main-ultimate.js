// JAIME'S ULTIMATE BIRTHDAY EXPERIENCE - MAXIMUM OVERDRIVE EDITION
// WARNING: THIS CODE IS ABSOLUTELY UNHINGED AND SPECTACULAR

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import CANNON from 'cannon';

// EPIC CONFIGURATION
const CONFIG = {
    PARTICLE_COUNT: 15000,
    GALAXY_PARTICLES: 50000,
    CONFETTI_COUNT: 500,
    MAX_FIREWORKS: 10,
    BALLOON_WAVES: 5,
    RIBBON_SEGMENTS: 100,
    AUDIO_SAMPLES: 256,
    BEAT_THRESHOLD: 0.8,
    MODES: ['PARTY', 'SPACE', 'UNDERWATER', 'CYBERPUNK', 'RAINBOW', 'MATRIX'],
    ACHIEVEMENTS: [],
    COMBOS: [],
    EASTER_EGGS: {
        'jaime': '🎉 BIRTHDAY LEGEND MODE ACTIVATED! 🎉',
        'konami': '⬆⬆⬇⬇⬅➡⬅➡BA - UNLIMITED POWER!',
        '42': '🌌 The Answer to Everything... Happy Birthday! 🌌'
    }
};

// GLOBAL SCENE MANAGER
class UltimateBirthdayScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.composer = null;
        this.controls = null;
        this.world = null;
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        this.elapsedTime = 0;
        
        // Systems
        this.particleSystems = [];
        this.lightingSystems = [];
        this.effectSystems = [];
        this.audioSystem = null;
        this.uiSystem = null;
        
        // State
        this.currentMode = 'PARTY';
        this.isPaused = false;
        this.intensity = 1.0;
        this.beatDetected = false;
        this.comboCounter = 0;
        this.score = 0;
        
        // Collections
        this.balloons = [];
        this.fireworks = [];
        this.confetti = [];
        this.ribbons = [];
        this.sparklers = [];
        this.cakes = [];
        this.galaxies = [];
        this.fractals = [];
        
        this.init();
    }
    
    init() {
        // RENDERER SETUP - MAXIMUM QUALITY
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        document.body.appendChild(this.renderer.domElement);
        
        // CAMERA SETUP
        this.camera.position.set(0, 10, 30);
        this.camera.lookAt(0, 0, 0);
        
        // CONTROLS
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 100;
        this.controls.minDistance = 5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // PHYSICS WORLD
        this.initPhysics();
        
        // POST PROCESSING
        this.initPostProcessing();
        
        // SCENE ELEMENTS
        this.createGalaxyBackground();
        this.createAdvancedLighting();
        this.createMainTitle();
        this.createParticleUniverse();
        this.createBalloonWaves();
        this.createRibbonDance();
        this.createMagicalFloor();
        this.createFloatingIslands();
        
        // AUDIO SYSTEM
        this.initAudioSystem();
        
        // UI SYSTEM
        this.initUISystem();
        
        // EVENT LISTENERS
        this.initEventListeners();
        
        // START ANIMATION
        this.animate();
    }
    
    initPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }
    
    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // EPIC BLOOM
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0, // strength
            0.5, // radius
            0.2  // threshold
        );
        this.composer.addPass(bloomPass);
        
        // Film grain for cinematic feel
        const filmPass = new FilmPass(0.35, 0.025, 648, false);
        this.composer.addPass(filmPass);
        
        // Anti-aliasing
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        this.composer.addPass(fxaaPass);
        
        // Custom shader for extra effects
        this.createCustomShaders();
    }
    
    createCustomShaders() {
        // Chromatic Aberration Shader
        const chromaticAberrationShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.002 },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float amount;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 offset = amount * sin(time * 2.0);
                    vec4 cr = texture2D(tDiffuse, vUv + offset);
                    vec4 cg = texture2D(tDiffuse, vUv);
                    vec4 cb = texture2D(tDiffuse, vUv - offset);
                    gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
                }
            `
        };
        
        const chromaticPass = new ShaderPass(chromaticAberrationShader);
        this.composer.addPass(chromaticPass);
        this.chromaticPass = chromaticPass;
    }
    
    createGalaxyBackground() {
        // EPIC GALAXY PARTICLES
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyCount = CONFIG.GALAXY_PARTICLES;
        const positions = new Float32Array(galaxyCount * 3);
        const colors = new Float32Array(galaxyCount * 3);
        const sizes = new Float32Array(galaxyCount);
        
        for (let i = 0; i < galaxyCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 200;
            const spinAngle = radius * 0.1;
            const branchAngle = ((i % 3) / 3) * Math.PI * 2;
            
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
            
            // Colorful galaxy
            colors[i3] = Math.random();
            colors[i3 + 1] = Math.random() * 0.5 + 0.5;
            colors[i3 + 2] = Math.random() * 0.5 + 0.5;
            
            sizes[i] = Math.random() * 2;
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom galaxy shader
        const galaxyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    float animatedSize = size * (1.0 + sin(time + position.x * 0.1) * 0.3);
                    gl_PointSize = animatedSize * 100.0 / -mvPosition.z;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float strength = 1.0 - dist * 2.0;
                    vec3 finalColor = mix(vColor, vec3(1.0), strength * 0.5);
                    gl_FragColor = vec4(finalColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });
        
        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        galaxy.rotation.y = Math.PI * 0.25;
        this.scene.add(galaxy);
        this.galaxies.push(galaxy);
    }
    
    createAdvancedLighting() {
        // DRAMATIC LIGHTING SETUP
        
        // Main spotlight
        const mainSpot = new THREE.SpotLight(0xffffff, 3);
        mainSpot.position.set(0, 50, 0);
        mainSpot.angle = Math.PI / 4;
        mainSpot.penumbra = 0.5;
        mainSpot.castShadow = true;
        mainSpot.shadow.mapSize.width = 2048;
        mainSpot.shadow.mapSize.height = 2048;
        this.scene.add(mainSpot);
        
        // Colored rim lights
        const colors = [0xff00ff, 0x00ffff, 0xffff00, 0xff0080];
        colors.forEach((color, i) => {
            const angle = (i / colors.length) * Math.PI * 2;
            const light = new THREE.PointLight(color, 2, 50);
            light.position.set(Math.cos(angle) * 30, 10, Math.sin(angle) * 30);
            this.scene.add(light);
            this.lightingSystems.push(light);
        });
        
        // Moving lights
        for (let i = 0; i < 5; i++) {
            const movingLight = new THREE.SpotLight(0xffffff, 1);
            movingLight.angle = Math.PI / 6;
            movingLight.penumbra = 0.3;
            movingLight.position.set(
                Math.random() * 60 - 30,
                Math.random() * 20 + 10,
                Math.random() * 60 - 30
            );
            this.scene.add(movingLight);
            this.lightingSystems.push(movingLight);
        }
        
        // Ambient for visibility
        const ambient = new THREE.AmbientLight(0x404080, 0.5);
        this.scene.add(ambient);
        
        // Fog for atmosphere
        this.scene.fog = new THREE.FogExp2(0x000033, 0.008);
    }
    
    createMainTitle() {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            // Main title
            const titleGeometry = new TextGeometry('HAPPY BIRTHDAY', {
                font: font,
                size: 4,
                height: 1,
                curveSegments: 32,
                bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.2,
                bevelOffset: 0,
                bevelSegments: 16
            });
            
            // Holographic material
            const titleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: new THREE.Color(0xff00ff) },
                    color2: { value: new THREE.Color(0x00ffff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color1;
                    uniform vec3 color2;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    
                    void main() {
                        float wave = sin(vPosition.x * 0.5 + time * 2.0) * 0.5 + 0.5;
                        vec3 color = mix(color1, color2, wave);
                        float glow = sin(time * 3.0) * 0.2 + 0.8;
                        gl_FragColor = vec4(color * glow, 1.0);
                    }
                `
            });
            
            const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
            titleGeometry.center();
            titleMesh.position.y = 15;
            titleMesh.castShadow = true;
            this.scene.add(titleMesh);
            this.mainTitle = titleMesh;
            
            // JAIME text
            const nameGeometry = new TextGeometry('JAIME', {
                font: font,
                size: 6,
                height: 1.5,
                curveSegments: 32,
                bevelEnabled: true,
                bevelThickness: 0.4,
                bevelSize: 0.3,
                bevelSegments: 20
            });
            
            // Gold material
            const nameMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffd700,
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                emissive: 0xffaa00,
                emissiveIntensity: 0.3
            });
            
            const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
            nameGeometry.center();
            nameMesh.position.y = 8;
            nameMesh.castShadow = true;
            this.scene.add(nameMesh);
            this.nameTitle = nameMesh;
        });
    }
    
    createParticleUniverse() {
        // MASSIVE PARTICLE SYSTEM
        const particleCount = CONFIG.PARTICLE_COUNT;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Sphere distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = Math.random() * 50 + 20;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Rainbow colors
            const hue = (i / particleCount) * 360;
            const color = new THREE.Color().setHSL(hue / 360, 1, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            scales[i] = Math.random() * 2 + 0.5;
            
            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.userData.velocities = velocities;
        
        // Advanced particle material
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioLevel: { value: 0 },
                beatPulse: { value: 0 }
            },
            vertexShader: `
                attribute float scale;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float audioLevel;
                uniform float beatPulse;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Audio reactive movement
                    pos += normalize(position) * audioLevel * 5.0;
                    
                    // Orbit animation
                    float angle = time * 0.5 + length(position) * 0.01;
                    pos.x += sin(angle) * 2.0;
                    pos.z += cos(angle) * 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    float finalScale = scale * (1.0 + beatPulse * 2.0 + audioLevel);
                    gl_PointSize = finalScale * 200.0 / -mvPosition.z;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    
                    float strength = 1.0 - (dist * 2.0);
                    strength = pow(strength, 2.0);
                    
                    vec3 finalColor = vColor * (1.0 + sin(time * 3.0) * 0.3);
                    gl_FragColor = vec4(finalColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });
        
        const particleSystem = new THREE.Points(geometry, particleMaterial);
        this.scene.add(particleSystem);
        this.particleSystems.push(particleSystem);
    }
    
    createBalloonWaves() {
        // FLOATING BALLOON WAVES
        const balloonColors = [0xff1493, 0x00ced1, 0xffd700, 0xff69b4, 0x9370db];
        
        for (let wave = 0; wave < CONFIG.BALLOON_WAVES; wave++) {
            for (let i = 0; i < 20; i++) {
                const geometry = new THREE.SphereGeometry(2, 32, 32);
                
                // Iridescent balloon material
                const material = new THREE.MeshPhysicalMaterial({
                    color: balloonColors[i % balloonColors.length],
                    metalness: 0.3,
                    roughness: 0.2,
                    clearcoat: 1,
                    clearcoatRoughness: 0,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide,
                    envMapIntensity: 1
                });
                
                const balloon = new THREE.Mesh(geometry, material);
                
                // Position in waves
                const angle = (i / 20) * Math.PI * 2;
                const radius = 15 + wave * 5;
                balloon.position.set(
                    Math.cos(angle) * radius,
                    Math.random() * 10 - 5,
                    Math.sin(angle) * radius
                );
                
                // Balloon string
                const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 10);
                const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
                const string = new THREE.Mesh(stringGeometry, stringMaterial);
                string.position.y = -6;
                balloon.add(string);
                
                // Store animation data
                balloon.userData = {
                    floatSpeed: Math.random() * 0.5 + 0.5,
                    floatOffset: Math.random() * Math.PI * 2,
                    rotationSpeed: Math.random() * 0.02,
                    wave: wave
                };
                
                this.scene.add(balloon);
                this.balloons.push(balloon);
            }
        }
    }
    
    createRibbonDance() {
        // FLOWING RIBBONS
        for (let i = 0; i < 10; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-20, 0, 0),
                new THREE.Vector3(-10, 10, 5),
                new THREE.Vector3(0, 5, 0),
                new THREE.Vector3(10, 10, -5),
                new THREE.Vector3(20, 0, 0)
            ]);
            
            const tubeGeometry = new THREE.TubeGeometry(curve, CONFIG.RIBBON_SEGMENTS, 0.5, 8, false);
            
            // Gradient ribbon material
            const ribbonMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: new THREE.Color(Math.random(), Math.random(), Math.random()) },
                    color2: { value: new THREE.Color(Math.random(), Math.random(), Math.random()) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    uniform float time;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        pos.y += sin(position.x * 0.5 + time) * 2.0;
                        pos.x += cos(position.z * 0.3 + time) * 1.0;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float time;
                    varying vec2 vUv;
                    
                    void main() {
                        vec3 color = mix(color1, color2, vUv.x + sin(time) * 0.5);
                        float alpha = 0.8 + sin(time * 2.0 + vUv.x * 10.0) * 0.2;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const ribbon = new THREE.Mesh(tubeGeometry, ribbonMaterial);
            ribbon.position.set(
                Math.random() * 40 - 20,
                Math.random() * 20,
                Math.random() * 40 - 20
            );
            ribbon.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.scene.add(ribbon);
            this.ribbons.push(ribbon);
        }
    }
    
    createMagicalFloor() {
        // INFINITE GRID FLOOR WITH WAVES
        const floorMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioLevel: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                uniform float audioLevel;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    vec3 pos = position;
                    float wave = sin(position.x * 0.3 + time) * cos(position.z * 0.3 + time);
                    pos.y += wave * audioLevel * 2.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    float grid = step(0.98, max(sin(vPosition.x * 2.0), sin(vPosition.z * 2.0)));
                    vec3 color = mix(
                        vec3(0.1, 0.0, 0.2),
                        vec3(0.0, 1.0, 1.0),
                        grid
                    );
                    
                    float glow = sin(time * 2.0) * 0.5 + 0.5;
                    color *= (1.0 + glow * 0.5);
                    
                    float dist = length(vPosition.xz);
                    float fade = 1.0 - smoothstep(20.0, 50.0, dist);
                    
                    gl_FragColor = vec4(color, fade * 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const floorGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -10;
        this.scene.add(floor);
        this.magicalFloor = floor;
    }
    
    createFloatingIslands() {
        // MYSTICAL FLOATING PLATFORMS
        const islandCount = 8;
        for (let i = 0; i < islandCount; i++) {
            const group = new THREE.Group();
            
            // Crystal formation
            const crystalGeometry = new THREE.OctahedronGeometry(3, 0);
            const crystalMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                metalness: 0.5,
                roughness: 0.1,
                transparent: true,
                opacity: 0.8,
                emissive: new THREE.Color().setHSL(Math.random(), 1, 0.3),
                emissiveIntensity: 0.5
            });
            
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.scale.y = 2;
            group.add(crystal);
            
            // Floating platform
            const platformGeometry = new THREE.CylinderGeometry(5, 3, 1, 16);
            const platformMaterial = new THREE.MeshStandardMaterial({
                color: 0x444466,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.position.y = -2;
            group.add(platform);
            
            // Particle aura
            const auraGeometry = new THREE.BufferGeometry();
            const auraCount = 100;
            const auraPositions = new Float32Array(auraCount * 3);
            
            for (let j = 0; j < auraCount; j++) {
                const angle = (j / auraCount) * Math.PI * 2;
                const radius = Math.random() * 8;
                auraPositions[j * 3] = Math.cos(angle) * radius;
                auraPositions[j * 3 + 1] = Math.random() * 10 - 5;
                auraPositions[j * 3 + 2] = Math.sin(angle) * radius;
            }
            
            auraGeometry.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
            
            const auraMaterial = new THREE.PointsMaterial({
                color: crystalMaterial.color,
                size: 0.3,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            
            const aura = new THREE.Points(auraGeometry, auraMaterial);
            group.add(aura);
            
            // Position island
            const angle = (i / islandCount) * Math.PI * 2;
            const radius = 35;
            group.position.set(
                Math.cos(angle) * radius,
                Math.random() * 15 + 5,
                Math.sin(angle) * radius
            );
            
            group.userData = {
                floatSpeed: Math.random() * 0.3 + 0.2,
                rotationSpeed: Math.random() * 0.01,
                crystal: crystal,
                aura: aura
            };
            
            this.scene.add(group);
            this.effectSystems.push(group);
        }
    }
    
    initAudioSystem() {
        this.audioSystem = {
            audio: document.getElementById('birthdayAudio'),
            context: null,
            analyser: null,
            dataArray: null,
            source: null,
            isInitialized: false,
            currentSong: 0,
            songs: [
                { file: 'song1.mp3', title: 'Happy Birthday Dude! 🎉', theme: 'party' },
                { file: 'song2.mp3', title: 'Happy B-Day Jaime! 🎂', theme: 'space' },
                { file: 'song3.mp3', title: 'Yo Jaime, It\'s Your Day! 🎈', theme: 'rainbow' }
            ],
            frequencies: {
                bass: 0,
                mid: 0,
                treble: 0,
                average: 0
            },
            beatDetection: {
                threshold: CONFIG.BEAT_THRESHOLD,
                lastBeat: 0,
                beatCooldown: 200
            }
        };
        
        // Initialize when user interacts
        const initAudio = () => {
            if (!this.audioSystem.isInitialized) {
                this.audioSystem.context = new (window.AudioContext || window.webkitAudioContext)();
                this.audioSystem.analyser = this.audioSystem.context.createAnalyser();
                this.audioSystem.analyser.fftSize = CONFIG.AUDIO_SAMPLES * 2;
                this.audioSystem.dataArray = new Uint8Array(this.audioSystem.analyser.frequencyBinCount);
                
                this.audioSystem.source = this.audioSystem.context.createMediaElementSource(this.audioSystem.audio);
                this.audioSystem.source.connect(this.audioSystem.analyser);
                this.audioSystem.analyser.connect(this.audioSystem.context.destination);
                
                this.audioSystem.isInitialized = true;
                
                // Start playing
                this.playCurrentSong();
            }
        };
        
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
    }
    
    playCurrentSong() {
        const song = this.audioSystem.songs[this.audioSystem.currentSong];
        this.audioSystem.audio.src = song.file;
        this.audioSystem.audio.play().catch(e => console.log('Audio play failed:', e));
        this.showNotification(`Now Playing: ${song.title}`);
        this.applyTheme(song.theme);
    }
    
    nextSong() {
        this.audioSystem.currentSong = (this.audioSystem.currentSong + 1) % this.audioSystem.songs.length;
        this.playCurrentSong();
    }
    
    previousSong() {
        this.audioSystem.currentSong = (this.audioSystem.currentSong - 1 + this.audioSystem.songs.length) % this.audioSystem.songs.length;
        this.playCurrentSong();
    }
    
    analyzeAudio() {
        if (!this.audioSystem.isInitialized || !this.audioSystem.analyser) return;
        
        this.audioSystem.analyser.getByteFrequencyData(this.audioSystem.dataArray);
        
        const bufferLength = this.audioSystem.dataArray.length;
        const bassEnd = Math.floor(bufferLength * 0.1);
        const midEnd = Math.floor(bufferLength * 0.5);
        
        let bass = 0, mid = 0, treble = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const value = this.audioSystem.dataArray[i] / 255;
            if (i < bassEnd) bass += value;
            else if (i < midEnd) mid += value;
            else treble += value;
        }
        
        this.audioSystem.frequencies.bass = bass / bassEnd;
        this.audioSystem.frequencies.mid = mid / (midEnd - bassEnd);
        this.audioSystem.frequencies.treble = treble / (bufferLength - midEnd);
        this.audioSystem.frequencies.average = (bass + mid + treble) / 3 / bufferLength * 10;
        
        // Beat detection
        const currentTime = Date.now();
        if (this.audioSystem.frequencies.bass > this.audioSystem.beatDetection.threshold &&
            currentTime - this.audioSystem.beatDetection.lastBeat > this.audioSystem.beatDetection.beatCooldown) {
            this.audioSystem.beatDetection.lastBeat = currentTime;
            this.onBeatDetected();
        }
    }
    
    onBeatDetected() {
        this.beatDetected = true;
        
        // Camera shake
        const intensity = 0.5;
        this.camera.position.x += (Math.random() - 0.5) * intensity;
        this.camera.position.y += (Math.random() - 0.5) * intensity;
        
        // Flash effect
        const flash = new THREE.PointLight(0xffffff, 10, 100);
        flash.position.copy(this.camera.position);
        this.scene.add(flash);
        
        setTimeout(() => {
            this.scene.remove(flash);
            this.beatDetected = false;
        }, 100);
        
        // Trigger random effect
        const effects = [
            () => this.spawnConfettiBurst(),
            () => this.launchFirework(),
            () => this.pulseColors(),
            () => this.spinCamera()
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
        
        // Combo system
        this.comboCounter++;
        if (this.comboCounter > 10) {
            this.triggerMegaCombo();
            this.comboCounter = 0;
        }
    }
    
    spawnConfettiBurst() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        for (let i = 0; i < 50; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                metalness: 0.8,
                roughness: 0.2
            });
            
            const confetti = new THREE.Mesh(geometry, material);
            confetti.position.copy(this.camera.position);
            confetti.position.y += 5;
            
            // Physics body
            const body = new CANNON.Body({
                mass: 0.1,
                shape: new CANNON.Box(new CANNON.Vec3(0.15, 0.15, 0.05)),
                position: new CANNON.Vec3(confetti.position.x, confetti.position.y, confetti.position.z),
                velocity: new CANNON.Vec3(
                    (Math.random() - 0.5) * 20,
                    Math.random() * 20 + 10,
                    (Math.random() - 0.5) * 20
                )
            });
            
            body.angularVelocity.set(
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10
            );
            
            this.world.add(body);
            confetti.userData.body = body;
            
            this.scene.add(confetti);
            this.confetti.push(confetti);
            
            // Remove after 5 seconds
            setTimeout(() => {
                this.scene.remove(confetti);
                this.world.remove(body);
                const index = this.confetti.indexOf(confetti);
                if (index > -1) this.confetti.splice(index, 1);
            }, 5000);
        }
    }
    
    launchFirework() {
        if (this.fireworks.length >= CONFIG.MAX_FIREWORKS) return;
        
        const firework = new THREE.Group();
        
        // Rocket trail
        const trailGeometry = new THREE.CylinderGeometry(0.1, 0.3, 5);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 2
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        firework.add(trail);
        
        // Launch position
        firework.position.set(
            (Math.random() - 0.5) * 40,
            -10,
            (Math.random() - 0.5) * 40
        );
        
        firework.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 15 + 20,
                (Math.random() - 0.5) * 2
            ),
            exploded: false,
            life: 0
        };
        
        this.scene.add(firework);
        this.fireworks.push(firework);
    }
    
    explodeFirework(firework) {
        const position = firework.position.clone();
        const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
        
        // Create explosion particles
        for (let i = 0; i < 100; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.2),
                new THREE.MeshBasicMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 2,
                    transparent: true
                })
            );
            
            particle.position.copy(position);
            
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            particle.userData = {
                velocity: velocity,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            };
            
            this.scene.add(particle);
            this.effectSystems.push(particle);
        }
        
        // Create explosion light
        const explosionLight = new THREE.PointLight(color, 50, 50);
        explosionLight.position.copy(position);
        this.scene.add(explosionLight);
        
        // Fade out light
        let lightIntensity = 50;
        const fadeLight = setInterval(() => {
            lightIntensity -= 2;
            explosionLight.intensity = lightIntensity;
            if (lightIntensity <= 0) {
                this.scene.remove(explosionLight);
                clearInterval(fadeLight);
            }
        }, 20);
    }
    
    pulseColors() {
        // Pulse all colored lights
        this.lightingSystems.forEach(light => {
            if (light.isPointLight) {
                const originalIntensity = light.intensity;
                light.intensity = originalIntensity * 3;
                setTimeout(() => {
                    light.intensity = originalIntensity;
                }, 200);
            }
        });
    }
    
    spinCamera() {
        const startRotation = this.controls.getAzimuthalAngle();
        const spinDuration = 1000;
        const startTime = Date.now();
        
        const spin = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const eased = this.easeOutCubic(progress);
            
            this.controls.setAzimuthalAngle(startRotation + eased * Math.PI * 2);
            
            if (progress < 1) {
                requestAnimationFrame(spin);
            }
        };
        
        spin();
    }
    
    triggerMegaCombo() {
        this.showNotification('🎆 MEGA COMBO! 🎆');
        
        // Launch multiple fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.launchFirework(), i * 200);
        }
        
        // Massive confetti burst
        this.spawnConfettiBurst();
        this.spawnConfettiBurst();
        
        // Color wave
        const colorWave = setInterval(() => {
            this.scene.fog.color.setHSL(Math.random(), 1, 0.2);
        }, 100);
        
        setTimeout(() => {
            clearInterval(colorWave);
            this.scene.fog.color.set(0x000033);
        }, 2000);
    }
    
    initUISystem() {
        // Create UI container
        const uiContainer = document.createElement('div');
        uiContainer.id = 'ui-container';
        uiContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            color: white;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(50,0,100,0.8));
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            min-width: 300px;
        `;
        
        uiContainer.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 24px; text-shadow: 0 0 10px #ff00ff;">
                🎉 JAIME'S BIRTHDAY CONTROLS 🎉
            </h2>
            
            <div id="music-controls" style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin: 10px 0;">🎵 Music Player</h3>
                <div id="now-playing" style="margin: 10px 0; font-size: 14px; color: #ffff00;"></div>
                <button id="play-pause" class="ui-btn">▶️ Play</button>
                <button id="prev-song" class="ui-btn">⏮️ Previous</button>
                <button id="next-song" class="ui-btn">⏭️ Next</button>
                <button id="shuffle" class="ui-btn">🔀 Shuffle</button>
            </div>
            
            <div id="effect-controls" style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin: 10px 0;">✨ Effects</h3>
                <button id="confetti-btn" class="ui-btn">🎊 Confetti</button>
                <button id="firework-btn" class="ui-btn">🎆 Fireworks</button>
                <button id="cake-btn" class="ui-btn">🎂 Spawn Cake</button>
                <button id="disco-btn" class="ui-btn">🕺 Disco Mode</button>
            </div>
            
            <div id="scene-modes" style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin: 10px 0;">🌟 Scene Modes</h3>
                <select id="mode-select" class="ui-select">
                    <option value="PARTY">🎉 Party Mode</option>
                    <option value="SPACE">🚀 Space Mode</option>
                    <option value="UNDERWATER">🌊 Underwater</option>
                    <option value="CYBERPUNK">🤖 Cyberpunk</option>
                    <option value="RAINBOW">🌈 Rainbow</option>
                    <option value="MATRIX">💻 Matrix</option>
                </select>
            </div>
            
            <div id="intensity-control" style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin: 10px 0;">🎚️ Intensity</h3>
                <input type="range" id="intensity-slider" min="0" max="200" value="100" class="ui-slider">
                <span id="intensity-value">100%</span>
            </div>
            
            <div id="stats" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 12px; color: #aaa;">
                    FPS: <span id="fps">60</span> | 
                    Particles: <span id="particle-count">0</span> |
                    Score: <span id="score">0</span>
                </div>
            </div>
            
            <style>
                .ui-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    margin: 2px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }
                .ui-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }
                .ui-select {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px;
                    border-radius: 10px;
                    width: 100%;
                    font-size: 14px;
                }
                .ui-slider {
                    width: 70%;
                    margin-right: 10px;
                }
            </style>
        `;
        
        document.body.appendChild(uiContainer);
        
        // Notification system
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notifications';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
        `;
        document.body.appendChild(notificationContainer);
        
        this.uiSystem = {
            container: uiContainer,
            notifications: notificationContainer,
            elements: {
                playPause: document.getElementById('play-pause'),
                nowPlaying: document.getElementById('now-playing'),
                intensitySlider: document.getElementById('intensity-slider'),
                intensityValue: document.getElementById('intensity-value'),
                modeSelect: document.getElementById('mode-select'),
                fps: document.getElementById('fps'),
                particleCount: document.getElementById('particle-count'),
                score: document.getElementById('score')
            }
        };
        
        this.initUIEventListeners();
    }
    
    initUIEventListeners() {
        // Music controls
        document.getElementById('play-pause').addEventListener('click', () => {
            if (this.audioSystem.audio.paused) {
                this.audioSystem.audio.play();
                this.uiSystem.elements.playPause.textContent = '⏸️ Pause';
            } else {
                this.audioSystem.audio.pause();
                this.uiSystem.elements.playPause.textContent = '▶️ Play';
            }
        });
        
        document.getElementById('next-song').addEventListener('click', () => this.nextSong());
        document.getElementById('prev-song').addEventListener('click', () => this.previousSong());
        
        document.getElementById('shuffle').addEventListener('click', () => {
            this.audioSystem.currentSong = Math.floor(Math.random() * this.audioSystem.songs.length);
            this.playCurrentSong();
        });
        
        // Effect controls
        document.getElementById('confetti-btn').addEventListener('click', () => this.spawnConfettiBurst());
        document.getElementById('firework-btn').addEventListener('click', () => this.launchFirework());
        document.getElementById('cake-btn').addEventListener('click', () => this.spawnCake());
        document.getElementById('disco-btn').addEventListener('click', () => this.toggleDiscoMode());
        
        // Scene mode
        document.getElementById('mode-select').addEventListener('change', (e) => {
            this.changeSceneMode(e.target.value);
        });
        
        // Intensity slider
        document.getElementById('intensity-slider').addEventListener('input', (e) => {
            this.intensity = e.target.value / 100;
            this.uiSystem.elements.intensityValue.textContent = e.target.value + '%';
        });
        
        // Audio ended event
        this.audioSystem.audio.addEventListener('ended', () => this.nextSong());
    }
    
    initEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case ' ':
                    this.spawnConfettiBurst();
                    break;
                case 'f':
                    this.launchFirework();
                    break;
                case 'c':
                    this.spawnCake();
                    break;
                case 'd':
                    this.toggleDiscoMode();
                    break;
                case 'm':
                    this.audioSystem.audio.muted = !this.audioSystem.audio.muted;
                    break;
                case 'p':
                    this.isPaused = !this.isPaused;
                    break;
                case '1':
                case '2':
                case '3':
                    this.audioSystem.currentSong = parseInt(e.key) - 1;
                    this.playCurrentSong();
                    break;
            }
            
            // Easter egg detection
            this.detectEasterEggs(e.key);
        });
        
        // Mouse interaction
        this.renderer.domElement.addEventListener('click', (e) => {
            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.balloons);
            if (intersects.length > 0) {
                this.popBalloon(intersects[0].object);
            }
        });
    }
    
    detectEasterEggs(key) {
        // Implement easter egg detection
        // Track key sequences for special combos
    }
    
    spawnCake() {
        const cakeGroup = new THREE.Group();
        
        // Cake base
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 2, 32);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b4513,
            metalness: 0.2,
            roughness: 0.5
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        cakeGroup.add(base);
        
        // Frosting
        const frostingGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.5, 32);
        const frostingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffc0cb,
            metalness: 0.1,
            roughness: 0.3,
            clearcoat: 1
        });
        const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
        frosting.position.y = 1.25;
        cakeGroup.add(frosting);
        
        // Candles
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const candleGroup = new THREE.Group();
            
            // Candle stick
            const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
            const candleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candleGroup.add(candle);
            
            // Flame
            const flameGeometry = new THREE.SphereGeometry(0.2);
            const flameMaterial = new THREE.MeshBasicMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                emissiveIntensity: 2
            });
            const flame = new THREE.Mesh(flameGeometry, flameMaterial);
            flame.position.y = 0.7;
            candleGroup.add(flame);
            
            // Light from candle
            const candleLight = new THREE.PointLight(0xff6600, 1, 5);
            candleLight.position.y = 0.7;
            candleGroup.add(candleLight);
            
            candleGroup.position.set(
                Math.cos(angle) * 2,
                2,
                Math.sin(angle) * 2
            );
            
            cakeGroup.add(candleGroup);
        }
        
        // Position cake
        cakeGroup.position.set(
            (Math.random() - 0.5) * 20,
            10,
            (Math.random() - 0.5) * 20
        );
        
        // Physics
        const body = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Box(new CANNON.Vec3(3, 2, 3)),
            position: new CANNON.Vec3(cakeGroup.position.x, cakeGroup.position.y, cakeGroup.position.z)
        });
        
        this.world.add(body);
        cakeGroup.userData.body = body;
        
        this.scene.add(cakeGroup);
        this.cakes.push(cakeGroup);
        
        this.showNotification('🎂 Birthday Cake Spawned! 🎂');
    }
    
    toggleDiscoMode() {
        this.discoMode = !this.discoMode;
        
        if (this.discoMode) {
            this.showNotification('🕺 DISCO MODE ACTIVATED! 💃');
            
            // Create disco ball
            const discoGeometry = new THREE.SphereGeometry(3, 32, 32);
            const discoMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 1,
                roughness: 0,
                envMapIntensity: 2
            });
            
            this.discoBall = new THREE.Mesh(discoGeometry, discoMaterial);
            this.discoBall.position.y = 20;
            this.scene.add(this.discoBall);
            
            // Disco lights
            this.discoLights = [];
            for (let i = 0; i < 8; i++) {
                const light = new THREE.SpotLight(
                    new THREE.Color().setHSL(Math.random(), 1, 0.5),
                    2,
                    50,
                    Math.PI / 4,
                    0.5
                );
                light.position.copy(this.discoBall.position);
                light.target.position.set(
                    Math.random() * 40 - 20,
                    0,
                    Math.random() * 40 - 20
                );
                this.scene.add(light);
                this.scene.add(light.target);
                this.discoLights.push(light);
            }
        } else {
            this.showNotification('Disco Mode Deactivated');
            
            if (this.discoBall) {
                this.scene.remove(this.discoBall);
                this.discoBall = null;
            }
            
            if (this.discoLights) {
                this.discoLights.forEach(light => {
                    this.scene.remove(light);
                    this.scene.remove(light.target);
                });
                this.discoLights = [];
            }
        }
    }
    
    popBalloon(balloon) {
        // Particle explosion
        const position = balloon.position.clone();
        const color = balloon.material.color;
        
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: color })
            );
            
            particle.position.copy(position);
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 5,
                    Math.random() * 5,
                    (Math.random() - 0.5) * 5
                ),
                life: 1.0
            };
            
            this.scene.add(particle);
            this.effectSystems.push(particle);
        }
        
        // Remove balloon
        this.scene.remove(balloon);
        const index = this.balloons.indexOf(balloon);
        if (index > -1) this.balloons.splice(index, 1);
        
        // Score
        this.score += 10;
        this.showNotification('+10 Points! 🎈');
    }
    
    changeSceneMode(mode) {
        this.currentMode = mode;
        this.showNotification(`Scene Mode: ${mode}`);
        
        // Apply mode-specific changes
        switch(mode) {
            case 'SPACE':
                this.scene.fog = new THREE.FogExp2(0x000011, 0.002);
                this.renderer.toneMappingExposure = 0.8;
                break;
            case 'UNDERWATER':
                this.scene.fog = new THREE.FogExp2(0x006688, 0.01);
                this.renderer.toneMappingExposure = 0.6;
                break;
            case 'CYBERPUNK':
                this.scene.fog = new THREE.FogExp2(0x110022, 0.005);
                this.renderer.toneMappingExposure = 1.5;
                break;
            case 'RAINBOW':
                this.scene.fog = new THREE.FogExp2(0x330066, 0.003);
                this.renderer.toneMappingExposure = 1.8;
                break;
            case 'MATRIX':
                this.scene.fog = new THREE.FogExp2(0x001100, 0.008);
                this.renderer.toneMappingExposure = 1.0;
                break;
            default:
                this.scene.fog = new THREE.FogExp2(0x000033, 0.008);
                this.renderer.toneMappingExposure = 1.2;
        }
    }
    
    applyTheme(theme) {
        // Theme-specific visual changes
        switch(theme) {
            case 'space':
                this.changeSceneMode('SPACE');
                break;
            case 'rainbow':
                this.changeSceneMode('RAINBOW');
                break;
            default:
                this.changeSceneMode('PARTY');
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9));
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            backdrop-filter: blur(10px);
        `;
        notification.textContent = message;
        
        this.uiSystem.notifications.appendChild(notification);
        
        setTimeout(() => {
            this.uiSystem.notifications.removeChild(notification);
        }, 3000);
    }
    
    updatePhysics() {
        if (!this.world) return;
        
        this.world.step(1/60);
        
        // Update confetti positions
        this.confetti.forEach(confetti => {
            if (confetti.userData.body) {
                confetti.position.copy(confetti.userData.body.position);
                confetti.quaternion.copy(confetti.userData.body.quaternion);
            }
        });
        
        // Update cakes
        this.cakes.forEach(cake => {
            if (cake.userData.body) {
                cake.position.copy(cake.userData.body.position);
                cake.quaternion.copy(cake.userData.body.quaternion);
            }
        });
    }
    
    updateAnimations() {
        // Update main titles
        if (this.mainTitle) {
            this.mainTitle.rotation.y = Math.sin(this.elapsedTime) * 0.1;
            this.mainTitle.position.y = 15 + Math.sin(this.elapsedTime * 2) * 0.5;
            this.mainTitle.material.uniforms.time.value = this.elapsedTime;
        }
        
        if (this.nameTitle) {
            this.nameTitle.rotation.y = -Math.sin(this.elapsedTime * 0.8) * 0.1;
            this.nameTitle.position.y = 8 + Math.cos(this.elapsedTime * 1.5) * 0.3;
        }
        
        // Update galaxies
        this.galaxies.forEach(galaxy => {
            galaxy.rotation.y += 0.001;
            galaxy.material.uniforms.time.value = this.elapsedTime;
        });
        
        // Update particle systems
        this.particleSystems.forEach(system => {
            system.rotation.y += 0.002;
            
            if (system.material.uniforms) {
                system.material.uniforms.time.value = this.elapsedTime;
                system.material.uniforms.audioLevel.value = this.audioSystem.frequencies.average;
                system.material.uniforms.beatPulse.value = this.beatDetected ? 1 : 0;
            }
        });
        
        // Update balloons
        this.balloons.forEach(balloon => {
            const userData = balloon.userData;
            balloon.position.y += Math.sin(this.elapsedTime * userData.floatSpeed + userData.floatOffset) * 0.05;
            balloon.rotation.y += userData.rotationSpeed;
            
            // Wave motion
            const waveAngle = this.elapsedTime * 0.5 + userData.wave * 0.5;
            balloon.position.x += Math.sin(waveAngle) * 0.02;
            balloon.position.z += Math.cos(waveAngle) * 0.02;
        });
        
        // Update ribbons
        this.ribbons.forEach((ribbon, i) => {
            ribbon.rotation.x += 0.005;
            ribbon.rotation.y += 0.003;
            ribbon.position.y += Math.sin(this.elapsedTime + i) * 0.05;
            
            if (ribbon.material.uniforms) {
                ribbon.material.uniforms.time.value = this.elapsedTime;
            }
        });
        
        // Update fireworks
        this.fireworks.forEach((firework, index) => {
            if (!firework.userData.exploded) {
                firework.position.add(firework.userData.velocity);
                firework.userData.velocity.y -= 0.5; // Gravity
                
                if (firework.userData.velocity.y < 0 || firework.userData.life++ > 60) {
                    this.explodeFirework(firework);
                    firework.userData.exploded = true;
                    this.scene.remove(firework);
                    this.fireworks.splice(index, 1);
                }
            }
        });
        
        // Update floating islands
        this.effectSystems.forEach(system => {
            if (system.userData && system.userData.floatSpeed) {
                system.position.y += Math.sin(this.elapsedTime * system.userData.floatSpeed) * 0.02;
                system.rotation.y += system.userData.rotationSpeed;
                
                if (system.userData.crystal) {
                    system.userData.crystal.rotation.y += 0.02;
                }
                
                if (system.userData.aura) {
                    system.userData.aura.rotation.y -= 0.01;
                }
            }
            
            // Update explosion particles
            if (system.userData && system.userData.velocity) {
                system.position.add(system.userData.velocity);
                system.userData.velocity.multiplyScalar(0.95); // Drag
                system.userData.velocity.y -= 0.1; // Gravity
                
                system.userData.life -= system.userData.decay;
                system.material.opacity = system.userData.life;
                
                if (system.userData.life <= 0) {
                    this.scene.remove(system);
                    const index = this.effectSystems.indexOf(system);
                    if (index > -1) this.effectSystems.splice(index, 1);
                }
            }
        });
        
        // Update magical floor
        if (this.magicalFloor) {
            this.magicalFloor.material.uniforms.time.value = this.elapsedTime;
            this.magicalFloor.material.uniforms.audioLevel.value = this.audioSystem.frequencies.bass;
        }
        
        // Update disco mode
        if (this.discoMode && this.discoBall) {
            this.discoBall.rotation.y += 0.02;
            
            this.discoLights.forEach((light, i) => {
                const angle = this.elapsedTime * 2 + (i / this.discoLights.length) * Math.PI * 2;
                light.target.position.x = Math.cos(angle) * 20;
                light.target.position.z = Math.sin(angle) * 20;
                
                // Change colors on beat
                if (this.beatDetected) {
                    light.color.setHSL(Math.random(), 1, 0.5);
                }
            });
        }
        
        // Update lighting systems
        this.lightingSystems.forEach((light, i) => {
            if (light.isPointLight) {
                const angle = this.elapsedTime + (i / this.lightingSystems.length) * Math.PI * 2;
                light.position.x = Math.cos(angle) * 30;
                light.position.z = Math.sin(angle) * 30;
                light.position.y = 10 + Math.sin(angle * 2) * 5;
            }
            
            if (light.isSpotLight && i > 0) {
                light.position.x += Math.sin(this.elapsedTime * 2 + i) * 0.1;
                light.position.z += Math.cos(this.elapsedTime * 2 + i) * 0.1;
            }
        });
        
        // Update chromatic aberration
        if (this.chromaticPass) {
            this.chromaticPass.uniforms.time.value = this.elapsedTime;
            this.chromaticPass.uniforms.amount.value = 0.002 * this.intensity + this.audioSystem.frequencies.bass * 0.005;
        }
    }
    
    updateUI() {
        // Update FPS
        const fps = Math.round(1 / this.deltaTime);
        this.uiSystem.elements.fps.textContent = fps;
        
        // Update particle count
        let particleCount = this.confetti.length + this.fireworks.length;
        this.particleSystems.forEach(system => {
            if (system.geometry.attributes.position) {
                particleCount += system.geometry.attributes.position.count;
            }
        });
        this.uiSystem.elements.particleCount.textContent = particleCount;
        
        // Update score
        this.uiSystem.elements.score.textContent = this.score;
        
        // Update now playing
        if (this.audioSystem.songs[this.audioSystem.currentSong]) {
            this.uiSystem.elements.nowPlaying.textContent = 
                `Now Playing: ${this.audioSystem.songs[this.audioSystem.currentSong].title}`;
        }
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    animate() {
        if (!this.isPaused) {
            requestAnimationFrame(() => this.animate());
            
            this.deltaTime = this.clock.getDelta();
            this.elapsedTime = this.clock.getElapsedTime();
            
            // Update all systems
            this.analyzeAudio();
            this.updatePhysics();
            this.updateAnimations();
            this.updateUI();
            
            // Update controls
            this.controls.update();
            
            // Apply intensity
            this.composer.passes.forEach(pass => {
                if (pass instanceof UnrealBloomPass) {
                    pass.strength = 2.0 * this.intensity;
                }
            });
            
            // Render
            this.composer.render();
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize the ultimate experience
window.addEventListener('DOMContentLoaded', () => {
    const scene = new UltimateBirthdayScene();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        body {
            margin: 0;
            overflow: hidden;
            background: black;
        }
        
        canvas {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎉🎂🎈 JAIME\'S ULTIMATE BIRTHDAY EXPERIENCE LOADED! 🎈🎂🎉');
    console.log('Press SPACE for confetti, F for fireworks, C for cake, D for disco mode!');
    console.log('Use number keys 1-3 to switch songs!');
});

export default UltimateBirthdayScene;
