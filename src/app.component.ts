
import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TempleService } from './services/temple.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col transition-colors duration-1000"
         [class.bg-stone-50]="!isNightMode()" 
         [class.bg-slate-900]="isNightMode()">
      
      <!-- Background Audio Element -->
      <audio #bgMusic loop src="https://www.tirumala.org/music/slogan.mp3"></audio>

      <!-- Top Bar -->
      <div class="text-sm py-2 px-4 flex justify-between items-center transition-colors duration-500 relative z-50"
           [class.bg-red-900]="!isNightMode()" [class.text-amber-100]="!isNightMode()"
           [class.bg-slate-950]="isNightMode()" [class.text-blue-100]="isNightMode()">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          
          <!-- Left Side: Mantra & Music Toggle -->
          <div class="flex items-center gap-4 mb-2 md:mb-0">
            <span class="font-serif tracking-wider font-bold text-amber-300">Om Namo Venkatesaya</span>
            
            <!-- Music Toggle Button -->
            <button (click)="toggleMusic()" 
               class="flex items-center gap-2 px-3 py-1 rounded-full border border-amber-800 bg-black/20 hover:bg-amber-900 transition-all shadow-sm group cursor-pointer"
               [title]="isMusicPlaying() ? 'Pause Chanting' : 'Play Background Chanting'">
               @if (isMusicPlaying()) {
                   <div class="relative flex h-3 w-3">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                     <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                   </div>
                   <span class="text-xs font-bold text-amber-400 animate-pulse">PLAYING</span>
               } @else {
                   <span class="text-xs font-bold opacity-80 group-hover:text-white">Play Chant</span>
               }
            </button>
          </div>

          <div class="flex gap-4 items-center">
            @if (deferredPrompt) {
              <button (click)="installPwa()" class="hidden md:flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold transition-all animate-pulse">
                Install App
              </button>
            }
            <a routerLink="/digital-darshan" class="font-bold text-amber-400 hover:text-white animate-pulse">3D Digital Darshan</a>
            <span class="hidden md:inline">|</span>
            @if (templeService.isAdmin()) {
              <button (click)="templeService.logout()" class="font-bold hover:text-white text-xs md:text-sm">Logout</button>
            } @else {
              <a routerLink="/admin" class="hover:text-white transition-colors text-xs md:text-sm">Admin</a>
            }
          </div>
        </div>
      </div>

      <!-- iOS Install Hint Modal -->
      @if (showIosHint) {
         <div class="fixed inset-0 bg-black/80 z-[100] flex items-end justify-center pb-8 animate-fade-in" (click)="showIosHint = false">
            <div class="bg-white rounded-xl p-6 max-w-sm mx-4 relative shadow-2xl animate-fade-in-up" (click)="$event.stopPropagation()">
               <h3 class="text-lg font-bold text-red-900 mb-2">Install App on iOS</h3>
               <p class="text-sm text-stone-600 mb-4">Install this app on your iPhone for the best experience.</p>
            </div>
         </div>
      }

      <!-- Header / Navigation -->
      <header class="shadow-md sticky top-0 z-40 border-b-4 border-amber-500 transition-colors duration-500"
              [class.bg-white]="!isNightMode()" [class.bg-slate-900]="isNightMode()">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
          <!-- Logo Area -->
          <div class="flex items-center gap-4 cursor-pointer" routerLink="/">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-red-800 shadow-inner overflow-hidden">
               <img [src]="templeService.siteConfig().logoUrl" alt="Logo" class="object-cover w-full h-full opacity-90" />
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold leading-tight transition-colors" [class.text-red-900]="!isNightMode()" [class.text-amber-500]="isNightMode()">{{ templeService.siteConfig().templeName }}</h1>
              <p class="text-xs md:text-sm font-semibold tracking-wide transition-colors" [class.text-stone-600]="!isNightMode()" [class.text-stone-400]="isNightMode()">{{ templeService.siteConfig().subTitle }}</p>
            </div>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex gap-1">
             <a routerLink="/" routerLinkActive="bg-red-50 text-red-800" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">Home</a>
             <a routerLink="/history" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">History</a>
             <a routerLink="/booking" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">Booking</a>
             <a routerLink="/e-hundi" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">E-Hundi</a>
             <a routerLink="/library" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">Library</a>
             <a routerLink="/gallery" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold transition-colors" [class.text-stone-700]="!isNightMode()" [class.text-stone-300]="isNightMode()">Gallery</a>
             @if (templeService.isAdmin()) {
               <a routerLink="/admin" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-amber-500 border border-amber-200 bg-amber-900/10">CMS</a>
             }
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow relative z-10">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-stone-900 text-stone-300 py-12 border-t-8 border-red-900 relative z-20">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Contact Us</h3>
            <p class="mb-2"><strong>{{ templeService.siteConfig().templeName }}</strong></p>
            <p class="mb-1">Pendurthi, Visakhapatnam</p>
            <p class="mb-1">{{ templeService.siteConfig().subTitle }}</p>
            <p class="mt-4 text-sm text-stone-400">Email: {{ templeService.siteConfig().contactEmail }}</p>
          </div>
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/history" class="hover:text-amber-400 transition-colors">History & Timings</a></li>
              <li><a routerLink="/booking" class="hover:text-amber-400 transition-colors">Darshan Booking</a></li>
              <li><a routerLink="/e-hundi" class="hover:text-amber-400 transition-colors">E-Hundi Donation</a></li>
              <li><a routerLink="/library" class="hover:text-amber-400 transition-colors">Spiritual Library</a></li>
              <li><a routerLink="/gallery" class="hover:text-amber-400 transition-colors">Photo Gallery</a></li>
              <li><a [href]="templeService.siteConfig().liveLink" target="_blank" class="hover:text-amber-400 transition-colors">YouTube Channel</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Temple Timing</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span>Suprabhatam:</span> <span>05:00 AM</span>
              <span>Darshanam:</span> <span>06:00 AM - 01:00 PM</span>
              <span>Break:</span> <span>01:00 PM - 04:00 PM</span>
              <span>Darshanam:</span> <span>04:00 PM - 08:30 PM</span>
              <span>Ekantha Seva:</span> <span>09:00 PM</span>
            </div>
          </div>
        </div>
        <div class="text-center mt-12 pt-8 border-t border-stone-800 text-sm text-stone-500">
          <p class="mb-4">&copy; 2026 {{ templeService.siteConfig().templeName }}. All Rights Reserved.</p>
          
          <div class="flex flex-col items-center gap-2">
             <p class="flex items-center gap-2 bg-stone-800 px-3 py-1 rounded-full border border-stone-700 shadow-inner">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-stone-400 uppercase text-[10px] tracking-widest">Live Visitors:</span>
                <span class="text-amber-400 font-mono font-bold">{{ visitorCount }}</span>
             </p>
             <p class="text-xs text-stone-600 font-serif italic opacity-70">Made with love by JMR</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  templeService = inject(TempleService);
  
  @ViewChild('bgMusic') bgMusicRef!: ElementRef<HTMLAudioElement>;
  
  isMusicPlaying = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  
  deferredPrompt: any = null;
  showIosHint = false;
  visitorCount = 1245089 + Math.floor(Math.random() * 50);

  constructor() {
    effect(() => {
       // React to theme changes if needed
    });
  }

  isNightMode() {
    return this.templeService.timeOfDay() === 'night' || this.templeService.timeOfDay() === 'evening';
  }

  ngAfterViewInit() {
    // PWA Handlers
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isIos && !isStandalone) {
       setTimeout(() => this.showIosHint = true, 3000);
    }

    // Initialize Divine Particles
    this.initParticles();
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          this.deferredPrompt = null;
        }
      });
    }
  }

  toggleMusic() {
    const audio = this.bgMusicRef.nativeElement;
    if (this.isMusicPlaying()) {
      audio.pause();
      this.isMusicPlaying.set(false);
    } else {
      audio.play().catch(e => console.error("Audio play failed", e));
      this.isMusicPlaying.set(true);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  // --- Atmospheric Physics (Particles) ---
  initParticles() {
    const canvas = document.getElementById('divine-particles') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`; // Gold color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    };

    animate();
  }
}
