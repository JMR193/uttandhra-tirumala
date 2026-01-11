import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleService, SlotAvailability } from '../services/temple.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-amber-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        
        <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border-t-8 border-[#800000]">
          
          <!-- Header -->
          <div class="bg-white p-6 border-b border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
             <div class="flex items-center gap-4">
                <img src="https://www.tirumala.org/Images/Sangu_Chakra_Symbol.png" class="h-12 w-auto opacity-90" onerror="this.style.display='none'">
                <div>
                   <h2 class="text-2xl font-serif font-bold text-[#800000]">Special Entry Darshan</h2>
                   <p class="text-xs text-stone-500 font-bold uppercase tracking-wider">Online Booking Portal</p>
                </div>
             </div>
             <div class="text-right hidden md:block">
                <p class="text-xs text-stone-500">Om Namo Venkatesaya</p>
                <p class="text-sm font-bold text-stone-800">{{ currentDateDisplay | date:'fullDate' }}</p>
             </div>
          </div>

          <div class="p-6 md:p-8 bg-stone-50/50">
            @if (step() === 'date') {
              <div class="animate-fade-in">
                 
                 <!-- Instruction Box -->
                 <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 text-sm text-blue-900 rounded-r shadow-sm">
                    <p class="font-bold mb-1 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                       Note to Pilgrims:
                    </p>
                    <ul class="list-disc list-inside space-y-1 opacity-90 ml-1">
                       <li>At the time of entry, all pilgrims shall produce the same original Photo ID used during booking.</li>
                       <li>Traditional dress code is mandatory (Dhoti/Pyjama for Men, Saree/Chudidhar for Women).</li>
                       <li>Pilgrims should report strictly at the time slot mentioned in the ticket.</li>
                    </ul>
                 </div>

                 <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Date Selection Panel -->
                    <div class="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-stone-200 h-fit">
                       <label class="block text-[#800000] font-bold mb-3 uppercase text-xs tracking-wider">Select Darshan Date</label>
                       <input type="date" [min]="minDate" [(ngModel)]="selectedDate" (change)="fetchSlots()" class="w-full p-3 border-2 border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg font-bold text-stone-700 cursor-pointer hover:bg-stone-50 transition-colors">
                       <p class="text-xs text-stone-500 mt-2">Booking allowed for next 30 days only.</p>
                    </div>
                    
                    <!-- Slot Selection Panel -->
                    <div class="lg:w-2/3">
                       <div class="flex justify-between items-end mb-4 border-b border-stone-200 pb-2">
                          <label class="block text-[#800000] font-bold uppercase text-xs tracking-wider">
                             Select Time Slot <span *ngIf="selectedDate" class="text-stone-500 normal-case ml-2">for {{ selectedDate | date:'mediumDate' }}</span>
                          </label>
                          
                          <!-- Legends -->
                          <div class="flex gap-3 text-[10px] font-bold uppercase">
                             <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-sm"></span> Available</span>
                             <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-sm"></span> Quota Full</span>
                             <span class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-600 rounded-sm"></span> Selected</span>
                          </div>
                       </div>
                       
                       @if (loadingSlots) {
                          <div class="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-stone-100">
                             <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                             <p class="text-sm font-bold text-stone-500">Checking availability...</p>
                          </div>
                       } @else if (slots.length > 0) {
                          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                             @for (slot of slots; track slot.time) {
                                <button (click)="selectSlot(slot)" [disabled]="slot.status === 'FULL'" 
                                   class="py-2 px-1 rounded shadow-sm transition-all relative overflow-hidden group flex flex-col items-center justify-center h-16 border"
                                   [class.bg-green-500]="slot.status === 'AVAILABLE' && selectedSlot?.time !== slot.time"
                                   [class.hover:bg-green-600]="slot.status === 'AVAILABLE' && selectedSlot?.time !== slot.time"
                                   [class.text-white]="slot.status === 'AVAILABLE' || slot.status === 'FULL'"
                                   
                                   [class.bg-red-500]="slot.status === 'FULL'"
                                   [class.cursor-not-allowed]="slot.status === 'FULL'"
                                   [class.opacity-50]="slot.status === 'FULL'"
                                   
                                   [class.bg-blue-600]="selectedSlot?.time === slot.time"
                                   [class.text-white]="selectedSlot?.time === slot.time"
                                   [class.ring-2]="selectedSlot?.time === slot.time"
                                   [class.ring-offset-2]="selectedSlot?.time === slot.time"
                                   [class.scale-105]="selectedSlot?.time === slot.time"
                                   >
                                   <div class="font-bold text-xs">{{ slot.time }}</div>
                                   @if (slot.status !== 'FULL') {
                                       <div class="text-[9px] mt-1 bg-black/20 px-1 rounded">{{ slot.capacity - slot.booked }}</div>
                                   }
                                </button>
                             }
                          </div>
                          
                          <div class="mt-8 flex justify-end">
                             <button (click)="nextStep()" [disabled]="!selectedSlot" class="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all flex items-center gap-2">
                                Continue
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                             </button>
                          </div>
                       } @else {
                          <div class="py-16 text-center text-stone-400 bg-white rounded-lg border border-dashed border-stone-300">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-2 opacity-50"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                             <span class="block text-sm">Select a date to view availability slots</span>
                          </div>
                       }
                    </div>
                 </div>
              </div>
            } @else if (step() === 'details') {
               <div class="animate-fade-in max-w-3xl mx-auto">
                  <div class="flex items-center justify-between mb-6 pb-4 border-b border-stone-300">
                     <h3 class="text-xl font-bold text-[#800000]">Pilgrim Details</h3>
                     <button (click)="step.set('date')" class="text-xs font-bold text-stone-500 hover:text-red-800 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg> Back to Slots
                     </button>
                  </div>
                  
                  <!-- Selected Slot Info -->
                  <div class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-8 flex items-center gap-4 shadow-sm">
                     <div class="bg-amber-200 p-2 rounded text-amber-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                     </div>
                     <div>
                        <p class="text-xs text-stone-500 font-bold uppercase tracking-wider">Booking For</p>
                        <p class="text-lg font-bold text-stone-800">
                           {{ selectedDate | date:'fullDate' }} 
                           <span class="mx-2 text-stone-300">|</span> 
                           {{ selectedSlot?.time }}
                        </p>
                     </div>
                  </div>

                  <form (submit)="confirmBooking($event)" class="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="md:col-span-2">
                           <label class="block text-stone-700 font-bold mb-1 text-sm">Full Name (As per ID Proof) <span class="text-red-500">*</span></label>
                           <input [(ngModel)]="bookingData.name" name="pName" required class="w-full p-3 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none uppercase placeholder:normal-case" placeholder="Enter Pilgrim Name">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-1 text-sm">Mobile Number <span class="text-red-500">*</span></label>
                           <div class="relative">
                              <span class="absolute left-3 top-3 text-stone-500 text-sm font-bold">+91</span>
                              <input [(ngModel)]="bookingData.mobile" name="pMobile" required pattern="[0-9]{10}" maxlength="10" class="w-full p-3 pl-10 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="9999999999">
                           </div>
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-1 text-sm">Aadhar Number <span class="text-red-500">*</span></label>
                           <input [(ngModel)]="bookingData.idProof" name="pId" required minlength="12" maxlength="12" pattern="[0-9]{12}" class="w-full p-3 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="12 Digit Aadhar No">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-1 text-sm">Age</label>
                           <input type="number" name="pAge" class="w-full p-3 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Age">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-1 text-sm">Gender</label>
                           <select name="pGender" class="w-full p-3 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                           </select>
                        </div>
                     </div>

                     <div class="bg-yellow-50 p-4 rounded text-xs text-yellow-800 mb-6 flex gap-2">
                        <input type="checkbox" required id="agree" class="mt-0.5">
                        <label for="agree">I hereby declare that the details furnished above are true to the best of my knowledge. I will produce the original ID proof at the time of entry.</label>
                     </div>

                     <div class="flex justify-end">
                        <button type="submit" [disabled]="isBooking" class="bg-[#800000] text-white px-10 py-3 rounded font-bold shadow-lg hover:bg-red-900 disabled:opacity-70 flex items-center gap-3 transition-all">
                           @if (isBooking) {
                              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Processing...
                           } @else {
                              Book Ticket
                           }
                        </button>
                     </div>
                  </form>
               </div>
            } @else if (step() === 'confirmed') {
               <div class="py-8 animate-fade-in flex flex-col items-center">
                  
                  <!-- Success Message -->
                  <div class="text-center mb-8">
                      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      </div>
                      <h3 class="text-3xl font-bold text-stone-800">Booking Confirmed</h3>
                      <p class="text-stone-600">A copy of the ticket has been sent to your mobile.</p>
                  </div>
                  
                  <!-- Ticket Design -->
                  <div class="w-full max-w-lg bg-white border border-stone-300 rounded-lg overflow-hidden shadow-2xl relative print-ticket">
                     <!-- Header -->
                     <div class="bg-[#800000] text-white p-4 flex justify-between items-center bg-pattern">
                        <div>
                           <h4 class="font-serif font-bold text-lg uppercase tracking-wider">Special Entry Darshan</h4>
                           <p class="text-[10px] opacity-80">Uttarandhra Tirupati Devasthanam</p>
                        </div>
                        <div class="text-right">
                           <span class="block text-xs opacity-75">Booking Ref</span>
                           <span class="font-mono font-bold">{{ ticketDetails.code }}</span>
                        </div>
                     </div>

                     <!-- Body -->
                     <div class="p-6 relative">
                        <!-- Watermark -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-64 h-64"><path d="M12 2L2 22h20L12 2z"/></svg>
                        </div>

                        <div class="grid grid-cols-2 gap-y-6 text-sm relative z-10">
                           <div>
                              <p class="text-xs text-stone-500 uppercase font-bold">Reporting Date</p>
                              <p class="font-bold text-lg text-stone-900">{{ selectedDate | date:'dd MMM yyyy' }}</p>
                           </div>
                           <div class="text-right">
                              <p class="text-xs text-stone-500 uppercase font-bold">Reporting Time</p>
                              <p class="font-bold text-lg text-[#800000]">{{ selectedSlot?.time }}</p>
                           </div>
                           <div class="col-span-2 border-t border-dashed border-stone-200 my-1"></div>
                           <div>
                              <p class="text-xs text-stone-500 uppercase font-bold">Pilgrim Name</p>
                              <p class="font-bold text-stone-900">{{ bookingData.name }}</p>
                           </div>
                           <div class="text-right">
                              <p class="text-xs text-stone-500 uppercase font-bold">ID Proof</p>
                              <p class="font-bold text-stone-900">{{ bookingData.idProof }}</p>
                           </div>
                           <div>
                              <p class="text-xs text-stone-500 uppercase font-bold">No. of Persons</p>
                              <p class="font-bold text-stone-900">1</p>
                           </div>
                           <div class="text-right">
                              <p class="text-xs text-stone-500 uppercase font-bold">Ticket Price</p>
                              <p class="font-bold text-stone-900">Free</p>
                           </div>
                        </div>

                        <!-- QR Code Area -->
                        <div class="mt-8 flex justify-center">
                           <div class="p-2 bg-white border border-stone-200 rounded">
                               <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + ticketDetails.code" class="w-32 h-32">
                           </div>
                        </div>
                        <p class="text-center text-[10px] text-stone-400 mt-2">Scan this QR code at the temple entrance queue.</p>
                     </div>

                     <!-- Footer -->
                     <div class="bg-stone-100 p-3 text-center border-t border-stone-200">
                        <p class="text-[10px] text-stone-500">Keep this ticket handy. Do not fold across the QR code.</p>
                     </div>
                  </div>

                  <div class="mt-8 flex gap-4 print:hidden">
                     <button (click)="printTicket()" class="bg-stone-800 text-white px-6 py-2 rounded font-bold hover:bg-black transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
                        Print Ticket
                     </button>
                     <button (click)="reset()" class="text-[#800000] font-bold hover:underline px-4">Book Another</button>
                  </div>
               </div>
            }
          </div>
        </div>

      </div>
    </div>
    
    <style>
      .bg-pattern {
        background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px);
      }
      @media print {
         body * { visibility: hidden; }
         .print-ticket, .print-ticket * { visibility: visible; }
         .print-ticket { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: 1px solid #ccc; }
      }
    </style>
  `
})
export class BookingComponent {
  templeService = inject(TempleService);
  
  step = signal<'date' | 'details' | 'confirmed'>('date');
  minDate = new Date().toISOString().split('T')[0];
  selectedDate = '';
  slots: SlotAvailability[] = [];
  selectedSlot: SlotAvailability | null = null;
  loadingSlots = false;
  isBooking = false;
  currentDateDisplay = new Date();

  bookingData = {
    name: '',
    mobile: '',
    idProof: ''
  };

  ticketDetails = {
    code: ''
  };

  async fetchSlots() {
    if (!this.selectedDate) return;
    this.loadingSlots = true;
    this.selectedSlot = null;
    try {
       // Simulate a bit of network delay for realism if utilizing mock data
       this.slots = await this.templeService.getSlotAvailability(this.selectedDate);
    } catch (e) {
       console.error(e);
    } finally {
       this.loadingSlots = false;
    }
  }

  selectSlot(slot: SlotAvailability) {
    this.selectedSlot = slot;
  }

  nextStep() {
    if (this.selectedSlot) {
       this.step.set('details');
       window.scrollTo(0, 0);
    }
  }

  async confirmBooking(e: Event) {
     e.preventDefault();
     if (!this.selectedSlot) return;

     this.isBooking = true;
     const result = await this.templeService.bookDarshanSlot({
        date: this.selectedDate,
        slot: this.selectedSlot.time,
        devoteeName: this.bookingData.name,
        mobile: this.bookingData.mobile,
        ticketCode: '', // Generated by service
        status: 'Booked'
     });

     if (result.success && result.ticketCode) {
        this.ticketDetails.code = result.ticketCode;
        this.step.set('confirmed');
        window.scrollTo(0, 0);
     } else {
        alert(result.message || 'Booking failed');
     }
     this.isBooking = false;
  }

  printTicket() {
    window.print();
  }

  reset() {
     this.step.set('date');
     this.selectedDate = '';
     this.selectedSlot = null;
     this.bookingData = { name: '', mobile: '', idProof: '' };
     this.slots = [];
  }
}