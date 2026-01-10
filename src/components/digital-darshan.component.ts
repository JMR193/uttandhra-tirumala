
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TempleService } from '../services/temple.service';

declare var THREE: any;

@Component({
  selector: 'app-digital-darshan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-screen bg-black overflow-hidden select-none" (window:resize)="onResize()">
      
      <!-- 3D Canvas Container -->
      <div #canvasContainer class="absolute inset-0 z-0 bg-gradient-to-b from-black via-[#1a0500] to-black"></div>

      <!-- UI Overlay -->
      <div class="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        <!-- Header -->
        <div class="flex justify-between items-start pointer-events-auto">
           <div class="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 text-white shadow-lg">
              <h2 class="text-2xl font-serif font-bold text-amber-400 drop-shadow-md">Digital Darshan</h2>
              <p class="text-xs text-stone-300">Drag to Rotate • Scroll to Zoom</p>
           </div>
           <button (click)="close.emit()" class="bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hover:shadow-red-500/50">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap justify-center gap-4 pointer-events-auto pb-8">
           <!-- Arathi Button -->
           <button (click)="performArathi()" [disabled]="isArathiActive" class="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)] transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 animate-pulse"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" /></svg>
             Harathi
           </button>

           <!-- Pushpanjali Button -->
           <button (click)="performPushpanjali()" [disabled]="isRainingFlowers" class="bg-gradient-to-r from-pink-600 to-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-pink-400/50 disabled:opacity-50 disabled:cursor-not-allowed">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
             Pushpanjali
           </button>
        </div>

      </div>

      <!-- Loading Indicator -->
      @if (loading) {
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-black text-amber-500">
           <div class="flex flex-col items-center animate-pulse">
              <div class="w-16 h-16 border-4 border-amber-600 border-t-amber-300 rounded-full animate-spin mb-6"></div>
              <p class="font-serif tracking-[0.2em] text-sm uppercase text-amber-300">Entering Bhuloka Vaikuntham...</p>
           </div>
        </div>
      }
    </div>
  `
})
export class DigitalDarshanComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef;
  
  templeService = inject(TempleService);
  loading = true;

  // Three.js Variables
  private scene: any;
  private camera: any;
  private renderer: any;
  private idolGroup: any;
  private particles: any;
  private flowers: any;
  private animationId: number | null = null;
  private lights: any[] = [];
  
  // Specific Mesh References
  private chakraMesh: any;
  private shankuMesh: any;
  private arathiLight: any;
  
  // Interaction State
  private isDragging = false;
  isRainingFlowers = false;
  isArathiActive = false;
  
  private previousMousePosition = { x: 0, y: 0 };
  private rotationSpeed = 0.005;
  
  // Rotation Inertia Logic
  private targetRotation = { x: 0, y: 0 };
  private currentRotation = { x: 0, y: 0 };
  private mouseDelta = { x: 0, y: 0 };

  // Events
  close = new (class { emit() { window.history.back(); } })();

  ngOnInit() {
    // Simulate asset loading
    setTimeout(() => {
      this.initThreeJS();
      this.loading = false;
    }, 1500);
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) {
        this.renderer.dispose();
    }
  }

  createTexture(type: 'petal' | 'halo' | 'sparkle'): any {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (type === 'halo') {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 150, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
    } else if (type === 'petal') {
        ctx.translate(64, 64);
        ctx.scale(2, 2);
        const pGrad = ctx.createLinearGradient(0, -20, 0, 20);
        pGrad.addColorStop(0, '#ff99cc');
        pGrad.addColorStop(1, '#ff6699');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -10, 3, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
    } else if (type === 'sparkle') {
         const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
         gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
         gradient.addColorStop(0.2, 'rgba(255, 255, 200, 0.8)');
         gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
         gradient.addColorStop(1, 'rgba(0,0,0,0)');
         ctx.fillStyle = gradient;
         ctx.fillRect(0,0,128,128);
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  initThreeJS() {
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded');
      return;
    }

    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x1a0500, 0.035);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 1, 9);
    this.camera.lookAt(0, 2, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.containerRef.nativeElement.appendChild(this.renderer.domElement);

    // --- MATERIALS ---
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x442200,
      emissiveIntensity: 0.1,
    });
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222, // Black stone (Moolavar style)
      roughness: 0.7,
      metalness: 0.1
    });
    const vastramMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // Gold Silk
      roughness: 0.4,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    const whitePaste = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const redPaste = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.5 });
    const gemRed = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.1 });
    const gemGreen = new THREE.MeshStandardMaterial({ color: 0x00aa00, metalness: 0.8, roughness: 0.1 });

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffaa00, 0.4); 
    this.scene.add(ambientLight);
    const mainSpot = new THREE.SpotLight(0xffaa00, 1.8);
    mainSpot.position.set(5, 10, 5);
    mainSpot.castShadow = true;
    this.scene.add(mainSpot);
    const rimLight = new THREE.SpotLight(0xff5500, 2.0);
    rimLight.position.set(-5, 5, -5);
    this.scene.add(rimLight);

    // --- ENVIRONMENT ---
    const haloMat = new THREE.SpriteMaterial({ map: this.createTexture('halo'), color: 0xffdd44, transparent: true, blending: THREE.AdditiveBlending });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(14, 14, 1);
    halo.position.set(0, 3.5, -3);
    this.scene.add(halo);

    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x110505, roughness: 0.1, metalness: 0.5 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // --- DEITY CONSTRUCTION (Chaturbhuja form) ---
    this.idolGroup = new THREE.Group();

    // 1. PEETHAM (Base)
    const baseGroup = new THREE.Group();
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 0.8, 64), goldMaterial);
    base1.position.y = -2.4;
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.6, 64), goldMaterial);
    base2.position.y = -1.8;
    // Lotus Petals on Base
    for(let i=0; i<16; i++) {
        const petal = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 3), goldMaterial);
        petal.position.y = -1.5;
        petal.position.x = Math.cos(i/16 * Math.PI*2) * 2;
        petal.position.z = Math.sin(i/16 * Math.PI*2) * 2;
        petal.lookAt(0, -1.5, 0);
        petal.rotation.x = -Math.PI/4;
        baseGroup.add(petal);
    }
    baseGroup.add(base1);
    baseGroup.add(base2);
    this.idolGroup.add(baseGroup);

    // 2. LEGS & LOWER BODY (Vastram)
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 1.5, 32), vastramMaterial);
    hips.position.y = -0.5;
    this.idolGroup.add(hips);
    
    // Dhoti Folds (Central Pleats)
    const pleats = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.5, 0.3), vastramMaterial);
    pleats.position.set(0, -1.2, 1.3);
    pleats.rotation.x = -0.1;
    this.idolGroup.add(pleats);

    // Legs (Cylinders under cloth)
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 3.5, 32), vastramMaterial);
    leftLeg.position.set(-0.6, -1.5, 0.5);
    this.idolGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 3.5, 32), vastramMaterial);
    rightLeg.position.set(0.6, -1.5, 0.5);
    this.idolGroup.add(rightLeg);
    
    // Feet
    const footGeo = new THREE.BoxGeometry(0.5, 0.3, 1.2);
    const leftFoot = new THREE.Mesh(footGeo, goldMaterial); // Gold feet covering
    leftFoot.position.set(-0.7, -3.2, 0.8);
    const rightFoot = new THREE.Mesh(footGeo, goldMaterial);
    rightFoot.position.set(0.7, -3.2, 0.8);
    this.idolGroup.add(leftFoot);
    this.idolGroup.add(rightFoot);


    // 3. TORSO
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 2.8, 32), goldMaterial); // Covered in Kavacham
    torso.position.y = 1.5;
    torso.castShadow = true;
    this.idolGroup.add(torso);
    
    // Yagnopaveetham (Sacred Thread)
    const thread = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.05, 16, 100, 3), whitePaste);
    thread.position.set(0, 1.5, 0);
    thread.rotation.x = 0.5;
    thread.rotation.y = 0.5; // Diagonal across chest
    this.idolGroup.add(thread);

    // Lakshmi Kasula Haram (Coin Necklace)
    const necklace = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.1, 16, 64, 3.5), goldMaterial);
    necklace.position.set(0, 2.2, 0.3);
    necklace.rotation.x = 0.5; // Hang down
    necklace.rotation.z = Math.PI; // Flip arc
    this.idolGroup.add(necklace);


    // 4. ARMS (Chaturbhuja)
    
    // Helper for arm segments
    const createArm = (posX: number, posY: number, posZ: number, rotZ: number, lowerRotZ: number, lowerRotX: number): any => {
        const armGroup = new THREE.Group();
        armGroup.position.set(posX, posY, posZ);
        
        // Shoulder/Upper Arm
        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.8, 16), goldMaterial);
        upperArm.position.y = -0.9;
        upperArm.rotation.z = rotZ;
        armGroup.add(upperArm);

        // Elbow/Lower Arm Group
        const elbowGroup = new THREE.Group();
        elbowGroup.position.set(Math.sin(rotZ)*1.8 * (rotZ > 0 ? -1 : 1), -1.6, 0); // Approx
        if (rotZ > 0) elbowGroup.position.x = -Math.sin(rotZ)*1.8;
        else elbowGroup.position.x = -Math.sin(rotZ)*1.8;
        
        const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 16), goldMaterial);
        lowerArm.position.y = -0.8;
        elbowGroup.rotation.z = lowerRotZ;
        elbowGroup.rotation.x = lowerRotX;
        elbowGroup.add(lowerArm);
        
        // Add wrist jewelry
        const wrist = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 16, 32), gemRed);
        wrist.position.y = -1.4;
        wrist.rotation.x = Math.PI/2;
        elbowGroup.add(wrist);

        armGroup.add(elbowGroup);
        return armGroup;
    }

    // Rear Right Arm (Holding Chakra) - Raised
    const rearRight = createArm(1.4, 2.5, 0, 0, 0, 0); 
    // Manual override for simpler positioning of raised arms
    rearRight.clear();
    const rrUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.5, 16), goldMaterial);
    rrUpper.rotation.z = -0.5;
    rrUpper.position.set(0.5, 0, 0);
    const rrLower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.5, 16), goldMaterial);
    rrLower.rotation.z = 0.5; // Bent up
    rrLower.position.set(1.5, 0.5, 0);
    rearRight.add(rrUpper);
    rearRight.add(rrLower);
    this.idolGroup.add(rearRight);

    // Rear Left Arm (Holding Sankhu) - Raised
    const rearLeft = createArm(-1.4, 2.5, 0, 0, 0, 0);
    rearLeft.clear();
    const rlUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.5, 16), goldMaterial);
    rlUpper.rotation.z = 0.5;
    rlUpper.position.set(-0.5, 0, 0);
    const rlLower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.5, 16), goldMaterial);
    rlLower.rotation.z = -0.5;
    rlLower.position.set(-1.5, 0.5, 0);
    rearLeft.add(rlUpper);
    rearLeft.add(rlLower);
    this.idolGroup.add(rearLeft);

    // Front Right Arm (Varada Hasta - Boon giving, palm down/out)
    const frontRight = new THREE.Group();
    frontRight.position.set(1.5, 2.2, 0.5);
    const frUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.6, 16), goldMaterial);
    frUpper.rotation.z = -0.2;
    frUpper.position.y = -0.8;
    const frLower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16), goldMaterial);
    frLower.position.set(0.2, -2.0, 0.2);
    frLower.rotation.x = -0.5; // Point forward
    // Hand
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), goldMaterial);
    rHand.position.set(0.2, -2.8, 0.6);
    rHand.rotation.x = 1.0; // Palm facing viewer/down
    frontRight.add(frUpper);
    frontRight.add(frLower);
    frontRight.add(rHand);
    this.idolGroup.add(frontRight);

    // Front Left Arm (Kati Hasta - On hip)
    const frontLeft = new THREE.Group();
    frontLeft.position.set(-1.5, 2.2, 0.5);
    const flUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.6, 16), goldMaterial);
    flUpper.rotation.z = 0.2;
    flUpper.position.y = -0.8;
    const flLower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16), goldMaterial);
    flLower.position.set(-0.3, -2.0, 0.0);
    flLower.rotation.z = 0.3; // Inward to hip
    // Hand
    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), goldMaterial);
    lHand.position.set(-0.6, -2.6, 0.2);
    lHand.rotation.z = 0.5; // Resting on thigh
    frontLeft.add(flUpper);
    frontLeft.add(flLower);
    frontLeft.add(lHand);
    this.idolGroup.add(frontLeft);


    // 5. HEAD & FACE
    const headGroup = new THREE.Group();
    headGroup.position.y = 3.0;
    
    // Face (Black Stone typically, but covered in gold/turmeric paste look here)
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), goldMaterial);
    face.scale.y = 1.3;
    headGroup.add(face);

    // Tiruman (The Great Namam) - White 'U' shape covering eyes
    const namamGroup = new THREE.Group();
    namamGroup.position.set(0, 0.2, 0.85);
    // Left Slab
    const nLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.1), whitePaste);
    nLeft.position.x = -0.2;
    nLeft.rotation.z = 0.1;
    // Right Slab
    const nRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.1), whitePaste);
    nRight.position.x = 0.2;
    nRight.rotation.z = -0.1;
    // Bottom Curve connection
    const nBottom = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.1), whitePaste);
    nBottom.position.y = -0.4;
    // Center Red Streak (Srichurnam)
    const nRed = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.12), redPaste);
    nRed.position.z = 0.02;
    
    namamGroup.add(nLeft);
    namamGroup.add(nRight);
    namamGroup.add(nBottom);
    namamGroup.add(nRed);
    headGroup.add(namamGroup);

    // Eyes (Hidden behind Namam mostly, but defined for depth)
    const eyes = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), whitePaste);
    eyes.position.set(0.3, 0.1, 0.8);
    eyes.scale.x = 2;
    // headGroup.add(eyes); // Optional, mostly covered by Namam

    // Makara Kundalams (Ears)
    const earL = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 8, 16), goldMaterial);
    earL.position.set(-1.0, 0, 0);
    earL.rotation.y = -0.5;
    const earR = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 8, 16), goldMaterial);
    earR.position.set(1.0, 0, 0);
    earR.rotation.y = 0.5;
    headGroup.add(earL);
    headGroup.add(earR);

    // 6. CROWN (Kireetam)
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 1.2;
    // Base tier
    const c1 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.95, 0.5, 32), goldMaterial);
    // Middle tier
    const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.8, 32), goldMaterial);
    c2.position.y = 0.6;
    // Top Cone
    const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.9, 1.5, 32), goldMaterial);
    c3.position.y = 1.7;
    // Finial (Kalasam)
    const cTop = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMaterial);
    cTop.position.y = 2.5;
    
    crownGroup.add(c1);
    crownGroup.add(c2);
    crownGroup.add(c3);
    crownGroup.add(cTop);
    
    // Add Gemstones to Crown
    const gem = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), gemGreen);
    gem.position.set(0, 0.6, 1.0);
    crownGroup.add(gem);
    
    headGroup.add(crownGroup);
    this.idolGroup.add(headGroup);


    // --- CHAKRA & SANKHU (Imported from previous ornate logic) ---
    
    // CHAKRA (Discus) - Positioned at Rear Right Hand
    const chakraGroup = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 16, 100), goldMaterial);
    chakraGroup.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32), goldMaterial);
    hub.rotation.x = Math.PI / 2;
    chakraGroup.add(hub);
    for(let i=0; i<12; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.02), goldMaterial);
        spoke.position.y = 0.25;
        const pivot = new THREE.Group();
        pivot.add(spoke);
        pivot.rotation.z = (i / 12) * Math.PI * 2;
        chakraGroup.add(pivot);
    }
    for(let i=0; i<16; i++) {
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), goldMaterial);
        flame.position.y = 0.55; 
        const pivot = new THREE.Group();
        pivot.add(flame);
        pivot.rotation.z = (i / 16) * Math.PI * 2;
        chakraGroup.add(pivot);
    }
    this.chakraMesh = chakraGroup;
    this.chakraMesh.position.set(2.0, 3.8, 0); // At hand tip
    this.idolGroup.add(this.chakraMesh);

    // SANKHU (Conch) - Positioned at Rear Left Hand
    const shankuGroup = new THREE.Group();
    const shankuBody = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.2, 32, 1, true), goldMaterial);
    shankuBody.rotation.z = Math.PI;
    shankuBody.position.y = -0.2;
    shankuGroup.add(shankuBody);
    const shankuHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), goldMaterial);
    shankuHead.position.y = 0.45;
    shankuGroup.add(shankuHead);
    const rib1 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 16, 50), goldMaterial);
    rib1.position.y = 0.25;
    rib1.rotation.x = Math.PI/2;
    shankuGroup.add(rib1);
    const rib2 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 16, 50), goldMaterial);
    rib2.position.y = 0.0;
    rib2.rotation.x = Math.PI/2;
    shankuGroup.add(rib2);
    this.shankuMesh = shankuGroup;
    this.shankuMesh.position.set(-2.0, 3.8, 0); // At hand tip
    this.shankuMesh.rotation.z = 0.2;
    this.idolGroup.add(this.shankuMesh);


    // 7. GARLANDS
    // Large Rose Garland
    const garlandGeo = new THREE.TorusGeometry(1.8, 0.2, 16, 64);
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xe60073, roughness: 0.9 });
    const garland = new THREE.Mesh(garlandGeo, roseMat);
    garland.rotation.x = 0.3; // Hang on shoulders
    garland.scale.y = 2.0;
    garland.position.y = 1.0;
    garland.position.z = 0.2;
    this.idolGroup.add(garland);

    // Tulasi Garland (Green)
    const tulasiGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 1.0 });
    const tulasi = new THREE.Mesh(tulasiGeo, greenMat);
    tulasi.rotation.x = 0.3;
    tulasi.scale.y = 1.8;
    tulasi.position.y = 1.2;
    tulasi.position.z = 0.3;
    this.idolGroup.add(tulasi);

    this.scene.add(this.idolGroup);

    // --- PARTICLES ---
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 15;
        posArray[i*3+1] = Math.random() * 10 - 2;
        posArray[i*3+2] = (Math.random() - 0.5) * 15;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.3,
        map: this.createTexture('sparkle'),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffaa44
    });
    this.particles = new THREE.Points(particlesGeo, particlesMat);
    this.scene.add(this.particles);

    // --- FLOWER SYSTEM ---
    const flowerGeo = new THREE.BufferGeometry();
    const flowerCount = 150;
    const flowerPos = new Float32Array(flowerCount * 3);
    const flowerVel: any[] = [];
    for(let i=0; i<flowerCount; i++) {
       flowerPos[i*3] = (Math.random() - 0.5) * 6; 
       flowerPos[i*3+1] = 12 + Math.random() * 10; 
       flowerPos[i*3+2] = (Math.random() - 0.5) * 6; 
       flowerVel.push({
          y: -0.05 - Math.random() * 0.05, 
          x: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03
       });
    }
    flowerGeo.setAttribute('position', new THREE.BufferAttribute(flowerPos, 3));
    flowerGeo.userData = { velocities: flowerVel };
    const flowerMat = new THREE.PointsMaterial({
       size: 0.5,
       map: this.createTexture('petal'),
       transparent: true,
       opacity: 0,
       depthWrite: false,
       color: 0xffffff,
       side: THREE.DoubleSide
    });
    this.flowers = new THREE.Points(flowerGeo, flowerMat);
    this.scene.add(this.flowers);

    // --- EVENTS ---
    const el = this.renderer.domElement;
    el.addEventListener('mousedown', (e: any) => this.onMouseDown(e));
    el.addEventListener('mousemove', (e: any) => this.onMouseMove(e));
    el.addEventListener('mouseup', () => this.onMouseUp());
    el.addEventListener('mouseleave', () => this.onMouseUp());
    el.addEventListener('touchstart', (e: any) => this.onTouchStart(e), {passive: false});
    el.addEventListener('touchmove', (e: any) => this.onTouchMove(e), {passive: false});
    el.addEventListener('touchend', () => this.onMouseUp());
    el.addEventListener('wheel', (e: any) => this.onWheel(e));

    this.animate();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Inertia Rotation
    if (this.isDragging) {
        this.targetRotation.x += this.mouseDelta.y * this.rotationSpeed;
        this.targetRotation.y += this.mouseDelta.x * this.rotationSpeed;
        this.targetRotation.x = Math.max(-0.5, Math.min(0.5, this.targetRotation.x));
        this.mouseDelta = { x: 0, y: 0 };
    } else {
        this.targetRotation.y += 0.001;
    }

    const damping = 0.05;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * damping;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * damping;

    if (this.idolGroup) {
        this.idolGroup.rotation.x = this.currentRotation.x;
        this.idolGroup.rotation.y = this.currentRotation.y;
    }

    // Sub-mesh Animations
    if (this.chakraMesh) {
       this.chakraMesh.rotation.z -= 0.15; // Fast spin
    }
    if (this.shankuMesh) {
       const time = Date.now() * 0.002;
       this.shankuMesh.position.y = 3.8 + Math.sin(time) * 0.08; 
       this.shankuMesh.rotation.y = Math.sin(time * 0.5) * 0.1;
    }

    // Dust Particles
    if (this.particles) {
       this.particles.rotation.y = this.currentRotation.y * 0.5;
       const positions = this.particles.geometry.attributes.position.array;
       for(let i = 1; i < positions.length; i+=3) {
          positions[i] -= 0.015; 
          if(positions[i] < -5) positions[i] = 8; 
       }
       this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Arathi Light
    if (this.arathiLight) {
        this.arathiLight.intensity = 2 + Math.random() * 1.5; 
        this.arathiLight.position.x += (Math.random() - 0.5) * 0.05;
        this.arathiLight.position.y += (Math.random() - 0.5) * 0.05;
    }

    // Flowers
    if (this.isRainingFlowers && this.flowers) {
       const positions = this.flowers.geometry.attributes.position.array;
       const vels = this.flowers.geometry.userData.velocities;
       for(let i=0; i < vels.length; i++) {
          positions[i*3] += vels[i].x;   
          positions[i*3+1] += vels[i].y; 
          positions[i*3+2] += vels[i].z; 
          if (positions[i*3+1] < -2) {
             positions[i*3+1] = 12 + Math.random() * 5; 
             positions[i*3] = (Math.random() - 0.5) * 6; 
          }
       }
       this.flowers.geometry.attributes.position.needsUpdate = true;
       if (this.flowers.material.opacity < 1) this.flowers.material.opacity += 0.02;
    } else if (this.flowers) {
       if (this.flowers.material.opacity > 0) this.flowers.material.opacity -= 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // --- Interaction Handlers ---

  performArathi() {
     if (this.isArathiActive) return;
     this.isArathiActive = true;
     
     this.arathiLight = new THREE.PointLight(0xffaa00, 3, 8);
     this.arathiLight.castShadow = true;
     this.scene.add(this.arathiLight);
     
     const flameGeo = new THREE.SphereGeometry(0.2, 16, 16);
     const flameMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
     const flameMesh = new THREE.Mesh(flameGeo, flameMat);
     this.scene.add(flameMesh);

     let angle = 0;
     const duration = 5000;
     const start = Date.now();
     const radius = 2.5;

     const animateArathi = () => {
        const now = Date.now();
        const progress = (now - start) / duration;
        
        if (progress < 1) {
            angle += 0.08;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius + 1.5; 
            const z = 3 + Math.sin(angle * 3) * 0.5;

            this.arathiLight.position.set(x, y, z);
            flameMesh.position.set(x, y, z);
            requestAnimationFrame(animateArathi);
        } else {
            this.scene.remove(this.arathiLight);
            this.scene.remove(flameMesh);
            this.arathiLight = null;
            this.isArathiActive = false;
        }
     };
     animateArathi();
  }

  performPushpanjali() {
    this.isRainingFlowers = true;
    setTimeout(() => {
       this.isRainingFlowers = false;
    }, 8000); 
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.mouseDelta = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  onMouseUp() { 
      this.isDragging = false; 
      this.mouseDelta = { x: 0, y: 0 };
  }

  onTouchStart(event: TouchEvent) {
      if(event.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
  }

  onTouchMove(event: TouchEvent) {
     if (this.isDragging && event.touches.length === 1) {
        event.preventDefault(); // Prevent scrolling
        this.mouseDelta = {
            x: event.touches[0].clientX - this.previousMousePosition.x,
            y: event.touches[0].clientY - this.previousMousePosition.y
        };
        this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
     }
  }

  onWheel(event: WheelEvent) {
      this.camera.position.z += event.deltaY * 0.005;
      this.camera.position.z = Math.min(Math.max(this.camera.position.z, 5), 20);
  }
}
