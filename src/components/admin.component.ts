import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { TempleService, Donation, SiteConfig } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

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
            
            @if (loginStep() === 'credentials') {
              <!-- Step 1: Email & Password -->
              <div class="mb-4">
                <label class="block text-stone-700 text-sm font-bold mb-2">Email Address</label>
                <input type="email" [(ngModel)]="email" class="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" placeholder="admin@example.com">
              </div>
              
              <div class="mb-6">
                <label class="block text-stone-700 text-sm font-bold mb-2">Password</label>
                <input type="password" [(ngModel)]="password" class="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-red-500" placeholder="••••••">
              </div>

              <button (click)="handleLogin()" [disabled]="isLoading" class="w-full bg-red-900 text-white font-bold py-3 rounded hover:bg-red-800 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {{ isLoading ? 'Verifying...' : 'Next Step' }}
                @if (!isLoading) { <span>&rarr;</span> }
              </button>

            } @else {
              <!-- Step 2: 2FA Verification -->
              <div class="mb-6 text-center">
                 <div class="bg-amber-100 text-amber-800 p-4 rounded-lg mb-4 text-sm">
                    <p class="font-bold mb-1">Two-Factor Authentication</p>
                    <p>Please enter the 6-digit code sent to your registered device.</p>
                 </div>
                 
                 <label class="block text-stone-700 text-sm font-bold mb-2">Authentication Code</label>
                 <input type="text" [(ngModel)]="otp" maxlength="6" class="w-full px-4 py-3 border border-stone-300 rounded text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-red-500" placeholder="000000">
              </div>

              <div class="flex flex-col gap-3">
                <button (click)="handleVerifyOtp()" [disabled]="isLoading || otp.length !== 6" class="w-full bg-red-900 text-white font-bold py-3 rounded hover:bg-red-800 transition-colors shadow-lg disabled:opacity-50">
                   {{ isLoading ? 'Checking...' : 'Verify & Login' }}
                </button>
                <button (click)="resetLogin()" class="text-sm text-stone-500 hover:text-stone-700 underline">Back to Login</button>
              </div>
            }
            
            @if (errorMsg) {
               <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                 {{ errorMsg }}
               </div>
            }

            <div class="mt-4 text-center">
               <p class="text-xs text-stone-400">Powered by Supabase Security</p>
            </div>
          </div>
        </div>
      } @else {
        
        <div class="flex h-screen overflow-hidden">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-stone-900 text-stone-300 flex flex-col shadow-xl z-20">
            <div class="p-6 border-b border-stone-800 text-center">
               <h3 class="text-xl font-serif font-bold text-amber-500">CMS Dashboard</h3>
               <p class="text-xs text-stone-500 mt-1">Admin Panel v2.0</p>
               <p class="text-[10px] text-stone-600 truncate mt-1">{{ templeService.currentUser()?.email }}</p>
            </div>
            
            <nav class="flex-grow p-4 space-y-2">
              <button (click)="setActiveTab('dashboard')" [class]="activeTab() === 'dashboard' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                 Dashboard Overview
              </button>
              <button (click)="setActiveTab('settings')" [class]="activeTab() === 'settings' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                 Site Settings
              </button>
              <button (click)="setActiveTab('donations')" [class]="activeTab() === 'donations' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                 Donation Reports
              </button>
              <button (click)="setActiveTab('news')" [class]="activeTab() === 'news' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.43.816 1.035.816 1.73 0 .695-.32 1.3-.816 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg>
                 Announcements
              </button>
              <button (click)="setActiveTab('library')" [class]="activeTab() === 'library' ? 'bg-red-900 text-white shadow' : 'hover:bg-stone-800'" class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                 Digital Library
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

              <!-- D3 Analytics Chart -->
              <div class="bg-white p-6 rounded-lg shadow mb-8">
                <h3 class="text-lg font-bold text-stone-800 mb-4">Analytics: Donations by Category</h3>
                <div #chartContainer class="w-full h-64 bg-stone-50 rounded flex items-center justify-center">
                   <!-- D3 Chart renders here -->
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

            <!-- Site Settings View -->
            @if (activeTab() === 'settings') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6">Site Configuration (CMS)</h2>
               <div class="bg-white p-8 rounded-lg shadow max-w-4xl">
                 <form (submit)="saveSettings($event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Temple Name</label>
                          <input [(ngModel)]="tempConfig.templeName" name="tName" class="w-full p-2 border border-stone-300 rounded">
                       </div>
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Subtitle / Location</label>
                          <input [(ngModel)]="tempConfig.subTitle" name="tSub" class="w-full p-2 border border-stone-300 rounded">
                       </div>
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Logo URL</label>
                          <input [(ngModel)]="tempConfig.logoUrl" name="tLogo" class="w-full p-2 border border-stone-300 rounded">
                          <img [src]="tempConfig.logoUrl" class="h-12 mt-2 border rounded">
                       </div>
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Live Darshan Link</label>
                          <input [(ngModel)]="tempConfig.liveLink" name="tLive" class="w-full p-2 border border-stone-300 rounded">
                       </div>
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Contact Phone</label>
                          <input [(ngModel)]="tempConfig.contactPhone" name="tPhone" class="w-full p-2 border border-stone-300 rounded">
                       </div>
                       <div>
                          <label class="block text-stone-700 font-bold mb-2">Contact Email</label>
                          <input [(ngModel)]="tempConfig.contactEmail" name="tEmail" class="w-full p-2 border border-stone-300 rounded">
                       </div>
                    </div>
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded font-bold shadow">
                       Save Configuration
                    </button>
                 </form>
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
                        <td class="p-4 font-bold">
                          {{ d.donorName }}
                          @if (d.pan) {
                            <span class="text-stone-400 font-normal text-xs">({{d.pan}})</span>
                          }
                        </td>
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
                   <div class="mb-3">
                     <label class="block text-xs font-bold text-stone-500 mb-1">Headline</label>
                     <input [(ngModel)]="newTitle" placeholder="Title" class="w-full p-2 border rounded">
                   </div>
                   <div class="mb-3">
                     <label class="block text-xs font-bold text-stone-500 mb-1">Details</label>
                     <textarea [(ngModel)]="newContent" placeholder="Content details..." class="w-full p-2 border rounded h-24"></textarea>
                   </div>
                   <div class="mb-3">
                      <label class="block text-xs font-bold text-stone-500 mb-1">Attachment (File Upload or URL)</label>
                      <div class="flex gap-2 mb-2">
                        <input [(ngModel)]="newAttachment" placeholder="https://..." class="flex-grow p-2 border rounded">
                      </div>
                      <div class="border-2 border-dashed border-stone-300 p-4 rounded text-center bg-stone-50">
                        @if (newsUploading) {
                           <span class="text-amber-600 font-bold animate-pulse">Uploading file...</span>
                        } @else {
                           <input type="file" (change)="handleFileSelectForNews($event)" class="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200">
                        }
                      </div>
                   </div>
                   <button (click)="handleAddNews()" [disabled]="newsUploading" class="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700 disabled:opacity-50">Publish Update</button>
                 </div>
                 
                 <div class="space-y-4">
                   @for (item of templeService.news(); track item.id) {
                     <div class="bg-white p-4 rounded shadow border-l-4 border-amber-500 flex justify-between items-start">
                       <div>
                         <h4 class="font-bold text-lg">{{ item.title }}</h4>
                         <span class="text-xs text-stone-500">{{ item.date }}</span>
                         <p class="text-sm text-stone-600 mt-1">{{ item.content }}</p>
                         @if (item.attachmentUrl) {
                            <a [href]="item.attachmentUrl" target="_blank" class="inline-block mt-2 text-xs bg-stone-200 px-2 py-1 rounded hover:bg-stone-300">View Attachment</a>
                         }
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

          </main>
        </div>
      }
    </div>
  `
})
export class AdminComponent {
  templeService = inject(TempleService);
  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;
  activeTab = signal<'dashboard' | 'news' | 'donations' | 'library' | 'settings'>('dashboard');

  // 2FA State
  loginStep = signal<'credentials' | 'otp'>('credentials');
  otp = '';

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  // Site Config State (Local Copy)
  tempConfig: SiteConfig = { ...this.templeService.siteConfig() };

  // News State
  newTitle = '';
  newContent = '';
  newAttachment = '';
  newsUploading = false;

  // Library State
  libType: 'audio' | 'ebook' = 'audio';
  libTitle = '';
  libUrl = '';
  libDesc = '';

  // Flash News State
  flashNewsInput = '';

  constructor() {
    this.flashNewsInput = this.templeService.flashNews();
    this.tempConfig = { ...this.templeService.siteConfig() };
    
    // Effect to draw chart when tab is dashboard and DOM is ready
    effect(() => {
      if (this.activeTab() === 'dashboard' && this.templeService.donations().length > 0) {
        // Allow time for DOM to render the container
        setTimeout(() => this.drawChart(), 100);
      }
    });
  }

  setActiveTab(tab: 'dashboard' | 'news' | 'donations' | 'library' | 'settings') {
    this.activeTab.set(tab);
  }

  drawChart() {
    if (!this.chartContainer) return;
    
    // Cast to any to bypass TypeScript definition errors with D3 types in this environment
    const d3any = d3 as any;
    
    const element = this.chartContainer.nativeElement;
    d3any.select(element).selectAll('*').remove(); // Clear previous

    const data = this.templeService.donations();
    // Group by Category
    const categoryMap = new Map<string, number>();
    data.forEach(d => {
      const current = categoryMap.get(d.category) || 0;
      categoryMap.set(d.category, current + d.amount);
    });
    
    const chartData = Array.from(categoryMap, ([name, value]) => ({ name, value }));
    
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    
    const svg = d3any.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // X Axis
    const x = d3any.scaleBand()
      .range([0, innerWidth])
      .domain(chartData.map(d => d.name))
      .padding(0.2);
    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3any.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Y Axis
    const y = d3any.scaleLinear()
      .domain([0, d3any.max(chartData, (d: any) => d.value) || 0])
      .range([innerHeight, 0]);
    
    svg.append('g')
      .call(d3any.axisLeft(y));

    // Bars
    svg.selectAll('mybar')
      .data(chartData)
      .join('rect')
        .attr('x', (d: any) => x(d.name)!)
        .attr('y', (d: any) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d: any) => innerHeight - y(d.value))
        .attr('fill', '#d97706'); // Amber-600
  }

  async handleLogin() {
    this.isLoading = true;
    this.errorMsg = '';
    
    try {
      const { error, requires2FA } = await this.templeService.login(this.email, this.password);
      if (error) {
        this.errorMsg = error.message || 'Invalid credentials.';
      } else if (requires2FA) {
        this.loginStep.set('otp');
      } else {
        // Normal login success (unlikely with our new service logic, but safe fallback)
        this.resetLogin();
      }
    } catch (err) {
       this.errorMsg = 'Unexpected error occurred.';
    } finally {
      this.isLoading = false;
    }
  }

  async handleVerifyOtp() {
    this.isLoading = true;
    this.errorMsg = '';

    const isValid = await this.templeService.verifyTwoFactor(this.otp);
    
    if (isValid) {
      this.resetLogin(); // Cleanup inputs
      // isAdmin signal in service is now true, view will switch automatically
    } else {
      this.errorMsg = 'Invalid verification code. Please try again.';
      this.isLoading = false;
    }
  }

  resetLogin() {
     this.password = '';
     this.email = '';
     this.otp = '';
     this.loginStep.set('credentials');
  }

  updateFlash() {
    this.templeService.updateFlashNews(this.flashNewsInput);
  }

  saveSettings(e: Event) {
    e.preventDefault();
    this.templeService.updateSiteConfig(this.tempConfig);
    alert('Settings Saved Successfully!');
  }

  async handleFileSelectForNews(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newsUploading = true;
      const url = await this.templeService.uploadFile(file);
      if (url) {
        this.newAttachment = url;
      } else {
        alert('Upload failed.');
      }
      this.newsUploading = false;
    }
  }

  handleAddNews() {
    if (this.newTitle && this.newContent) {
      this.templeService.addNews(this.newTitle, this.newContent, this.newAttachment);
      this.newTitle = '';
      this.newContent = '';
      this.newAttachment = '';
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