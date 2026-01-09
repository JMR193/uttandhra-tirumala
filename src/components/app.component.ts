
import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TempleService } from '../services/temple.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50 font-serif">
      <!-- Background Audio Element -->
      <audio #bgMusic loop src="https://www.tirumala.org/music/slogan.mp3"></audio>

      <!-- TTD Style Header -->
      <header class="shadow-lg z-50 sticky top-0">
        
        <!-- Top Bar: Maroon Background -->
        <div class="bg-[#800000] text-amber-200 text-xs md:text-sm py-1 px-4 border-b border-amber-600/50">
           <div class="container mx-auto flex justify-between items-center">
             <div class="flex gap-4">
               <span class="hover:text-white cursor-pointer">Skip to Main Content</span>
               <span>|</span>
               <span class="hover:text-white cursor-pointer">Screen Reader Access</span>
             </div>
             <div class="flex gap-4 items-center">
                <button (click)="toggleMusic()" class="flex items-center gap-1 hover:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                   </svg>
                   <span>{{ isMusicPlaying() ? 'Pause Chant' : 'Play Chant' }}</span>
                </button>
                <span>|</span>
                <div class="flex gap-2">
                   <a href="#" class="font-bold">A+</a>
                   <a href="#" class="font-bold">A-</a>
                </div>
                <span>|</span>
                @if (templeService.isAdmin()) {
                   <button (click)="templeService.logout()" class="font-bold text-white bg-red-800 px-2 rounded">Logout</button>
                } @else {
                   <a routerLink="/admin" class="hover:text-white">Admin Login</a>
                }
             </div>
           </div>
        </div>

        <!-- Main Header Area: White Background -->
        <div class="bg-white py-2 border-b-4 border-[#800000]">
           <div class="container mx-auto px-4 flex justify-between items-center">
              
              <!-- Left: Logo & Title -->
              <div class="flex items-center gap-4">
                 <div class="relative w-20 h-20 md:w-24 md:h-24">
                    <img [src]="templeService.siteConfig().logoUrl" class="w-full h-full object-contain drop-shadow-md">
                 </div>
                 <div class="hidden md:block">
                    <h1 class="text-[#800000] text-2xl md:text-3xl font-bold uppercase tracking-tight leading-none">{{ templeService.siteConfig().templeName }}</h1>
                    <p class="text-stone-600 font-bold text-sm tracking-widest mt-1">{{ templeService.siteConfig().subTitle }}</p>
                 </div>
              </div>

              <!-- Right: Deity Image or Emblem (Stylistic) -->
              <div class="hidden md:block opacity-90">
                 <img src="https://www.tirumala.org/Images/TTD-Logo.png" alt="Emblem" class="h-20 opacity-80" onError="this.style.display='none'">
              </div>
              
              <!-- Mobile Menu Toggle -->
              <button class="md:hidden text-[#800000]" (click)="toggleMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
           </div>
        </div>

        <!-- Navigation Bar: Gold/Yellow Background -->
        <div class="bg-gradient-to-r from-amber-500 to-yellow-500 shadow-md hidden md:block">
           <div class="container mx-auto px-4">
              <nav class="flex justify-center">
                 <a routerLink="/" routerLinkActive="bg-[#800000] text-white" [routerLinkActiveOptions]="{exact: true}" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">Home</a>
                 <a routerLink="/history" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">History</a>
                 <a routerLink="/e-hundi" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">E-Hundi</a>
                 <a routerLink="/library" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">Library</a>
                 <a routerLink="/gallery" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">Gallery</a>
                 <a routerLink="/feedback" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">Feedback</a>
                 @if (templeService.isAdmin()) {
                   <a routerLink="/admin" routerLinkActive="bg-[#800000] text-white" class="px-6 py-3 font-bold text-[#800000] hover:bg-[#800000] hover:text-white transition-colors uppercase text-sm tracking-wide">Admin CMS</a>
                 }
              </nav>
           </div>
        </div>

        <!-- Mobile Nav Drawer -->
        @if (isMobileMenuOpen()) {
          <div class="md:hidden bg-[#800000] text-white border-t border-amber-500 animate-fade-in">
            <nav class="flex flex-col p-4 gap-2">
              <a (click)="closeMobileMenu()" routerLink="/" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">Home</a>
              <a (click)="closeMobileMenu()" routerLink="/history" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">History</a>
              <a (click)="closeMobileMenu()" routerLink="/e-hundi" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">E-Hundi</a>
              <a (click)="closeMobileMenu()" routerLink="/library" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">Library</a>
              <a (click)="closeMobileMenu()" routerLink="/gallery" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">Gallery</a>
              <a (click)="closeMobileMenu()" routerLink="/feedback" class="px-4 py-3 rounded hover:bg-red-900 border-b border-red-900">Feedback</a>
              @if (templeService.isAdmin()) {
                 <a (click)="closeMobileMenu()" routerLink="/admin" class="px-4 py-3 rounded hover:bg-red-900 font-bold text-amber-300">CMS Dashboard</a>
              }
            </nav>
          </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer: TTD Style Footer (Dark Maroon) -->
      <footer class="bg-[#2c0b0e] text-amber-50 py-12 border-t-8 border-amber-600">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          
          <!-- Column 1 -->
          <div>
            <h3 class="text-lg font-bold text-amber-400 mb-4 border-b border-amber-800 pb-2">About Temple</h3>
            <p class="mb-4 opacity-80 leading-relaxed">{{ templeService.siteConfig().templeName }} is a divine destination in Uttarandhra, replicating the sanctity of Tirumala.</p>
            <div class="flex gap-4">
               <a [href]="templeService.siteConfig().liveLink" target="_blank" class="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>
               </a>
            </div>
          </div>

          <!-- Column 2 -->
          <div>
            <h3 class="text-lg font-bold text-amber-400 mb-4 border-b border-amber-800 pb-2">Quick Links</h3>
            <ul class="space-y-2 opacity-80">
              <li><a routerLink="/history" class="hover:text-amber-300">History & Significance</a></li>
              <li><a routerLink="/e-hundi" class="hover:text-amber-300">E-Hundi / Donations</a></li>
              <li><a routerLink="/gallery" class="hover:text-amber-300">Photo Gallery</a></li>
              <li><a routerLink="/library" class="hover:text-amber-300">Audio Library</a></li>
            </ul>
          </div>

          <!-- Column 3 -->
          <div>
            <h3 class="text-lg font-bold text-amber-400 mb-4 border-b border-amber-800 pb-2">Temple Timings</h3>
            <ul class="space-y-2 opacity-80">
              <li class="flex justify-between"><span>Suprabhatam:</span> <span>05:00 AM</span></li>
              <li class="flex justify-between"><span>Darshan (M):</span> <span>06:00 AM - 01:00 PM</span></li>
              <li class="flex justify-between"><span>Darshan (E):</span> <span>04:00 PM - 08:30 PM</span></li>
              <li class="flex justify-between"><span>Ekantha Seva:</span> <span>09:00 PM</span></li>
            </ul>
          </div>

          <!-- Column 4 -->
          <div>
            <h3 class="text-lg font-bold text-amber-400 mb-4 border-b border-amber-800 pb-2">Contact Info</h3>
            <p class="opacity-80 mb-2">{{ templeService.siteConfig().address }}</p>
            <p class="opacity-80 mb-2">Phone: {{ templeService.siteConfig().contactPhone }}</p>
            <p class="opacity-80">Email: {{ templeService.siteConfig().contactEmail }}</p>

            @if (templeService.siteConfig().whatsappChannel) {
              <a [href]="templeService.siteConfig().whatsappChannel" target="_blank" class="block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center transition-colors flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                 Join WhatsApp Channel
              </a>
            }
          </div>

        </div>
        
        <div class="bg-[#1a0507] text-center py-4 mt-8 text-xs opacity-50">
          <p>&copy; 2026 {{ templeService.siteConfig().templeName }}. All Rights Reserved. | Designed for Devotees.</p>
        </div>
      </footer>
    </div>
  `
