import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TempleService } from '../services/temple.service';

@Component({
  selector: 'app-ehundi',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="bg-amber-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <!-- Main Card -->
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full">
          
          <div class="bg-red-900 text-white p-6 text-center print:hidden">
            <h2 class="text-3xl font-serif font-bold">Srivari E-Hundi</h2>
            <p class="opacity-80">Kanuka to Lord Venkateswara</p>
          </div>

          <div class="p-8">
            @if (step() === 'form') {
              <form (submit)="processPayment($event)">
                <div class="mb-6">
                  <label class="block text-stone-700 font-bold mb-2">Contribution Category</label>
                  <select [(ngModel)]="category" name="category" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="Hundi">General Hundi (Srivari Kanuka)</option>
                    <option value="Annadanam">Annadanam Trust</option>
                    <option value="Gosala">Gosala Maintenance</option>
                    <option value="Saswatha_Puja">Saswatha Puja Scheme</option>
                    <option value="Construction">Temple Construction Fund</option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="block text-stone-700 font-bold mb-2">Devotee Name</label>
                    <input type="text" [(ngModel)]="donorName" name="donorName" required class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Enter Full Name">
                  </div>
                  <div>
                    <label class="block text-stone-700 font-bold mb-2">Gothram</label>
                    <input type="text" [(ngModel)]="gothram" name="gothram" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Optional">
                  </div>
                </div>

                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="block text-stone-700 font-bold mb-2">Email ID</label>
                    <input type="email" required class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="For receipt">
                  </div>
                   <div>
                    <label class="block text-stone-700 font-bold mb-2">PAN Number (Optional)</label>
                    <input type="text" [(ngModel)]="pan" name="pan" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none uppercase" placeholder="For Tax Exemption">
                  </div>
                </div>

                <div class="mb-8">
                  <label class="block text-stone-700 font-bold mb-2">Amount (INR)</label>
                  <div class="flex gap-4 mb-4 flex-wrap">
                    <button type="button" (click)="amount = 116" class="px-4 py-2 rounded border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold transition-colors">₹ 116</button>
                    <button type="button" (click)="amount = 516" class="px-4 py-2 rounded border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold transition-colors">₹ 516</button>
                    <button type="button" (click)="amount = 1116" class="px-4 py-2 rounded border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold transition-colors">₹ 1,116</button>
                    <button type="button" (click)="amount = 5000" class="px-4 py-2 rounded border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold transition-colors">₹ 5,000</button>
                  </div>
                  <input type="number" [(ngModel)]="amount" name="amount" required min="1" class="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-xl font-bold text-stone-800">
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg hover:from-amber-700 hover:to-amber-800 transform hover:-translate-y-1 transition-all">
                  Proceed to Pay ₹{{ amount }}
                </button>
                <p class="text-center text-xs text-stone-500 mt-4">Secure Payment Gateway by Bank of Temple Trust</p>
              </form>
            } @else if (step() === 'processing') {
              <div class="flex flex-col items-center justify-center py-12">
                 <div class="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                 <p class="text-xl font-bold text-stone-700">Processing Payment...</p>
                 <p class="text-sm text-stone-500">Connecting to Payment Gateway...</p>
              </div>
            } @else if (step() === 'success') {
              <!-- Receipt View -->
              <div class="text-center py-4 animate-fade-in print:text-left">
                
                <div class="border-4 border-double border-amber-600 p-6 rounded-lg relative overflow-hidden bg-amber-50">
                  <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-48 h-48"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                  </div>

                  <h3 class="text-2xl font-serif font-bold text-red-900 mb-1">Uttarandhra Tirupati</h3>
                  <p class="text-sm font-bold text-stone-600 uppercase mb-4">Shri Venkateswara Swamy Temple</p>
                  
                  <div class="w-full h-px bg-amber-300 my-4"></div>
                  
                  <h4 class="text-xl font-bold text-stone-800 mb-6 uppercase tracking-widest">Donation Receipt</h4>

                  <div class="grid grid-cols-2 gap-y-4 text-left text-sm mb-6 max-w-md mx-auto print:max-w-full">
                    <span class="text-stone-500">Receipt No:</span> <span class="font-mono font-bold">{{ transactionId }}</span>
                    <span class="text-stone-500">Date:</span> <span class="font-bold">{{ currentDate }}</span>
                    <span class="text-stone-500">Donor Name:</span> <span class="font-bold">{{ donorName }}</span>
                    <span class="text-stone-500">Gothram:</span> <span class="font-bold">{{ gothram || '-' }}</span>
                    <span class="text-stone-500">Category:</span> <span class="font-bold">{{ category }}</span>
                    <span class="text-stone-500">PAN:</span> <span class="font-bold">{{ pan || '-' }}</span>
                  </div>

                  <div class="bg-white p-4 rounded border border-amber-200 inline-block w-full max-w-md print:max-w-full">
                     <p class="text-sm text-stone-500 mb-1">Total Amount Received</p>
                     <p class="text-3xl font-bold text-emerald-700">₹ {{ amount }}</p>
                  </div>

                  <p class="mt-6 text-xs text-stone-500 italic">May Lord Venkateswara bless you and your family.</p>
                  <p class="text-xs text-stone-400 mt-1">This is a computer generated receipt.</p>

                </div>

                <div class="mt-8 flex justify-center gap-4 print:hidden">
                   <button (click)="printReceipt()" class="bg-stone-800 text-white px-6 py-2 rounded hover:bg-stone-700 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
                     Print
                   </button>
                   <button (click)="reset()" class="border border-amber-600 text-amber-700 font-bold px-6 py-2 rounded hover:bg-amber-50">New Donation</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class EHundiComponent {
  templeService = inject(TempleService);
  
  amount = 116;
  donorName = '';
  gothram = '';
  category = 'Hundi';
  pan = '';
  
  step = signal<'form' | 'processing' | 'success'>('form');
  transactionId = '';
  currentDate = '';

  processPayment(e: Event) {
    e.preventDefault();
    this.step.set('processing');
    
    setTimeout(() => {
      this.transactionId = 'TXN' + Math.floor(Math.random() * 10000000).toString();
      this.currentDate = new Date().toISOString().split('T')[0];
      
      // Save to Service (Backend Mock)
      this.templeService.addDonation({
        id: Date.now().toString(),
        donorName: this.donorName,
        gothram: this.gothram,
        category: this.category,
        amount: this.amount,
        date: this.currentDate,
        transactionId: this.transactionId,
        pan: this.pan
      });

      this.step.set('success');
    }, 2000);
  }

  printReceipt() {
    window.print();
  }

  reset() {
    this.step.set('form');
    this.amount = 116;
    this.donorName = '';
    this.gothram = '';
    this.pan = '';
    this.category = 'Hundi';
  }
}
