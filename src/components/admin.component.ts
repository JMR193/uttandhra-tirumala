
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
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-amber-400 animate-fade-in">
            <div class="text-center mb-6">
               <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-800">
                  <img [src]="templeService.siteConfig().logoUrl" class="w-full h-full object-cover rounded-full opacity-90">
               </div>
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-1">Admin Access</h2>
               <p class="text-stone-500 text-sm">Uttarandhra Tirupati CMS</p>
            </div>
            
            @if (loginStep() === 'credentials') {
              <!-- Step 1: Email & Password -->
              <div class="mb-4">
                <label class="block text-red-900 text-sm font-bold mb-2">Email Address</label>
                <input type="email" [(ngModel)]="email" class="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white text-stone-800" placeholder="admin@example.com">
              </div>
              
              <div class="mb-6">
                <label class="block text-red-900 text-sm font-bold mb-2">Password</label>
                <input type="password" [(ngModel)]="password" class="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white text-stone-800" placeholder="••••••">
              </div>

              <button (click)="handleLogin()" [disabled]="isLoading" class="w-full bg-gradient-to-r from-red-800 to-red-900 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                {{ isLoading ? 'Verifying...' : 'Next Step' }}
                @if (!isLoading) { <span>&rarr;</span> }
              </button>

            } @else {
              <!-- Step 2: 2FA Verification -->
              <div class="mb-6 text-center">
                 <div class="bg-amber-100 text-amber-900 p-4 rounded-lg mb-4 text-sm border border-amber-200">
                    <p class="font-bold mb-1">Two-Factor Authentication</p>
                    <p>Enter the code sent to your secure device.</p>
                 </div>
                 
                 <label class="block text-red-900 text-sm font-bold mb-2">Authentication Code</label>
                 <input type="text" [(ngModel)]="otp" maxlength="6" class="w-full px-4 py-3 border border-stone-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-amber-500 bg-white text-stone-800" placeholder="000000">
              </div>

              <div class="flex flex-col gap-3">
                <button (click)="handleVerifyOtp()" [disabled]="isLoading || otp.length !== 6" class="w-full bg-red-900 text-white font-bold py-3 rounded-lg hover:bg-red-800 transition-colors shadow-lg disabled:opacity-50">
                   {{ isLoading ? 'Checking...' : 'Verify & Login' }}
                </button>
                <button (click)="resetLogin()" class="text-sm text-stone-500 hover:text-red-700 underline">Back to Login</button>
              </div>
            }
            
            @if (errorMsg) {
               <div class="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                 {{ errorMsg }}
               </div>
            }
          </div>
        </div>
      } @else {
        
        <div class="flex h-screen overflow-hidden">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-red-900 text-amber-50 flex flex-col shadow-2xl z-20 border-r border-red-800">
            <div class="p-6 border-b border-red-800/50 text-center bg-red-950/30">
               <div class="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-amber-400">
                 <img [src]="templeService.siteConfig().logoUrl" class="w-full h-full object-cover">
               </div>
               <h3 class="text-lg font-serif font-bold text-amber-400">Temple Admin</h3>
               <div class="flex items-center justify-center gap-2 mt-2">
                  <span class="w-2 h-2 rounded-full" 
                        [class.bg-green-500]="templeService.realtimeStatus() === 'CONNECTED'"
                        [class.bg-yellow-500]="templeService.realtimeStatus() === 'CONNECTING'"
                        [class.bg-red-500]="templeService.realtimeStatus() === 'DISCONNECTED'">
                  </span>
                  <span class="text-[10px] text-red-200 uppercase tracking-wide">{{ templeService.realtimeStatus() }}</span>
               </div>
            </div>
            
            <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
              <button (click)="setActiveTab('dashboard')" [class]="activeTab() === 'dashboard' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                 Dashboard
              </button>
              <button (click)="setActiveTab('tasks')" [class]="activeTab() === 'tasks' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                 Task Manager
              </button>
              <button (click)="setActiveTab('reviews')" [class]="activeTab() === 'reviews' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
                 Reviews
              </button>
              <button (click)="setActiveTab('settings')" [class]="activeTab() === 'settings' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                 Site Settings
              </button>
              <button (click)="setActiveTab('donations')" [class]="activeTab() === 'donations' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                 Donations
              </button>
              <button (click)="setActiveTab('news')" [class]="activeTab() === 'news' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.43.816 1.035.816 1.73 0 .695-.32 1.3-.816 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg>
                 Announcements
              </button>
              <button (click)="setActiveTab('library')" [class]="activeTab() === 'library' ? 'bg-amber-500 text-red-950 font-bold shadow-md' : 'hover:bg-red-800 text-amber-100'" class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                 Library
              </button>
            </nav>
            
            <div class="p-4 border-t border-red-800/50">
               <button (click)="templeService.logout()" class="w-full text-left px-4 py-2 text-red-200 hover:text-white flex items-center gap-2 hover:bg-red-800 rounded transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                 Logout
               </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-grow p-8 overflow-y-auto bg-orange-50/50">
            
            <!-- Dashboard View -->
            @if (activeTab() === 'dashboard') {
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">Temple Overview</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-white p-6 rounded-xl shadow-lg border-l-8 border-red-600">
                    <p class="text-stone-500 text-xs font-bold uppercase tracking-widest">Total Donations</p>
                    <p class="text-4xl font-serif font-bold text-red-800 mt-2">₹ {{ templeService.totalDonations().toLocaleString('en-IN') }}</p>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-lg border-l-8 border-amber-500">
                    <p class="text-stone-500 text-xs font-bold uppercase tracking-widest">Active News</p>
                    <p class="text-4xl font-serif font-bold text-amber-700 mt-2">{{ templeService.news().length }}</p>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-lg border-l-8 border-orange-400">
                    <p class="text-stone-500 text-xs font-bold uppercase tracking-widest">Pending Tasks</p>
                    <p class="text-4xl font-serif font-bold text-orange-700 mt-2">{{ getPendingTasksCount() }}</p>
                 </div>
              </div>

              <!-- Edge Function Tester -->
               <div class="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8">
                  <h3 class="text-lg font-bold text-indigo-900 mb-4 font-serif">Server Health Check (Edge Function)</h3>
                  <div class="flex gap-4 items-center">
                    <button (click)="testEdgeFunction()" [disabled]="testingEdge" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                       {{ testingEdge ? 'Connecting...' : 'Ping Server' }}
                    </button>
                    <span class="font-mono text-sm bg-stone-100 px-3 py-2 rounded border border-stone-200 flex-grow">{{ edgeResponse }}</span>
                  </div>
               </div>

              <!-- Visualizations Row -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Bar Chart -->
                <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
                  <h3 class="text-lg font-bold text-red-900 mb-4 font-serif">Donations by Category (Bar)</h3>
                  <div #barChartContainer class="w-full h-64 flex items-center justify-center"></div>
                </div>

                <!-- Pie Chart -->
                <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
                   <h3 class="text-lg font-bold text-red-900 mb-4 font-serif">Distribution (Pie)</h3>
                   <div #pieChartContainer class="w-full h-64 flex items-center justify-center relative"></div>
                   <!-- Legend -->
                   <div class="mt-4 flex flex-wrap gap-2 justify-center">
                     @for (item of pieLegend(); track item.label) {
                       <div class="flex items-center gap-1 text-xs">
                         <span class="w-3 h-3 rounded-full" [style.background-color]="item.color"></span>
                         <span class="text-stone-600">{{item.label}}</span>
                       </div>
                     }
                   </div>
                </div>
              </div>

              <!-- Flash News Manager -->
              <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
                 <h3 class="text-lg font-bold text-red-900 mb-4">Scrolling Flash News</h3>
                 <div class="flex gap-4">
                   <input [(ngModel)]="flashNewsInput" class="flex-grow p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800" [placeholder]="templeService.flashNews()">
                   <button (click)="updateFlash()" class="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 font-bold shadow-md transition-all">Update</button>
                 </div>
                 <p class="text-xs text-stone-500 mt-2 italic">This text scrolls across the top of the homepage in marquee style.</p>
              </div>
            }

            <!-- Task Manager Tab -->
            @if (activeTab() === 'tasks') {
              <div class="flex justify-between items-center mb-6 border-b border-amber-200 pb-2">
                <h2 class="text-3xl font-serif font-bold text-red-900">Task Management</h2>
                <button (click)="openTaskModal()" class="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 font-bold shadow-md flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   New Task
                </button>
              </div>

              <!-- Task Form -->
              @if (showTaskForm) {
                 <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-200 mb-8 animate-fade-in">
                    <h3 class="text-xl font-bold text-stone-800 mb-4">{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h3>
                    <form (submit)="handleTaskSubmit($event)">
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label class="block text-stone-700 font-bold mb-1 text-sm">Task Title</label>
                            <input [(ngModel)]="currentTask.title" name="tTitle" required class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                          </div>
                          <div>
                            <label class="block text-stone-700 font-bold mb-1 text-sm">Assign To</label>
                            <input [(ngModel)]="currentTask.assignee" name="tAssignee" required class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                          </div>
                          <div class="md:col-span-2">
                             <label class="block text-stone-700 font-bold mb-1 text-sm">Description</label>
                             <textarea [(ngModel)]="currentTask.description" name="tDesc" class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none h-20 bg-white text-stone-800"></textarea>
                          </div>
                          <div>
                             <label class="block text-stone-700 font-bold mb-1 text-sm">Priority</label>
                             <select [(ngModel)]="currentTask.priority" name="tPriority" class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                             </select>
                          </div>
                          <div>
                             <label class="block text-stone-700 font-bold mb-1 text-sm">Due Date</label>
                             <input type="date" [(ngModel)]="currentTask.dueDate" name="tDue" class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                          </div>
                          <div>
                             <label class="block text-stone-700 font-bold mb-1 text-sm">Status</label>
                             <select [(ngModel)]="currentTask.status" name="tStatus" class="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                             </select>
                          </div>
                       </div>
                       <div class="flex gap-2 justify-end">
                          <button type="button" (click)="closeTaskForm()" class="px-4 py-2 text-stone-600 hover:text-stone-900 font-bold border border-stone-300 rounded">Cancel</button>
                          <button type="submit" class="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900 font-bold shadow-sm">Save Task</button>
                       </div>
                    </form>
                 </div>
              }

              <!-- Tasks List -->
              <div class="grid grid-cols-1 gap-4">
                 @for (task of templeService.tasks(); track task.id) {
                    <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                         [class.border-l-red-500]="task.priority === 'High'"
                         [class.border-l-yellow-500]="task.priority === 'Medium'"
                         [class.border-l-green-500]="task.priority === 'Low'">
                       <div class="flex-grow">
                          <div class="flex items-center gap-2 mb-1">
                             <h4 class="font-bold text-lg text-stone-800">{{ task.title }}</h4>
                             <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border"
                                   [class.bg-red-100]="task.priority === 'High'" [class.text-red-800]="task.priority === 'High'" [class.border-red-200]="task.priority === 'High'"
                                   [class.bg-yellow-100]="task.priority === 'Medium'" [class.text-yellow-800]="task.priority === 'Medium'" [class.border-yellow-200]="task.priority === 'Medium'"
                                   [class.bg-green-100]="task.priority === 'Low'" [class.text-green-800]="task.priority === 'Low'" [class.border-green-200]="task.priority === 'Low'">
                                {{ task.priority }}
                             </span>
                             <button (click)="toggleTaskStatus(task)" class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide cursor-pointer border transition-colors hover:brightness-95"
                                   [class.bg-stone-100]="task.status === 'Pending'" [class.text-stone-600]="task.status === 'Pending'"
                                   [class.bg-blue-100]="task.status === 'In Progress'" [class.text-blue-800]="task.status === 'In Progress'"
                                   [class.bg-green-100]="task.status === 'Completed'" [class.text-green-800]="task.status === 'Completed'">
                                {{ task.status }}
                             </button>
                          </div>
                          <p class="text-stone-600 text-sm mb-2">{{ task.description }}</p>
                          <div class="flex gap-4 text-xs text-stone-500 font-bold">
                             <span class="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg>
                                {{ task.assignee }}
                             </span>
                             <span class="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd" /></svg>
                                {{ task.dueDate }}
                             </span>
                          </div>
                       </div>
                       <div class="flex gap-2">
                          <button (click)="editTask(task)" class="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Edit">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </button>
                          <button (click)="deleteTask(task.id)" class="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                       </div>
                    </div>
                 }
                 @if (templeService.tasks().length === 0) {
                     <div class="text-center py-12 text-stone-500 bg-white rounded-lg border-2 border-dashed border-stone-200">
                        <p>No tasks assigned yet.</p>
                     </div>
                 }
              </div>
            }

            <!-- Reviews Management Tab -->
            @if (activeTab() === 'reviews') {
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">User Feedback & Reviews</h2>
               <div class="grid grid-cols-1 gap-4">
                  @for (feedback of templeService.feedbacks(); track feedback.id) {
                     <div class="bg-white p-5 rounded-lg shadow-sm border border-stone-200 flex justify-between items-start gap-4">
                        <div class="flex-grow">
                           <div class="flex items-center gap-2 mb-2">
                              <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                                 {{ feedback.name.charAt(0).toUpperCase() }}
                              </div>
                              <div>
                                 <h4 class="font-bold text-stone-800 text-sm">{{ feedback.name }}</h4>
                                 <p class="text-[10px] text-stone-500">{{ feedback.date }}</p>
                              </div>
                           </div>
                           <p class="text-stone-600 text-sm italic bg-stone-50 p-3 rounded">"{{ feedback.message }}"</p>
                        </div>
                        <button (click)="deleteReview(feedback.id)" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors" title="Delete Review">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                     </div>
                  }
                  @if (templeService.feedbacks().length === 0) {
                     <div class="text-center py-12 text-stone-500 italic">No feedback received yet.</div>
                  }
               </div>
            }

            <!-- Site Settings View -->
            @if (activeTab() === 'settings') {
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">Site Configuration</h2>
               <div class="bg-white p-8 rounded-xl shadow-lg max-w-4xl border border-amber-100">
                 <form (submit)="saveSettings($event)">
                    
                    <!-- Logo Upload Section -->
                    <div class="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
                       <h3 class="font-bold text-red-800 mb-4">Temple Logo</h3>
                       <div class="flex items-center gap-6">
                          <div class="w-24 h-24 bg-white rounded-full border-4 border-amber-300 shadow overflow-hidden flex-shrink-0">
                             <img [src]="tempConfig.logoUrl" class="w-full h-full object-cover">
                          </div>
                          <div class="flex-grow">
                             <label class="block text-sm font-bold text-stone-600 mb-2">Upload New Logo Image</label>
                             <input type="file" (change)="handleLogoUpload($event)" accept="image/*" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200 cursor-pointer">
                             <p class="text-xs text-stone-400 mt-2">Recommended: Square PNG/JPG, 500x500px</p>
                             @if (logoUploading) {
                                <p class="text-amber-600 text-sm font-bold mt-2 animate-pulse">Uploading...</p>
                             }
                          </div>
                       </div>
                    </div>

                    <!-- Daily Panchangam Upload Section -->
                    <div class="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                       <h3 class="font-bold text-red-800 mb-4 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                           Daily Panchangam Image
                       </h3>
                       <div class="flex flex-col md:flex-row gap-6 items-start">
                           @if (tempConfig.panchangamImageUrl) {
                               <div class="w-32 md:w-48 bg-white p-1 border border-amber-200 shadow-sm">
                                   <img [src]="tempConfig.panchangamImageUrl" class="w-full h-auto">
                                   <p class="text-[10px] text-center mt-1 text-stone-500">Current Sheet</p>
                               </div>
                           }
                           <div class="flex-grow">
                               <label class="block text-sm font-bold text-stone-600 mb-2">Upload Today's Panchangam</label>
                               <input type="file" (change)="handlePanchangamUpload($event)" accept="image/*" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer">
                               <p class="text-xs text-stone-400 mt-2">Upload an image (JPG/PNG) of the daily almanac sheet to display on the home page.</p>
                               @if (panchangamUploading) {
                                   <p class="text-amber-600 text-sm font-bold mt-2 animate-pulse">Uploading...</p>
                               }
                           </div>
                       </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                       <div>
                          <label class="block text-red-900 font-bold mb-2">Temple Name</label>
                          <input [(ngModel)]="tempConfig.templeName" name="tName" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                       </div>
                       <div>
                          <label class="block text-red-900 font-bold mb-2">Subtitle / Location</label>
                          <input [(ngModel)]="tempConfig.subTitle" name="tSub" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-red-900 font-bold mb-2">Logo URL (Manual Override)</label>
                          <input [(ngModel)]="tempConfig.logoUrl" name="tLogo" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800 font-mono text-sm">
                       </div>
                       <div>
                          <label class="block text-red-900 font-bold mb-2">Live Darshan Link (YouTube)</label>
                          <input [(ngModel)]="tempConfig.liveLink" name="tLive" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-blue-600">
                       </div>
                       <div>
                          <label class="block text-red-900 font-bold mb-2">Contact Phone</label>
                          <input [(ngModel)]="tempConfig.contactPhone" name="tPhone" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-red-900 font-bold mb-2">WhatsApp Channel Link</label>
                          <input [(ngModel)]="tempConfig.whatsappChannel" name="tWhatsapp" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-green-600">
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-red-900 font-bold mb-2">Contact Email</label>
                          <input [(ngModel)]="tempConfig.contactEmail" name="tEmail" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                       </div>
                    </div>

                    <!-- Bank Details Section -->
                    <div class="border-t border-amber-200 pt-6 mt-6">
                        <h3 class="text-xl font-bold text-red-900 mb-4">Bank Details & QR Code</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="tempConfig.bankInfo">
                            <div>
                                <label class="block text-stone-700 font-bold mb-2">Account Name</label>
                                <input [(ngModel)]="tempConfig.bankInfo!.accountName" name="bAccName" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                            </div>
                            <div>
                                <label class="block text-stone-700 font-bold mb-2">Bank Name</label>
                                <input [(ngModel)]="tempConfig.bankInfo!.bankName" name="bBankName" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                            </div>
                            <div>
                                <label class="block text-stone-700 font-bold mb-2">Account Number</label>
                                <input [(ngModel)]="tempConfig.bankInfo!.accountNumber" name="bAccNum" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono bg-white text-stone-800">
                            </div>
                            <div>
                                <label class="block text-stone-700 font-bold mb-2">IFSC Code</label>
                                <input [(ngModel)]="tempConfig.bankInfo!.ifsc" name="bIfsc" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono uppercase bg-white text-stone-800">
                            </div>
                            <div>
                                <label class="block text-stone-700 font-bold mb-2">Branch</label>
                                <input [(ngModel)]="tempConfig.bankInfo!.branch" name="bBranch" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                            </div>
                            
                            <!-- QR Upload -->
                            <div class="md:col-span-2 mt-4 p-4 bg-stone-50 rounded border border-stone-200">
                                <label class="block text-stone-700 font-bold mb-2">Payment QR Code Image</label>
                                <div class="flex items-center gap-4">
                                    <div *ngIf="tempConfig.bankInfo?.qrCodeUrl" class="w-24 h-24 border border-stone-300 bg-white p-1">
                                        <img [src]="tempConfig.bankInfo!.qrCodeUrl" class="w-full h-full object-contain">
                                    </div>
                                    <div class="flex-grow">
                                        <input type="file" (change)="handleQrUpload($event)" accept="image/*" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer">
                                        <p class="text-xs text-stone-400 mt-1">Upload UPI QR code image (JPG/PNG)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8">
                      <button type="submit" [disabled]="logoUploading || panchangamUploading" class="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50">
                         Save Configuration
                      </button>
                    </div>
                 </form>
               </div>
            }

            <!-- Donations Reports -->
            @if (activeTab() === 'donations') {
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">Donation History</h2>
              
              <!-- Filter Controls -->
              <div class="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-stone-200">
                  <label class="font-bold text-stone-700">Segregate By Category:</label>
                  <select [(ngModel)]="donationFilter" class="p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                      <option value="All">All Donations</option>
                      <option value="Hundi">Hundi</option>
                      <option value="Annadanam">Annadanam</option>
                      <option value="Gosala">Gosala</option>
                      <option value="Saswatha_Puja">Saswatha Puja</option>
                      <option value="Construction">Construction</option>
                  </select>
                  <div class="ml-auto text-sm text-stone-500">
                      Showing {{ filteredDonations().length }} records
                  </div>
              </div>

              <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
                <table class="w-full text-left">
                  <thead class="bg-orange-100 text-red-900 font-bold uppercase text-xs">
                    <tr>
                      <th class="p-4">Transaction ID</th>
                      <th class="p-4">Date</th>
                      <th class="p-4">Donor Name</th>
                      <th class="p-4">Category</th>
                      <th class="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-orange-100">
                    @for (d of filteredDonations(); track d.id) {
                      <tr class="hover:bg-orange-50 transition-colors">
                        <td class="p-4 font-mono text-stone-600 text-sm">{{ d.transactionId }}</td>
                        <td class="p-4 text-sm font-medium">{{ d.date }}</td>
                        <td class="p-4 font-bold text-stone-800">
                          {{ d.donorName }}
                          @if (d.pan) {
                            <span class="text-stone-400 font-normal text-xs block">PAN: {{d.pan}}</span>
                          }
                        </td>
                        <td class="p-4">
                          <span class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold border border-amber-200">{{ d.category }}</span>
                        </td>
                        <td class="p-4 text-right font-bold text-red-800">₹ {{ d.amount.toLocaleString('en-IN') }}</td>
                      </tr>
                    }
                    @if (filteredDonations().length === 0) {
                        <tr>
                            <td colspan="5" class="p-8 text-center text-stone-500 italic">No donations found for this category.</td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            <!-- News Manager -->
            @if (activeTab() === 'news') {
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">Announcements</h2>
               <div class="grid grid-cols-1 gap-8">
                 <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
                   <h3 class="text-lg font-bold mb-4 text-stone-800">Post New Update</h3>
                   
                   <div class="mb-3">
                     <label class="block text-xs font-bold text-stone-500 mb-1">Headline</label>
                     <input [(ngModel)]="newTitle" placeholder="Title" class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                   </div>

                   <!-- Rich Text Editor Section -->
                   <div class="mb-4">
                        <label class="block text-xs font-bold text-stone-500 mb-2">Details (Rich Text)</label>
                        
                        <div class="border border-stone-300 rounded-lg overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
                            <!-- Toolbar -->
                            <div class="flex items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 flex-wrap">
                                <button (click)="execCommand('bold')" title="Bold" class="p-2 hover:bg-stone-200 rounded text-stone-700 font-bold transition-colors">
                                    <span class="font-serif">B</span>
                                </button>
                                <button (click)="execCommand('italic')" title="Italic" class="p-2 hover:bg-stone-200 rounded text-stone-700 italic transition-colors">
                                    <span class="font-serif">I</span>
                                </button>
                                <button (click)="execCommand('underline')" title="Underline" class="p-2 hover:bg-stone-200 rounded text-stone-700 underline transition-colors">
                                    <span class="font-serif">U</span>
                                </button>
                                <div class="w-px h-6 bg-stone-300 mx-1"></div>
                                <button (click)="execCommand('insertOrderedList')" title="Ordered List" class="p-2 hover:bg-stone-200 rounded text-stone-700 transition-colors font-mono">
                                    1.
                                </button>
                                <button (click)="execCommand('insertUnorderedList')" title="Bullet List" class="p-2 hover:bg-stone-200 rounded text-stone-700 transition-colors font-mono">
                                    •
                                </button>
                                <div class="w-px h-6 bg-stone-300 mx-1"></div>
                                <button (click)="execCommand('justifyLeft')" title="Align Left" class="p-2 hover:bg-stone-200 rounded text-stone-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
                                </button>
                                <button (click)="execCommand('justifyCenter')" title="Align Center" class="p-2 hover:bg-stone-200 rounded text-stone-700 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                                </button>
                            </div>
                            
                            <!-- Editable Area -->
                            <div #newsEditor
                                 contenteditable="true" 
                                 (input)="updateContent($event)"
                                 class="w-full p-4 min-h-[150px] outline-none text-stone-800 text-sm leading-relaxed overflow-y-auto">
                            </div>
                        </div>
                   </div>
                   
                   <div class="mb-4">
                      <label class="block text-xs font-bold text-stone-500 mb-1">Attachment</label>
                      <div class="flex flex-col gap-2">
                         <input type="file" #newsFileInput (change)="handleFileSelectForNews($event)" class="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer">
                         @if (newsUploading) { <span class="text-xs text-amber-600 animate-pulse font-bold">Uploading file...</span> }
                      </div>
                   </div>
                   <button (click)="handleAddNews()" [disabled]="newsUploading" class="bg-red-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-900 disabled:opacity-50 shadow-md">Publish Update</button>
                 </div>
                 
                 <div class="space-y-4">
                   @for (item of templeService.news(); track item.id) {
                     <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-amber-500 flex justify-between items-start hover:shadow-md transition-shadow">
                       <div>
                         <h4 class="font-bold text-lg text-red-900">{{ item.title }}</h4>
                         <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{{ item.date }}</span>
                         
                         <!-- Render HTML content -->
                         <div class="text-sm text-stone-600 mt-2 prose prose-sm max-w-none" [innerHTML]="item.content"></div>

                         @if (item.attachmentUrl) {
                            <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-1 mt-3 text-xs bg-stone-100 px-3 py-1.5 rounded-full hover:bg-stone-200 font-bold text-stone-600">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                               View Attachment
                            </a>
                         }
                       </div>
                       <button (click)="templeService.deleteNews(item.id)" class="text-stone-400 hover:text-red-600 p-2" title="Delete">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                       </button>
                     </div>
                   }
                 </div>
               </div>
            }

            <!-- Library Manager -->
            @if (activeTab() === 'library') {
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-6 border-b border-amber-200 pb-2">Digital Library</h2>
               <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100 mb-8">
                  <h3 class="text-lg font-bold mb-4 text-stone-800">Add New Resource</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select [(ngModel)]="libType" class="p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                      <option value="audio">Audio (MP3)</option>
                      <option value="ebook">E-Book (PDF)</option>
                    </select>
                    <input [(ngModel)]="libTitle" placeholder="Resource Title" class="p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                  </div>
                  
                  <div class="mb-4">
                      <label class="block text-xs font-bold text-stone-500 mb-1">File Upload (Optional)</label>
                      <div class="flex items-center gap-4">
                        <input type="file" (change)="handleLibFileUpload($event)" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer">
                        @if (libUploading) { <span class="text-xs text-purple-600 animate-pulse font-bold whitespace-nowrap">Uploading...</span> }
                      </div>
                  </div>

                  <input [(ngModel)]="libUrl" placeholder="File URL (https://...)" class="w-full p-3 border border-stone-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                  <input [(ngModel)]="libDesc" placeholder="Short Description" class="w-full p-3 border border-stone-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-800">
                  <button (click)="handleAddLibrary()" [disabled]="libUploading" class="bg-purple-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-900 shadow-md disabled:opacity-50">Add to Library</button>
               </div>

               <div class="grid grid-cols-1 gap-4">
                  @for (item of templeService.library(); track item.id) {
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-stone-200 flex justify-between items-center">
                       <div class="flex items-center gap-4">
                          <div [class]="item.type === 'audio' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'" class="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                            <span class="uppercase text-[10px] font-bold">{{ item.type === 'audio' ? 'MP3' : 'PDF' }}</span>
                          </div>
                          <div>
                            <h4 class="font-bold text-stone-800">{{ item.title }}</h4>
                            <p class="text-xs text-stone-500 line-clamp-1">{{ item.description }}</p>
                          </div>
                       </div>
                       <button (click)="templeService.deleteLibraryItem(item.id)" class="text-red-500 hover:text-red-700 text-sm font-bold border border-red-200 px-3 py-1 rounded hover:bg-red-50 ml-4 whitespace-nowrap">Remove</button>
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
export class AdminComponent implements AfterViewInit {
  templeService = inject(TempleService);
  
  // ViewChild for editor
  @ViewChild('newsEditor') newsEditor!: ElementRef;

  // Login State
  loginStep = signal<'credentials' | '2fa'>('credentials');
  email = '';
  password = '';
  otp = '';
  isLoading = false;
  errorMsg = '';
  
  // Dashboard State
  activeTab = signal<'dashboard' | 'tasks' | 'reviews' | 'settings' | 'donations' | 'news' | 'library'>('dashboard');
  
  // Charts
  @ViewChild('barChartContainer') barChartContainer!: ElementRef;
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;
  pieLegend = signal<{label: string, color: string}[]>([]);

  // Edge Function Test
  testingEdge = false;
  edgeResponse = '';

  // Flash News
  flashNewsInput = '';

  // Tasks
  showTaskForm = false;
  editingTask = false;
  currentTask: any = this.getEmptyTask();

  // Settings
  tempConfig: any = {};
  logoUploading = false;
  panchangamUploading = false;

  // Donations
  donationFilter = 'All';

  // News
  newTitle = '';
  newContent = '';
  newAttachmentUrl = '';
  newsUploading = false;

  // Library
  libType = 'audio';
  libTitle = '';
  libUrl = '';
  libDesc = '';
  libUploading = false;

  constructor() {
    effect(() => {
      if (this.templeService.isAdmin()) {
        this.initAdminData();
      }
    });

    effect(() => {
        if (this.activeTab() === 'dashboard' && this.templeService.isAdmin()) {
            // Allow DOM to update then render charts
            setTimeout(() => this.renderCharts(), 100); 
        }
    });
  }
  
  ngAfterViewInit() {
      // Initial render if already admin and on dashboard
      if (this.templeService.isAdmin() && this.activeTab() === 'dashboard') {
          this.renderCharts();
      }
  }

  initAdminData() {
    this.tempConfig = JSON.parse(JSON.stringify(this.templeService.siteConfig()));
    this.flashNewsInput = this.templeService.flashNews();
  }

  // ... Editor Methods
  execCommand(command: string) {
    document.execCommand(command, false, '');
    if (this.newsEditor) {
        this.newContent = this.newsEditor.nativeElement.innerHTML;
    }
  }

  updateContent(e: any) {
      this.newContent = e.target.innerHTML;
  }

  // ... Login Methods
  async handleLogin() {
      this.isLoading = true;
      this.errorMsg = '';
      const res = await this.templeService.login(this.email, this.password);
      this.isLoading = false;
      if (res.error) {
          this.errorMsg = res.error.message;
      } else if (res.requires2FA) {
          this.loginStep.set('2fa');
      }
  }

  async handleVerifyOtp() {
      this.isLoading = true;
      const valid = await this.templeService.verifyTwoFactor(this.otp);
      this.isLoading = false;
      if (!valid) {
          this.errorMsg = 'Invalid Code';
      }
  }
  
  resetLogin() {
      this.loginStep.set('credentials');
      this.otp = '';
      this.errorMsg = '';
  }

  setActiveTab(tab: any) {
      this.activeTab.set(tab);
  }

  // ... Dashboard Methods
  getPendingTasksCount() {
      return this.templeService.tasks().filter(t => t.status === 'Pending').length;
  }

  async testEdgeFunction() {
      this.testingEdge = true;
      this.edgeResponse = 'Calling...';
      const res = await this.templeService.invokeHelloFunction('Admin');
      this.edgeResponse = res;
      this.testingEdge = false;
  }
  
  updateFlash() {
      this.templeService.updateFlashNews(this.flashNewsInput);
      alert('Flash news updated!');
  }

  renderCharts() {
      if (!this.barChartContainer || !this.pieChartContainer) return;
      
      // Clear previous
      d3.select(this.barChartContainer.nativeElement).selectAll('*').remove();
      d3.select(this.pieChartContainer.nativeElement).selectAll('*').remove();

      this.renderBarChart();
      this.renderPieChart();
  }

  renderBarChart() {
      const data = this.templeService.donations();
      // Aggregate by category
      const counts: {[key: string]: number} = {};
      data.forEach(d => {
          counts[d.category] = (counts[d.category] || 0) + d.amount;
      });
      const chartData = Object.keys(counts).map(k => ({ category: k, value: counts[k] }));
      
      const margin = {top: 20, right: 20, bottom: 30, left: 60};
      const width = this.barChartContainer.nativeElement.offsetWidth - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const svg = d3.select(this.barChartContainer.nativeElement)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
      const y = d3.scaleLinear()
          .range([height, 0]);

      x.domain(chartData.map(d => d.category));
      y.domain([0, d3.max(chartData, d => d.value) || 0]);

      svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

      svg.append("g")
          .call(d3.axisLeft(y));

      svg.selectAll(".bar")
          .data(chartData)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.category)!)
          .attr("width", x.bandwidth())
          .attr("y", d => y(d.value))
          .attr("height", d => height - y(d.value))
          .attr("fill", "#b45309"); // amber-700
  }

  renderPieChart() {
      const data = this.templeService.donations();
      const counts: {[key: string]: number} = {};
      data.forEach(d => {
          counts[d.category] = (counts[d.category] || 0) + d.amount;
      });
      const chartData = Object.keys(counts).map(k => ({ label: k, value: counts[k] }));

      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(this.pieChartContainer.nativeElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.label))
        .range(d3.schemeSet2);

      const pie = d3.pie<any>().value(d => d.value);
      const data_ready = pie(chartData);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc as any)
        .attr('fill', d => color(d.data.label) as string)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
        
      this.pieLegend.set(chartData.map(d => ({ label: d.label, color: color(d.label) as string })));
  }

  // ... Task Methods
  getEmptyTask() {
      return { title: '', description: '', assignee: '', priority: 'Medium', dueDate: '', status: 'Pending' };
  }
  
  openTaskModal() {
      this.currentTask = this.getEmptyTask();
      this.editingTask = false;
      this.showTaskForm = true;
  }
  
  closeTaskForm() {
      this.showTaskForm = false;
  }
  
  handleTaskSubmit(e: Event) {
      e.preventDefault();
      if (this.editingTask) {
          this.templeService.updateTask(this.currentTask.id, this.currentTask);
      } else {
          this.templeService.addTask(this.currentTask);
      }
      this.closeTaskForm();
  }
  
  editTask(task: any) {
      this.currentTask = { ...task };
      this.editingTask = true;
      this.showTaskForm = true;
  }
  
  toggleTaskStatus(task: any) {
      const nextStatus = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending';
      this.templeService.updateTask(task.id, { status: nextStatus });
  }

  deleteTask(id: number) {
      if(confirm('Delete this task?')) this.templeService.deleteTask(id);
  }

  // ... Reviews
  deleteReview(id: number) {
      if(confirm('Delete review?')) this.templeService.deleteFeedback(id);
  }

  // ... Settings
  async handleLogoUpload(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      this.logoUploading = true;
      const url = await this.templeService.uploadFile(file, 'images');
      if (url) this.tempConfig.logoUrl = url;
      this.logoUploading = false;
  }

  async handlePanchangamUpload(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      this.panchangamUploading = true;
      const url = await this.templeService.uploadFile(file, 'images');
      if (url) this.tempConfig.panchangamImageUrl = url;
      this.panchangamUploading = false;
  }

  async handleQrUpload(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      const url = await this.templeService.uploadFile(file, 'images');
      if (url && this.tempConfig.bankInfo) this.tempConfig.bankInfo.qrCodeUrl = url;
  }

  saveSettings(e: Event) {
      e.preventDefault();
      this.templeService.updateSiteConfig(this.tempConfig);
      alert('Configuration Saved!');
  }

  // ... Donations
  filteredDonations = computed(() => {
      const all = this.templeService.donations();
      if (this.donationFilter === 'All') return all;
      return all.filter(d => d.category === this.donationFilter);
  });

  // ... News
  async handleFileSelectForNews(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      this.newsUploading = true;
      const url = await this.templeService.uploadFile(file, 'gallery'); // or specific bucket
      if (url) this.newAttachmentUrl = url;
      this.newsUploading = false;
  }

  handleAddNews() {
      if (!this.newTitle || !this.newContent) return;
      this.templeService.addNews(this.newTitle, this.newContent, this.newAttachmentUrl);
      this.newTitle = '';
      this.newContent = '';
      this.newAttachmentUrl = '';
      
      // Clear visual editor
      if (this.newsEditor && this.newsEditor.nativeElement) {
          this.newsEditor.nativeElement.innerHTML = '';
      }
      
      alert('News Added');
  }

  // ... Library
  async handleLibFileUpload(e: any) {
       const file = e.target.files[0];
       if (!file) return;
       this.libUploading = true;
       const bucket = this.libType === 'ebook' ? 'ebooks' : 'gallery';
       const url = await this.templeService.uploadFile(file, bucket);
       if (url) this.libUrl = url;
       this.libUploading = false;
  }
  
  handleAddLibrary() {
      if (!this.libTitle || !this.libUrl) return;
      this.templeService.addLibraryItem({
          type: this.libType as any,
          title: this.libTitle,
          url: this.libUrl,
          description: this.libDesc
      });
      this.libTitle = '';
      this.libUrl = '';
      this.libDesc = '';
      alert('Library Item Added');
  }
}
