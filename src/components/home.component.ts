import { Component, inject, computed } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Flash News Ticker -->
    @if (templeService.flashNews()) {
      <div class="bg-amber-100 border-b border-amber-300 text-amber-900 py-2 overflow-hidden relative shadow-inner">
        <div class="container mx-auto px-4 flex items-center">
          <span class="bg-red-800 text-white text-xs font-bold px-3 py-1 rounded-full mr-4 z-10 whitespace-nowrap uppercase tracking-wider shadow-md animate-pulse">Flash News</span>
          <div class="whitespace-nowrap animate-marquee font-semibold text-sm md:text-base">
            {{ templeService.flashNews() }}
          </div>
        </div>
      </div>
    }

    <!-- Hero Banner with Parallax-like effect -->
    <div class="relative h-[500px] md:h-[600px] bg-stone-900 overflow-hidden group">
      <!-- Background Image -->
      <div class="absolute inset-0 opacity-70 group-hover:scale-105 transition-transform duration-[2s]">
        <img src="https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" alt="Temple Banner" class="w-full h-full object-cover">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>
      
      <!-- Hero Content -->
      <div class="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white animate-fade-in-up">
        <div class="mb-4 text-amber-300 font-bold tracking-[0.3em] uppercase text-xs md:text-sm opacity-80">Welcome to Bhuloka Vaikuntham</div>
        <h2 class="text-4xl md:text-7xl font-bold mb-6 font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 drop-shadow-lg">{{ templeService.siteConfig().templeName }}</h2>
        <p class="text-xl md:text-3xl mb-10 font-light tracking-wide drop-shadow-md text-stone-200 max-w-2xl mx-auto border-b border-stone-500 pb-8">{{ templeService.siteConfig().subTitle }}</p>
        
        <div class="flex flex-col md:flex-row gap-6">
          <a routerLink="/e-hundi" class="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-amber-500/50 border border-amber-400">
            Offering (Hundi)
          </a>
          <a [href]="templeService.siteConfig().liveLink" target="_blank" class="glass-panel text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:bg-white/20 border border-white/40 flex items-center justify-center gap-3">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Darshan
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Services Grid (Floating) -->
    <div class="bg-stone-100 pb-16 pt-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-10">
          
          <div class="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-amber-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group animate-fade-in-up delay-100">
             <a routerLink="/e-hundi" class="block">
                <div class="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-inner">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h3 class="font-bold text-lg text-stone-800 group-hover:text-amber-700 transition-colors">E-Hundi</h3>
                <p class="text-xs font-bold text-stone-400 mt-1 uppercase tracking-wider">Donations</p>
            </a>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-red-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group animate-fade-in-up delay-200">
             <a href="#" class="block">
                <div class="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5 21h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" /></svg>
                </div>
                <h3 class="font-bold text-lg text-stone-800 group-hover:text-red-700 transition-colors">Darshan</h3>
                <p class="text-xs font-bold text-stone-400 mt-1 uppercase tracking-wider">Bookings</p>
             </a>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group animate-fade-in-up delay-300">
             <a routerLink="/library" class="block">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-inner">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h3 class="font-bold text-lg text-stone-800 group-hover:text-purple-700 transition-colors">Library</h3>
                <p class="text-xs font-bold text-stone-400 mt-1 uppercase tracking-wider">Knowledge</p>
             </a>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group animate-fade-in-up delay-300">
             <a routerLink="/gallery" class="block">
                <div class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                <h3 class="font-bold text-lg text-stone-800 group-hover:text-indigo-700 transition-colors">Gallery</h3>
                <p class="text-xs font-bold text-stone-400 mt-1 uppercase tracking-wider">Multimedia</p>
            </a>
          </div>

        </div>
      </div>
    </div>

    <!-- Daily Panchangam Section (New Feature) -->
    <div class="py-12 bg-white border-b border-stone-200">
       <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row gap-8 items-center">
             
             <div class="md:w-1/3 text-center md:text-left">
                <h3 class="text-3xl font-serif font-bold text-red-900 mb-2">Daily Panchangam</h3>
                <p class="text-stone-500 mb-4">Auspicious timings for {{ templeService.dailyPanchangam().date }}</p>
                <div class="inline-block p-4 border border-amber-200 rounded-lg bg-amber-50 shadow-sm">
                   <div class="text-4xl font-bold text-amber-600 mb-1">{{ getCurrentDateDay() }}</div>
                   <div class="text-sm font-bold text-stone-600 uppercase tracking-widest">{{ getCurrentMonth() }}</div>
                </div>
             </div>

             <div class="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <!-- Tithi -->
                <div class="bg-stone-50 p-4 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div class="text-xs font-bold text-stone-400 uppercase mb-1">Tithi</div>
                   <div class="font-bold text-stone-800 text-sm md:text-base">{{ templeService.dailyPanchangam().tithi }}</div>
                </div>
                <!-- Nakshatra -->
                <div class="bg-stone-50 p-4 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div class="text-xs font-bold text-stone-400 uppercase mb-1">Nakshatra</div>
                   <div class="font-bold text-stone-800 text-sm md:text-base">{{ templeService.dailyPanchangam().nakshatra }}</div>
                </div>
                 <!-- Rahu Kalam -->
                <div class="bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                   <div class="text-xs font-bold text-red-400 uppercase mb-1">Rahu Kalam</div>
                   <div class="font-bold text-stone-800 text-sm md:text-base">{{ templeService.dailyPanchangam().rahuKalam }}</div>
                </div>
                <!-- Yamagandam -->
                <div class="bg-stone-50 p-4 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div class="text-xs font-bold text-stone-400 uppercase mb-1">Yamagandam</div>
                   <div class="font-bold text-stone-800 text-sm md:text-base">{{ templeService.dailyPanchangam().yamagandam }}</div>
                </div>
                <!-- Sunrise/Sunset -->
                <div class="bg-amber-50 p-4 rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-2 flex justify-between items-center">
                   <div>
                      <div class="text-xs font-bold text-amber-600 uppercase mb-1">Sunrise</div>
                      <div class="font-bold text-stone-800">{{ templeService.dailyPanchangam().sunrise }}</div>
                   </div>
                   <div class="text-amber-300">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                   </div>
                   <div class="text-right">
                      <div class="text-xs font-bold text-amber-600 uppercase mb-1">Sunset</div>
                      <div class="font-bold text-stone-800">{{ templeService.dailyPanchangam().sunset }}</div>
                   </div>
                </div>
                 <!-- Yogam -->
                <div class="bg-stone-50 p-4 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-2">
                   <div class="flex justify-between">
                     <div>
                       <div class="text-xs font-bold text-stone-400 uppercase mb-1">Yogam</div>
                       <div class="font-bold text-stone-800">{{ templeService.dailyPanchangam().yogam }}</div>
                     </div>
                     <div class="text-right">
                       <div class="text-xs font-bold text-stone-400 uppercase mb-1">Karanam</div>
                       <div class="font-bold text-stone-800">{{ templeService.dailyPanchangam().karanam }}</div>
                     </div>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>

    <!-- Latest Updates Section -->
    <div class="py-16 bg-stone-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-serif font-bold text-red-900 border-l-8 border-amber-500 pl-4">Latest Updates</h2>
          <a routerLink="/gallery" class="text-amber-600 font-semibold hover:underline flex items-center gap-1 group">
            View All 
            <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (item of templeService.news(); track item.id) {
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-stone-100 flex flex-col h-full">
              <div class="p-6 flex-grow">
                <div class="flex items-center justify-between mb-4">
                   <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">{{ item.date }}</span>
                   <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                </div>
                <h3 class="text-xl font-bold text-stone-800 mb-3 leading-tight">{{ item.title }}</h3>
                <p class="text-stone-600 leading-relaxed text-sm line-clamp-3">{{ item.content }}</p>
                @if (item.attachmentUrl) {
                  <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-2 mt-4 text-xs bg-stone-100 px-3 py-2 rounded text-stone-700 font-semibold hover:bg-stone-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                    Download Attachment
                  </a>
                }
              </div>
              <div class="bg-stone-50 px-6 py-4 border-t border-stone-100 flex justify-end">
                 <button class="text-red-800 font-bold text-sm hover:text-red-600 transition-colors">Read More &rarr;</button>
              </div>
            </div>
          } @empty {
             <div class="col-span-3 text-center py-10 bg-white rounded-xl shadow border border-stone-200">
               <p class="text-stone-500 italic">No updates available at the moment.</p>
             </div>
          }
        </div>
      </div>
    </div>

    <!-- YouTube Video Section -->
    <div class="py-16 bg-stone-900 text-white relative overflow-hidden">
      <!-- Decorational Blur -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-red-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="container mx-auto px-4 relative z-10">
         <div class="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 class="text-3xl font-serif font-bold text-amber-400 mb-2">Spiritual Discourses</h2>
              <p class="text-stone-400">Watch the latest videos from our official channel</p>
            </div>
            <a [href]="templeService.siteConfig().liveLink" target="_blank" class="mt-4 md:mt-0 px-6 py-2 border border-red-600 text-red-400 hover:bg-red-900/50 hover:text-white rounded transition-all flex items-center gap-2 group">
               <span>Subscribe on YouTube</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="group-hover:scale-110 transition-transform"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>
            </a>
         </div>

         <!-- Dynamic Video Grid -->
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (video of recentVideos(); track video.id) {
               <a [href]="video.url" target="_blank" class="group block relative rounded-xl overflow-hidden shadow-lg border border-stone-800 bg-stone-800 hover:-translate-y-2 transition-transform duration-300">
                  <div class="overflow-hidden">
                     <img [src]="getThumbnail(video.url)" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100">
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                     <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors scale-75 group-hover:scale-100 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     </div>
                  </div>
                  <div class="p-4 bg-stone-800 absolute bottom-0 w-full backdrop-blur-sm bg-opacity-90">
                     <p class="text-sm font-bold text-stone-200 truncate group-hover:text-amber-400 transition-colors">{{ video.caption }}</p>
                  </div>
               </a>
            } @empty {
              <!-- Fallback content if no videos in DB -->
               <a [href]="templeService.siteConfig().liveLink" target="_blank" class="group block relative rounded-xl overflow-hidden shadow-lg border border-stone-800">
                 <img src="https://picsum.photos/id/1015/600/340" alt="Video Thumbnail" class="w-full h-40 object-cover opacity-80">
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 bg-stone-600 rounded-full flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                 </div>
                 <div class="p-3 bg-stone-800 absolute bottom-0 w-full">
                    <p class="text-sm font-bold text-stone-200 truncate">More videos coming soon...</p>
                 </div>
              </a>
            }
         </div>
      </div>
    </div>
    
    <style>
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-marquee {
        animation: marquee 20s linear infinite;
        display: inline-block;
        padding-left: 100%; 
      }
    </style>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);

  recentVideos = computed(() => {
    // Filter gallery items for videos, return top 4
    const videos = this.templeService.gallery().filter(i => i.type === 'video');
    return videos.length > 0 ? videos.slice(0, 4) : [];
  });

  getCurrentDateDay() {
    return new Date().getDate();
  }

  getCurrentMonth() {
    return new Date().toLocaleString('default', { month: 'long' });
  }

  getThumbnail(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    }
    return 'https://picsum.photos/id/1015/600/340'; // Fallback
  }
}
