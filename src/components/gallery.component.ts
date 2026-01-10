
import { Component, inject } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
          <p class="mt-4 text-stone-600">Glimpses of the deity, events, and videos.</p>
        </div>

        <!-- Admin Upload Section -->
        @if (templeService.isAdmin()) {
          <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500 mb-12 animate-fade-in">
            <h3 class="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Admin: Add Media
            </h3>
            
            <!-- Upload Mode Switch -->
             <div class="flex gap-4 mb-4 border-b border-stone-200 pb-2">
               <button (click)="uploadMode = 'url'" [class]="uploadMode === 'url' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500'" class="pb-1 font-bold">Paste URLs</button>
               <button (click)="uploadMode = 'file'" [class]="uploadMode === 'file' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500'" class="pb-1 font-bold">Upload File</button>
             </div>

            <div class="flex flex-col gap-4">
              <div class="flex gap-4">
                 <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mediaType" [(ngModel)]="newMediaType" value="image" class="text-amber-600 focus:ring-amber-500">
                    <span class="font-bold text-stone-700">Photos</span>
                 </label>
                 <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mediaType" [(ngModel)]="newMediaType" value="video" class="text-amber-600 focus:ring-amber-500">
                    <span class="font-bold text-stone-700">Videos</span>
                 </label>
              </div>

              @if (uploadMode === 'url') {
                <div class="grid grid-cols-1 gap-4">
                  <textarea [(ngModel)]="newPhotoUrls" placeholder="Paste URLs here (Separated by commas or new lines)" class="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-amber-500 h-32"></textarea>
                </div>
              } @else {
                 <div class="border-2 border-dashed border-stone-300 rounded p-8 text-center bg-stone-50">
                   <input type="file" (change)="onFileSelected($event)" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200">
                   @if (uploading) {
                     <p class="text-amber-600 mt-2 text-sm font-bold">Uploading to Cloud Storage...</p>
                   }
                 </div>
              }

              <input [(ngModel)]="newCaption" placeholder="Caption for this item" class="w-full p-3 border border-stone-300 rounded focus:outline-none focus:border-amber-500">
              
              <button (click)="handleUpload()" [disabled]="(!newPhotoUrls && !selectedFile) || !newCaption || uploading" class="bg-red-900 text-white font-bold py-2 px-6 rounded hover:bg-red-800 transition-colors self-end disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                {{ uploadMode === 'url' ? 'Add Links' : 'Upload File' }}
              </button>
            </div>
          </div>
        }

        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          @for (item of templeService.gallery(); track item.id) {
            <div class="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden border border-stone-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group">
              
              @if (item.type === 'video') {
                 <!-- Video Rendering -->
                 <div class="relative pt-[56.25%] bg-black">
                    @if (isYoutube(item.url)) {
                         <iframe [src]="getYoutubeEmbed(item.url)" class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    } @else {
                        <video [src]="item.url" controls class="absolute inset-0 w-full h-full object-cover"></video>
                    }
                 </div>
              } @else {
                 <!-- Image Rendering with lazy loading optimization -->
                 <img [src]="item.url" [alt]="item.caption" loading="lazy" class="w-full object-cover hover:opacity-90 transition-opacity">
              }

              <div class="p-4 flex justify-between items-center">
                <p class="font-serif text-stone-800 font-bold text-lg">{{ item.caption }}</p>
                @if (item.type === 'video') {
                   <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">VIDEO</span>
                }
              </div>
              
              <!-- Admin Delete Action -->
              @if (templeService.isAdmin()) {
                 <button 
                    (click)="confirmDelete(item.id)" 
                    class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md z-10 transition-colors border-2 border-white" 
                    title="Delete Media">
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
  sanitizer: DomSanitizer = inject(DomSanitizer);
  
  uploadMode: 'url' | 'file' = 'url';
  newPhotoUrls = '';
  newCaption = '';
  newMediaType: 'image' | 'video' = 'image';
  selectedFile: File | null = null;
  uploading = false;
  
  isYoutube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getYoutubeEmbed(url: string): SafeResourceUrl {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    const embedUrl = id ? `https://www.youtube.com/embed/${id}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async handleUpload() {
    if (this.uploadMode === 'url' && this.newPhotoUrls) {
      // Batch URL Upload
      const urls = this.newPhotoUrls.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);
      for (const url of urls) {
        await this.templeService.addMediaItem(url, this.newCaption, this.newMediaType);
      }
      this.resetForm();
    } else if (this.uploadMode === 'file' && this.selectedFile) {
      // File Upload to Supabase Storage
      this.uploading = true;
      const publicUrl = await this.templeService.uploadFile(this.selectedFile);
      if (publicUrl) {
         await this.templeService.addMediaItem(publicUrl, this.newCaption, this.newMediaType);
         this.resetForm();
      } else {
        alert('File upload failed. Please try again.');
      }
      this.uploading = false;
    }
  }

  resetForm() {
    this.newPhotoUrls = '';
    this.newCaption = '';
    this.selectedFile = null;
    this.uploading = false;
  }

  confirmDelete(id: number) {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      this.templeService.deletePhoto(id);
    }
  }
}
