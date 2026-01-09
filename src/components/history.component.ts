import { Component, inject } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-orange-50 min-h-screen animate-fade-in">
      <!-- Hero -->
      <div class="relative h-64 md:h-96 overflow-hidden">
        <img src="https://picsum.photos/id/1047/1200/600" alt="Temple History" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-[#800000] bg-opacity-70 flex items-center justify-center">
          <h1 class="text-4xl md:text-6xl text-white font-serif font-bold text-center px-4 drop-shadow-xl border-b-4 border-amber-500 pb-2">History & Significance</h1>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- Main Content: History -->
          <div class="lg:col-span-2 space-y-8 text-stone-700 leading-relaxed font-serif">
            
            <section>
              <h2 class="text-3xl font-bold text-[#800000] mb-4 border-l-4 border-amber-500 pl-4">The Legend of Uttarandhra Tirupati</h2>
              <p class="mb-4 text-lg">
                The Lord of the Universe and Vaikuntha, Srimannarayana, takes many forms to protect his devotees. 
                In this Kaliyuga, he incarnated as Lord Venkateswara to offer solace to mankind.
              </p>
              <p class="mb-4 text-lg">
                Located in the serene surroundings of Pendurthi, Visakhapatnam, the <strong>Sri Venkatadri</strong> temple stands as a testament to devotion. It is widely revered as "Uttarandhra Tirupati" (Tirupati of North Andhra), serving millions of devotees who seek the blessings of the Lord but cannot travel to Tirumala.
              </p>
              <div class="bg-amber-100 border-l-4 border-amber-600 p-6 italic text-stone-700 my-6 shadow-sm rounded-r">
                <p class="mb-3"><strong>Sthala Purana:</strong> Local legends state that the hills of Pendurthi have been a site of penance for sages for centuries, making it a powerful Kshetram.</p>
              </div>
            </section>

            <section>
              <h2 class="text-3xl font-bold text-[#800000] mb-4 border-l-4 border-amber-500 pl-4">Temple Timeline</h2>
              <div class="overflow-hidden rounded-lg border border-stone-200 shadow-md">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-stone-100 text-stone-800 uppercase text-sm font-bold tracking-wider">
                      <th class="p-4 border-b border-stone-200">Milestone</th>
                      <th class="p-4 border-b border-stone-200">Date</th>
                      <th class="p-4 border-b border-stone-200">Details</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100 bg-white">
                    <tr>
                      <td class="p-4 font-bold text-amber-800">Foundation Stone</td>
                      <td class="p-4">1995</td>
                      <td class="p-4">Laid by H.H. Sri Chinna Jeeyar Swamy.</td>
                    </tr>
                    <tr>
                      <td class="p-4 font-bold text-amber-800">Consecration</td>
                      <td class="p-4">May 17, 1997</td>
                      <td class="p-4">Formal idol installation (Pratishta) and sanctification according to Vaikhanasa Agama.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          <!-- Sidebar: Visitor Info -->
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-xl shadow-lg border-t-8 border-[#800000] sticky top-24">
              <h3 class="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                 Plan Your Visit
              </h3>
              
              <div class="mb-8">
                <h4 class="font-bold text-amber-800 uppercase text-sm mb-3 tracking-wide">Temple Timings</h4>
                <div class="space-y-3 text-sm bg-stone-50 p-4 rounded-lg">
                  <div class="flex justify-between border-b border-stone-200 pb-2">
                    <span class="text-stone-600">Morning</span>
                    <span class="font-bold text-stone-900">06:00 AM – 01:00 PM</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-stone-600">Evening</span>
                    <span class="font-bold text-stone-900">04:00 PM – 08:30 PM</span>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                 <h4 class="font-bold text-amber-800 uppercase text-sm mb-3 tracking-wide">How to Reach</h4>
                 <div class="space-y-2 text-sm">
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Address:</strong> {{ templeService.siteConfig().address }}</p>
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Road:</strong> Well connected from Vizag (20km).</p>
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Train:</strong> Visakhapatnam Junction or Pendurthi Station.</p>
                 </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="mt-12 bg-[#800000] text-amber-50 rounded-lg p-8 shadow-xl">
           <div class="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                 <h2 class="text-2xl font-bold mb-2">Contact Us</h2>
                 <p class="opacity-90">{{ templeService.siteConfig().address }}</p>
                 <p class="opacity-90">Phone: {{ templeService.siteConfig().contactPhone }}</p>
              </div>
              
              <!-- Map Placeholder -->
              <div class="w-full md:w-1/3 h-48 bg-stone-800 rounded overflow-hidden">
                <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.243547568541!2d83.2184!3d17.8284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3967d1c6e6d4c1%3A0x6b3b5b6b6b6b6b6b!2sPendurthi!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin" 
                 width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy">
               </iframe>
              </div>
           </div>
        </div>

      </div>
    </div>
  `
})
export class HistoryComponent {
  templeService = inject(TempleService);
}