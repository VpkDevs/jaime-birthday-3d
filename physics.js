// Physics with Cannon.js
let world;
let physicsBodies = [];
let confetti = [];

function initPhysics() {
    // Create physics world
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    
    // Add ground physics
    const groundShape = new CANNON.Box(new CANNON.Vec3(50, 0.1, 50));
    const groundBody = new CANNON.Body({
        mass: 0, // Static body
        shape: groundShape,
        position: new CANNON.Vec3(0, -2, 0)
    });
    world.add(groundBody);
}

function createConfettiBurst() {
    const confettiCount = 100;
    const colors = [
        0xff0088, 0x00ff88, 0x8800ff, 
        0xffff00, 0xff00ff, 0x00ffff,
        0xff4444, 0x44ff44, 0x4444ff
    ];
    
    for (let i = 0; i < confettiCount; i++) {
        // Create visual confetti
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            shininess: 100,
            side: THREE.DoubleSide
        });
        const confettiMesh = new THREE.Mesh(geometry, material);
        confettiMesh.castShadow = true;
        confettiMesh.receiveShadow = true;
        
        // Random starting position above the scene
        confettiMesh.position.set(
            (Math.random() - 0.5) * 10,
            10 + Math.random() * 5,
            (Math.random() - 0.5) * 10
        );
        
        // Random rotation
        confettiMesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        scene.add(confettiMesh);
        
        // Create physics body
        const shape = new CANNON.Box(new CANNON.Vec3(0.05, 0.05, 0.025));
        const body = new CANNON.Body({
            mass: 0.01,
            shape: shape,
            position: new CANNON.Vec3(
                confettiMesh.position.x,
                confettiMesh.position.y,
                confettiMesh.position.z
            ),
            velocity: new CANNON.Vec3(
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 5,
                (Math.random() - 0.5) * 10
            ),
            angularVelocity: new CANNON.Vec3(
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10
            )
        });
        
        world.add(body);
        
        confetti.push({
            mesh: confettiMesh,
            body: body,
            lifeTime: 5
        });
    }
    
    // Clean up old confetti after some time
    setTimeout(() => {
        confetti.forEach(item => {
            scene.remove(item.mesh);
            world.remove(item.body);
        });
        confetti = [];
    }, 10000);
}

function createPhysicsBall(x, y, z) {
    // Visual ball
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        shininess: 100
    });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballMesh.position.set(x, y, z);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    scene.add(ballMesh);
    
    // Physics ball
    const ballShape = new CANNON.Sphere(0.5);
    const ballBody = new CANNON.Body({
        mass: 1,
        shape: ballShape,
        position: new CANNON.Vec3(x, y, z)
    });
    ballBody.velocity.set(
        (Math.random() - 0.5) * 5,
        0,
        (Math.random() - 0.5) * 5
    );
    world.add(ballBody);
    
    physicsBodies.push({
        mesh: ballMesh,
        body: ballBody
    });
}

function createPhysicsBox(x, y, z, width, height, depth) {
    // Visual box
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        shininess: 50
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x, y, z);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    scene.add(boxMesh);
    
    // Physics box
    const boxShape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
    const boxBody = new CANNON.Body({
        mass: 0.5,
        shape: boxShape,
        position: new CANNON.Vec3(x, y, z)
    });
    boxBody.angularVelocity.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
    );
    world.add(boxBody);
    
    physicsBodies.push({
        mesh: boxMesh,
        body: boxBody
    });
}

function createDominoEffect() {
    const dominoCount = 20;
    const dominoSpacing = 1.5;
    
    for (let i = 0; i < dominoCount; i++) {
        const angle = (i / dominoCount) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Visual domino
        const dominoGeometry = new THREE.BoxGeometry(0.2, 2, 1);
        const dominoMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(i / dominoCount, 1, 0.5)
        });
        const dominoMesh = new THREE.Mesh(dominoGeometry, dominoMaterial);
        dominoMesh.position.set(x, 1, z);
        dominoMesh.rotation.y = angle + Math.PI / 2;
        dominoMesh.castShadow = true;
        dominoMesh.receiveShadow = true;
        scene.add(dominoMesh);
        
        // Physics domino
        const dominoShape = new CANNON.Box(new CANNON.Vec3(0.1, 1, 0.5));
        const dominoBody = new CANNON.Body({
            mass: 0.2,
            shape: dominoShape,
            position: new CANNON.Vec3(x, 1, z)
        });
        dominoBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle + Math.PI / 2);
        world.add(dominoBody);
        
        physicsBodies.push({
            mesh: dominoMesh,
            body: dominoBody
        });
    }
    
    // Start the domino effect with a push
    setTimeout(() => {
        if (physicsBodies.length > 0) {
            physicsBodies[0].body.velocity.x = 5;
        }
    }, 1000);
}

function createBouncingBalls() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createPhysicsBall(
                (Math.random() - 0.5) * 10,
                15 + Math.random() * 5,
                (Math.random() - 0.5) * 10
            );
        }, i * 200);
    }
}

function updatePhysics() {
    if (!world) return;
    
    // Step the physics world
    world.step(1/60);
    
    // Update visual objects to match physics bodies
    physicsBodies.forEach(item => {
        if (item.mesh && item.body) {
            item.mesh.position.copy(item.body.position);
            item.mesh.quaternion.copy(item.body.quaternion);
            
            // Remove bodies that have fallen too far
            if (item.body.position.y < -10) {
                scene.remove(item.mesh);
                world.remove(item.body);
                const index = physicsBodies.indexOf(item);
                if (index > -1) {
                    physicsBodies.splice(index, 1);
                }
            }
        }
    });
    
    // Update confetti
    confetti.forEach(item => {
        if (item.mesh && item.body) {
            item.mesh.position.copy(item.body.position);
            item.mesh.quaternion.copy(item.body.quaternion);
        }
    });
}

// Add some interactive physics on click
document.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        const point = intersects[0].point;
        createPhysicsBall(point.x, point.y + 10, point.z);
    }
});

// Keyboard shortcuts for physics effects
document.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
        case 'd':
            createDominoEffect();
            break;
        case 'b':
            createBouncingBalls();
            break;
        case 'c':
            createConfettiBurst();
            break;
        case 'r':
            // Reset physics bodies
            physicsBodies.forEach(item => {
                scene.remove(item.mesh);
                world.remove(item.body);
            });
            physicsBodies = [];
            break;
    }
});
