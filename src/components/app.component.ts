import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TempleService } from '../services/temple.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50">
      <!-- Top Bar -->
      <div class="bg-red-900 text-amber-100 text-sm py-2 px-4 flex justify-between items-center">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <span class="mb-2 md:mb-0">Om Namo Venkatesaya</span>
          <div class="flex gap-4">
            <a href="tel:+919999999999" class="hover:text-white transition-colors">Help Desk</a>
            <span>|</span>
            <a href="#" class="hover:text-white transition-colors">Tenders</a>
            <span>|</span>
            @if (templeService.isAdmin()) {
              <button (click)="templeService.logout()" class="font-bold text-amber-400 hover:text-amber-200">Logout (Admin)</button>
            } @else {
              <a routerLink="/admin" class="hover:text-white transition-colors">Admin Login</a>
            }
          </div>
        </div>
      </div>

      <!-- Header / Navigation -->
      <header class="bg-white shadow-md sticky top-0 z-50 border-b-4 border-amber-500">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
          <!-- Logo Area -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-red-800 shadow-inner overflow-hidden">
               <img src="https://picsum.photos/id/1047/100/100" alt="Logo" class="object-cover w-full h-full opacity-90" />
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-red-900 leading-tight">Uttarandhra Tirupati</h1>
              <p class="text-xs md:text-sm text-stone-600 font-semibold tracking-wide">Shri Venkateswara Swamy Temple, Pendurthi</p>
            </div>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex gap-1">
            <a routerLink="/" routerLinkActive="bg-red-50 text-red-800" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Home</a>
            <a routerLink="/e-hundi" routerLinkActive="bg-red-50 text-red-800" class="px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">E-Hundi</a>
            <a routerLink="/library" routerLinkActive="bg-red-50 text-red-800" class="px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Library</a>
            <a routerLink="/gallery" routerLinkActive="bg-red-50 text-red-800" class="px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Gallery</a>
            <a routerLink="/feedback" routerLinkActive="bg-red-50 text-red-800" class="px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Feedback</a>
            @if (templeService.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="bg-red-50 text-red-800" class="px-4 py-2 rounded-lg font-bold text-amber-700 border border-amber-200 bg-amber-50">CMS Dashboard</a>
            }
          </nav>

          <!-- Mobile Menu Button (Simple) -->
          <button class="md:hidden text-red-900 p-2" (click)="toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <!-- Mobile Nav Drawer (Basic implementation) -->
        @if (isMobileMenuOpen) {
          <div class="md:hidden bg-stone-100 border-t border-stone-200">
            <nav class="flex flex-col p-4 gap-2">
              <a (click)="closeMobileMenu()" routerLink="/" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800">Home</a>
              <a (click)="closeMobileMenu()" routerLink="/e-hundi" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800">E-Hundi</a>
              <a (click)="closeMobileMenu()" routerLink="/library" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800">Library</a>
              <a (click)="closeMobileMenu()" routerLink="/gallery" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800">Gallery</a>
              <a (click)="closeMobileMenu()" routerLink="/feedback" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800">Feedback</a>
              @if (templeService.isAdmin()) {
                 <a (click)="closeMobileMenu()" routerLink="/admin" class="px-4 py-3 rounded-md bg-amber-100 shadow-sm font-semibold text-amber-900">CMS Dashboard</a>
              }
            </nav>
          </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-stone-900 text-stone-300 py-12 border-t-8 border-red-900">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Contact Us</h3>
            <p class="mb-2"><strong>Uttarandhra Tirupati</strong></p>
            <p class="mb-1">Shri Venkateswara Swamy Temple</p>
            <p class="mb-1">Balaji Nagar, Pendurthi</p>
            <p class="mb-1">Visakhapatnam, Andhra Pradesh 531173</p>
            <p class="mt-4 text-sm text-stone-400">Email: helpdesk&#64;uttarandhratirupati.org</p>
          </div>
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/e-hundi" class="hover:text-amber-400 transition-colors">E-Hundi Donation</a></li>
              <li><a routerLink="/library" class="hover:text-amber-400 transition-colors">Spiritual Library</a></li>
              <li><a routerLink="/gallery" class="hover:text-amber-400 transition-colors">Photo Gallery</a></li>
              <li><a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="hover:text-amber-400 transition-colors">YouTube Channel</a></li>
              <li><a routerLink="/feedback" class="hover:text-amber-400 transition-colors">Devotee Feedback</a></li>
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
          <p>&copy; 2024 Uttarandhra Tirupati Devasthanam. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  templeService = inject(TempleService);
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
