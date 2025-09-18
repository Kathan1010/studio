
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
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
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
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x55aa55, roughness: 0.9 });
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

    // Obstacles
    this.level.obstacles.forEach(obs => {
        const obsGeo = new THREE.BoxGeometry(...obs.size);
        const obsMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
        const obstacle = new THREE.Mesh(obsGeo, obsMat);
        obstacle.position.fromArray(obs.position);
        if (obs.rotation) obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
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
            event.preventDefault();
            this.aimLeft();
            break;
        case 'arrowright':
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

    // --- Ground collision ---
    if (this.ballMesh.position.y < ballRadius && this.ballVelocity.y < 0) {
        this.ballMesh.position.y = ballRadius;
        this.ballVelocity.y *= -0.3; // Dampen bounce
        onSurface = true;
    }

    // --- Sandpit check ---
    if (onSurface) {
        for (const sandpit of this.sandpits) {
            const distToSandpitCenter = this.ballMesh.position.clone().setY(0).distanceTo(sandpit.position.clone().setY(0));
            const sandpitRadius = (sandpit.geometry as THREE.CircleGeometry).parameters.radius;
            if (distToSandpitCenter < sandpitRadius) {
                inSand = true;
                break;
            }
        }
    }
    
    // --- Obstacle collision ---
    for (const obstacle of this.obstacles) {
        const obstacleAABB = new THREE.Box3().setFromObject(obstacle);

        if (obstacleAABB.intersectsSphere(new THREE.Sphere(this.ballMesh.position, ballRadius))) {
            const closestPoint = new THREE.Vector3();
            obstacleAABB.clampPoint(this.ballMesh.position, closestPoint);

            const collisionNormal = this.ballMesh.position.clone().sub(closestPoint).normalize();
            
            this.ballVelocity.reflect(collisionNormal).multiplyScalar(0.7);

            this.ballMesh.position.add(collisionNormal.multiplyScalar(0.01));
        }
    }

    // --- Apply friction if on any surface ---
    if(onSurface) {
      const friction = inSand ? 0.85 : 0.96;
      this.ballVelocity.x *= friction;
      this.ballVelocity.z *= friction;
    }
  }

  private update() {
    // If game is paused or hole is completed, do nothing.
    if (this.isGamePaused() || this.isHoleCompleted) {
        return;
    }
    
    // Update aim line and power charging
    this.updateAimLine();
    if (this.isCharging) {
        const chargeSpeed = 0.75;
        this.chargePower = Math.min(this.chargePower + chargeSpeed, 100);
        this.setPower(this.chargePower);
    }
    
    // --- Physics and Gameplay Logic ---
    if (this.isBallMoving) {
        // 1. Check for Hole Completion
        const distToHole = this.ballMesh.position.clone().setY(0).distanceTo(this.holeMesh.position.clone().setY(0));
        const ballIsOnGround = this.ballMesh.position.y <= (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius + 0.01;
        
        if (distToHole < this.level.holeRadius && ballIsOnGround && this.ballVelocity.lengthSq() < 0.2) {
            this.isHoleCompleted = true;
            this.isBallMoving = false;
            this.ballVelocity.set(0, 0, 0);
            this.ballMesh.visible = false; // Hide the ball as it's "in the hole"
            if (this.flagGroup) this.flagGroup.visible = false;
            this.onHoleComplete();
            return; // End update loop for this frame
        }

        // 2. Apply Gravity
        this.ballVelocity.add(this.gravity);
        
        // 3. Update Position
        this.ballMesh.position.add(this.ballVelocity);
        
        // 4. Check Collisions
        this.checkCollisions();
      
        // 5. Check for Out of Bounds
        const { x, y, z } = this.ballMesh.position;
        if (y < -2 || Math.abs(x) > 25 || Math.abs(z) > 25) {
            this.onStroke(); // Add penalty stroke
            this.ballMesh.position.fromArray(this.level.startPosition);
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
        }
        
        // 6. Stop Condition
        if (this.ballVelocity.lengthSq() < 0.0001) {
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

    

    