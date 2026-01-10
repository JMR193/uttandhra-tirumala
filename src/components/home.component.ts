import { Component, inject, computed, signal } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Top Scrolling Ticker (Maroon Background like Tirumala.org) -->
    <div class="bg-[#800000] text-white py-2 overflow-hidden relative shadow-md border-b-2 border-amber-500 z-20">
      <div class="container mx-auto px-4 flex items-center">
        <span class="bg-amber-500 text-[#800000] text-xs font-bold px-3 py-1 rounded mr-4 z-10 whitespace-nowrap uppercase tracking-wider shadow-sm">Latest Updates</span>
        <div class="whitespace-nowrap animate-marquee font-medium text-sm flex items-center gap-8">
          <span>{{ templeService.flashNews() }}</span>
          <span class="text-amber-300">✦</span>
          <span>{{ templeService.siteConfig().templeName }} Welcomes You to Bhuloka Vaikuntham</span>
          <span class="text-amber-300">✦</span>
          <span>Sarve Jana Sukhino Bhavantu</span>
          <span class="text-amber-300">✦</span>
          <span>Please wear traditional dress for Darshan</span>
        </div>
      </div>
    </div>

    <!-- Hero Banner with Slider effect imitation -->
    <div class="relative h-[400px] md:h-[550px] w-full overflow-hidden bg-stone-900 group">
      <img src="https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" 
           class="w-full h-full object-cover opacity-90 transition-transform duration-[10s] ease-linear group-hover:scale-110" 
           fetchpriority="high" loading="eager">
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center text-center">
         <div class="container mx-auto px-6 md:px-12 animate-fade-in-up">
            <img src="https://www.tirumala.org/Images/Sangu_Chakra_Symbol.png" class="h-16 mx-auto mb-4 opacity-80" alt="Shanku Chakra" onerror="this.style.display='none'">
            <h2 class="text-5xl md:text-7xl text-white font-serif font-bold drop-shadow-xl mb-4 tracking-tight">Govinda Govinda</h2>
            <div class="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p class="text-amber-200 text-xl md:text-2xl font-serif italic mb-8 max-w-2xl mx-auto leading-relaxed">
              "Experience the divine presence of Lord Venkateswara at {{ templeService.siteConfig().templeName }}"
            </p>
            <div class="flex gap-4 justify-center">
              <a routerLink="/booking" class="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white px-8 py-4 rounded-full shadow-2xl border-2 border-amber-500/50 font-bold uppercase text-sm tracking-widest transform hover:-translate-y-1 transition-all">
                Book Darshan
              </a>
              <a routerLink="/e-hundi" class="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-full shadow-xl border border-white/30 font-bold uppercase text-sm tracking-widest transform hover:-translate-y-1 transition-all">
                E-Hundi
              </a>
            </div>
         </div>
      </div>
    </div>

    <!-- Dashboard Services Grid (Cloning https://ttdevasthanams.ap.gov.in/home/dashboard style) -->
    <div class="bg-stone-50 py-16 relative">
       <!-- Decorative background pattern -->
       <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

       <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-12">
             <span class="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">Pilgrim Services</span>
             <h3 class="text-3xl font-serif font-bold text-[#800000] uppercase tracking-wide inline-block relative pb-4">
                Online Services
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-amber-500 rounded"></span>
             </h3>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
             <!-- Service Card: Booking -->
             <a routerLink="/booking" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-amber-500 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-[#800000] bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-[#800000] group-hover:text-white transition-colors relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Darshan Booking</h4>
             </a>

             <!-- Service Card: Hundi -->
             <a routerLink="/e-hundi" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-green-600 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-green-700 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition-colors relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Srivari Hundi</h4>
             </a>

             <!-- Service Card: Live -->
             <a [href]="templeService.siteConfig().liveLink" target="_blank" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-red-600 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-red-600 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Live Darshan</h4>
             </a>

             <!-- Service Card: Audio -->
             <a routerLink="/library" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-purple-500 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-purple-700 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Audio Library</h4>
             </a>

             <!-- Service Card: Timings -->
             <a routerLink="/history" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-500 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-blue-700 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Seva Timings</h4>
             </a>

             <!-- Service Card: Feedback -->
             <a routerLink="/feedback" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-500 flex flex-col items-center text-center group cursor-pointer h-full relative overflow-hidden">
                <div class="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="w-14 h-14 mb-4 text-orange-600 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm md:text-base relative z-10">Feedback</h4>
             </a>
          </div>
       </div>
    </div>

    <!-- News & Updates Section (Grid like TTD) -->
    <div class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-8">
          
          <!-- Latest News Column -->
          <div class="md:w-2/3">
             <div class="flex items-center justify-between mb-6 border-b border-stone-200 pb-2">
                <h3 class="text-xl font-bold text-[#800000] uppercase font-serif">Latest News & Updates</h3>
                <a routerLink="/gallery" class="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                   View Archives <span class="text-lg">&rsaquo;</span>
                </a>
             </div>
             
             <div class="space-y-4">
               @for (item of templeService.news(); track item.id) {
                 <div class="flex gap-4 p-5 border border-stone-100 shadow-sm rounded-lg hover:shadow-md transition-all hover:border-amber-200 bg-white group">
                    <div class="flex-shrink-0 w-16 text-center pt-1">
                       <div class="bg-[#800000] text-white text-[10px] font-bold py-1 rounded-t uppercase tracking-wider">{{ getMonth(item.date) }}</div>
                       <div class="bg-stone-50 text-stone-800 font-serif font-bold text-xl py-2 border border-stone-200 border-t-0 rounded-b shadow-inner">{{ getDay(item.date) }}</div>
                    </div>
                    <div class="flex-grow">
                       <h4 class="font-bold text-[#800000] text-lg mb-2 group-hover:text-amber-700 transition-colors">{{ item.title }}</h4>
                       <div class="text-stone-600 text-sm leading-relaxed prose prose-sm max-w-none" [innerHTML]="item.content"></div>
                       @if (item.attachmentUrl) {
                          <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-1 text-xs text-blue-600 font-bold mt-3 hover:underline bg-blue-50 px-2 py-1 rounded">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                             Download Attachment
                          </a>
                       }
                    </div>
                 </div>
               }
               @if (templeService.news().length === 0) {
                 <p class="text-stone-500 italic p-4 bg-stone-50 rounded">No recent updates available.</p>
               }
             </div>
          </div>

          <!-- Right Sidebar Column (Panchangam + Media) -->
          <div class="md:w-1/3 flex flex-col gap-8">
             
             <!-- Panchangam Widget -->
             <div class="bg-white rounded-lg shadow-md border border-amber-200 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 font-bold uppercase text-sm flex justify-between items-center shadow-md">
                   <span class="flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                     Daily Panchangam
                   </span>
                   <span class="text-[10px] bg-red-900 text-amber-100 px-2 py-0.5 rounded shadow">{{ templeService.dailyPanchangam().date.split(',')[0] }}</span>
                </div>
                
                <div class="p-4 bg-orange-50/50">
                    <p class="text-center font-serif font-bold text-lg text-[#800000] mb-4 leading-tight border-b border-amber-200 pb-3">{{ templeService.dailyPanchangam().date }}</p>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm text-stone-700 mb-4">
                       <div class="flex flex-col items-center bg-white p-3 rounded border border-amber-100 shadow-sm">
                          <span class="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">Tithi</span>
                          <span class="font-bold text-base text-stone-900 text-center leading-tight">{{ templeService.dailyPanchangam().tithi }}</span>
                       </div>
                       <div class="flex flex-col items-center bg-white p-3 rounded border border-amber-100 shadow-sm">
                          <span class="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">Nakshatra</span>
                          <span class="font-bold text-base text-stone-900 text-center leading-tight">{{ templeService.dailyPanchangam().nakshatra }}</span>
                       </div>
                    </div>

                    <div class="space-y-2 text-sm mb-4">
                       <div class="flex justify-between items-center bg-white p-2 rounded border border-stone-100 shadow-sm">
                          <span class="text-stone-600 font-semibold text-xs uppercase flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-stone-400"></span>Rahu Kalam</span>
                          <span class="font-mono font-bold text-red-800">{{ templeService.dailyPanchangam().rahuKalam }}</span>
                       </div>
                       <div class="flex justify-between items-center bg-white p-2 rounded border border-stone-100 shadow-sm">
                          <span class="text-stone-600 font-semibold text-xs uppercase flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-stone-400"></span>Yamagandam</span>
                          <span class="font-mono font-bold text-red-800">{{ templeService.dailyPanchangam().yamagandam }}</span>
                       </div>
                    </div>
                    
                    <div class="flex justify-around mt-2 text-xs font-bold text-amber-800 bg-amber-100 py-2 rounded">
                       <span class="flex items-center gap-1">☀️ Sunrise: {{ templeService.dailyPanchangam().sunrise }}</span>
                       <span class="flex items-center gap-1">🌙 Sunset: {{ templeService.dailyPanchangam().sunset }}</span>
                    </div>

                    @if (templeService.siteConfig().panchangamImageUrl) {
                      <div class="mt-4 pt-4 border-t border-amber-200 text-center">
                         <span class="text-xs font-bold text-amber-800 uppercase block mb-2">Today's Sheet</span>
                         <div class="relative group cursor-pointer overflow-hidden rounded border border-amber-300 shadow-sm">
                            <img [src]="templeService.siteConfig().panchangamImageUrl" class="w-full h-auto transform group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <a [href]="templeService.siteConfig().panchangamImageUrl" target="_blank" class="text-white font-bold text-xs uppercase border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">View Full</a>
                            </div>
                         </div>
                      </div>
                    }
                </div>
             </div>

             <!-- Official Media Channels -->
             <div class="rounded-lg shadow-md overflow-hidden bg-white border border-stone-200">
                <div class="bg-[#800000] text-white p-3 font-bold uppercase text-sm border-b border-red-900">
                   Official Media
                </div>
                <div class="p-4 bg-white">
                   <div class="space-y-4">
                      @for (video of recentVideos(); track video.id) {
                         <a [href]="video.url" target="_blank" class="flex gap-3 group items-center">
                            <div class="w-24 h-16 bg-black flex-shrink-0 relative overflow-hidden rounded shadow-sm border border-stone-200">
                               <img [src]="getThumbnail(video.url)" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                               <div class="absolute inset-0 flex items-center justify-center">
                                  <div class="w-6 h-6 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                               </div>
                            </div>
                            <div>
                               <p class="text-xs font-bold text-stone-800 line-clamp-2 group-hover:text-[#800000] transition-colors leading-tight">{{ video.caption }}</p>
                               <p class="text-[10px] text-stone-500 mt-1">Watch on YouTube</p>
                            </div>
                         </a>
                      }
                   </div>
                   
                   <a [href]="templeService.siteConfig().liveLink" target="_blank" class="block w-full text-center mt-5 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded text-sm transition-colors shadow-sm uppercase tracking-wide">
                      SVBC Channel
                   </a>

                   <!-- WhatsApp Button -->
                   @if (templeService.siteConfig().whatsappChannel) {
                       <a [href]="templeService.siteConfig().whatsappChannel" target="_blank" class="mt-4 block w-full bg-[#25D366] hover:bg-[#20b85c] text-white font-bold py-3 rounded-lg text-center transition-colors shadow-md flex items-center justify-center gap-2 text-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                           Follow on WhatsApp Channel
                       </a>
                   }
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
    
    <style>
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-marquee {
        animation: marquee 35s linear infinite;
        display: inline-block;
        padding-left: 100%; 
      }
    </style>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);

  recentVideos = signal([
    { id: 1, url: 'https://www.youtube.com/watch?v=xcJtL7QggTI', caption: 'Morning Suprabhatam Seva' },
    { id: 2, url: 'https://www.youtube.com/watch?v=j7W4_3nQtNg', caption: 'Weekly Kalyanotsavam' },
    { id: 3, url: 'https://www.youtube.com/watch?v=ysz5S6P_bsU', caption: 'Vaikuntha Ekadasi Special' }
  ]);

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'JAN';
    return date.toLocaleString('en-US', { month: 'short' });
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '01';
    return date.getDate().toString().padStart(2, '0');
  }

  getThumbnail(url: string): string {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return 'https://picsum.photos/200/150'; // Fallback
  }
}
