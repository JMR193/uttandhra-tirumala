
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleService, SlotAvailability } from '../services/temple.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-amber-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-[#800000] text-amber-50 p-6 text-center border-b-4 border-amber-500">
             <h2 class="text-3xl font-serif font-bold">Special Darshan Booking</h2>
             <p class="opacity-90 mt-1">Reserve your slot for a divine experience</p>
          </div>

          <div class="p-8">
            @if (step() === 'date') {
              <div class="animate-fade-in">
                 <h3 class="text-xl font-bold text-stone-800 mb-6 border-b pb-2">Step 1: Select Date</h3>
                 <div class="flex flex-col md:flex-row gap-8">
                    <div class="md:w-1/3">
                       <label class="block text-stone-700 font-bold mb-2">Pick a Date</label>
                       <input type="date" [min]="minDate" [(ngModel)]="selectedDate" (change)="fetchSlots()" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-lg">
                    </div>
                    
                    <div class="md:w-2/3">
                       <label class="block text-stone-700 font-bold mb-2">Available Slots for {{ selectedDate | date:'mediumDate' }}</label>
                       
                       @if (loadingSlots) {
                          <div class="flex justify-center py-8">
                             <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                       } @else if (slots.length > 0) {
                          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                             @for (slot of slots; track slot.time) {
                                <button (click)="selectSlot(slot)" [disabled]="slot.status === 'FULL'" 
                                   class="p-3 rounded-lg border text-center transition-all relative overflow-hidden group"
                                   [class.border-green-500]="slot.status === 'AVAILABLE'"
                                   [class.bg-green-50]="slot.status === 'AVAILABLE'"
                                   [class.hover:bg-green-100]="slot.status === 'AVAILABLE'"
                                   [class.border-amber-500]="slot.status === 'FAST_FILLING'"
                                   [class.bg-amber-50]="slot.status === 'FAST_FILLING'"
                                   [class.border-red-200]="slot.status === 'FULL'"
                                   [class.bg-red-50]="slot.status === 'FULL'"
                                   [class.opacity-60]="slot.status === 'FULL'"
                                   [class.ring-2]="selectedSlot?.time === slot.time"
                                   [class.ring-amber-600]="selectedSlot?.time === slot.time"
                                   >
                                   <div class="font-bold text-stone-800">{{ slot.time }}</div>
                                   <div class="text-xs mt-1" 
                                        [class.text-green-700]="slot.status === 'AVAILABLE'"
                                        [class.text-amber-700]="slot.status === 'FAST_FILLING'"
                                        [class.text-red-700]="slot.status === 'FULL'">
                                      {{ slot.status === 'FULL' ? 'FULL' : (slot.capacity - slot.booked) + ' Available' }}
                                   </div>
                                </button>
                             }
                          </div>
                          <div class="mt-6 text-right">
                             <button (click)="nextStep()" [disabled]="!selectedSlot" class="bg-red-900 text-white px-8 py-3 rounded font-bold hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all">
                                Continue &rarr;
                             </button>
                          </div>
                       } @else {
                          <div class="p-8 text-center text-stone-500 bg-stone-50 rounded border border-dashed border-stone-300">
                             Please select a date to view slots.
                          </div>
                       }
                    </div>
                 </div>
              </div>
            } @else if (step() === 'details') {
               <div class="animate-fade-in">
                  <h3 class="text-xl font-bold text-stone-800 mb-6 border-b pb-2">Step 2: Pilgrim Details</h3>
                  
                  <div class="bg-amber-50 p-4 rounded border border-amber-200 mb-6 flex justify-between items-center">
                     <div>
                        <span class="block text-xs text-stone-500 font-bold uppercase">Selected Slot</span>
                        <span class="text-lg font-bold text-red-900">{{ selectedDate | date:'mediumDate' }} at {{ selectedSlot?.time }}</span>
                     </div>
                     <button (click)="step.set('date')" class="text-sm text-amber-700 underline font-bold">Change</button>
                  </div>

                  <form (submit)="confirmBooking($event)">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label class="block text-stone-700 font-bold mb-2">Pilgrim Name</label>
                           <input [(ngModel)]="bookingData.name" name="pName" required class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-2">Mobile Number</label>
                           <input [(ngModel)]="bookingData.mobile" name="pMobile" required pattern="[0-9]{10}" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-2">Aadhar / ID Number</label>
                           <input [(ngModel)]="bookingData.idProof" name="pId" required class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>
                        <div>
                           <label class="block text-stone-700 font-bold mb-2">Number of Persons</label>
                           <select class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                              <option>1 (Self)</option>
                           </select>
                           <p class="text-xs text-stone-500 mt-1">Currently restricted to 1 person per booking.</p>
                        </div>
                     </div>

                     <div class="flex justify-between items-center">
                        <button type="button" (click)="step.set('date')" class="text-stone-500 font-bold hover:text-stone-800">Back</button>
                        <button type="submit" [disabled]="isBooking" class="bg-gradient-to-r from-amber-600 to-red-700 text-white px-8 py-3 rounded font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center gap-2">
                           @if (isBooking) {
                              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           }
                           Confirm Booking
                        </button>
                     </div>
                  </form>
               </div>
            } @else if (step() === 'confirmed') {
               <div class="text-center py-8 animate-fade-in">
                  <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  </div>
                  <h3 class="text-2xl font-bold text-stone-800 mb-2">Booking Confirmed!</h3>
                  <p class="text-stone-600 mb-8">Please carry a digital or printed copy of this ticket.</p>
                  
                  <div class="max-w-md mx-auto border-2 border-stone-800 p-6 rounded relative bg-white ticket-tear">
                     <div class="absolute -left-3 top-1/2 w-6 h-6 bg-amber-50 rounded-full"></div>
                     <div class="absolute -right-3 top-1/2 w-6 h-6 bg-amber-50 rounded-full"></div>
                     
                     <div class="border-b border-dashed border-stone-300 pb-4 mb-4">
                        <h4 class="text-xl font-serif font-bold text-[#800000] uppercase">Darshan Ticket</h4>
                        <p class="text-xs text-stone-500">Uttarandhra Tirupati</p>
                     </div>
                     
                     <div class="space-y-3 text-left">
                        <div class="flex justify-between">
                           <span class="text-stone-500 text-sm">Ticket No</span>
                           <span class="font-mono font-bold text-lg">{{ ticketDetails.code }}</span>
                        </div>
                        <div class="flex justify-between">
                           <span class="text-stone-500 text-sm">Date</span>
                           <span class="font-bold">{{ selectedDate | date:'mediumDate' }}</span>
                        </div>
                        <div class="flex justify-between">
                           <span class="text-stone-500 text-sm">Time Slot</span>
                           <span class="font-bold bg-amber-100 px-2 rounded">{{ selectedSlot?.time }}</span>
                        </div>
                        <div class="flex justify-between">
                           <span class="text-stone-500 text-sm">Pilgrim</span>
                           <span class="font-bold">{{ bookingData.name }}</span>
                        </div>
                     </div>
                     
                     <div class="mt-6 pt-4 border-t border-stone-200 text-center">
                        <div class="w-32 h-32 bg-white mx-auto mb-2 border p-1">
                           <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + ticketDetails.code" class="w-full h-full object-contain">
                        </div>
                        <p class="text-[10px] text-stone-400">Scan at entry</p>
                     </div>
                  </div>

                  <div class="mt-8">
                     <button (click)="printTicket()" class="text-stone-600 hover:text-black font-bold underline mr-4">Print Ticket</button>
                     <button (click)="reset()" class="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700">Book Another</button>
                  </div>
               </div>
            }
          </div>
        </div>

      </div>
    </div>

    <style>
       .ticket-tear { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
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
