import { Component, inject, signal } from '@angular/core';
import { TempleService, Donation } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-stone-100">
      
      <!-- Login Overlay -->
      @if (!templeService.isAdmin()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900 bg-opacity-90">
          <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl border-t-8 border-red-800 animate-fade-in">
            <h2 class="text-3xl font-serif font-bold text-red-900 mb-2 text-center">Admin Access</h2>
            <p class="text-center text-stone-500 mb-6">Uttarandhra Tirupati Digital CMS</p>
            
            <div class="mb-4">
              <label class="block text-stone-700 text-sm font-bold mb-2">Username</label>
              <input type="text" class="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" placeholder="admin">
            </div>
            
            <div class="mb-6">
              <label class="block text-stone-700 text-sm font-bold mb-2">Password</label>
              <input type="password" [(ngModel)]="password" class="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" placeholder="admin">
            </div>
            
            @if (errorMsg) {
               <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                 {{ errorMsg }}
               </div>
            }

            <button (click)="handleLogin()" class="w-full bg-red-900 text-white font-bold py-3 rounded hover:bg-red-800 transition-colors shadow-lg">
              Secure Login
            </button>
          </div>
        </div>
      } @else {
        
        <div class="flex h-screen overflow-hidden">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-stone-900 text-stone-300 flex flex-col shadow-xl z-20">
            <div class="p-6 border-b border-stone-800 text-center">
               <h3 class="text-xl font-serif font-bold text-amber-500">CMS Dashboard</h3>
               <p class="text-xs text-stone-500 mt-1">Admin Panel v1.0</p>
            </div>
            
            <nav class="flex-grow p-4 space-y-2">
              <button (click)="activeTab.set('dashboard')" [class]="activeTab() === 'dashboard' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                 Dashboard Overview
              </button>
              <button (click)="activeTab.set('donations')" [class]="activeTab() === 'donations' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                 Donation Reports
              </button>
              <button (click)="activeTab.set('news')" [class]="activeTab() === 'news' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.43.816 1.035.816 1.73 0 .695-.32 1.3-.816 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg>
                 Announcements
              </button>
              <button (click)="activeTab.set('library')" [class]="activeTab() === 'library' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                 Digital Library
              </button>
              <button (click)="activeTab.set('gallery')" [class]="activeTab() === 'gallery' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                 Media Gallery
              </button>
            </nav>
            
            <div class="p-4 border-t border-stone-800">
               <button (click)="templeService.logout()" class="w-full text-left px-4 py-2 text-stone-400 hover:text-white flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                 Logout
               </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-grow p-8 overflow-y-auto">
            
            <!-- Dashboard View -->
            @if (activeTab() === 'dashboard') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6">Overview</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-emerald-500">
                    <p class="text-stone-500 text-sm font-bold uppercase">Total Donations</p>
                    <p class="text-3xl font-bold text-stone-800 mt-2">₹ {{ templeService.totalDonations() }}</p>
                 </div>
                 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-amber-500">
                    <p class="text-stone-500 text-sm font-bold uppercase">Active News Items</p>
                    <p class="text-3xl font-bold text-stone-800 mt-2">{{ templeService.news().length }}</p>
                 </div>
                 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
                    <p class="text-stone-500 text-sm font-bold uppercase">Media Count</p>
                    <p class="text-3xl font-bold text-stone-800 mt-2">{{ templeService.gallery().length + templeService.library().length }}</p>
                 </div>
              </div>

              <!-- Flash News Manager -->
              <div class="bg-white p-6 rounded-lg shadow mb-8">
                 <h3 class="text-lg font-bold text-stone-800 mb-4">Manage Flash News</h3>
                 <div class="flex gap-4">
                   <input [(ngModel)]="flashNewsInput" class="flex-grow p-2 border border-stone-300 rounded" [placeholder]="templeService.flashNews()">
                   <button (click)="updateFlash()" class="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">Update Ticker</button>
                 </div>
                 <p class="text-xs text-stone-500 mt-2">This text scrolls across the top of the homepage.</p>
              </div>
            }

            <!-- Donations Reports -->
            @if (activeTab() === 'donations') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6">Donation History</h2>
              <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-stone-100 text-stone-700 font-bold uppercase text-xs">
                    <tr>
                      <th class="p-4">Transaction ID</th>
                      <th class="p-4">Date</th>
                      <th class="p-4">Donor Name</th>
                      <th class="p-4">Category</th>
                      <th class="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-200">
                    @for (d of templeService.donations(); track d.id) {
                      <tr class="hover:bg-stone-50">
                        <td class="p-4 font-mono text-stone-600 text-sm">{{ d.transactionId }}</td>
                        <td class="p-4 text-sm">{{ d.date }}</td>
                        <td class="p-4 font-bold">{{ d.donorName }} <span class="text-stone-400 font-normal text-xs" *ngIf="d.pan">({{d.pan}})</span></td>
                        <td class="p-4">
                          <span class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">{{ d.category }}</span>
                        </td>
                        <td class="p-4 text-right font-bold text-emerald-700">₹ {{ d.amount }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            <!-- News Manager -->
            @if (activeTab() === 'news') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6">News & Announcements</h2>
               <div class="grid grid-cols-1 gap-8">
                 <div class="bg-white p-6 rounded-lg shadow">
                   <h3 class="text-lg font-bold mb-4">Post New Update</h3>
                   <input [(ngModel)]="newTitle" placeholder="Title" class="w-full mb-3 p-2 border rounded">
                   <textarea [(ngModel)]="newContent" placeholder="Content details..." class="w-full mb-3 p-2 border rounded h-24"></textarea>
                   <button (click)="handleAddNews()" class="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700">Publish</button>
                 </div>
                 
                 <div class="space-y-4">
                   @for (item of templeService.news(); track item.id) {
                     <div class="bg-white p-4 rounded shadow border-l-4 border-amber-500 flex justify-between items-start">
                       <div>
                         <h4 class="font-bold text-lg">{{ item.title }}</h4>
                         <span class="text-xs text-stone-500">{{ item.date }}</span>
                         <p class="text-sm text-stone-600 mt-1">{{ item.content }}</p>
                       </div>
                       <button (click)="templeService.deleteNews(item.id)" class="text-red-500 hover:text-red-700 font-bold text-sm ml-4">Delete</button>
                     </div>
                   }
                 </div>
               </div>
            }

            <!-- Library Manager -->
            @if (activeTab() === 'library') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6">Digital Library Manager</h2>
               <div class="bg-white p-6 rounded-lg shadow mb-8">
                  <h3 class="text-lg font-bold mb-4">Upload New Item</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select [(ngModel)]="libType" class="p-2 border rounded">
                      <option value="audio">Audio (MP3)</option>
                      <option value="ebook">E-Book (PDF)</option>
                    </select>
                    <input [(ngModel)]="libTitle" placeholder="Title (e.g. Suprabhatam)" class="p-2 border rounded">
                  </div>
                  <input [(ngModel)]="libUrl" placeholder="File URL (https://...)" class="w-full p-2 border rounded mb-4">
                  <input [(ngModel)]="libDesc" placeholder="Description" class="w-full p-2 border rounded mb-4">
                  <button (click)="handleAddLibrary()" class="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700">Add to Library</button>
               </div>

               <div class="grid grid-cols-1 gap-4">
                  @for (item of templeService.library(); track item.id) {
                    <div class="bg-white p-4 rounded shadow flex justify-between items-center">
                       <div class="flex items-center gap-4">
                          <div [class]="item.type === 'audio' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'" class="w-10 h-10 rounded flex items-center justify-center">
                            <span class="uppercase text-xs font-bold">{{ item.type === 'audio' ? 'MP3' : 'PDF' }}</span>
                          </div>
                          <div>
                            <h4 class="font-bold">{{ item.title }}</h4>
                            <p class="text-xs text-stone-500">{{ item.description }}</p>
                          </div>
                       </div>
                       <button (click)="templeService.deleteLibraryItem(item.id)" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    </div>
                  }
               </div>
            }

            <!-- Gallery Manager -->
            @if (activeTab() === 'gallery') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6">Gallery Manager</h2>
               <div class="bg-white p-6 rounded-lg shadow mb-8">
                 <div class="flex gap-4">
                   <input [(ngModel)]="newPhotoUrl" placeholder="Image URL" class="flex-grow p-2 border rounded">
                   <input [(ngModel)]="newCaption" placeholder="Caption" class="flex-grow p-2 border rounded">
                   <button (click)="handleAddPhoto()" class="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700">Add Photo</button>
                 </div>
               </div>

               <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                 @for (item of templeService.gallery(); track item.id) {
                   <div class="relative group rounded overflow-hidden shadow-lg">
                     <img [src]="item.url" class="w-full h-32 object-cover">
                     <button (click)="templeService.deletePhoto(item.id)" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow opacity-75 hover:opacity-100">Delete</button>
                     <p class="p-2 text-xs font-bold bg-white truncate">{{ item.caption }}</p>
                   </div>
                 }
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
  password = '';
  errorMsg = '';
  activeTab = signal<'dashboard' | 'news' | 'gallery' | 'donations' | 'library'>('dashboard');

  // News State
  newTitle = '';
  newContent = '';

  // Gallery State
  newPhotoUrl = '';
  newCaption = '';

  // Library State
  libType: 'audio' | 'ebook' = 'audio';
  libTitle = '';
  libUrl = '';
  libDesc = '';

  // Flash News State
  flashNewsInput = '';

  constructor() {
    this.flashNewsInput = this.templeService.flashNews();
  }

  handleLogin() {
    if (!this.templeService.login(this.password)) {
      this.errorMsg = 'Invalid credentials. Access Denied.';
    } else {
      this.errorMsg = '';
      this.password = '';
    }
  }

  updateFlash() {
    this.templeService.updateFlashNews(this.flashNewsInput);
  }

  handleAddNews() {
    if (this.newTitle && this.newContent) {
      this.templeService.addNews(this.newTitle, this.newContent);
      this.newTitle = '';
      this.newContent = '';
    }
  }

  handleAddPhoto() {
    if (this.newPhotoUrl && this.newCaption) {
      this.templeService.addPhoto(this.newPhotoUrl, this.newCaption);
      this.newPhotoUrl = '';
      this.newCaption = '';
    }
  }

  handleAddLibrary() {
    if (this.libTitle && this.libUrl) {
      this.templeService.addLibraryItem({
        type: this.libType,
        title: this.libTitle,
        url: this.libUrl,
        description: this.libDesc
      });
      this.libTitle = '';
      this.libUrl = '';
      this.libDesc = '';
    }
  }
}
