// Advanced Particle Systems
let sparkleSystem;
let magicDustSystem;
let heartParticles = [];
let sparklers = [];

function initParticles() {
    createSparkleSystem();
    createMagicDustSystem();
    createHeartParticles();
    createSparklers();
}

function createSparkleSystem() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random position
        positions[i3] = (Math.random() - 0.5) * 50;
        positions[i3 + 1] = Math.random() * 30;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;
        
        // Random color (golden sparkles)
        const hue = 0.1 + Math.random() * 0.1; // Golden range
        const color = new THREE.Color();
        color.setHSL(hue, 1, 0.5 + Math.random() * 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Random size
        sizes[i] = Math.random() * 0.5 + 0.1;
        
        // Random velocity
        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: Math.random() * 0.05 + 0.01,
            z: (Math.random() - 0.5) * 0.1
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    
    sparkleSystem = new THREE.Points(geometry, material);
    sparkleSystem.userData.velocities = velocities;
    scene.add(sparkleSystem);
}

function createMagicDustSystem() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 20;
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.random() * 15;
        positions[i3 + 2] = Math.sin(angle) * radius;
        
        // Rainbow colors
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        phases[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    magicDustSystem = new THREE.Points(geometry, material);
    magicDustSystem.userData.phases = phases;
    scene.add(magicDustSystem);
}

function createHeartParticles() {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.2, x + 0.1, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.5, y + 0.95);
    heartShape.bezierCurveTo(x + 1.1, y + 0.77, x + 1.3, y + 0.55, x + 1.3, y + 0.35);
    heartShape.bezierCurveTo(x + 1.3, y + 0.35, x + 1.3, y, x + 1, y);
    heartShape.bezierCurveTo(x + 0.9, y, x + 0.5, y + 0.2, x + 0.5, y + 0.5);
    
    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    
    for (let i = 0; i < 20; i++) {
        const heartMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.95, 1, 0.5 + Math.random() * 0.3),
            emissive: 0xff0066,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 30
        );
        heart.rotation.z = Math.random() * Math.PI * 2;
        heart.scale.set(0.5, 0.5, 0.5);
        
        scene.add(heart);
        heartParticles.push({
            mesh: heart,
            velocity: {
                x: (Math.random() - 0.5) * 0.05,
                y: Math.random() * 0.02 - 0.01,
                z: (Math.random() - 0.5) * 0.05
            },
            rotationSpeed: Math.random() * 0.05
        });
    }
}

function createSparklers() {
    for (let i = 0; i < 4; i++) {
        const sparklerGroup = new THREE.Group();
        const angle = (i / 4) * Math.PI * 2;
        
        // Sparkler stick
        const stickGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const stickMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
        const stick = new THREE.Mesh(stickGeometry, stickMaterial);
        sparklerGroup.add(stick);
        
        // Sparkler particles
        const sparkCount = 50;
        const sparkGeometry = new THREE.BufferGeometry();
        const sparkPositions = new Float32Array(sparkCount * 3);
        const sparkColors = new Float32Array(sparkCount * 3);
        
        for (let j = 0; j < sparkCount; j++) {
            const j3 = j * 3;
            sparkPositions[j3] = (Math.random() - 0.5) * 0.5;
            sparkPositions[j3 + 1] = 1.5 + Math.random() * 0.5;
            sparkPositions[j3 + 2] = (Math.random() - 0.5) * 0.5;
            
            const color = new THREE.Color();
            color.setHSL(0.1, 1, 0.8); // Bright yellow
            sparkColors[j3] = color.r;
            sparkColors[j3 + 1] = color.g;
            sparkColors[j3 + 2] = color.b;
        }
        
        sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
        sparkGeometry.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));
        
        const sparkMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
        sparklerGroup.add(sparks);
        
        sparklerGroup.position.set(
            Math.cos(angle) * 10,
            2,
            Math.sin(angle) * 10
        );
        
        scene.add(sparklerGroup);
        sparklers.push({
            group: sparklerGroup,
            sparks: sparks,
            angle: angle
        });
    }
}

function createRainbowTrail(x, y, z) {
    const trailCount = 30;
    const trail = [];
    
    for (let i = 0; i < trailCount; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.1 + i * 0.02);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / trailCount, 1, 0.5),
            transparent: true,
            opacity: 1 - (i / trailCount)
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
            x + (Math.random() - 0.5) * i * 0.1,
            y - i * 0.2,
            z + (Math.random() - 0.5) * i * 0.1
        );
        
        scene.add(sphere);
        trail.push(sphere);
        
        // Fade out and remove
        gsap.to(sphere.material, {
            opacity: 0,
            duration: 2,
            delay: i * 0.05,
            onComplete: () => {
                scene.remove(sphere);
            }
        });
        
        gsap.to(sphere.position, {
            y: sphere.position.y - 2,
            duration: 2,
            ease: "power2.in"
        });
    }
}

