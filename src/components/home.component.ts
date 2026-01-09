
import { Component, inject, computed } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Top Scrolling Ticker (Maroon Background like Tirumala.org) -->
    <div class="bg-[#800000] text-white py-2 overflow-hidden relative shadow-md border-b-2 border-amber-500">
      <div class="container mx-auto px-4 flex items-center">
        <span class="bg-amber-500 text-[#800000] text-xs font-bold px-2 py-0.5 rounded mr-4 z-10 whitespace-nowrap uppercase">Latest Updates</span>
        <div class="whitespace-nowrap animate-marquee font-medium text-sm">
          {{ templeService.flashNews() }} &nbsp;&nbsp; | &nbsp;&nbsp; {{ templeService.siteConfig().templeName }} Welcomes You to Bhuloka Vaikuntham &nbsp;&nbsp; | &nbsp;&nbsp; Sarve Jana Sukhino Bhavantu
        </div>
      </div>
    </div>

    <!-- Hero Banner with Slider effect imitation -->
    <div class="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-stone-200">
      <img src="https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" class="w-full h-full object-cover" fetchpriority="high" loading="eager">
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
         <div class="container mx-auto px-6 md:px-12">
            <h2 class="text-4xl md:text-6xl text-white font-serif font-bold drop-shadow-lg mb-2">Govinda Govinda</h2>
            <p class="text-amber-300 text-xl md:text-2xl font-serif italic mb-6">Experience the Divine at {{ templeService.siteConfig().templeName }}</p>
            <div class="flex gap-4">
              <a routerLink="/e-hundi" class="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded shadow-lg border border-red-500 font-bold uppercase text-sm tracking-widest">E-Hundi</a>
              <a routerLink="/history" class="bg-white hover:bg-stone-100 text-red-900 px-6 py-3 rounded shadow-lg font-bold uppercase text-sm tracking-widest">Plan Visit</a>
            </div>
         </div>
      </div>
    </div>

    <!-- Dashboard Services Grid (Cloning https://ttdevasthanams.ap.gov.in/home/dashboard style) -->
    <div class="bg-stone-100 py-12">
       <div class="container mx-auto px-4">
          <div class="text-center mb-10">
             <h3 class="text-2xl font-bold text-[#800000] uppercase tracking-wide border-b-2 border-amber-500 inline-block pb-1">Pilgrim Services</h3>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             <!-- Service Card 1 -->
             <a routerLink="/e-hundi" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-amber-500 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-[#800000] group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Hundi / Donation</h4>
             </a>

             <!-- Service Card 2 -->
             <a [href]="templeService.siteConfig().liveLink" target="_blank" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-red-600 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-red-600 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Live Darshan</h4>
             </a>

             <!-- Service Card 3 -->
             <a routerLink="/library" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-amber-500 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-[#800000] group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Audio Library</h4>
             </a>

             <!-- Service Card 4 -->
             <a routerLink="/gallery" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-red-600 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-red-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Gallery</h4>
             </a>

             <!-- Service Card 5 -->
             <a routerLink="/history" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-amber-500 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-[#800000] group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Timings</h4>
             </a>

             <!-- Service Card 6 -->
             <a routerLink="/feedback" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-red-600 flex flex-col items-center text-center group cursor-pointer h-full">
                <div class="w-12 h-12 mb-3 text-red-600 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <h4 class="font-bold text-stone-700 text-sm">Feedback</h4>
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
                <h3 class="text-xl font-bold text-[#800000] uppercase">Latest Updates</h3>
                <a routerLink="/gallery" class="text-sm font-bold text-amber-600 hover:text-amber-700">View Archives &rarr;</a>
             </div>
             
             <div class="space-y-4">
               @for (item of templeService.news(); track item.id) {
                 <div class="flex gap-4 p-4 border border-stone-100 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                    <div class="flex-shrink-0 w-16 text-center">
                       <div class="bg-[#800000] text-white text-xs font-bold py-1 rounded-t uppercase">{{ getMonth(item.date) }}</div>
                       <div class="bg-stone-100 text-stone-800 font-bold text-xl py-2 border border-stone-200 border-t-0 rounded-b">{{ getDay(item.date) }}</div>
                    </div>
                    <div>
                       <h4 class="font-bold text-[#800000] mb-1">{{ item.title }}</h4>
                       <p class="text-stone-600 text-sm leading-relaxed">{{ item.content }}</p>
                       @if (item.attachmentUrl) {
                          <a [href]="item.attachmentUrl" target="_blank" class="text-xs text-blue-600 font-bold mt-2 inline-block hover:underline">Download Attachment</a>
                       }
                    </div>
                 </div>
               }
             </div>
          </div>

          <!-- YouTube / Media Column -->
          <div class="md:w-1/3">
             <div class="bg-[#800000] text-white p-3 rounded-t-lg font-bold uppercase text-sm">
                From Our YouTube Channel
             </div>
             <div class="bg-stone-50 border border-t-0 border-stone-200 p-4 rounded-b-lg">
                <p class="text-xs text-stone-500 mb-4">Watch the latest spiritual discourses and events from {{ templeService.siteConfig().templeName }}.</p>
                
                <div class="space-y-4">
                   @for (video of recentVideos(); track video.id) {
                      <a [href]="video.url" target="_blank" class="flex gap-3 group">
                         <div class="w-24 h-16 bg-black flex-shrink-0 relative overflow-hidden rounded">
                            <img [src]="getThumbnail(video.url)" class="w-full h-full object-cover opacity-80 group-hover:opacity-100">
                            <div class="absolute inset-0 flex items-center justify-center">
                               <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                            </div>
                         </div>
                         <div>
                            <p class="text-sm font-bold text-stone-800 line-clamp-2 group-hover:text-[#800000]">{{ video.caption }}</p>
                         </div>
                      </a>
                   }
                </div>
                
                <a [href]="templeService.siteConfig().liveLink" target="_blank" class="block w-full text-center mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-sm transition-colors">
                   Subscribe for More
                </a>

                <!-- WhatsApp Button -->
                @if (templeService.siteConfig().whatsappChannel) {
                    <a [href]="templeService.siteConfig().whatsappChannel" target="_blank" class="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-center transition-colors shadow-md flex items-center justify-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                        Follow on WhatsApp Channel
                    </a>
                }
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
        animation: marquee 30s linear infinite;
        display: inline-block;
        padding-left: 100%; 
      }
    </style>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);

  recentVideos = computed(() => {
    return this.templeService.gallery()
      .filter(item => item.type === 'video')
      .slice(0, 3);
  });

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString().padStart(2, '0');
  }

  getThumbnail(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
    }
    return 'https://picsum.photos/id/10/200/200'; // Fallback
  }
}
