import { Component, inject } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-stone-50 min-h-screen animate-fade-in">
      <!-- Hero -->
      <div class="relative h-64 md:h-96 overflow-hidden">
        <img src="https://picsum.photos/id/1047/1200/600" alt="Temple History" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-stone-900 bg-opacity-60 flex items-center justify-center">
          <h1 class="text-4xl md:text-6xl text-white font-serif font-bold text-center px-4 drop-shadow-xl">The Sacred History of Venkatadri</h1>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- Main Content: History -->
          <div class="lg:col-span-2 space-y-8 text-stone-700 leading-relaxed">
            
            <section>
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-4">The Legend & Sthala Purana</h2>
              <p class="mb-4 text-lg">
                The Lord of the Universe and Vaikuntha, Srimannarayana, takes many forms to protect his devotees. 
                In this Kaliyuga, he incarnated as Lord Venkateswara to offer solace to mankind.
              </p>
              <div class="bg-amber-50 border-l-4 border-amber-500 p-6 italic text-stone-600 my-6 shadow-sm rounded-r">
                <p class="mb-3"><strong>The Divine Step:</strong> According to the local Sthala Purana, Sri Varaha Lakshmi Narasimha Swamy of Simhachalam placed one foot on the Pendurthi Venkatadri hill and the other on Simhachalam.</p>
                <p><strong>The Sacred Evidence:</strong> To this day, the divine footprint of the Lord remains etched upon this hill, serving as a powerful site of pilgrimage.</p>
              </div>
            </section>

            <section>
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-4">The Vision of "Uttarandhra Tirupati"</h2>
              <p class="text-lg">
                Recognizing the spiritual energy of the site, local elders and the Panchavati Committee sought the guidance of the renowned spiritual leader, 
                <strong>Sri Tridandi Srimannarayana Chinna Jeeyar Swamy</strong>.
              </p>
              <p class="mt-4 text-lg">
                Upon visiting the hill and hearing its history, Swamiji prophesied that this site would become known as the 
                <strong>"Uttarandhra Tirupati"</strong> (The Tirupati of North Andhra), serving those who may be unable to travel to the main Tirumala shrine.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-serif font-bold text-red-900 mb-4">Temple Timeline</h2>
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
                      <td class="p-4">Laid by Sri Chinna Jeeyar Swamy.</td>
                    </tr>
                    <tr>
                      <td class="p-4 font-bold text-amber-800">Consecration</td>
                      <td class="p-4">May 17, 1997</td>
                      <td class="p-4">Formal idol installation (Pratishta) and sanctification.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
               <h2 class="text-3xl font-serif font-bold text-red-900 mb-4">A Growing Spiritual Hub</h2>
               <p class="text-lg mb-4">Since its consecration, the Venkatadri Kshetram has expanded into a massive spiritual complex. Under the continued blessings of Swamiji, other shrines established include:</p>
               <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <li class="flex items-center gap-2 bg-white p-3 rounded shadow-sm border border-stone-200">
                    <span class="text-red-600 text-xl">🕉</span> Goddess Alivelu Mangamma Temple
                 </li>
                 <li class="flex items-center gap-2 bg-white p-3 rounded shadow-sm border border-stone-200">
                    <span class="text-red-600 text-xl">🕉</span> Sri Govindaraja Swamy Temple
                 </li>
                 <li class="flex items-center gap-2 bg-white p-3 rounded shadow-sm border border-stone-200">
                    <span class="text-red-600 text-xl">🕉</span> Sri Kalyana Venkateswara Swamy Temple
                 </li>
               </ul>
            </section>

          </div>

          <!-- Sidebar: Visitor Info -->
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-xl shadow-lg border-t-8 border-red-900 sticky top-24">
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
                  <p class="text-xs text-stone-500 italic mt-2 border-t border-stone-200 pt-2">* Timings may extend during festivals.</p>
                </div>
              </div>

              <div class="mb-8">
                <h4 class="font-bold text-amber-800 uppercase text-sm mb-3 tracking-wide">Facilities</h4>
                <ul class="space-y-3 text-sm">
                  <li class="flex items-center gap-3">
                    <span class="bg-green-100 text-green-700 p-1 rounded-full text-xs">✔</span> Prasadam Counter
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="bg-green-100 text-green-700 p-1 rounded-full text-xs">✔</span> Annadanam (Free Meals)
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="bg-green-100 text-green-700 p-1 rounded-full text-xs">✔</span> Footwear Stand
                  </li>
                </ul>
              </div>

              <div class="mb-6">
                 <h4 class="font-bold text-amber-800 uppercase text-sm mb-3 tracking-wide">How to Reach</h4>
                 <div class="space-y-2 text-sm">
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Road:</strong> Well connected from Vizag (20km).</p>
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Train:</strong> Visakhapatnam Junction or Pendurthi Station.</p>
                    <p class="bg-stone-50 p-2 rounded"><strong class="block text-stone-700">Air:</strong> Visakhapatnam International Airport.</p>
                 </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Festivals Section (Dynamic) -->
        <div class="my-20">
          <div class="text-center mb-10">
             <h2 class="text-3xl font-serif font-bold text-red-900">Upcoming Major Festivals</h2>
             <div class="w-24 h-1 bg-amber-500 mx-auto rounded mt-4"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (fest of templeService.festivals(); track fest.id) {
               <div class="bg-white rounded-xl shadow-lg p-6 border-b-4 hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden" [class]="fest.colorClass">
                  <!-- Decorative Circle -->
                  <div class="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10" [class]="fest.colorClass.replace('border-', 'bg-')"></div>
                  
                  <div class="flex items-start justify-between mb-4">
                     <!-- Date Badge -->
                     <div class="flex flex-col items-center justify-center bg-stone-100 rounded-lg p-2 min-w-[60px] border border-stone-200">
                        <span class="text-xs font-bold text-stone-500 uppercase">{{ fest.month }}</span>
                        <span class="text-xl font-bold text-stone-800">{{ fest.date }}</span>
                     </div>
                     
                     <!-- Icon -->
                     <div class="p-2 rounded-full bg-stone-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8" [class]="fest.colorClass.replace('border-', 'text-')">
                           <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="fest.icon" />
                        </svg>
                     </div>
                  </div>

                  <h3 class="font-bold text-xl text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">{{ fest.name }}</h3>
                  <p class="text-sm text-stone-600 leading-relaxed">{{ fest.description }}</p>
               </div>
            }
          </div>
        </div>

        <!-- Contact Section -->
        <div class="bg-stone-900 text-stone-300 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden relative">
          <!-- Background Pattern -->
          <div class="absolute top-0 right-0 opacity-10 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 12h21L12 0zm0 4.5L16.5 9H7.5L12 4.5zM3.75 13.5h16.5v9H3.75v-9zm3 3v3h10.5v-3H6.75z"/></svg>
          </div>

          <h2 class="text-3xl font-serif font-bold text-amber-500 mb-10 text-center relative z-10">Get In Touch</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            
            <!-- Contact Info -->
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4 border-b border-stone-700 pb-2 inline-block">Contact Information</h3>
                <p class="mb-3 flex items-start gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   <span><strong>Address:</strong><br>Venkatadri Kshetram, Pendurthi,<br>Visakhapatnam, Andhra Pradesh - 530047.</span>
                </p>
                <p class="mb-3 flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   <span><strong>Phone:</strong> {{ templeService.siteConfig().contactPhone }}</span>
                </p>
                <p class="mb-3 flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   <span><strong>Email:</strong> {{ templeService.siteConfig().contactEmail }}</span>
                </p>
                <p class="mb-3 flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span><strong>Office Hours:</strong> 9:00 AM – 6:00 PM Daily</span>
                </p>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4 border-b border-stone-700 pb-2 inline-block">Stay Connected</h3>
                <div class="flex gap-4">
                   <a href="#" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                   </a>
                   <a [href]="templeService.siteConfig().liveLink" target="_blank" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                   </a>
                   <a href="#" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                   </a>
                </div>
              </div>
            </div>

            <!-- Map Placeholder -->
            <div class="h-64 md:h-full bg-stone-800 rounded-lg flex items-center justify-center border border-stone-700 relative overflow-hidden group">
               <!-- Embedded Google Maps -->
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.243547568541!2d83.2184!3d17.8284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3967d1c6e6d4c1%3A0x6b3b5b6b6b6b6b6b!2sPendurthi!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin" 
                 width="100%" height="100%" style="border:0; opacity: 0.8;" allowfullscreen="" loading="lazy" class="group-hover:opacity-100 transition-opacity">
               </iframe>
               <div class="absolute bottom-4 right-4 bg-white text-stone-900 text-xs px-2 py-1 rounded font-bold shadow opacity-80 pointer-events-none">
                 Google Maps
               </div>
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
