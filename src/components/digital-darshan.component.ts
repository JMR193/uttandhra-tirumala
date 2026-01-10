
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TempleService } from '../services/temple.service';

declare var THREE: any;

@Component({
  selector: 'app-digital-darshan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-screen bg-black overflow-hidden" (window:resize)="onResize()">
      
      <!-- 3D Canvas Container -->
      <div #canvasContainer class="absolute inset-0 z-0"></div>

      <!-- UI Overlay -->
      <div class="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        <!-- Header -->
        <div class="flex justify-between items-start pointer-events-auto">
           <div class="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 text-white">
              <h2 class="text-2xl font-serif font-bold text-amber-400">Digital Darshan</h2>
              <p class="text-xs text-stone-300">Interact to rotate. Scroll to Zoom.</p>
           </div>
           <button (click)="close.emit()" class="bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-4 pointer-events-auto pb-8">
           <button (click)="performArathi()" class="bg-gradient-to-r from-amber-500 to-red-600 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 animate-pulse"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" /></svg>
             Perform Harathi
           </button>
        </div>

      </div>

      <!-- Loading Indicator -->
      @if (loading) {
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-black text-amber-500">
           <div class="flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="font-serif tracking-widest text-sm">ENTERING VAIKUNTAM...</p>
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
  private animationId: number | null = null;
  private light: any;
  
  // Interaction State
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationSpeed = 0.005;

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
    if (this.renderer) this.renderer.dispose();
  }

  initThreeJS() {
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded');
      return;
    }

    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 8;
    this.camera.position.y = 2;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.containerRef.nativeElement.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffaa00, 0.3); // Warm ambient
    this.scene.add(ambientLight);

    this.light = new THREE.PointLight(0xffaa00, 1.5, 50);
    this.light.position.set(0, 5, 5);
    this.light.castShadow = true;
    this.scene.add(this.light);

    // 5. Construct the Abstract Deity (Gold Material)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x442200
    });

    this.idolGroup = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 1, 32);
    const base = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    base.position.y = -2;
    this.idolGroup.add(base);

    // Body (Abstract)
    const bodyGeo = new THREE.CylinderGeometry(0.8, 1.2, 4, 32);
    const body = new THREE.Mesh(bodyGeo, goldMaterial);
    this.idolGroup.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const head = new THREE.Mesh(headGeo, goldMaterial);
    head.position.y = 2.5;
    this.idolGroup.add(head);

    // Namam (Mark) - Red
    const namamGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const namamMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const namam = new THREE.Mesh(namamGeo, namamMat);
    namam.position.set(0, 2.5, 0.85);
    this.idolGroup.add(namam);

    // Crown (Kireetam)
    const crownGeo = new THREE.ConeGeometry(0.8, 2, 32);
    const crown = new THREE.Mesh(crownGeo, goldMaterial);
    crown.position.y = 4;
    this.idolGroup.add(crown);

    // Chakram & Shankhu (Simple Torus shapes)
    const chakraGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
    const chakra = new THREE.Mesh(chakraGeo, goldMaterial);
    chakra.position.set(1.5, 1.5, 0);
    this.idolGroup.add(chakra);

    const shankuGeo = new THREE.ConeGeometry(0.3, 0.8, 32);
    const shanku = new THREE.Mesh(shankuGeo, goldMaterial);
    shanku.position.set(-1.5, 1.5, 0);
    shanku.rotation.z = -0.5;
    this.idolGroup.add(shanku);

    // Garlands (Torus knots)
    const garlandGeo = new THREE.TorusGeometry(1.4, 0.15, 16, 100);
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 1 }); // Pink flowers
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.rotation.x = Math.PI / 2;
    garland.rotation.y = 0.2;
    garland.scale.y = 2; // Stretch
    garland.position.y = 0.5;
    this.idolGroup.add(garland);

    this.scene.add(this.idolGroup);

    // 6. Particles (Divine Dust)
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffaa00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(particlesGeo, particlesMat);
    this.scene.add(this.particles);

    // 7. Event Listeners for Interaction
    const el = this.renderer.domElement;
    el.addEventListener('mousedown', (e: any) => this.onMouseDown(e));
    el.addEventListener('mousemove', (e: any) => this.onMouseMove(e));
    el.addEventListener('mouseup', () => this.onMouseUp());
    el.addEventListener('touchstart', (e: any) => this.onTouchStart(e), {passive: false});
    el.addEventListener('touchmove', (e: any) => this.onTouchMove(e), {passive: false});
    el.addEventListener('touchend', () => this.onMouseUp());
    el.addEventListener('wheel', (e: any) => this.onWheel(e));

    this.animate();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Idle Animation
    if (!this.isDragging) {
       this.idolGroup.rotation.y += 0.001;
    }

    // Particle Animation
    this.particles.rotation.y -= 0.0005;
    this.particles.rotation.x += 0.0002;

    this.renderer.render(this.scene, this.camera);
  }

  // --- Interaction Handlers ---

  performArathi() {
     // Create a bright light that moves in a circle
     const arathiLight = new THREE.PointLight(0xff5500, 3, 5);
     arathiLight.position.set(0, 0, 2);
     this.scene.add(arathiLight);

     let angle = 0;
     const duration = 2000; // 2 seconds
     const start = Date.now();

     const animateArathi = () => {
        const now = Date.now();
        const progress = (now - start) / duration;
        
        if (progress < 1) {
            angle += 0.15;
            arathiLight.position.x = Math.cos(angle) * 1.5;
            arathiLight.position.y = Math.sin(angle) * 1.5;
            arathiLight.position.z = 2 + Math.sin(angle * 2) * 0.5;
            requestAnimationFrame(animateArathi);
        } else {
            this.scene.remove(arathiLight);
        }
     };
     animateArathi();
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
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };
      
      this.idolGroup.rotation.y += deltaMove.x * this.rotationSpeed;
      this.idolGroup.rotation.x += deltaMove.y * this.rotationSpeed;
      
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  onMouseUp() { this.isDragging = false; }

  onTouchStart(event: TouchEvent) {
      if(event.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
  }

  onTouchMove(event: TouchEvent) {
     if (this.isDragging && event.touches.length === 1) {
        event.preventDefault();
        const deltaMove = {
            x: event.touches[0].clientX - this.previousMousePosition.x,
            y: event.touches[0].clientY - this.previousMousePosition.y
        };
        this.idolGroup.rotation.y += deltaMove.x * this.rotationSpeed;
        this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
     }
  }

  onWheel(event: WheelEvent) {
      this.camera.position.z += event.deltaY * 0.005;
      // Clamp zoom
      this.camera.position.z = Math.min(Math.max(this.camera.position.z, 3), 15);
  }
}
