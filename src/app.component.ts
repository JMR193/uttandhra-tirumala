import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit, effect, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TempleService } from './services/temple.service';
import { ChatComponent } from './components/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col transition-colors duration-1000 bg-[#fffbeb]"
         [style.fontFamily]="'Lato'">
      
      <!-- Background Audio Element -->
      <audio #bgMusic loop src="https://www.tirumala.org/music/slogan.mp3"></audio>

      <!-- Top Bar: Deep Saffron with Gold Text -->
      <div class="text-sm py-2 px-4 flex justify-between items-center relative z-50 text-white bg-gradient-to-r from-orange-700 to-red-800 shadow-sm">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          
          <!-- Left Side: Mantra & Music Toggle -->
          <div class="flex items-center gap-4 mb-2 md:mb-0">
            <span class="font-serif tracking-wider font-bold text-amber-200">Om Namo Venkatesaya</span>
            
            <!-- Music Toggle Button -->
            <button (click)="toggleMusic()" 
               class="flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/50 bg-black/20 hover:bg-black/30 transition-all shadow-sm group cursor-pointer"
               [title]="isMusicPlaying() ? 'Pause Chanting' : 'Play Background Chanting'">
               @if (isMusicPlaying()) {
                   <div class="relative flex h-3 w-3">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                     <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                   </div>
                   <span class="text-xs font-bold text-amber-300 animate-pulse">CHANTING ON</span>
               } @else {
                   <span class="text-xs font-bold text-amber-100 group-hover:text-white">Play Chant</span>
               }
            </button>
          </div>

          <div class="flex gap-4 items-center text-amber-100 text-xs md:text-sm font-semibold">
            @if (deferredPrompt) {
              <button (click)="installPwa()" class="hidden md:flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold transition-all animate-pulse shadow-lg border border-amber-400">
                Install App
              </button>
            }
            <a routerLink="/digital-darshan" class="hover:text-white hover:underline decoration-amber-400 decoration-2 underline-offset-4 transition-all">3D Digital Darshan</a>
            <span class="hidden md:inline text-amber-500">|</span>
            @if (templeService.isAdmin()) {
              <button (click)="templeService.logout()" class="hover:text-white">Logout</button>
            } @else {
              <a routerLink="/admin" class="hover:text-white">Admin Login</a>
            }
          </div>
        </div>
      </div>

      <!-- iOS Install Hint Modal -->
      @if (showIosHint) {
         <div class="fixed inset-0 bg-black/80 z-[100] flex items-end justify-center pb-8 animate-fade-in" (click)="showIosHint = false">
            <div class="bg-white rounded-xl p-6 max-w-sm mx-4 relative shadow-2xl animate-fade-in-up border-t-4 border-amber-600" (click)="$event.stopPropagation()">
               <h3 class="text-lg font-bold text-[#800000] mb-2 font-serif">Install App on iOS</h3>
               <p class="text-sm text-stone-600 mb-4">Tap the share button and select "Add to Home Screen" for the best experience.</p>
               <button (click)="showIosHint = false" class="text-amber-700 font-bold text-sm">Dismiss</button>
            </div>
         </div>
      }

      <!-- Header / Navigation -->
      <header class="shadow-lg sticky top-0 z-40 bg-white border-b-4 border-amber-500">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
          <!-- Logo Area -->
          <div class="flex items-center gap-4 cursor-pointer group" routerLink="/">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-full flex items-center justify-center border-2 border-[#800000] shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-300">
               <img [src]="templeService.siteConfig().logoUrl" alt="Logo" class="object-cover w-full h-full p-1" />
            </div>
            <div>
              <h1 class="text-xl md:text-3xl font-extrabold leading-tight text-[#800000] font-serif tracking-tight group-hover:text-amber-700 transition-colors">
                  {{ templeService.siteConfig().templeName }}
              </h1>
              <p class="text-xs md:text-sm font-bold tracking-widest text-amber-600 uppercase">{{ templeService.siteConfig().subTitle }}</p>
            </div>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex gap-1 items-center">
             @if (templeService.siteConfig().enableBooking) {
                <a routerLink="/booking" routerLinkActive="text-[#800000] bg-amber-50" class="px-4 py-2 rounded-full font-bold text-stone-600 hover:text-[#800000] hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200">Darshan</a>
             }
             
             @if (templeService.siteConfig().enableHundi) {
                <a routerLink="/e-hundi" routerLinkActive="text-[#800000] bg-amber-50" class="px-4 py-2 rounded-full font-bold text-stone-600 hover:text-[#800000] hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200">E-Hundi</a>
             }

             <a routerLink="/history" routerLinkActive="text-[#800000] bg-amber-50" class="px-4 py-2 rounded-full font-bold text-stone-600 hover:text-[#800000] hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200">History</a>
             
             <a routerLink="/library" routerLinkActive="text-[#800000] bg-amber-50" class="px-4 py-2 rounded-full font-bold text-stone-600 hover:text-[#800000] hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200">Library</a>
             
             @if (templeService.isAdmin()) {
               <a routerLink="/admin" routerLinkActive="bg-[#800000] text-white" class="ml-2 px-5 py-2 rounded-full font-bold text-[#800000] border-2 border-[#800000] hover:bg-[#800000] hover:text-white transition-all shadow-sm">CMS</a>
             }
          </nav>

          <!-- Mobile Menu Button (Simple) -->
          <button class="lg:hidden text-[#800000] p-2 hover:bg-amber-50 rounded-lg transition-colors" (click)="toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

        </div>

        <!-- Mobile Nav Drawer -->
        @if (isMobileMenuOpen()) {
          <div class="lg:hidden bg-[#fffbeb] border-t border-amber-200 animate-fade-in relative z-50 shadow-xl">
            <nav class="flex flex-col p-4 gap-3">
              @if (templeService.siteConfig().enableBooking) {
                 <a (click)="closeMobileMenu()" routerLink="/booking" class="px-4 py-3 rounded-lg bg-gradient-to-r from-amber-50 to-white border border-amber-200 shadow-sm font-bold text-[#800000] flex items-center justify-between">Book Darshan <span>&rsaquo;</span></a>
              }
              
              @if (templeService.siteConfig().enableHundi) {
                 <a (click)="closeMobileMenu()" routerLink="/e-hundi" class="px-4 py-3 rounded-lg bg-white border border-amber-100 shadow-sm font-bold text-[#800000] flex items-center justify-between">E-Hundi <span>&rsaquo;</span></a>
              }
              
              <a (click)="closeMobileMenu()" routerLink="/history" class="px-4 py-3 rounded-lg bg-white border border-amber-100 shadow-sm font-bold text-[#800000] flex items-center justify-between">History & Info <span>&rsaquo;</span></a>
              <a (click)="closeMobileMenu()" routerLink="/library" class="px-4 py-3 rounded-lg bg-white border border-amber-100 shadow-sm font-bold text-[#800000] flex items-center justify-between">Library <span>&rsaquo;</span></a>
              <a (click)="closeMobileMenu()" routerLink="/gallery" class="px-4 py-3 rounded-lg bg-white border border-amber-100 shadow-sm font-bold text-[#800000] flex items-center justify-between">Gallery <span>&rsaquo;</span></a>
              <a (click)="closeMobileMenu()" routerLink="/feedback" class="px-4 py-3 rounded-lg bg-white border border-amber-100 shadow-sm font-bold text-[#800000] flex items-center justify-between">Feedback <span>&rsaquo;</span></a>
            </nav>
          </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow relative z-10">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer: Deep Maroon with Gold -->
      <footer class="bg-[#450a0a] text-amber-50 pt-16 pb-8 border-t-8 border-[#d97706] relative z-20">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <!-- Column 1: Info -->
          <div>
            <h3 class="text-2xl font-bold mb-6 font-serif text-amber-400 border-b border-amber-900/50 pb-2 inline-block">Contact Us</h3>
            <div class="space-y-4">
               <p class="font-bold text-lg text-white font-serif">{{ templeService.siteConfig().templeName }}</p>
               <p class="opacity-80 text-sm leading-relaxed">{{ templeService.siteConfig().address }}</p>
               <p class="mt-4 text-sm text-amber-200 font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  {{ templeService.siteConfig().contactEmail }}
               </p>
               <p class="text-sm text-amber-200 font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                  {{ templeService.siteConfig().contactPhone }}
               </p>
            </div>
          </div>
          
          <!-- Column 2: Links -->
          <div>
            <h3 class="text-2xl font-bold mb-6 font-serif text-amber-400 border-b border-amber-900/50 pb-2 inline-block">Quick Links</h3>
            <ul class="space-y-3 text-sm font-medium">
              <li><a routerLink="/history" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> History & Timings</a></li>
              @if (templeService.siteConfig().enableBooking) {
                 <li><a routerLink="/booking" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> Darshan Booking</a></li>
              }
              @if (templeService.siteConfig().enableHundi) {
                 <li><a routerLink="/e-hundi" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> E-Hundi Donation</a></li>
              }
              <li><a routerLink="/library" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> Spiritual Library</a></li>
              <li><a routerLink="/gallery" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> Photo Gallery</a></li>
              <li><a [href]="templeService.siteConfig().liveLink" target="_blank" class="hover:text-amber-300 transition-colors flex items-center gap-2"><span class="text-amber-600">›</span> YouTube Channel</a></li>
            </ul>
          </div>
          
          <!-- Column 3: Timings -->
          <div>
            <h3 class="text-2xl font-bold mb-6 font-serif text-amber-400 border-b border-amber-900/50 pb-2 inline-block">Temple Timings</h3>
            <div class="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <span class="text-amber-200">Suprabhatam:</span> <span class="font-bold">{{ templeService.siteConfig().timings.suprabhatam }}</span>
              <span class="text-amber-200">Morning:</span> <span class="font-bold">{{ templeService.siteConfig().timings.morningDarshan }}</span>
              <span class="text-amber-200">Break:</span> <span class="font-bold text-red-300">{{ templeService.siteConfig().timings.breakTime }}</span>
              <span class="text-amber-200">Evening:</span> <span class="font-bold">{{ templeService.siteConfig().timings.eveningDarshan }}</span>
              <span class="text-amber-200">Ekantha Seva:</span> <span class="font-bold">{{ templeService.siteConfig().timings.ekanthaSeva }}</span>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12 pt-8 border-t border-amber-900/50 text-sm text-amber-200/60">
          <p class="mb-1">&copy; 2026 {{ templeService.siteConfig().templeName }}. All Rights Reserved.</p>
          <p class="text-xs font-medium tracking-wide opacity-80">
            Designed & Developed by <span class="text-amber-600 font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">JMRSai Technologies</span>
          </p>
          
          <div class="flex flex-col items-center gap-3 mt-4">
             <p class="flex items-center gap-2 bg-[#2a0a0a] px-4 py-1.5 rounded-full border border-amber-900/50 shadow-inner">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                <span class="text-amber-100 uppercase text-[10px] tracking-widest font-bold">Live Visitors:</span>
                <span class="font-mono font-bold text-amber-400 text-lg">{{ templeService.visitorCount() }}</span>
             </p>
             <p class="text-xl md:text-2xl font-serif font-bold mt-2 text-gradient-gold drop-shadow-sm opacity-90">Om Namo Venkatesaya</p>
          </div>
        </div>
      </footer>
      
      <!-- AI Chat Widget -->
      <app-chat></app-chat>
    </div>
  `
})
export class AppComponent implements AfterViewInit, OnDestroy {
  templeService = inject(TempleService);
  
  @ViewChild('bgMusic') bgMusicRef!: ElementRef<HTMLAudioElement>;
  
  isMusicPlaying = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  
  deferredPrompt: any = null;
  showIosHint = false;

  // Particle Animation ID for cleanup
  private particleFrameId: number | null = null;

  constructor() {
    effect(() => {
       // React to theme changes if needed
    });
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

  ngOnDestroy() {
     if (this.particleFrameId) {
        cancelAnimationFrame(this.particleFrameId);
     }
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
    const particleCount = 40; // Reduced for subtle effect

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
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.4;
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
        // Golden particles
        ctx.fillStyle = `rgba(251, 191, 36, ${this.opacity})`; 
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
      this.particleFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}