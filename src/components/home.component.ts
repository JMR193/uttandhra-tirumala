import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      <img ngSrc="https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" 
           fill
           priority
           class="object-cover opacity-90 transition-transform duration-[10s] ease-linear group-hover:scale-110" 
           alt="Temple Banner">
      
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
                          <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-1 mt-3 text-xs bg-stone-100 px-3 py-1.5 rounded-full hover:bg-stone-200 font-bold text-stone-600">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                             View Attachment
                          </a>
                       }
                    </div>
                 </div>
               }
             </div>
          </div>

          <!-- Sidebar: Daily Panchangam & Quick Info -->
          <div class="md:w-1/3 space-y-8">
             
             <!-- Daily Panchangam -->
             <div class="bg-orange-50 rounded-xl shadow-lg border border-amber-200 overflow-hidden">
                <div class="bg-[#800000] text-amber-100 p-4 flex justify-between items-center">
                   <h3 class="font-serif font-bold text-lg">Daily Panchangam</h3>
                   <span class="text-xs bg-red-800 px-2 py-1 rounded">{{ templeService.dailyPanchangam().date }}</span>
                </div>
                
                @if (templeService.siteConfig().panchangamImageUrl) {
                   <div class="p-4 bg-white border-b border-stone-200">
                      <img [src]="templeService.siteConfig().panchangamImageUrl" class="w-full rounded shadow-sm hover:scale-105 transition-transform cursor-pointer" alt="Today's Panchangam Sheet">
                   </div>
                }

                <div class="p-4 space-y-3 text-sm">
                   <div class="flex justify-between border-b border-orange-100 pb-2">
                      <span class="text-stone-500 font-bold">Tithi</span>
                      <span class="text-[#800000] font-bold">{{ templeService.dailyPanchangam().tithi }}</span>
                   </div>
                   <div class="flex justify-between border-b border-orange-100 pb-2">
                      <span class="text-stone-500 font-bold">Nakshatram</span>
                      <span class="text-[#800000] font-bold">{{ templeService.dailyPanchangam().nakshatra }}</span>
                   </div>
                   <div class="flex justify-between border-b border-orange-100 pb-2">
                      <span class="text-stone-500 font-bold">Rahu Kalam</span>
                      <span class="text-stone-800">{{ templeService.dailyPanchangam().rahuKalam }}</span>
                   </div>
                   <div class="flex justify-between border-b border-orange-100 pb-2">
                      <span class="text-stone-500 font-bold">Yamagandam</span>
                      <span class="text-stone-800">{{ templeService.dailyPanchangam().yamagandam }}</span>
                   </div>
                   <div class="grid grid-cols-2 gap-4 mt-2">
                      <div class="bg-white p-2 rounded text-center border border-orange-100">
                         <span class="block text-xs text-stone-400 uppercase">Sunrise</span>
                         <span class="font-bold text-amber-700">{{ templeService.dailyPanchangam().sunrise }}</span>
                      </div>
                      <div class="bg-white p-2 rounded text-center border border-orange-100">
                         <span class="block text-xs text-stone-400 uppercase">Sunset</span>
                         <span class="font-bold text-indigo-900">{{ templeService.dailyPanchangam().sunset }}</span>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Social Media Connect -->
             <div class="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center relative overflow-hidden">
                <h4 class="text-[#800000] font-bold text-lg uppercase tracking-wide mb-4">Stay Connected</h4>
                
                <div class="space-y-4">
                  <a href="https://www.youtube.com/@ramanujampendurthi1012" target="_blank" class="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors shadow-md group">
                    <div class="bg-white p-1 rounded-full text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </div>
                    <div class="text-left">
                      <p class="text-[10px] opacity-80 uppercase font-bold">Subscribe on</p>
                      <p class="font-bold leading-none">YouTube</p>
                    </div>
                  </a>

                  <a href="https://whatsapp.com/channel/0029Vap96ByFnSzG0KocMq1y" target="_blank" class="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-lg transition-colors shadow-md group">
                     <div class="bg-white p-1 rounded-full text-[#25D366]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    </div>
                    <div class="text-left">
                      <p class="text-[10px] opacity-80 uppercase font-bold">Follow Channel</p>
                      <p class="font-bold leading-none">WhatsApp</p>
                    </div>
                  </a>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString();
  }
}