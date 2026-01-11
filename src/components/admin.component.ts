import { Component, inject, signal, effect, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TempleService, LibraryItem, Booking, NewsItem } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-stone-100 font-sans flex flex-col">
      
      <!-- Login Overlay -->
      @if (!templeService.isAdmin()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-red-900/95 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-amber-400 animate-fade-in">
             <div class="text-center mb-6">
               <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-red-900"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
               </div>
               <h2 class="text-3xl font-serif font-bold text-red-900">Admin Portal</h2>
               <p class="text-stone-500 text-sm">Authorized Personnel Only</p>
             </div>
             
             @if (requires2FA) {
                <div class="mb-4 text-center">
                   <p class="text-sm font-bold text-stone-700 mb-2">Enter 2FA Code</p>
                   <input type="text" [(ngModel)]="otp" class="w-full text-center p-3 border rounded text-2xl tracking-widest font-mono" placeholder="------" maxlength="6">
                   <button (click)="verifyOTP()" class="w-full mt-4 bg-amber-600 text-white p-3 rounded font-bold hover:bg-amber-700">Verify</button>
                </div>
             } @else {
                <input type="email" [(ngModel)]="email" class="w-full mb-4 p-3 border rounded" placeholder="Email Address">
                <input type="password" [(ngModel)]="password" class="w-full mb-4 p-3 border rounded" placeholder="Password">
                <button (click)="handleLogin()" class="w-full bg-red-900 text-white p-3 rounded font-bold hover:bg-red-800 transition-colors">Login</button>
             }
             
             @if(loginError) {
                 <p class="text-red-500 text-center mt-4 bg-red-50 p-2 rounded text-sm">{{loginError}}</p>
             }
          </div>
        </div>
      } @else {
        
        <div class="flex flex-1 overflow-hidden h-screen">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-stone-900 text-amber-50 flex flex-col shadow-2xl z-20 border-r border-stone-800 flex-shrink-0">
            <div class="p-6 border-b border-stone-800 flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-stone-900 font-bold">A</div>
                <div>
                  <h3 class="font-bold text-amber-400">Temple CMS</h3>
                  <p class="text-[10px] text-stone-400">v3.1 • Live</p>
                </div>
            </div>

            <nav class="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
              <button (click)="setActiveTab('dashboard')" [class.bg-red-900]="activeTab() === 'dashboard'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Dashboard
              </button>
              <button (click)="setActiveTab('bookings')" [class.bg-red-900]="activeTab() === 'bookings'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Darshan Bookings
              </button>
              <button (click)="setActiveTab('donations')" [class.bg-red-900]="activeTab() === 'donations'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Donations Ledger
              </button>
              <button (click)="setActiveTab('news')" [class.bg-red-900]="activeTab() === 'news'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Announcements
              </button>
              <button (click)="setActiveTab('library')" [class.bg-red-900]="activeTab() === 'library'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Library Uploads
              </button>
              <button (click)="setActiveTab('feedback')" [class.bg-red-900]="activeTab() === 'feedback'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 User Feedback
              </button>
              
              <div class="pt-4 mt-4 border-t border-stone-800">
                <button (click)="setActiveTab('config')" [class.bg-red-900]="activeTab() === 'config'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    Global Settings
                </button>
                <button (click)="setActiveTab('hundi')" [class.bg-red-900]="activeTab() === 'hundi'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    E-Hundi & Bank
                </button>
                <button (click)="setActiveTab('timings')" [class.bg-red-900]="activeTab() === 'timings'" class="w-full text-left px-4 py-3 rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    Seva Timings
                </button>
              </div>
            </nav>
            <div class="p-4 border-t border-stone-800">
               <button (click)="templeService.logout()" class="w-full text-left px-4 py-2 hover:bg-red-900 rounded text-sm text-stone-400 hover:text-white transition-colors">Sign Out</button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-grow p-8 overflow-y-auto bg-stone-100">
            
            <!-- Dashboard View -->
            @if (activeTab() === 'dashboard') {
              <header class="flex justify-between items-center mb-8">
                 <h2 class="text-3xl font-serif font-bold text-stone-800">Overview</h2>
                 <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">System Online</span>
              </header>
              
              <!-- Quick Actions -->
              <div class="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8 flex gap-8 items-center justify-between flex-wrap">
                 <div class="flex items-center gap-4">
                    <div>
                        <h3 class="font-bold text-stone-700">Festival Mode</h3>
                        <p class="text-xs text-stone-500">Activates special theme & animations.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" [checked]="templeService.festivalMode()" (change)="toggleFestivalMode($event)" class="sr-only peer">
                        <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                 </div>

                 <div class="flex-grow md:ml-8 md:border-l md:border-stone-200 md:pl-8">
                     <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Live Ticker Announcement</label>
                     <div class="flex gap-2">
                         <input type="text" [(ngModel)]="tickerText" class="flex-grow p-2 border rounded text-sm bg-stone-50" placeholder="Update Flash News...">
                         <button (click)="updateTicker()" class="bg-stone-800 text-white px-4 rounded text-sm font-bold hover:bg-stone-900">Update</button>
                     </div>
                 </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Total Donations</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">₹ {{ templeService.totalDonations() | number }}</p>
                    <p class="text-xs text-stone-400 mt-2">{{ templeService.donations().length }} Transactions</p>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Feedback Received</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">{{ templeService.feedbacks().length }}</p>
                    <p class="text-xs text-stone-400 mt-2">Unread messages</p>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Library Items</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">{{ templeService.library().length }}</p>
                    <p class="text-xs text-stone-400 mt-2">Audio & E-books</p>
                 </div>
              </div>
            }
            
            <!-- Bookings Tab -->
            @if (activeTab() === 'bookings') {
                <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Darshan Booking Management</h2>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8">
                    <div class="flex items-end gap-4">
                        <div>
                            <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Select Date</label>
                            <input type="date" [(ngModel)]="bookingFilterDate" (change)="loadAdminBookings()" class="p-2 border rounded">
                        </div>
                        <button (click)="loadAdminBookings()" class="bg-stone-800 text-white px-4 py-2 rounded font-bold text-sm hover:bg-stone-900">Refresh Data</button>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div class="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                        <h3 class="font-bold text-stone-700">Pilgrim List for {{ bookingFilterDate | date:'mediumDate' }}</h3>
                        <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">{{ bookingsList.length }} Bookings</span>
                    </div>
                    <table class="w-full text-left text-sm">
                        <thead class="bg-stone-100 text-stone-600 font-bold uppercase text-xs">
                            <tr>
                                <th class="p-4">Time Slot</th>
                                <th class="p-4">Ticket Code</th>
                                <th class="p-4">Pilgrim Name</th>
                                <th class="p-4">Mobile</th>
                                <th class="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100">
                           @for (b of bookingsList; track b.id) {
                               <tr class="hover:bg-stone-50">
                                   <td class="p-4 font-bold text-stone-800">{{ b.slot }}</td>
                                   <td class="p-4 font-mono text-xs">{{ b.ticketCode }}</td>
                                   <td class="p-4">{{ b.devoteeName }}</td>
                                   <td class="p-4">{{ b.mobile }}</td>
                                   <td class="p-4">
                                       <span class="px-2 py-1 rounded text-[10px] uppercase font-bold" 
                                             [class.bg-green-100]="b.status === 'Booked'" [class.text-green-800]="b.status === 'Booked'"
                                             [class.bg-red-100]="b.status === 'Cancelled'" [class.text-red-800]="b.status === 'Cancelled'">
                                         {{ b.status }}
                                       </span>
                                   </td>
                               </tr>
                           }
                           @if (bookingsList.length === 0) {
                               <tr>
                                   <td colspan="5" class="p-8 text-center text-stone-400">No bookings found for this date.</td>
                               </tr>
                           }
                        </tbody>
                    </table>
                </div>
            }

            <!-- Donations Tab -->
            @if (activeTab() === 'donations') {
                <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Donations Ledger</h2>
                
                <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-stone-100 text-stone-600 font-bold uppercase text-xs">
                            <tr>
                                <th class="p-4">Date</th>
                                <th class="p-4">Donor Name</th>
                                <th class="p-4">Category</th>
                                <th class="p-4">Amount</th>
                                <th class="p-4">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100">
                           @for (d of templeService.donations(); track d.id) {
                               <tr class="hover:bg-stone-50">
                                   <td class="p-4 text-xs">{{ d.date | date:'shortDate' }}</td>
                                   <td class="p-4 font-bold text-stone-700">{{ d.donorName }} <span class="text-stone-400 font-normal text-xs block">{{ d.gothram }}</span></td>
                                   <td class="p-4">{{ d.category }}</td>
                                   <td class="p-4 font-bold text-green-700">₹ {{ d.amount | number }}</td>
                                   <td class="p-4 font-mono text-xs text-stone-500">{{ d.transactionId }}</td>
                               </tr>
                           }
                        </tbody>
                    </table>
                </div>
            }

            <!-- Feedback Tab -->
            @if (activeTab() === 'feedback') {
                <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">User Feedback</h2>
                
                <div class="grid grid-cols-1 gap-4">
                   @for (f of templeService.feedbacks(); track f.id) {
                      <div class="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex justify-between gap-4">
                         <div>
                            <div class="flex items-center gap-2 mb-2">
                               <span class="font-bold text-stone-800">{{ f.name }}</span>
                               <span class="text-xs text-stone-400">{{ f.date | date:'medium' }}</span>
                            </div>
                            <p class="text-stone-600 text-sm italic">"{{ f.message }}"</p>
                         </div>
                         <button (click)="deleteFeedback(f.id)" class="text-red-500 hover:text-red-700 p-2 self-start" title="Delete Feedback">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                         </button>
                      </div>
                   }
                   @if (templeService.feedbacks().length === 0) {
                      <div class="p-8 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">No feedback received yet.</div>
                   }
                </div>
            }

            <!-- Global Configuration -->
            @if (activeTab() === 'config') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Site Configuration</h2>
               <div class="bg-white p-8 rounded-xl shadow-sm border border-stone-200 max-w-4xl">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Temple Name</label>
                        <input [(ngModel)]="configForm.templeName" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Subtitle</label>
                        <input [(ngModel)]="configForm.subTitle" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Contact Phone</label>
                        <input [(ngModel)]="configForm.contactPhone" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Contact Email</label>
                        <input [(ngModel)]="configForm.contactEmail" class="w-full p-2 border rounded">
                     </div>
                     <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-stone-700 mb-1">Address</label>
                        <textarea [(ngModel)]="configForm.address" class="w-full p-2 border rounded h-20"></textarea>
                     </div>
                     <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-stone-700 mb-1">YouTube Live Link</label>
                        <input [(ngModel)]="configForm.liveLink" class="w-full p-2 border rounded">
                     </div>
                  </div>
                  <button (click)="saveConfig()" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Save Configuration</button>
               </div>
            }

            <!-- Hundi & Bank -->
            @if (activeTab() === 'hundi') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">E-Hundi Management</h2>
               <div class="bg-white p-8 rounded-xl shadow-sm border border-stone-200 max-w-4xl">
                  <h3 class="font-bold text-lg mb-4 text-amber-800">Bank Account Details</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Account Name</label>
                        <input [(ngModel)]="configForm.bankInfo.accountName" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Account Number</label>
                        <input [(ngModel)]="configForm.bankInfo.accountNumber" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Bank Name</label>
                        <input [(ngModel)]="configForm.bankInfo.bankName" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">IFSC Code</label>
                        <input [(ngModel)]="configForm.bankInfo.ifsc" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Branch</label>
                        <input [(ngModel)]="configForm.bankInfo.branch" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">QR Code URL</label>
                        <input [(ngModel)]="configForm.bankInfo.qrCodeUrl" class="w-full p-2 border rounded">
                     </div>
                  </div>
                  <button (click)="saveConfig()" class="mt-6 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Update Bank Info</button>
               </div>
            }

            <!-- Timings -->
            @if (activeTab() === 'timings') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Temple Timings</h2>
               <div class="bg-white p-8 rounded-xl shadow-sm border border-stone-200 max-w-2xl">
                  <div class="space-y-4">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Suprabhatam</label>
                        <input [(ngModel)]="configForm.timings.suprabhatam" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Morning Darshan</label>
                        <input [(ngModel)]="configForm.timings.morningDarshan" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Afternoon Break</label>
                        <input [(ngModel)]="configForm.timings.breakTime" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Evening Darshan</label>
                        <input [(ngModel)]="configForm.timings.eveningDarshan" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Ekantha Seva</label>
                        <input [(ngModel)]="configForm.timings.ekanthaSeva" class="w-full p-2 border rounded">
                     </div>
                  </div>
                  <button (click)="saveConfig()" class="mt-6 bg-red-900 text-white px-6 py-2 rounded font-bold hover:bg-red-800">Update Timings</button>
               </div>
            }

            <!-- Library -->
            @if (activeTab() === 'library') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Digital Library</h2>
               
               <div class="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8">
                  <h3 class="font-bold text-lg mb-4 text-stone-700">Upload New Item</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Title</label>
                        <input [(ngModel)]="newLibItem.title" class="w-full p-2 border rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Type</label>
                        <select [(ngModel)]="newLibItem.type" class="w-full p-2 border rounded bg-white">
                           <option value="audio">Audio (MP3)</option>
                           <option value="ebook">E-Book (PDF)</option>
                        </select>
                     </div>
                     <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-stone-700 mb-1">Description</label>
                        <input [(ngModel)]="newLibItem.description" class="w-full p-2 border rounded">
                     </div>
                     <div class="md:col-span-2 border-2 border-dashed border-stone-300 rounded p-6 text-center">
                        <input type="file" (change)="onLibFileSelected($event)" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100">
                     </div>
                  </div>
                  <button (click)="uploadLibraryItem()" [disabled]="uploading" class="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 disabled:opacity-50">
                     {{ uploading ? 'Uploading...' : 'Add to Library' }}
                  </button>
               </div>

               <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                  <table class="w-full text-left">
                     <thead class="bg-stone-100 text-stone-600 font-bold text-sm">
                        <tr>
                           <th class="p-4">Title</th>
                           <th class="p-4">Type</th>
                           <th class="p-4">Action</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-stone-100">
                        @for (item of templeService.library(); track item.id) {
                           <tr class="hover:bg-stone-50">
                              <td class="p-4">{{ item.title }}</td>
                              <td class="p-4 uppercase text-xs font-bold text-stone-500">{{ item.type }}</td>
                              <td class="p-4">
                                 <button (click)="deleteLibraryItem(item.id)" class="text-red-600 hover:underline text-xs font-bold">Delete</button>
                              </td>
                           </tr>
                        }
                     </tbody>
                  </table>
               </div>
            }

            <!-- News -->
            @if (activeTab() === 'news') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">News & Announcements</h2>
               
               <div class="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8">
                  <h3 class="font-bold text-lg mb-4 text-stone-700">{{ editingNewsId ? 'Edit Announcement' : 'Post Announcement' }}</h3>
                  <div class="space-y-4 mb-4">
                     <input [(ngModel)]="newNews.title" placeholder="Headline" class="w-full p-2 border rounded">
                     <textarea [(ngModel)]="newNews.content" placeholder="Content (HTML Supported)" class="w-full p-2 border rounded h-32"></textarea>
                     <input [(ngModel)]="newNews.attachmentUrl" placeholder="Attachment URL (Optional)" class="w-full p-2 border rounded">
                  </div>
                  <div class="flex gap-2">
                     <button (click)="postNews()" class="bg-red-900 text-white px-6 py-2 rounded font-bold hover:bg-red-800">{{ editingNewsId ? 'Update' : 'Publish' }}</button>
                     @if (editingNewsId) {
                         <button (click)="cancelEditNews()" class="bg-stone-200 text-stone-700 px-6 py-2 rounded font-bold hover:bg-stone-300">Cancel</button>
                     }
                  </div>
               </div>

               <div class="space-y-4">
                  @for (item of templeService.news(); track item.id) {
                     <div class="bg-white p-4 rounded border border-stone-200 flex justify-between items-center hover:shadow-md transition-all">
                        <div>
                           <h4 class="font-bold">{{ item.title }}</h4>
                           <p class="text-xs text-stone-500">{{ item.date | date }}</p>
                        </div>
                        <div class="flex gap-2">
                            <button (click)="editNews(item)" class="text-blue-600 hover:text-blue-800 p-2" title="Edit">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                            </button>
                            <button (click)="deleteNews(item.id)" class="text-red-600 hover:text-red-800 p-2" title="Delete">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                        </div>
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
  
  // Auth State
  email = '';
  password = '';
  otp = '';
  loginError = '';
  requires2FA = false;
  
  activeTab = signal<'dashboard' | 'config' | 'hundi' | 'timings' | 'library' | 'news' | 'bookings' | 'donations' | 'feedback'>('dashboard');
  tickerText = '';

  // Config Form Binding (Cloned to avoid direct mutations before save)
  configForm: any = { bankInfo: {}, timings: {} };

  // Library Form
  newLibItem: Partial<LibraryItem> = { type: 'audio' };
  selectedLibFile: File | null = null;
  uploading = false;

  // News Form
  newNews = { title: '', content: '', attachmentUrl: '' };
  editingNewsId: string | null = null;

  // Bookings View
  bookingFilterDate = new Date().toISOString().split('T')[0];
  bookingsList: Booking[] = [];

  constructor() {
      effect(() => {
          this.tickerText = this.templeService.flashNews();
          // Deep copy to break reference
          this.configForm = JSON.parse(JSON.stringify(this.templeService.siteConfig()));
      });
  }

  async handleLogin() {
      const res = await this.templeService.login(this.email, this.password);
      if (res.error) {
          this.loginError = 'Invalid Credentials';
      } else if (res.requires2FA) {
          this.requires2FA = true;
          this.loginError = '';
      }
  }

  async verifyOTP() {
      const valid = await this.templeService.verifyTwoFactor(this.otp);
      if (!valid) this.loginError = 'Invalid OTP';
      else this.requires2FA = false;
  }

  setActiveTab(tab: any) {
      this.activeTab.set(tab);
      if (tab === 'bookings') {
          this.loadAdminBookings();
      }
  }

  toggleFestivalMode(e: any) {
      this.templeService.setFestivalMode(e.target.checked);
  }
  
  updateTicker() {
      this.templeService.updateFlashNews(this.tickerText);
      alert('Ticker Updated');
  }

  async saveConfig() {
      await this.templeService.updateSiteConfig(this.configForm);
      alert('Configuration Saved Successfully');
  }

  // Bookings Logic
  async loadAdminBookings() {
      this.bookingsList = await this.templeService.getBookingsForAdmin(this.bookingFilterDate);
  }

  // Library Logic
  onLibFileSelected(event: any) {
      this.selectedLibFile = event.target.files[0];
  }

  async uploadLibraryItem() {
      if (!this.selectedLibFile || !this.newLibItem.title) return;
      this.uploading = true;
      const url = await this.templeService.uploadFile(this.selectedLibFile, 'library');
      if (url) {
          await this.templeService.addLibraryItem({
              title: this.newLibItem.title!,
              type: this.newLibItem.type || 'audio',
              url: url,
              description: this.newLibItem.description || ''
          });
          this.selectedLibFile = null;
          this.newLibItem = { type: 'audio' };
          alert('Uploaded Successfully');
      }
      this.uploading = false;
  }

  async deleteLibraryItem(id: string) {
      if(confirm('Delete this item?')) {
          await this.templeService.deleteLibraryItem(id);
      }
  }

  // News Logic
  async postNews() {
      if(this.newNews.title) {
          if (this.editingNewsId) {
             await this.templeService.updateNews(this.editingNewsId, this.newNews);
             this.editingNewsId = null;
             alert('News Updated');
          } else {
             await this.templeService.addNews(this.newNews.title, this.newNews.content, this.newNews.attachmentUrl);
             alert('News Posted');
          }
          this.newNews = { title: '', content: '', attachmentUrl: '' };
      }
  }

  editNews(item: NewsItem) {
      this.newNews = { title: item.title, content: item.content, attachmentUrl: item.attachmentUrl || '' };
      this.editingNewsId = item.id;
      window.scrollTo(0,0);
  }

  cancelEditNews() {
      this.editingNewsId = null;
      this.newNews = { title: '', content: '', attachmentUrl: '' };
  }

  async deleteNews(id: string) {
      if(confirm('Delete news?')) {
          await this.templeService.deleteNews(id);
      }
  }

  async deleteFeedback(id: string) {
      if(confirm('Delete this feedback?')) {
          await this.templeService.deleteFeedback(id);
      }
  }
}