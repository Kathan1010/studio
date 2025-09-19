

"use client";

import React, { useRef, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Level } from '@/lib/levels';
import { useIsMobile } from '@/hooks/use-mobile';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- A dedicated class to manage the Three.js game world ---
export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private ballMesh: THREE.Mesh;
  private holeMesh: THREE.Mesh;
  private obstacles: THREE.Mesh[] = [];
  private sandpits: THREE.Mesh[] = [];
  private aimLine: THREE.Line;
  private flagGroup: THREE.Group;


  // Game state
  private isBallMoving = false;
  private isCharging = false;
  private chargePower = 0;
  private aimDirection = new THREE.Vector3(0, 0, -1);
  private ballVelocity = new THREE.Vector3();
  private isHoleCompleted = false;
  
  // Constants
  private gravity = new THREE.Vector3(0, -0.01, 0);

  // Callbacks
  private onStroke: () => void;
  private onHoleComplete: () => void;
  private setPower: (power: number) => void;
  private isGamePaused: () => boolean;
  
  constructor(
    private mount: HTMLDivElement,
    private level: Level,
    callbacks: {
        onStroke: () => void;
        onHoleComplete: () => void;
        setPower: (power: number) => void;
        isGamePaused: () => boolean;
    }
  ) {
    this.onStroke = callbacks.onStroke;
    this.onHoleComplete = callbacks.onHoleComplete;
    this.setPower = callbacks.setPower;
    this.isGamePaused = callbacks.isGamePaused;

    // --- Basic setup ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

    this.camera = new THREE.PerspectiveCamera(60, this.mount.clientWidth / this.mount.clientHeight, 0.1, 1000);
    this.camera.position.set(this.level.startPosition[0], 5, this.level.startPosition[2] + 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false; // Right-click to pan
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.target.set(this.level.startPosition[0], this.level.startPosition[1], this.level.startPosition[2]);

    this.addLights();
    this.createLevel();
    this.bindEventHandlers();
    this.updateAimLine();
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(-5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);
  }

  private createTree(position: THREE.Vector3) {
    const treeGroup = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = 0.75;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    const leavesGeo = new THREE.ConeGeometry(1, 2, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const leavesMesh = new THREE.Mesh(leavesGeo, leavesMat);
    leavesMesh.position.y = 2.5;
    leavesMesh.castShadow = true;
    treeGroup.add(leavesMesh);

    treeGroup.position.copy(position);
    this.scene.add(treeGroup);
    
    // Add tree trunk to obstacles for collision
    const trunkObstacle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 0.6), new THREE.MeshStandardMaterial({visible: false}));
    trunkObstacle.position.set(position.x, 0.75, position.z);
    this.obstacles.push(trunkObstacle);
    this.scene.add(trunkObstacle);
  }

  private createLevel() {
    // Ground
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    
    // --- Checkerboard Texture ---
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
        const color1 = '#228B22'; // ForestGreen
        const color2 = '#006400'; // DarkGreen
        const checks = 8;
        const size = canvas.width / checks;

        for (let x = 0; x < checks; x++) {
            for (let y = 0; y < checks; y++) {
                context.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
                context.fillRect(x * size, y * size, size, size);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);

    const groundMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Ball
    const ballGeo = new THREE.SphereGeometry(0.15, 32, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.ballMesh.position.fromArray(this.level.startPosition);
    this.scene.add(this.ballMesh);

    // Hole
    const holeGeo = new THREE.CircleGeometry(this.level.holeRadius, 32);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.holeMesh = new THREE.Mesh(holeGeo, holeMat);
    this.holeMesh.position.fromArray(this.level.holePosition);
    this.holeMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.holeMesh);

    // Boundaries
    const boundaryMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    const boundaryHeight = 0.5;
    const boundaryThickness = 0.5;

    const boundaries = [
      { size: [50 + boundaryThickness, boundaryHeight, boundaryThickness], position: [0, boundaryHeight / 2, 25] }, // Bottom
      { size: [50 + boundaryThickness, boundaryHeight, boundaryThickness], position: [0, boundaryHeight / 2, -25] }, // Top
      { size: [boundaryThickness, boundaryHeight, 50 + boundaryThickness], position: [25, boundaryHeight / 2, 0] }, // Right
      { size: [boundaryThickness, boundaryHeight, 50 + boundaryThickness], position: [-25, boundaryHeight / 2, 0] } // Left
    ];

    boundaries.forEach(b => {
      const boundaryGeo = new THREE.BoxGeometry(...(b.size as [number,number,number]));
      const boundaryMesh = new THREE.Mesh(boundaryGeo, boundaryMat);
      boundaryMesh.position.fromArray(b.position as [number,number,number]);
      boundaryMesh.castShadow = true;
      boundaryMesh.receiveShadow = true;
      this.scene.add(boundaryMesh);
      this.obstacles.push(boundaryMesh);
    });

    // Obstacles
    this.level.obstacles.forEach(obs => {
      let obsGeo: THREE.BoxGeometry;
      let obsMat: THREE.MeshStandardMaterial;

      if (obs.type === 'ramp') {
          obsGeo = new THREE.BoxGeometry(...obs.size);
          obsMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.7 });
      } else { // 'box'
          obsGeo = new THREE.BoxGeometry(...obs.size);
          obsMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
      }
      
      const obstacle = new THREE.Mesh(obsGeo, obsMat);
      obstacle.position.fromArray(obs.position);
      if (obs.rotation) {
          obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
      }
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
      this.obstacles.push(obstacle);
    });

    // Sandpits
    if (this.level.sandpits) {
      this.level.sandpits.forEach(sp => {
        const sandGeo = new THREE.CircleGeometry(sp.radius, 32);
        const sandMat = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 1 });
        const sandpit = new THREE.Mesh(sandGeo, sandMat);
        sandpit.position.fromArray(sp.position);
        sandpit.rotation.x = -Math.PI / 2;
        sandpit.receiveShadow = true;
        this.scene.add(sandpit);
        this.sandpits.push(sandpit);
      });
    }

    // Trees
    if (this.level.trees) {
      this.level.trees.forEach(t => {
        this.createTree(new THREE.Vector3(...t.position));
      });
    }

    // Flag
    this.flagGroup = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    poleMesh.position.y = 0.75; // Half of height
    poleMesh.castShadow = true;
    this.flagGroup.add(poleMesh);

    const flagGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.3, 1.2, 0); // Position relative to the pole top
    this.flagGroup.add(flagMesh);
    
    this.flagGroup.position.fromArray(this.level.holePosition);
    this.flagGroup.position.y = this.level.holePosition[1];
    this.scene.add(this.flagGroup);


    // Aim Line
    const aimLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthTest: false });
    const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.aimLine = new THREE.Line(aimLineGeo, aimLineMat);
    this.aimLine.renderOrder = 999;
    this.scene.add(this.aimLine);
  }

  private bindEventHandlers() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
  }

  private updateAimLine() {
    this.aimLine.visible = !this.isBallMoving && !this.isHoleCompleted;
    if (this.aimLine.visible) {
        const startPoint = this.ballMesh.position;
        const endPoint = startPoint.clone().add(this.aimDirection.clone().multiplyScalar(3));
        this.aimLine.geometry.setFromPoints([startPoint, endPoint]);
    }
  }

  public aimLeft() {
    if (this.isGamePaused() || this.isBallMoving || this.isHoleCompleted) return;
    this.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 45);
  }

  public aimRight() {
    if (this.isGamePaused() || this.isBallMoving || this.isHoleCompleted) return;
    this.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 45);
  }

  public startPowerCharge() {
    if (this.isGamePaused() || this.isBallMoving || this.isHoleCompleted) return;
    if (!this.isCharging) {
        this.isCharging = true;
    }
  }

  public releasePowerCharge() {
      if (this.isGamePaused() || this.isHoleCompleted) return;
      if (!this.isCharging) return;
      
      if (this.chargePower < 5) { // Cancel shot if not enough power
          this.isCharging = false;
          this.setPower(0);
          this.chargePower = 0;
          return;
      }

      const powerMultiplier = 0.007;
      this.ballVelocity.copy(this.aimDirection).multiplyScalar(this.chargePower * powerMultiplier);
      this.isBallMoving = true;
      this.onStroke();

      // Reset charge state AFTER the shot is taken
      this.isCharging = false;
      this.setPower(0);
      this.chargePower = 0;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    switch(event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            event.preventDefault();
            this.aimLeft();
            break;
        case 'arrowright':
        case 'd':
            event.preventDefault();
            this.aimRight();
            break;
        case ' ':
            event.preventDefault();
            this.startPowerCharge();
            break;
    }
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === ' ') {
        event.preventDefault();
        this.releasePowerCharge();
    }
  }

  private handleResize = () => {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };
  
 private checkCollisions() {
    const ballRadius = (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius;
    let onSurface = false;
    let inSand = false;
    let surfaceNormal = new THREE.Vector3(0, 1, 0); // Default to flat ground
    
    // --- Ground collision ---
    const groundLevel = 0;
    if (this.ballMesh.position.y < groundLevel + ballRadius && this.ballVelocity.y < 0) {
        this.ballMesh.position.y = groundLevel + ballRadius;
        this.ballVelocity.y *= -0.3; // Dampen bounce
        onSurface = true;
    }

    // --- Obstacle Collision (with Raycasting for Tunneling) ---
    const movementVector = this.ballVelocity.clone();
    const movementDistance = movementVector.length();
    let collisionDetected = false;

    if (movementDistance > 0) {
        const raycaster = new THREE.Raycaster(this.ballMesh.position, movementVector.normalize(), 0, movementDistance + ballRadius);
        const intersects = raycaster.intersectObjects(this.obstacles);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            // Check if the intersection is closer than the ball's intended movement
            if (intersection.distance <= movementDistance + ballRadius) {
                collisionDetected = true;
                const collisionNormal = intersection.face!.normal.clone();
                // Make sure normal is pointing out of the face from the obstacle's perspective
                collisionNormal.transformDirection(intersection.object.matrixWorld).normalize();

                // Position the ball at the point of collision
                this.ballMesh.position.copy(intersection.point);
                this.ballMesh.position.add(collisionNormal.clone().multiplyScalar(ballRadius * 1.01)); // Epsilon to avoid getting stuck
                
                // Reflect velocity
                this.ballVelocity.reflect(collisionNormal);
                
                // Apply dampening
                const collisionDampening = 0.7; 
                this.ballVelocity.multiplyScalar(collisionDampening);
                
                // If the normal is pointing mostly upwards, we are on top of the obstacle
                if (collisionNormal.y > 0.7) {
                    onSurface = true;
                    surfaceNormal = collisionNormal; // This is a slope!
                }
            }
        }
    }
    
    // --- Sandpit check ---
    if (!collisionDetected) { // Only check for sand if we didn't just bounce off a wall
        for (const sandpit of this.sandpits) {
            const distToSandpitCenter = this.ballMesh.position.clone().setY(sandpit.position.y).distanceTo(sandpit.position);
            const sandpitRadius = (sandpit.geometry as THREE.CircleGeometry).parameters.radius;

            // Check if the ball is horizontally within the sandpit and vertically very close to it.
            if (distToSandpitCenter < sandpitRadius && Math.abs(this.ballMesh.position.y - (sandpit.position.y + ballRadius)) < 0.2) {
                inSand = true;
                onSurface = true; // Being in sand means we are on a surface
                break;
            }
        }
    }


    // --- Apply friction and slope gravity if on any surface ---
    if(onSurface) {
      const isFlat = surfaceNormal.y > 0.99; // Check if the surface is nearly flat
      const friction = inSand ? 0.8 : 0.98;
      
      this.ballVelocity.x *= friction;
      this.ballVelocity.z *= friction;
      
      // Also apply a little friction to vertical bounce on surfaces
      if (Math.abs(this.ballVelocity.y) < 0.01) {
          this.ballVelocity.y = 0;
      }
      
      // Apply slope gravity if not flat
      if (!isFlat) {
          const slopeGravity = this.gravity.clone();
          const slide = slopeGravity.sub(surfaceNormal.clone().multiplyScalar(slopeGravity.dot(surfaceNormal)));
          this.ballVelocity.add(slide);
      }
    }
  }

  private update() {
    if (this.isGamePaused()) {
        return;
    }

    this.updateAimLine();
    if (this.isCharging) {
        const chargeSpeed = 0.75;
        this.chargePower = Math.min(this.chargePower + chargeSpeed, 100);
        this.setPower(this.chargePower);
    }
    
    // --- Hole Completion Animation ---
    // If the level is complete, just run the sinking animation.
    if (this.isHoleCompleted) {
        this.ballMesh.position.y -= 0.05; // Make the ball sink
        this.ballMesh.scale.multiplyScalar(0.95); // Shrink the ball
        if (this.ballMesh.scale.x < 0.1) {
            this.ballMesh.visible = false;
        }
        return;
    }

    // --- Gameplay Physics ---
    if (this.isBallMoving) {
        // Apply global gravity before checking collisions
        this.ballVelocity.add(this.gravity);
        
        // Move and check for collisions
        // The checkCollisions method now also handles slope gravity and tunneling
        this.checkCollisions();
        this.ballMesh.position.add(this.ballVelocity);


        const ballRadius = (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius;
        const distToHole = this.ballMesh.position.distanceTo(this.holeMesh.position);
        
        // --- HOLE COMPLETION LOGIC ---
        // Condition to sink the ball: must be close to the hole and moving slowly.
        // The squared length is used for efficiency (avoids square root).
        const onHolePlane = Math.abs(this.ballMesh.position.y - this.holeMesh.position.y) < ballRadius;
        if (onHolePlane && distToHole < this.level.holeRadius && this.ballVelocity.lengthSq() < 0.05) {
            this.isHoleCompleted = true;
            this.isBallMoving = false;
            this.ballVelocity.set(0, 0, 0); // Stop all movement
            this.ballMesh.position.copy(this.holeMesh.position).setY(this.holeMesh.position.y + ballRadius); // Center it
            if (this.flagGroup) this.flagGroup.visible = false;
            this.onHoleComplete();
            return; // Exit update loop for this frame
        }

        // --- HOLE GRAVITY LOGIC ---
        // If ball is near the hole, on the ground, and moving at a reasonable speed,
        // apply a gentle pull towards the hole.
        if (onHolePlane && distToHole < this.level.holeRadius * 2.5 && this.ballVelocity.lengthSq() < 0.5) {
            const pullVector = this.holeMesh.position.clone().sub(this.ballMesh.position).normalize();
            pullVector.y = 0; // Only pull on the XZ plane
            pullVector.multiplyScalar(0.0035); // Adjust pull strength for a subtle effect
            this.ballVelocity.add(pullVector);
            this.ballVelocity.multiplyScalar(0.975); // Slightly dampen velocity near hole
        }

        // --- Out of Bounds Check ---
        const { x, y, z } = this.ballMesh.position;
        if (y < -2) { // Only reset if it falls below the boundaries
            this.onStroke(); // Penalty stroke
            this.ballMesh.position.fromArray(this.level.startPosition);
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
        }
        
        // --- Stop Condition ---
        // If the ball is moving very slowly on a near-flat surface, bring it to a complete stop.
        // This threshold is now checked inside checkCollisions where we know the surface normal.
        const onAnySurface = this.ballMesh.position.y <= (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius + 0.01;
        if (onAnySurface && this.ballVelocity.lengthSq() < 0.0001) {
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
        }
    }
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    if (this.mount && this.renderer.domElement) {
        try {
            this.mount.removeChild(this.renderer.domElement);
        } catch (e) {
            console.error("Failed to remove renderer DOM element.", e);
        }
    }
    
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.renderer.dispose();
    this.controls.dispose();
  }
}

// --- The React Component ---
type GolfCanvasProps = {
  level: Level;
  onStroke: () => void;
  onHoleComplete: () => void;
  setPower: (power: number) => void;
  isGamePaused?: boolean;
  gameRef?: MutableRefObject<Game | null>;
};

const GolfCanvas: React.FC<GolfCanvasProps> = ({ level, onStroke, onHoleComplete, setPower, isGamePaused = false, gameRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isGamePausedRef = useRef(isGamePaused);

  useEffect(() => {
    isGamePausedRef.current = isGamePaused;
  }, [isGamePaused]);

  useEffect(() => {
    if (!mountRef.current) return;

    const game = new Game(mountRef.current, level, {
        onStroke,
        onHoleComplete,
        setPower,
        isGamePaused: () => isGamePausedRef.current,
    });

    if (gameRef) {
        gameRef.current = game;
    }
    
    game.animate();

    return () => {
      game.cleanup();
      if (gameRef) {
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]); // Key change: This effect now ONLY re-runs if the level changes.

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default GolfCanvas;

    

    

    

    

    

    



    



















