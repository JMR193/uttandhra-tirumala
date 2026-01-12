import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Scrolling Ticker: Deep Red Background -->
    <div class="bg-[#800000] text-white py-2 overflow-hidden relative shadow-md border-b-2 border-amber-500 z-20">
      <div class="container mx-auto px-4 flex items-center">
        <span class="bg-amber-500 text-red-900 text-[10px] font-extrabold px-2 py-1 rounded-sm mr-4 z-10 whitespace-nowrap uppercase tracking-widest shadow-sm">Upcoming Events</span>
        <div class="whitespace-nowrap animate-marquee font-medium text-sm flex items-center gap-8 text-amber-50">
          <span>{{ templeService.flashNews() }}</span>
          <span class="text-amber-400">✦</span>
          <span>Annual Brahmotsavams to be held next month</span>
          <span class="text-amber-400">✦</span>
          <span>Booking for next month's Darshan opens tomorrow at 10 AM</span>
        </div>
      </div>
    </div>

    <!-- Hero Banner with Golden Overlay -->
    <div class="relative h-[650px] w-full overflow-hidden bg-[#2a0a0a] group">
      <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/channels4_banner.jpg" 
           class="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[25s] ease-linear group-hover:scale-105" 
           style="object-position: center 25%;"
           alt="Lord Venkateswara">
      
      <!-- Gradient Overlay for Text Readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#450a0a] via-[#450a0a]/50 to-transparent flex items-center justify-center text-center">
         <div class="container mx-auto px-6 md:px-12 animate-fade-in-up mt-24">
            
            <h2 class="text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400 font-serif font-extrabold drop-shadow-xl mb-4 tracking-tight leading-tight">Uttarandhra Tirupati</h2>
            <div class="flex items-center justify-center gap-4 mb-8 opacity-90">
                <div class="h-[2px] w-12 bg-amber-500"></div>
                <p class="text-amber-100 text-xl md:text-3xl font-serif italic drop-shadow-md">
                  "Bhuloka Vaikuntham"
                </p>
                <div class="h-[2px] w-12 bg-amber-500"></div>
            </div>

            <div class="flex flex-col md:flex-row gap-6 justify-center mt-10">
              @if (templeService.siteConfig().enableBooking) {
                <a routerLink="/booking" class="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-10 py-4 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.5)] border border-amber-400 font-bold uppercase text-sm tracking-widest transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  Book Darshan
                </a>
              }
              <a routerLink="/e-hundi" class="bg-[#800000]/90 hover:bg-[#800000] text-amber-100 px-10 py-4 rounded-full shadow-lg border border-amber-500/50 font-bold uppercase text-sm tracking-widest transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                E-Hundi
              </a>
            </div>
         </div>
      </div>
      
      <!-- Decorative Wave Bottom -->
      <div class="divider-bottom">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
      </div>
    </div>

    <!-- Welcome Section (Classic & Auspicious) -->
    <div class="py-24 bg-mandala relative">
       <div class="container mx-auto px-4">
          <div class="flex flex-col lg:flex-row items-center gap-16">
             <!-- Image Collage -->
             <div class="lg:w-1/2 relative">
                <div class="relative z-10 rounded-xl overflow-hidden shadow-2xl border-[6px] border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                   <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2018.jpg" alt="Temple" class="w-full h-auto object-cover">
                </div>
                <!-- Badge -->
                <div class="absolute -bottom-6 -left-6 w-36 h-36 bg-gradient-to-br from-[#800000] to-[#5a0505] rounded-full flex items-center justify-center text-amber-100 z-20 border-4 border-amber-400 shadow-[0_10px_30px_rgba(120,53,15,0.3)]">
                   <div class="text-center">
                      <span class="block text-3xl font-bold font-serif">25+</span>
                      <span class="text-[10px] uppercase tracking-widest font-bold text-amber-300">Years of<br>Seva</span>
                   </div>
                </div>
                <!-- Background Decoration -->
                <div class="absolute -top-10 -right-10 w-64 h-64 bg-amber-200/50 rounded-full blur-3xl -z-10"></div>
             </div>
             
             <!-- Content -->
             <div class="lg:w-1/2">
                <span class="text-amber-600 font-extrabold uppercase tracking-[0.2em] text-xs mb-3 block flex items-center gap-2">
                   <span class="w-8 h-[2px] bg-amber-600"></span> Welcome to the Adobe
                </span>
                <h1 class="text-4xl md:text-5xl font-serif font-extrabold text-[#800000] mb-8 leading-tight drop-shadow-sm">
                   Where Divinity Meets <br>
                   <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Inner Peace</span>
                </h1>
                
                <p class="text-stone-700 text-lg leading-relaxed mb-8 font-light border-l-4 border-amber-400 pl-6">
                   Sri Venkatadri temple in Pendurthi is a testament to the devotion of millions. Revered as "Uttarandhra Tirupati", it offers the same divine vibration and solace as the holy hills of Tirumala. Join us for daily rituals, special sevas, and find inner peace.
                </p>
                
                <div class="grid grid-cols-1 gap-6 mb-10">
                   <div class="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-stone-100 w-fit">
                      <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      </div>
                      <div>
                         <span class="font-bold text-[#800000] block">Daily Poojas</span>
                         <span class="text-xs text-stone-500">Suprabhatam to Ekantha Seva</span>
                      </div>
                   </div>
                </div>

                <a routerLink="/history" class="inline-block text-[#800000] font-bold border-b-2 border-[#800000] pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors uppercase tracking-wide text-sm">
                   Read Temple History &rarr;
                </a>
             </div>
          </div>
       </div>
    </div>

    <!-- Parallax Sloka Section -->
    <div class="relative py-32 bg-fixed bg-cover bg-center" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1200px-Tirumala_090615.jpg');">
       <div class="absolute inset-0 bg-[#2a0a0a]/70 mix-blend-multiply"></div>
       <div class="absolute inset-0 bg-gradient-to-t from-[#2a0a0a] to-transparent"></div>
       
       <div class="container mx-auto px-4 relative z-10 text-center">
          <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png" class="h-20 mx-auto mb-8 opacity-90 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" alt="Symbol">
          <h2 class="text-4xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-6 drop-shadow-sm">" Dharmo Rakshati Rakshitah "</h2>
          <p class="text-amber-100 text-xl md:text-3xl font-light italic opacity-90 max-w-4xl mx-auto leading-relaxed">
             "Those who protect Dharma are protected by Dharma." <br>
             <span class="text-sm md:text-lg not-italic mt-4 block text-stone-300 font-sans">Your contribution supports the temple maintenance, Annadanam, and Gosala.</span>
          </p>
          <div class="mt-10">
             <a routerLink="/e-hundi" class="inline-block bg-transparent border-2 border-amber-400 text-amber-400 px-10 py-3 rounded-full font-bold hover:bg-amber-400 hover:text-[#2a0a0a] transition-all uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                Support Dharma
             </a>
          </div>
       </div>
    </div>

    <!-- Featured Services (Clean Icon Style) -->
    <div class="bg-gradient-to-b from-stone-50 to-amber-50 py-24 relative">
       <div class="container mx-auto px-4">
          <div class="text-center mb-16">
             <span class="text-amber-600 font-extrabold uppercase tracking-[0.2em] text-xs">Sacred Offerings</span>
             <h2 class="text-4xl md:text-5xl font-serif font-bold text-[#800000] mt-3">Temple Services</h2>
             <div class="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             
             <!-- Card 1: Darshan -->
             <div class="group relative bg-white rounded-xl shadow-lg border-t-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shadow-inner mb-6 group-hover:bg-[#800000] group-hover:text-white transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-[#800000] mb-3 font-serif group-hover:text-amber-600 transition-colors">Darshan</h3>
                <p class="text-stone-600 text-sm mb-6 leading-relaxed">Book Special Entry Darshan online to avoid long queues.</p>
                <a routerLink="/booking" class="mt-auto px-6 py-2 rounded-full border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider hover:bg-amber-600 hover:text-white transition-all">Book Now</a>
             </div>

             <!-- Card 2: E-Hundi -->
             <div class="group relative bg-white rounded-xl shadow-lg border-t-4 border-green-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner mb-6 group-hover:bg-green-700 group-hover:text-white transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-[#800000] mb-3 font-serif group-hover:text-green-700 transition-colors">E-Hundi</h3>
                <p class="text-stone-600 text-sm mb-6 leading-relaxed">Offer your Kanuka securely online via Payment Gateway or UPI.</p>
                <a routerLink="/e-hundi" class="mt-auto px-6 py-2 rounded-full border border-green-200 text-green-800 text-xs font-bold uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all">Donate</a>
             </div>

             <!-- Card 3: Live Seva -->
             <div class="group relative bg-white rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 shadow-inner mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-[#800000] mb-3 font-serif group-hover:text-red-600 transition-colors">Live Seva</h3>
                <p class="text-stone-600 text-sm mb-6 leading-relaxed">Watch daily rituals and special events live on YouTube.</p>
                <a [href]="templeService.siteConfig().liveLink" target="_blank" class="mt-auto px-6 py-2 rounded-full border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all">Watch Live</a>
             </div>

             <!-- Card 4: Library -->
             <div class="group relative bg-white rounded-xl shadow-lg border-t-4 border-purple-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shadow-inner mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h3 class="text-xl font-bold text-[#800000] mb-3 font-serif group-hover:text-purple-600 transition-colors">Library</h3>
                <p class="text-stone-600 text-sm mb-6 leading-relaxed">Access spiritual ebooks, audio slogans, and discourses.</p>
                <a routerLink="/library" class="mt-auto px-6 py-2 rounded-full border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider hover:bg-purple-600 hover:text-white transition-all">Explore</a>
             </div>

          </div>
       </div>
    </div>
    
    <!-- Temple Insights & Visualizations Section -->
    <div class="bg-stone-900 py-20 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 bg-lotus-pattern"></div>
        
        <div class="container mx-auto px-4 relative z-10">
            <div class="text-center mb-12">
               <span class="text-amber-500 font-extrabold uppercase tracking-[0.2em] text-xs">Live Status</span>
               <h2 class="text-3xl md:text-4xl font-serif font-bold text-white mt-2">Temple Insights</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                
                <!-- Insight 1: Crowd Meter -->
                <div class="bg-stone-800/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 flex flex-col items-center">
                    <h3 class="text-amber-400 font-bold uppercase tracking-wider text-sm mb-4">Crowd Density</h3>
                    <div class="relative w-32 h-32 flex items-center justify-center">
                        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path class="text-stone-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
                          <!-- Dynamic Stroke Dasharray -->
                          <path class="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                                [attr.stroke-dasharray]="(templeService.insights().crowdStatus === 'High' ? 90 : (templeService.insights().crowdStatus === 'Moderate' ? 60 : 30)) + ', 100'" 
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <div class="absolute flex flex-col items-center">
                            <span class="text-2xl font-bold text-white">
                                {{ templeService.insights().crowdStatus }}
                            </span>
                            <span class="text-[10px] text-stone-400">Live</span>
                        </div>
                    </div>
                    <p class="text-xs text-stone-400 mt-4 text-center">Movement is {{ templeService.insights().crowdStatus === 'High' ? 'slow' : 'smooth' }}.</p>
                </div>

                <!-- Insight 2: Wait Time -->
                <div class="bg-stone-800/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 flex flex-col items-center">
                    <h3 class="text-blue-400 font-bold uppercase tracking-wider text-sm mb-4">Darshan Wait Time</h3>
                    <div class="flex gap-1 items-end h-32 w-full px-8 justify-center">
                        <div class="w-4 bg-stone-700 h-[30%] rounded-t-sm"></div>
                        <div class="w-4 bg-stone-700 h-[50%] rounded-t-sm"></div>
                        <!-- Dynamic Height based on wait time (max 120 mins) -->
                        <div class="w-4 bg-blue-500 rounded-t-sm shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse transition-all duration-1000" 
                             [style.height.%]="(templeService.insights().darshanWaitTime / 120) * 100 + 10"></div>
                        <div class="w-4 bg-stone-700 h-[60%] rounded-t-sm"></div>
                        <div class="w-4 bg-stone-700 h-[40%] rounded-t-sm"></div>
                    </div>
                    <div class="text-center mt-2">
                        <span class="text-3xl font-bold text-white font-mono">{{ templeService.insights().darshanWaitTime }}</span>
                        <span class="text-sm text-stone-400 ml-1">Mins</span>
                    </div>
                    <p class="text-xs text-stone-400 mt-2 text-center">Average time for Sarva Darshan.</p>
                </div>

                <!-- Insight 3: Laddu Prasadam -->
                <div class="bg-stone-800/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 flex flex-col items-center">
                    <h3 class="text-orange-400 font-bold uppercase tracking-wider text-sm mb-4">Laddu Prasadam</h3>
                    <div class="relative w-full h-8 bg-stone-700 rounded-full overflow-hidden mt-8 mb-4">
                        <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-yellow-500 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
                             [style.width.%]="(templeService.insights().ladduStock / (templeService.insights().ladduStock + templeService.insights().laddusDistributed)) * 100"></div>
                    </div>
                    <div class="flex justify-between w-full text-xs font-bold px-1">
                        <span class="text-orange-400">Stock: {{ templeService.insights().ladduStock | number }}</span>
                    </div>
                    <div class="text-center mt-4">
                        <span class="text-2xl font-bold text-white">{{ templeService.insights().laddusDistributed | number }}</span>
                        <span class="text-xs text-stone-400 block">Laddus Distributed Today</span>
                    </div>
                </div>

                <!-- Insight 4: Weather/Temperature -->
                <div class="bg-stone-800/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 flex flex-col items-center justify-center">
                    <h3 class="text-teal-400 font-bold uppercase tracking-wider text-sm mb-6">Current Weather</h3>
                    
                    <div class="relative mb-4">
                        <div class="absolute -top-6 -right-6 w-12 h-12 bg-yellow-500 rounded-full blur-xl opacity-20"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-yellow-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                    </div>
                    
                    <div class="text-center">
                        <span class="text-4xl font-bold text-white font-mono">{{ templeService.weather().temp }}°C</span>
                        <span class="text-sm text-stone-400 ml-1 block mt-1">{{ templeService.weather().condition }}</span>
                    </div>
                    <p class="text-xs text-stone-500 mt-4 text-center">Pendurthi, Visakhapatnam</p>
                </div>

            </div>
        </div>
    </div>

    <!-- Upcoming Events & News Section -->
    <div class="py-20 bg-white relative">
      <!-- Top Decorative Border -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>

      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-16">
          
          <!-- Latest News Column -->
          <div class="md:w-2/3">
             <div class="flex items-center justify-between mb-10 pb-4 border-b-2 border-amber-100">
                <h3 class="text-3xl font-bold text-[#800000] font-serif flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-amber-500"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.42 24.42 0 0 1 0 3.46" /></svg>
                   Upcoming Events & Updates
                </h3>
                <a routerLink="/gallery" class="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 uppercase tracking-wider bg-amber-50 px-4 py-2 rounded-full border border-amber-200 transition-colors">
                   View Archives <span class="text-lg">&rsaquo;</span>
                </a>
             </div>
             
             <div class="space-y-6">
               @for (item of templeService.news(); track item.id) {
                 <div class="flex gap-6 p-6 border border-stone-100 shadow-md rounded-xl hover:shadow-xl transition-all hover:border-amber-300 bg-white group relative overflow-hidden">
                    <!-- Accent Bar -->
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-[#800000]"></div>
                    
                    <div class="flex-shrink-0 w-20 text-center pt-1">
                       <div class="bg-[#800000] text-amber-100 text-[10px] font-extrabold py-1.5 rounded-t uppercase tracking-widest">{{ getMonth(item.date) }}</div>
                       <div class="bg-amber-50 text-[#800000] font-serif font-bold text-2xl py-3 border border-stone-200 border-t-0 rounded-b shadow-inner">{{ getDay(item.date) }}</div>
                    </div>
                    <div class="flex-grow">
                       <h4 class="font-bold text-[#800000] text-xl mb-2 group-hover:text-amber-700 transition-colors font-serif">{{ item.title }}</h4>
                       <div class="text-stone-600 text-sm leading-relaxed line-clamp-3" [innerHTML]="item.content"></div>
                       @if (item.attachmentUrl) {
                          <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-2 mt-4 text-xs bg-stone-50 px-4 py-2 rounded-full hover:bg-amber-100 font-bold text-stone-700 border border-stone-200 transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                             Download Circular / PDF
                          </a>
                       }
                    </div>
                 </div>
               }
             </div>
          </div>

          <!-- Sidebar: Daily Panchangam -->
          <div class="md:w-1/3">
             <div class="bg-[#fffbeb] rounded-xl shadow-2xl border border-amber-200 overflow-hidden sticky top-28">
                <div class="bg-gradient-to-r from-[#800000] to-[#5a0505] text-amber-100 p-5 flex justify-between items-center relative overflow-hidden">
                   <div class="absolute inset-0 bg-lotus-pattern opacity-10"></div>
                   <div>
                       <h3 class="font-serif font-bold text-xl relative z-10 text-white">Daily Panchangam</h3>
                       <p class="text-xs text-amber-300 relative z-10 opacity-80 mt-1 uppercase tracking-wider">Auspicious Timings</p>
                   </div>
                   <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                   </div>
                </div>
                
                <div class="bg-stone-50 p-2 text-center border-b border-stone-200 text-sm font-bold text-stone-600">
                    {{ templeService.dailyPanchangam().date }}
                </div>

                @if (templeService.siteConfig().panchangamImageUrl) {
                   <div class="p-4 bg-white border-b border-stone-200">
                      <img [src]="templeService.siteConfig().panchangamImageUrl" class="w-full rounded shadow-sm hover:scale-105 transition-transform cursor-pointer border border-stone-100" alt="Today's Panchangam">
                   </div>
                }

                <div class="p-6 space-y-4 text-sm bg-white">
                   <div class="flex justify-between border-b border-dashed border-stone-200 pb-2">
                      <span class="text-stone-500 font-bold uppercase text-xs tracking-wider flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Tithi</span>
                      <span class="text-[#800000] font-bold">{{ templeService.dailyPanchangam().tithi }}</span>
                   </div>
                   <div class="flex justify-between border-b border-dashed border-stone-200 pb-2">
                      <span class="text-stone-500 font-bold uppercase text-xs tracking-wider flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Nakshatram</span>
                      <span class="text-[#800000] font-bold">{{ templeService.dailyPanchangam().nakshatra }}</span>
                   </div>
                   <div class="flex justify-between border-b border-dashed border-stone-200 pb-2 bg-red-50/50 p-2 rounded">
                      <span class="text-red-800 font-bold uppercase text-xs tracking-wider">Rahu Kalam</span>
                      <span class="text-red-900 font-mono text-xs font-bold">{{ templeService.dailyPanchangam().rahuKalam }}</span>
                   </div>
                   <div class="flex justify-between border-b border-dashed border-stone-200 pb-2 bg-red-50/50 p-2 rounded">
                      <span class="text-red-800 font-bold uppercase text-xs tracking-wider">Yamagandam</span>
                      <span class="text-red-900 font-mono text-xs font-bold">{{ templeService.dailyPanchangam().yamagandam }}</span>
                   </div>
                   <div class="grid grid-cols-2 gap-4 mt-6">
                      <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg text-center border border-amber-100 shadow-sm">
                         <span class="block text-[10px] text-amber-700 uppercase font-bold mb-1">Sunrise</span>
                         <span class="font-bold text-[#800000] text-lg font-serif">{{ templeService.dailyPanchangam().sunrise }}</span>
                      </div>
                      <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg text-center border border-indigo-100 shadow-sm">
                         <span class="block text-[10px] text-indigo-700 uppercase font-bold mb-1">Sunset</span>
                         <span class="font-bold text-[#800000] text-lg font-serif">{{ templeService.dailyPanchangam().sunset }}</span>
                      </div>
                   </div>
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
    return date.getDate().toString().padStart(2, '0');
  }
}