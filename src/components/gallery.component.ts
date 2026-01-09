import { Component, inject } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-stone-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-serif font-bold text-red-900 mb-4">Divine Gallery</h2>
          <div class="w-24 h-1 bg-amber-500 mx-auto rounded"></div>
          <p class="mt-4 text-stone-600">Glimpses of the deity and temple events.</p>
        </div>

        <!-- Admin Upload Section -->
        @if (templeService.isAdmin()) {
          <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500 mb-12 animate-fade-in">
            <h3 class="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Admin: Add New Photo
            </h3>
            <div class="flex flex-col gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input [(ngModel)]="newPhotoUrl" placeholder="Image URL (e.g. https://picsum.photos/id/10/800/600)" class="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                <input [(ngModel)]="newCaption" placeholder="Caption (e.g. Morning Alankaram)" class="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
              </div>
              <button (click)="handleAddPhoto()" [disabled]="!newPhotoUrl || !newCaption" class="bg-red-900 text-white font-bold py-2 px-6 rounded hover:bg-red-800 transition-colors self-end disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload Photo
              </button>
            </div>
          </div>
        }

        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          @for (photo of templeService.gallery(); track photo.id) {
            <div class="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden border border-stone-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group">
              <img [src]="photo.url" [alt]="photo.caption" class="w-full object-cover hover:opacity-90 transition-opacity">
              <div class="p-4">
                <p class="text-center font-serif text-stone-800 font-bold text-lg">{{ photo.caption }}</p>
              </div>
              
              <!-- Admin Delete Action -->
              @if (templeService.isAdmin()) {
                 <button 
                    (click)="confirmDelete(photo.id)" 
                    class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md z-10 transition-colors border-2 border-white" 
                    title="Delete Photo">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                 </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class GalleryComponent {
  templeService = inject(TempleService);
  newPhotoUrl = '';
  newCaption = '';

  handleAddPhoto() {
    if (this.newPhotoUrl && this.newCaption) {
      this.templeService.addPhoto(this.newPhotoUrl, this.newCaption);
      this.newPhotoUrl = '';
      this.newCaption = '';
    }
  }

  confirmDelete(id: number) {
    if (confirm('Are you sure you want to permanently delete this photo?')) {
      this.templeService.deletePhoto(id);
    }
  }
}
