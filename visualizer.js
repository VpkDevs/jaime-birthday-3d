// Music Visualizer with Web Audio API
let audioContext;
let analyser;
let dataArray;
let bufferLength;
let source;
let isVisualizerActive = false;

// Frequency bands for different visual effects
let bass = 0;
let midRange = 0;
let treble = 0;
let avgVolume = 0;

// Smoothing values for animations
let smoothBass = 0;
let smoothMid = 0;
let smoothTreble = 0;
let smoothVolume = 0;

// Beat detection
let beatDetected = false;
let lastBeatTime = 0;
let beatThreshold = 0.3;
let beatDecay = 0.98;
let beatMin = 0.15;
let beatHoldTime = 60;
let beatLevel = 0;

function initVisualizer() {
    const audio = document.getElementById('birthday-music');
    
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create analyser node
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // Increased for better frequency resolution
    analyser.smoothingTimeConstant = 0.8;
    
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    // Connect audio element to analyser
    if (!source) {
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
    
    isVisualizerActive = true;
    
    // Start the visualization loop
    visualizerLoop();
}

function visualizerLoop() {
    if (!isVisualizerActive) return;
    
    requestAnimationFrame(visualizerLoop);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate frequency bands
    calculateFrequencyBands();
    
    // Detect beats
    detectBeat();
    
    // Apply visualizations
    applyMusicVisualization();
}

function calculateFrequencyBands() {
    // Bass: 20-250 Hz (roughly first 10% of spectrum)
    let bassSum = 0;
    const bassEnd = Math.floor(bufferLength * 0.1);
    for (let i = 0; i < bassEnd; i++) {
        bassSum += dataArray[i];
    }
    bass = bassSum / (bassEnd * 255); // Normalize to 0-1
    
    // Mid-range: 250-2000 Hz (roughly 10-40% of spectrum)
    let midSum = 0;
    const midStart = bassEnd;
    const midEnd = Math.floor(bufferLength * 0.4);
    for (let i = midStart; i < midEnd; i++) {
        midSum += dataArray[i];
    }
    midRange = midSum / ((midEnd - midStart) * 255);
    
    // Treble: 2000-20000 Hz (roughly 40-100% of spectrum)
    let trebleSum = 0;
    const trebleStart = midEnd;
    for (let i = trebleStart; i < bufferLength; i++) {
        trebleSum += dataArray[i];
    }
    treble = trebleSum / ((bufferLength - trebleStart) * 255);
    
    // Overall volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    avgVolume = sum / (bufferLength * 255);
    
    // Smooth the values for less jittery animations
    smoothBass = smoothBass * 0.7 + bass * 0.3;
    smoothMid = smoothMid * 0.7 + midRange * 0.3;
    smoothTreble = smoothTreble * 0.7 + treble * 0.3;
    smoothVolume = smoothVolume * 0.8 + avgVolume * 0.2;
}

function detectBeat() {
    const currentTime = Date.now();
    
    // Simple beat detection based on bass energy
    if (bass > beatThreshold && bass > beatLevel && currentTime - lastBeatTime > beatHoldTime) {
        beatDetected = true;
        lastBeatTime = currentTime;
        beatLevel = bass;
        onBeat();
    } else {
        beatDetected = false;
    }
    
    // Decay beat level
    beatLevel *= beatDecay;
    beatLevel = Math.max(beatLevel, beatMin);
    
    // Adjust threshold dynamically
    beatThreshold = beatLevel * 1.5 + 0.15;
}

function onBeat() {
    // Trigger visual effects on beat
    
    // Flash effect
    createBeatFlash();
    
    // Spawn confetti on strong beats
    if (bass > 0.6 && typeof createConfettiBurst !== 'undefined') {
        // Small confetti burst
        const confettiCount = Math.floor(bass * 20);
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                if (typeof createPhysicsBall !== 'undefined') {
                    createPhysicsBall(
                        (Math.random() - 0.5) * 10,
                        15,
                        (Math.random() - 0.5) * 10
                    );
                }
            }, i * 10);
        }
    }
    
    // Camera shake on beat
    if (camera) {
        const intensity = bass * 0.5;
        const originalPos = camera.position.clone();
        gsap.to(camera.position, {
            x: originalPos.x + (Math.random() - 0.5) * intensity,
            y: originalPos.y + (Math.random() - 0.5) * intensity,
            z: originalPos.z + (Math.random() - 0.5) * intensity,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}

function createBeatFlash() {
    // Create a flash effect on beat
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = `radial-gradient(circle, rgba(255,255,255,${bass * 0.3}) 0%, transparent 70%)`;
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9999';
    document.body.appendChild(flash);
    
    gsap.to(flash, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => flash.remove()
    });
}

function applyMusicVisualization() {
    if (!scene) return;
    
    // Scale birthday text based on bass
    if (birthdayText) {
        const baseScale = 1;
        const scaleBoost = smoothBass * 0.3;
        birthdayText.scale.set(
            baseScale + scaleBoost,
            baseScale + scaleBoost,
            baseScale + scaleBoost
        );
        
        // Rotate based on mid frequencies
        birthdayText.rotation.y += smoothMid * 0.05;
        
        // Color change based on treble
        const hue = (smoothTreble + time * 0.1) % 1;
        birthdayText.material.color.setHSL(hue, 1, 0.5 + smoothTreble * 0.5);
    }
    
    // Scale name text based on mid-range
    if (nameText) {
        const baseScale = 1;
        const scaleBoost = smoothMid * 0.4;
        nameText.scale.set(
            baseScale + scaleBoost,
            baseScale + scaleBoost,
            baseScale + scaleBoost
        );
        
        // Pulse emissive intensity
        nameText.material.emissiveIntensity = 0.4 + smoothBass * 0.6;
    }
    
    // Animate balloons based on frequencies
    balloons.forEach((balloon, i) => {
        if (balloon) {
            // Bounce balloons on bass
            const bounceHeight = smoothBass * 2;
            balloon.position.y += Math.sin(time * 2 + i) * bounceHeight * 0.1;
            
            // Rotate on treble
            balloon.rotation.y += smoothTreble * 0.1;
            balloon.rotation.x = Math.sin(time + i) * smoothMid * 0.5;
            
            // Scale balloon based on volume
            const scale = 1 + smoothVolume * 0.3;
            balloon.scale.set(scale, scale, scale);
        }
    });
    
    // Animate lights intensity and color
    scene.traverse((child) => {
        if (child.isLight && child.type === 'PointLight') {
            // Pulse light intensity with bass
            child.intensity = 0.5 + smoothBass * 1.5;
            
            // Change light colors based on frequencies
            const hue = (smoothMid + smoothTreble) * 0.5;
            child.color.setHSL(hue, 1, 0.5);
        }
    });
    
    // Particle system reactions
    if (sparkleSystem) {
        // Make particles dance
        sparkleSystem.rotation.y += smoothMid * 0.02;
        sparkleSystem.rotation.x = Math.sin(time) * smoothTreble * 0.3;
        
        // Adjust particle size
        sparkleSystem.material.size = 0.3 + smoothBass * 0.5;
        
        // Brightness based on volume
        sparkleSystem.material.opacity = 0.5 + smoothVolume * 0.5;
    }
    
    if (magicDustSystem) {
        // Swirl magic dust faster with treble
        magicDustSystem.rotation.y += smoothTreble * 0.05;
        magicDustSystem.rotation.z = Math.sin(time * 2) * smoothMid * 0.5;
        
        // Expand/contract based on bass
        const scale = 1 + smoothBass * 0.5;
        magicDustSystem.scale.set(scale, scale, scale);
    }
    
    // Heart particles pulse with bass
    heartParticles.forEach((heart, i) => {
        if (heart.mesh) {
            const basePulse = 0.5 + smoothBass * 0.8;
            const phase = time * 3 + i * 0.5;
            const scale = basePulse + Math.sin(phase) * smoothMid * 0.2;
            heart.mesh.scale.set(scale, scale, scale);
            
            // Speed up rotation with treble
            heart.mesh.rotation.z += smoothTreble * 0.1;
            
            // Glow effect
            if (heart.mesh.material) {
                heart.mesh.material.emissiveIntensity = 0.3 + smoothBass * 0.7;
            }
        }
    });
    
    // Sparklers intensity
    sparklers.forEach(sparkler => {
        if (sparkler.sparks) {
            sparkler.sparks.material.size = 0.1 + smoothTreble * 0.2;
            sparkler.sparks.material.opacity = 0.7 + smoothVolume * 0.3;
            
            // Rotate sparkler groups
            sparkler.group.rotation.y += smoothMid * 0.03;
        }
    });
    
    // Camera effects
    if (controls) {
        // Auto-rotate speed based on mid frequencies
        controls.autoRotateSpeed = 0.5 + smoothMid * 2;
        
        // Zoom based on bass (subtle)
        const targetZoom = 20 - smoothBass * 3;
        camera.position.z += (targetZoom - camera.position.z) * 0.05;
    }
    
    // Ground plane effects
    const ground = scene.getObjectByProperty('receiveShadow', true);
    if (ground && ground.material) {
        // Pulse ground color
        const hue = (smoothBass + smoothMid + time * 0.05) % 1;
        ground.material.color.setHSL(hue, 0.5, 0.2 + smoothVolume * 0.1);
        ground.material.metalness = 0.8 + smoothTreble * 0.2;
    }
    
    // Ribbon reactions
    scene.traverse((child) => {
        if (child.geometry && child.geometry.type === 'TubeGeometry') {
            // Ribbons wave with music
            child.rotation.x += smoothMid * 0.02;
            child.rotation.y += smoothTreble * 0.03;
            
            // Color shift
            if (child.material) {
                const hue = (smoothVolume + time * 0.1) % 1;
                child.material.color.setHSL(hue, 1, 0.5);
            }
        }
    });
    
    // Cakes spin faster with music
    cakes.forEach(cake => {
        cake.rotation.y += smoothMid * 0.1;
        
        // Bounce cakes
        const bounce = Math.sin(time * 5) * smoothBass * 0.5;
        cake.position.y = bounce;
    });
    
    // Create trailing particles on high energy
    if (smoothVolume > 0.7 && Math.random() < 0.1) {
        createMusicParticle();
    }
    
    // Fireworks on high treble peaks
    if (smoothTreble > 0.8 && Math.random() < 0.02) {
        createFireworks(
            (Math.random() - 0.5) * 30,
            15,
            (Math.random() - 0.5) * 30
        );
    }
}

function createMusicParticle() {
    // Create particles that react to music
    const geometry = new THREE.SphereGeometry(0.1 + smoothBass * 0.2);
    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        transparent: true,
        opacity: 1
    });
    
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 20,
        (Math.random() - 0.5) * 40
    );
    
    scene.add(particle);
    
    // Animate and remove
    gsap.to(particle.position, {
        y: particle.position.y + 10,
        duration: 2 + smoothMid * 2,
        ease: "power2.out"
    });
    
    gsap.to(particle.material, {
        opacity: 0,
        duration: 2,
        onComplete: () => scene.remove(particle)
    });
    
    gsap.to(particle.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.in"
    });
}

// Visualization presets
function setVisualizationPreset(preset) {
    switch(preset) {
        case 'intense':
            beatThreshold = 0.2;
            analyser.smoothingTimeConstant = 0.6;
            break;
        case 'smooth':
            beatThreshold = 0.4;
            analyser.smoothingTimeConstant = 0.9;
            break;
        case 'responsive':
            beatThreshold = 0.25;
            analyser.smoothingTimeConstant = 0.7;
            break;
    }
}

// Export visualizer data for other modules
window.getVisualizerData = function() {
    return {
        bass: smoothBass,
        mid: smoothMid,
        treble: smoothTreble,
        volume: smoothVolume,
        beatDetected: beatDetected,
        rawBass: bass,
        rawMid: midRange,
        rawTreble: treble
    };
};

// Stop visualizer
function stopVisualizer() {
    isVisualizerActive = false;
    if (audioContext) {
        audioContext.close();
    }
}
