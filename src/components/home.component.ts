import { Component, inject } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Flash News Ticker -->
    @if (templeService.flashNews()) {
      <div class="bg-amber-100 border-b border-amber-300 text-amber-900 py-2 overflow-hidden relative">
        <div class="container mx-auto px-4 flex items-center">
          <span class="bg-red-800 text-white text-xs font-bold px-2 py-1 rounded mr-4 z-10 whitespace-nowrap uppercase">Flash News</span>
          <div class="whitespace-nowrap animate-marquee font-semibold">
            {{ templeService.flashNews() }}
          </div>
        </div>
      </div>
    }

    <!-- Hero Banner -->
    <div class="relative h-[400px] md:h-[500px] bg-stone-900 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 opacity-60">
        <img src="https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" alt="Temple Banner" class="w-full h-full object-cover">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent"></div>
      
      <!-- Hero Content -->
      <div class="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 font-serif text-amber-400 drop-shadow-lg">Shri Venkateswara Swamy Temple</h2>
        <p class="text-xl md:text-2xl mb-8 font-light tracking-wide drop-shadow-md">Uttarandhra Tirupati, Pendurthi</p>
        <div class="flex gap-4">
          <a routerLink="/e-hundi" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 border-2 border-amber-400">
            E-Hundi
          </a>
          <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 border-2 border-red-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            Live Darshan
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Services Grid -->
    <div class="bg-stone-100 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 -mt-20 relative z-10">
          
          <div class="bg-white p-6 rounded-xl shadow-xl text-center border-b-4 border-amber-500 hover:bg-amber-50 transition-colors cursor-pointer group">
             <a routerLink="/e-hundi" class="block">
                <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h3 class="font-bold text-stone-800">E-Hundi</h3>
                <p class="text-sm text-stone-500 mt-2">Offerings to Lord</p>
            </a>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-xl text-center border-b-4 border-red-500 hover:bg-red-50 transition-colors cursor-pointer group">
             <a href="#" class="block">
                <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5 21h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" /></svg>
                </div>
                <h3 class="font-bold text-stone-800">Darshan</h3>
                <p class="text-sm text-stone-500 mt-2">Book Slots</p>
             </a>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-xl text-center border-b-4 border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer group">
             <a routerLink="/library" class="block">
                <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h3 class="font-bold text-stone-800">Library</h3>
                <p class="text-sm text-stone-500 mt-2">E-Books & Audio</p>
             </a>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-xl text-center border-b-4 border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer group">
             <a routerLink="/gallery" class="block">
                <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                <h3 class="font-bold text-stone-800">Gallery</h3>
                <p class="text-sm text-stone-500 mt-2">Holy Views</p>
            </a>
          </div>

        </div>
      </div>
    </div>

    <!-- Latest Updates Section -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-serif font-bold text-red-900 border-l-8 border-amber-500 pl-4">Latest Updates</h2>
          <a routerLink="/gallery" class="text-amber-600 font-semibold hover:underline">View All</a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (item of templeService.news(); track item.id) {
            <div class="bg-stone-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-stone-200">
              <div class="p-6">
                <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3">{{ item.date }}</span>
                <h3 class="text-xl font-bold text-stone-800 mb-2">{{ item.title }}</h3>
                <p class="text-stone-600 leading-relaxed">{{ item.content }}</p>
              </div>
              <div class="bg-stone-100 px-6 py-3 border-t border-stone-200">
                 <button class="text-red-800 font-bold text-sm hover:text-red-600">Read More &rarr;</button>
              </div>
            </div>
          } @empty {
             <div class="col-span-3 text-center py-10 bg-stone-50 rounded">
               <p class="text-stone-500 italic">No updates available at the moment.</p>
             </div>
          }
        </div>
      </div>
    </div>

    <!-- YouTube Video Section -->
    <div class="py-16 bg-stone-900 text-white">
      <div class="container mx-auto px-4">
         <div class="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 class="text-3xl font-serif font-bold text-amber-400 mb-2">Spiritual Discourses</h2>
              <p class="text-stone-400">Watch the latest videos from our official channel</p>
            </div>
            <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="mt-4 md:mt-0 px-6 py-2 border border-red-600 text-red-400 hover:bg-red-900 rounded transition-colors flex items-center gap-2">
               <span>Subscribe on YouTube</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>
            </a>
         </div>

         <!-- Mock Video Grid (Using placeholders since we can't scrape YouTube dynamically without API key) -->
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Video 1 -->
            <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="group block relative rounded-lg overflow-hidden shadow-lg border border-stone-800">
               <img src="https://picsum.photos/id/1015/600/340" alt="Video Thumbnail" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
               <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
               <div class="p-3 bg-stone-800 absolute bottom-0 w-full">
                  <p class="text-sm font-bold text-stone-200 truncate">Special Puja on Friday</p>
                  <p class="text-xs text-stone-400">2 days ago</p>
               </div>
            </a>
            <!-- Video 2 -->
             <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="group block relative rounded-lg overflow-hidden shadow-lg border border-stone-800">
               <img src="https://picsum.photos/id/1016/600/340" alt="Video Thumbnail" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
               <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
               <div class="p-3 bg-stone-800 absolute bottom-0 w-full">
                  <p class="text-sm font-bold text-stone-200 truncate">Venkateswara Kalyanam Highlights</p>
                  <p class="text-xs text-stone-400">1 week ago</p>
               </div>
            </a>
            <!-- Video 3 -->
             <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="group block relative rounded-lg overflow-hidden shadow-lg border border-stone-800">
               <img src="https://picsum.photos/id/1018/600/340" alt="Video Thumbnail" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
               <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
               <div class="p-3 bg-stone-800 absolute bottom-0 w-full">
                  <p class="text-sm font-bold text-stone-200 truncate">Morning Suprabhatam Live</p>
                  <p class="text-xs text-stone-400">2 weeks ago</p>
               </div>
            </a>
            <!-- Video 4 -->
             <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="group block relative rounded-lg overflow-hidden shadow-lg border border-stone-800">
               <img src="https://picsum.photos/id/1019/600/340" alt="Video Thumbnail" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
               <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
               <div class="p-3 bg-stone-800 absolute bottom-0 w-full">
                  <p class="text-sm font-bold text-stone-200 truncate">Brahmotsavam Preparations</p>
                  <p class="text-xs text-stone-400">3 weeks ago</p>
               </div>
            </a>
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
}
