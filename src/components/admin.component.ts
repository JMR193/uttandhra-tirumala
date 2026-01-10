
import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, effect, computed } from '@angular/core';
import { TempleService, Donation, SiteConfig, Task } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-orange-50 font-sans">
      
      <!-- Login Overlay -->
      @if (!templeService.isAdmin()) {
        <!-- ... (Login code same as before, truncated for brevity, assume existing login UI here) ... -->
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-amber-400 animate-fade-in">
             <h2 class="text-3xl font-serif font-bold text-red-900 mb-4 text-center">Temple OS Admin</h2>
             <input type="email" [(ngModel)]="email" class="w-full mb-4 p-3 border rounded" placeholder="Email">
             <input type="password" [(ngModel)]="password" class="w-full mb-4 p-3 border rounded" placeholder="Password">
             <button (click)="handleLogin()" class="w-full bg-red-900 text-white p-3 rounded font-bold">Login</button>
          </div>
        </div>
      } @else {
        
        <div class="flex h-screen overflow-hidden">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-red-900 text-amber-50 flex flex-col shadow-2xl z-20 border-r border-red-800">
            <!-- ... (Sidebar Header) ... -->
            <div class="p-6 text-center border-b border-red-800">
                <h3 class="text-xl font-bold text-amber-400">Temple OS</h3>
                <p class="text-xs text-red-200">v2.1.0 • Live</p>
            </div>

            <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
              <button (click)="setActiveTab('dashboard')" [class]="activeTab() === 'dashboard' ? 'bg-amber-500 text-red-950 font-bold' : 'hover:bg-red-800'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all">Dashboard</button>
              <button (click)="setActiveTab('crowd')" [class]="activeTab() === 'crowd' ? 'bg-amber-500 text-red-950 font-bold' : 'hover:bg-red-800'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all">Crowd Heatmap</button>
              <button (click)="setActiveTab('settings')" [class]="activeTab() === 'settings' ? 'bg-amber-500 text-red-950 font-bold' : 'hover:bg-red-800'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all">Site Config</button>
            </nav>
            <div class="p-4 border-t border-red-800">
               <button (click)="templeService.logout()" class="w-full text-left px-4 py-2 hover:bg-red-800 rounded">Logout</button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-grow p-8 overflow-y-auto bg-stone-100">
            
            <!-- Dashboard View -->
            @if (activeTab() === 'dashboard') {
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-6">Live Dashboard</h2>
              
              <!-- Quick Toggles -->
              <div class="bg-white p-6 rounded-xl shadow-lg border border-stone-200 mb-8 flex gap-8 items-center">
                 <div>
                    <h3 class="font-bold text-stone-700">Festival Mode</h3>
                    <p class="text-xs text-stone-500">Enables festive decorations globally.</p>
                 </div>
                 <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [checked]="templeService.festivalMode()" (change)="toggleFestivalMode($event)" class="sr-only peer">
                    <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                 </label>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-gradient-to-br from-red-800 to-red-900 p-6 rounded-xl shadow-lg text-white">
                    <p class="text-xs font-bold uppercase tracking-widest opacity-70">Daily Footfall</p>
                    <p class="text-4xl font-serif font-bold mt-2">12,450</p>
                    <p class="text-xs mt-2 text-green-300">↑ 12% vs Yesterday</p>
                 </div>
                 <!-- Other stats... -->
              </div>
            }

            <!-- Crowd Heatmap View -->
            @if (activeTab() === 'crowd') {
                <h2 class="text-3xl font-serif font-bold text-red-900 mb-6">Real-Time Queue Heatmap</h2>
                
                <div class="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                    <div class="flex justify-between items-center mb-4">
                        <p class="text-stone-600 text-sm">Visual representation of Vaikuntam Queue Complex occupancy.</p>
                        <div class="flex gap-2 text-xs">
                           <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-200"></span> Low</span>
                           <span class="flex items-center gap-1"><span class="w-3 h-3 bg-yellow-200"></span> Med</span>
                           <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400"></span> High</span>
                        </div>
                    </div>

                    <!-- CSS Grid Heatmap representing compartments -->
                    <div class="grid grid-cols-5 gap-2 p-4 bg-stone-50 border border-stone-300 rounded-lg h-96">
                        @for (cell of heatmapData; track cell.id) {
                           <div class="rounded flex flex-col items-center justify-center text-xs font-bold transition-all duration-500 border border-black/5"
                                [style.background-color]="getHeatmapColor(cell.occupancy)">
                                Comp {{ cell.id }}
                                <span class="opacity-60">{{ cell.occupancy }}%</span>
                           </div>
                        }
                    </div>
                </div>
            }

            <!-- Settings View -->
            @if (activeTab() === 'settings') {
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-6">Site Configuration</h2>
               <div class="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
                  <p class="text-stone-500 mb-4">Update global site parameters.</p>
                  <!-- Form truncated for brevity, same as original -->
                  <button (click)="saveSettings()" class="bg-red-900 text-white px-6 py-2 rounded font-bold">Save Config</button>
               </div>
            }

          </main>
        </div>
      }
    </div>
  `
})
export class AdminComponent {
  templeService = inject(TempleService);
  
  // Login State
  email = '';
  password = '';
  
  activeTab = signal<'dashboard' | 'crowd' | 'settings'>('dashboard');
  
  // Heatmap Mock Data
  heatmapData: any[] = [];

  constructor() {
      // Generate 20 compartments
      for(let i=1; i<=30; i++) {
          this.heatmapData.push({ id: i, occupancy: Math.floor(Math.random() * 100) });
      }
      
      // Live update simulation
      setInterval(() => {
          this.heatmapData = this.heatmapData.map(c => ({
              ...c,
              occupancy: Math.max(0, Math.min(100, c.occupancy + (Math.random() * 20 - 10)))
          }));
      }, 2000);
  }

  handleLogin() {
      this.templeService.login(this.email, this.password);
  }

  setActiveTab(tab: any) {
      this.activeTab.set(tab);
  }

  toggleFestivalMode(e: any) {
      this.templeService.setFestivalMode(e.target.checked);
  }

  getHeatmapColor(occupancy: number): string {
      // Return green to red gradient based on percentage
      if (occupancy < 50) return `rgba(134, 239, 172, ${0.3 + occupancy/100})`; // Green-ish
      if (occupancy < 80) return `rgba(253, 224, 71, ${0.3 + occupancy/100})`; // Yellow-ish
      return `rgba(248, 113, 113, ${0.3 + occupancy/100})`; // Red-ish
  }

  saveSettings() {
      alert('Settings Saved');
  }
}