function createMagicExplosion(x, y, z) {
    const particleCount = 200;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 0.2 + 0.05;
        const geometry = new THREE.SphereGeometry(size);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
            transparent: true,
            opacity: 1,
            emissive: new THREE.Color().setHSL(Math.random(), 1, 0.6),
            emissiveIntensity: 2
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            Math.random() * 15,
            (Math.random() - 0.5) * 20
        );
        
        scene.add(particle);
        particles.push({ mesh: particle, velocity: velocity });
    }
    
    // Animate explosion
    const animateExplosion = () => {
        let allDone = true;
        
        particles.forEach(p => {
            if (p.mesh.material.opacity > 0) {
                allDone = false;
                p.mesh.position.add(p.velocity.clone().multiplyScalar(0.05));
                p.velocity.y -= 0.3; // gravity
                p.mesh.material.opacity -= 0.02;
                p.mesh.rotation.x += 0.1;
                p.mesh.rotation.y += 0.1;
            }
        });
        
        if (!allDone) {
            requestAnimationFrame(animateExplosion);
        } else {
            particles.forEach(p => scene.remove(p.mesh));
        }
    };
    
    animateExplosion();
}

function updateParticles() {
    const time = Date.now() * 0.001;
    
    // Update sparkle system
    if (sparkleSystem) {
        const positions = sparkleSystem.geometry.attributes.position.array;
        const velocities = sparkleSystem.userData.velocities;
        
        for (let i = 0; i < velocities.length; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;
            
            // Reset particles that go too high
            if (positions[i3 + 1] > 30) {
                positions[i3 + 1] = 0;
                positions[i3] = (Math.random() - 0.5) * 50;
                positions[i3 + 2] = (Math.random() - 0.5) * 50;
            }
        }
        
        sparkleSystem.geometry.attributes.position.needsUpdate = true;
        sparkleSystem.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }
    
    // Update magic dust
    if (magicDustSystem) {
        const positions = magicDustSystem.geometry.attributes.position.array;
        const phases = magicDustSystem.userData.phases;
        
        for (let i = 0; i < phases.length; i++) {
            const i3 = i * 3;
            const phase = phases[i];
            
            // Circular motion
            const angle = time + phase;
            const radius = 10 + Math.sin(angle * 2) * 5;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = positions[i3 + 1] + Math.sin(angle * 3) * 0.02;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // Reset height if too high
            if (positions[i3 + 1] > 20) {
                positions[i3 + 1] = 0;
            }
        }
        
        magicDustSystem.geometry.attributes.position.needsUpdate = true;
        magicDustSystem.rotation.y += 0.001;
    }
    
    // Update hearts
    heartParticles.forEach(heart => {
        heart.mesh.position.x += heart.velocity.x;
        heart.mesh.position.y += heart.velocity.y;
        heart.mesh.position.z += heart.velocity.z;
        heart.mesh.rotation.z += heart.rotationSpeed;
        
        // Pulse effect
        const scale = 0.5 + Math.sin(time * 3 + heart.mesh.position.x) * 0.1;
        heart.mesh.scale.set(scale, scale, scale);
        
        // Wrap around
        if (heart.mesh.position.y < -5) {
            heart.mesh.position.y = 25;
        }
        if (Math.abs(heart.mesh.position.x) > 20) {
            heart.mesh.position.x *= -0.9;
        }
        if (Math.abs(heart.mesh.position.z) > 20) {
            heart.mesh.position.z *= -0.9;
        }
    });
    
    // Update sparklers
    sparklers.forEach(sparkler => {
        sparkler.group.rotation.y += 0.02;
        
        // Update sparkler particles
        const positions = sparkler.sparks.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = (Math.random() - 0.5) * 0.5;
            positions[i + 1] = 1.5 + Math.random() * 0.5;
            positions[i + 2] = (Math.random() - 0.5) * 0.5;
        }
        sparkler.sparks.geometry.attributes.position.needsUpdate = true;
        
        // Flicker effect
        sparkler.sparks.material.opacity = 0.7 + Math.random() * 0.3;
    });
}

// Special effects triggers
document.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
        case 'm':
            // Magic explosion at random position
            createMagicExplosion(
                (Math.random() - 0.5) * 20,
                10,
                (Math.random() - 0.5) * 20
            );
            break;
        case 't':
            // Rainbow trail
            createRainbowTrail(
                (Math.random() - 0.5) * 10,
                15,
                (Math.random() - 0.5) * 10
            );
            break;
    }
});
