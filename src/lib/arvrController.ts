import * as THREE from "three";

export interface ARVRCapabilities {
  hasWebXR: boolean;
  hasCamera: boolean;
  hasDeviceMotion: boolean;
  hasVRSupport: boolean;
  hasARSupport: boolean;
}

export interface BiometricData {
  heartRate: number;
  stressLevel: number;
  breathingRate: number;
  eyeMovement: { x: number; y: number };
  timestamp: Date;
}

export class ARVRController {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private videoElement: HTMLVideoElement | null = null;
  private arMode = false;
  private vrMode = false;
  private capabilities: ARVRCapabilities;
  private onBiometricUpdate?: (data: BiometricData) => void;
  private animationId: number | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.capabilities = this.checkCapabilities();
    this.setupRenderer();
  }

  private checkCapabilities(): ARVRCapabilities {
    return {
      hasWebXR: "xr" in navigator,
      hasCamera:
        "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices,
      hasDeviceMotion: "DeviceMotionEvent" in window,
      hasVRSupport: "xr" in navigator,
      hasARSupport: "mediaDevices" in navigator,
    };
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Enable WebXR if available
    if (this.capabilities.hasWebXR) {
      this.setupWebXR();
    }
  }

  private async setupWebXR() {
    try {
      const sessions = await navigator.xr?.requestSession("immersive-vr");
      if (sessions) {
        this.renderer.xr.setSession(sessions);
      }
    } catch (error) {
      console.log("WebXR not available, using fallback");
    }
  }

  async startARMode(container: HTMLElement): Promise<boolean> {
    if (!this.capabilities.hasCamera) {
      throw new Error("Camera not available for AR");
    }

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Create video element for camera feed
      this.videoElement = document.createElement("video");
      this.videoElement.srcObject = stream;
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.videoElement.style.position = "absolute";
      this.videoElement.style.top = "0";
      this.videoElement.style.left = "0";
      this.videoElement.style.width = "100%";
      this.videoElement.style.height = "100%";
      this.videoElement.style.objectFit = "cover";
      this.videoElement.style.zIndex = "1";

      container.appendChild(this.videoElement);

      // Setup AR renderer
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = "0";
      this.renderer.domElement.style.left = "0";
      this.renderer.domElement.style.zIndex = "2";
      this.renderer.domElement.style.pointerEvents = "none";

      container.appendChild(this.renderer.domElement);

      this.arMode = true;
      this.startARTracking();
      this.animate();

      return true;
    } catch (error) {
      console.error("Failed to start AR mode:", error);
      return false;
    }
  }

  async startVRMode(container: HTMLElement): Promise<boolean> {
    if (!this.capabilities.hasWebXR) {
      // Fallback to desktop VR simulation
      return this.startVRSimulation(container);
    }

    try {
      const session = await navigator.xr!.requestSession("immersive-vr");
      this.renderer.xr.setSession(session);
      this.vrMode = true;
      container.appendChild(this.renderer.domElement);
      this.animate();
      return true;
    } catch (error) {
      console.error("WebXR VR not available, using simulation:", error);
      return this.startVRSimulation(container);
    }
  }

  private startVRSimulation(container: HTMLElement): boolean {
    // Create immersive full-screen experience
    this.renderer.domElement.style.width = "100vw";
    this.renderer.domElement.style.height = "100vh";
    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    this.renderer.domElement.style.zIndex = "1000";

    container.appendChild(this.renderer.domElement);

    // Add mouse/touch controls for VR simulation
    this.setupVRControls();
    this.vrMode = true;
    this.animate();
    return true;
  }

  private setupVRControls() {
    let mouseX = 0,
      mouseY = 0;
    let isMouseDown = false;

    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update camera rotation for VR look-around
        this.camera.rotation.y = mouseX * Math.PI;
        this.camera.rotation.x = mouseY * Math.PI * 0.5;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };
    const onMouseUp = () => {
      isMouseDown = false;
    };

    this.renderer.domElement.addEventListener("mousemove", onMouseMove);
    this.renderer.domElement.addEventListener("mousedown", onMouseDown);
    this.renderer.domElement.addEventListener("mouseup", onMouseUp);

    // Touch controls for mobile
    this.renderer.domElement.addEventListener("touchmove", (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
      this.camera.rotation.y = mouseX * Math.PI;
      this.camera.rotation.x = mouseY * Math.PI * 0.5;
    });
  }

  private startARTracking() {
    // Simulate AR object tracking
    if (this.capabilities.hasDeviceMotion) {
      window.addEventListener("deviceorientationabsolute", (event) => {
        if (
          event.alpha !== null &&
          event.beta !== null &&
          event.gamma !== null
        ) {
          // Convert device orientation to camera rotation
          this.camera.rotation.x = (event.beta! * Math.PI) / 180;
          this.camera.rotation.y = (event.alpha! * Math.PI) / 180;
          this.camera.rotation.z = (event.gamma! * Math.PI) / 180;
        }
      });
    }
  }

  createMeditationEnvironment(type: string): THREE.Group {
    const environment = new THREE.Group();

    switch (type) {
      case "forest-sanctuary":
        environment.add(this.createForestEnvironment());
        break;
      case "crystal-cave":
        environment.add(this.createCrystalCave());
        break;
      case "ocean-depths":
        environment.add(this.createOceanEnvironment());
        break;
      case "space-nebula":
        environment.add(this.createSpaceEnvironment());
        break;
      default:
        environment.add(this.createDefaultEnvironment());
    }

    this.scene.add(environment);
    return environment;
  }

  private createForestEnvironment(): THREE.Group {
    const forest = new THREE.Group();

    // Create trees
    for (let i = 0; i < 20; i++) {
      const tree = this.createTree();
      tree.position.set(
        (Math.random() - 0.5) * 50,
        0,
        (Math.random() - 0.5) * 50,
      );
      forest.add(tree);
    }

    // Add ambient forest sounds (visual representation)
    const soundWaves = this.createSoundVisualization("#10b981");
    forest.add(soundWaves);

    // Add floating particles
    const particles = this.createParticleSystem(1000, "#22c55e");
    forest.add(particles);

    return forest;
  }

  private createCrystalCave(): THREE.Group {
    const cave = new THREE.Group();

    // Create glowing crystals
    for (let i = 0; i < 15; i++) {
      const crystal = this.createCrystal();
      crystal.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 10,
        (Math.random() - 0.5) * 30,
      );
      cave.add(crystal);
    }

    // Add mystical glow
    const ambientLight = new THREE.AmbientLight("#a855f7", 0.6);
    cave.add(ambientLight);

    // Floating energy orbs
    const orbs = this.createEnergyOrbs();
    cave.add(orbs);

    return cave;
  }

  private createOceanEnvironment(): THREE.Group {
    const ocean = new THREE.Group();

    // Create water plane with waves
    const waterGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    const waterMaterial = new THREE.MeshPhongMaterial({
      color: "#0ea5e9",
      transparent: true,
      opacity: 0.7,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    ocean.add(water);

    // Animate waves
    this.animateWaves(waterGeometry);

    // Add floating bubbles
    const bubbles = this.createBubbles();
    ocean.add(bubbles);

    return ocean;
  }

  private createSpaceEnvironment(): THREE.Group {
    const space = new THREE.Group();

    // Create nebula effect
    const nebulaGeometry = new THREE.SphereGeometry(50, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: "#6366f1",
      transparent: true,
      opacity: 0.3,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    space.add(nebula);

    // Add stars
    const stars = this.createStarField();
    space.add(stars);

    // Floating cosmic objects
    const cosmicObjects = this.createCosmicObjects();
    space.add(cosmicObjects);

    return space;
  }

  private createTree(): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: "#92400e" });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 4;
    tree.add(trunk);

    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(4, 8, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: "#16a34a" });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 8;
    tree.add(leaves);

    return tree;
  }

  private createCrystal(): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(1, 3, 6);
    const material = new THREE.MeshPhongMaterial({
      color: "#a855f7",
      transparent: true,
      opacity: 0.8,
      emissive: "#7c3aed",
      emissiveIntensity: 0.3,
    });
    return new THREE.Mesh(geometry, material);
  }

  private createSoundVisualization(color: string): THREE.Group {
    const visualization = new THREE.Group();

    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 4, 4);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20,
      );

      visualization.add(sphere);
    }

    return visualization;
  }

  private createParticleSystem(count: number, color: string): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
    });

    return new THREE.Points(geometry, material);
  }

  private createEnergyOrbs(): THREE.Group {
    const orbs = new THREE.Group();

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: "#fbbf24",
        transparent: true,
        opacity: 0.7,
      });
      const orb = new THREE.Mesh(geometry, material);

      orb.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 20,
      );

      orbs.add(orb);
    }

    return orbs;
  }

  private createBubbles(): THREE.Group {
    const bubbles = new THREE.Group();

    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.SphereGeometry(
        0.2 + Math.random() * 0.3,
        8,
        8,
      );
      const material = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.3,
      });
      const bubble = new THREE.Mesh(geometry, material);

      bubble.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 20,
        (Math.random() - 0.5) * 40,
      );

      bubbles.add(bubble);
    }

    return bubbles;
  }

  private createStarField(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 2,
    });

    return new THREE.Points(geometry, material);
  }

  private createCosmicObjects(): THREE.Group {
    const objects = new THREE.Group();

    // Create floating cosmic debris
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.IcosahedronGeometry(1 + Math.random() * 2);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        transparent: true,
        opacity: 0.8,
      });
      const object = new THREE.Mesh(geometry, material);

      object.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
      );

      objects.add(object);
    }

    return objects;
  }

  private createDefaultEnvironment(): THREE.Group {
    const env = new THREE.Group();

    // Simple zen garden
    const ground = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: "#f3f4f6" });
    const groundMesh = new THREE.Mesh(ground, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    env.add(groundMesh);

    return env;
  }

  private animateWaves(geometry: THREE.PlaneGeometry) {
    const positions = geometry.attributes.position;
    const time = { value: 0 };

    const animate = () => {
      time.value += 0.01;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z =
          Math.sin(x * 0.1 + time.value) * Math.cos(y * 0.1 + time.value) * 2;
        positions.setZ(i, z);
      }

      positions.needsUpdate = true;
      requestAnimationFrame(animate);
    };

    animate();
  }

  startBiometricSimulation(callback: (data: BiometricData) => void) {
    this.onBiometricUpdate = callback;

    setInterval(() => {
      const data: BiometricData = {
        heartRate: 60 + Math.random() * 40, // 60-100 BPM
        stressLevel: Math.random() * 100,
        breathingRate: 12 + Math.random() * 8, // 12-20 per minute
        eyeMovement: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        timestamp: new Date(),
      };

      this.onBiometricUpdate?.(data);
    }, 1000);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Animate scene objects
    this.scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshBasicMaterial
      ) {
        object.rotation.y += 0.01;
      }
    });

    this.renderer.render(this.scene, this.camera);
  };

  stopARVR() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.videoElement) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      this.videoElement.remove();
      this.videoElement = null;
    }

    this.arMode = false;
    this.vrMode = false;
    this.scene.clear();
  }

  getCapabilities(): ARVRCapabilities {
    return this.capabilities;
  }

  isARMode(): boolean {
    return this.arMode;
  }

  isVRMode(): boolean {
    return this.vrMode;
  }
}

export default ARVRController;
