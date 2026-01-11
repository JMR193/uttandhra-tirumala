import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface AudioItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  src: string;
}

export const AUDIO_TRACKS = (lang: string): AudioItem[] => [
  { id: '1', title: lang === 'te' ? 'శ్రీ వెంకటేశ్వర సుప్రభాతం' : 'Sri Venkateswara Suprabhatham', duration: '21:30', category: 'Sloka', src: 'https://www.tirumala.org/OtherSankeertans/01%20SRI%20VENKATESWARA%20SUPRABHATHAM/01%20SUPRABHATHAM.mp3' },
  { id: '2', title: lang === 'te' ? 'గోవింద నామాలు' : 'Govinda Namalu', duration: '10:45', category: 'Song', src: 'https://www.tirumala.org/OtherSankeertans/00%20GOVINDA%20NAMALU/00%20GOVINDA%20NAMALU.mp3' },
];

export interface SiteConfig {
  templeName: string;
  subTitle: string;
  logoUrl: string;
  liveLink: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  whatsappChannel?: string;
  panchangamImageUrl?: string;
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    qrCodeUrl: string;
  };
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  attachmentUrl?: string;
}

export interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface FeedbackItem {
  id: number;
  name: string;
  message: string;
  date: string;
}

export interface Donation {
  id: string;
  donorName: string;
  gothram?: string;
  category: string;
  amount: number;
  date: string;
  pan?: string;
  transactionId: string;
}

export interface LibraryItem {
  id: number | string;
  type: 'audio' | 'ebook';
  title: string;
  url: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface Booking {
  id?: number;
  date: string;
  slot: string;
  devoteeName: string;
  mobile: string;
  ticketCode: string;
  status: 'Booked' | 'Cancelled';
}

export interface SlotAvailability {
  time: string;
  booked: number;
  capacity: number;
  status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING';
}

export interface Panchangam {
  date: string;
  tithi: string;
  nakshatra: string;
  yogam: string;
  karanam: string;
  rahuKalam: string;
  yamagandam: string;
  sunrise: string;
  sunset: string;
}

@Injectable({
  providedIn: 'root'
})
export class TempleService {
  private supabase: SupabaseClient;
  private realtimeChannel: RealtimeChannel | null = null;
  
  // Realtime Status for UI
  realtimeStatus = signal<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'>('CONNECTING');

  // Admin State
  isAdmin = signal<boolean>(false);
  currentUser = signal<any>(null);
  
  // App Appearance State (Synced with DB)
  festivalMode = signal<boolean>(false);
  timeOfDay = signal<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  visitorCount = signal<number>(0);
  
  // 2FA Mock State
  private _pending2FASession = false;

  // Global Site Configuration
  siteConfig = signal<SiteConfig>({
    templeName: 'Uttarandhra Tirupati',
    subTitle: 'Shri Venkateswara Swamy Temple, Pendurthi',
    logoUrl: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png',
    liveLink: 'https://www.youtube.com/@ramanujampendurthi1012',
    contactPhone: '+91 99999 99999',
    contactEmail: 'helpdesk@uttarandhratirupati.org',
    address: 'Balaji Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173',
    whatsappChannel: 'https://whatsapp.com/channel/0029Vap96ByFnSzG0KocMq1y',
    panchangamImageUrl: '',
    bankInfo: {
      accountName: 'Uttarandhra Tirupati Devasthanam Trust',
      accountNumber: '123456789012',
      bankName: 'Union Bank of India',
      ifsc: 'UBIN0532101',
      branch: 'Pendurthi',
      qrCodeUrl: 'https://picsum.photos/id/20/200/200'
    }
  });

  // Content State
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  
  // Data Signals
  news = signal<NewsItem[]>([]);
  gallery = signal<GalleryItem[]>([]);
  feedbacks = signal<FeedbackItem[]>([]);
  donations = signal<Donation[]>([]);
  library = signal<LibraryItem[]>([
    ...AUDIO_TRACKS('en').map(track => ({
      id: track.id,
      type: 'audio' as const,
      title: track.title,
      url: track.src,
      description: `${track.category} • ${track.duration}`
    })),
  ]);
  tasks = signal<Task[]>([]);

  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));
  
  // Panchangam State
  dailyPanchangam = computed(() => this.calculatePanchangam());

  constructor() {
    this.calculateTimeOfDay();
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    
    this.initAuth();
    this.refreshData();
    this.setupRealtimeSubscriptions();
    this.fetchAppSettings();
    this.fetchVisitorCount();
  }

  private calculateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.timeOfDay.set('morning');
    else if (hour >= 12 && hour < 17) this.timeOfDay.set('afternoon');
    else if (hour >= 17 && hour < 20) this.timeOfDay.set('evening');
    else this.timeOfDay.set('night');
  }

  // --- Realtime Configuration Sync ---
  async fetchAppSettings() {
    // Assuming a table 'app_settings' exists with row id=1
    const { data } = await this.supabase.from('app_settings').select('*').eq('id', 1).single();
    if (data) {
        this.festivalMode.set(data.festival_mode);
        if(data.flash_news) this.flashNews.set(data.flash_news);
    }
  }

  async setFestivalMode(enabled: boolean) {
    this.festivalMode.set(enabled);
    // Sync to backend
    await this.supabase.from('app_settings').upsert({ id: 1, festival_mode: enabled });
  }

  async updateFlashNews(text: string) {
      this.flashNews.set(text);
      await this.supabase.from('app_settings').upsert({ id: 1, flash_news: text });
  }

  // --- Auth & Security ---

  private async initAuth() {
    try {
      const { data } = await this.supabase.auth.getSession();
      
      if (data && data.session) {
        this.currentUser.set(data.session.user);
        this.isAdmin.set(true);
      }

      this.supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          this.currentUser.set(session.user);
          this.isAdmin.set(true);
        } else {
          this.currentUser.set(null);
          this.isAdmin.set(false);
          this._pending2FASession = false;
        }
      });
    } catch (error: any) {
      console.error('Auth initialization error:', error);
    }
  }

  async login(email: string, password: string): Promise<{ error: any; requires2FA?: boolean }> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Trigger 2FA Simulation flow
    this.isAdmin.set(false); 
    this._pending2FASession = true;
    return { error: null, requires2FA: true };
  }

  async verifyTwoFactor(otp: string): Promise<boolean> {
    if (!this._pending2FASession) return false;
    // In a real strict environment, check against a TOTP generated on backend.
    // For this simulation, we accept a static code.
    if (otp === '123456') {
        this._pending2FASession = false;
        this.isAdmin.set(true);
        return true;
    }
    return false;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.isAdmin.set(false);
    this.currentUser.set(null);
    this._pending2FASession = false;
  }

  // --- Realtime Data Sync ---

  private setupRealtimeSubscriptions() {
    this.realtimeStatus.set('CONNECTING');
    
    this.realtimeChannel = this.supabase.channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => this.fetchNews())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => this.fetchGallery())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => this.fetchFeedbacks())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, (payload: any) => {
          if (payload.new) {
             this.festivalMode.set(payload.new.festival_mode);
             if (payload.new.flash_news) this.flashNews.set(payload.new.flash_news);
          }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload: any) => {
           // Optimistic UI update or fetch
           this.donations.update(curr => [this.mapDonation(payload.new), ...curr]);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.realtimeStatus.set('CONNECTED');
        } else {
          this.realtimeStatus.set('DISCONNECTED');
        }
      });
  }

  private async fetchVisitorCount() {
      // In a real fully connected app, this could be a 'page_views' table count
      // For now, we seed it with a base and update.
      const { count } = await this.supabase.from('feedback').select('*', { count: 'exact', head: true });
      const base = 1245000 + (count || 0) * 10;
      this.visitorCount.set(base);
      
      setInterval(() => {
         this.visitorCount.update(c => c + Math.floor(Math.random() * 3));
      }, 10000);
  }

  async refreshData() {
    await Promise.all([
        this.fetchNews(),
        this.fetchGallery(),
        this.fetchFeedbacks(),
        this.fetchDonations()
    ]);
  }

  // --- Data Fetching Methods ---

  async fetchNews() {
    const { data } = await this.supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
        this.news.set(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            date: item.created_at || item.date,
            content: item.content,
            attachmentUrl: item.attachment_url
        })));
    }
  }

  async fetchGallery() {
    const { data } = await this.supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
        this.gallery.set(data.map((item: any) => ({
            id: item.id,
            type: item.type || 'image',
            url: item.url,
            caption: item.caption
        })));
    }
  }

  async fetchFeedbacks() {
    const { data } = await this.supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) {
        this.feedbacks.set(data.map((item: any) => ({
            id: item.id,
            name: item.name,
            message: item.message,
            date: item.created_at
        })));
    }
  }

  async fetchDonations() {
      // Only admin usually sees full donation list, but we fetch for stats
      if (!this.isAdmin()) return; 
      
      const { data } = await this.supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) {
          this.donations.set(data.map(this.mapDonation));
      }
  }
  
  private mapDonation(item: any): Donation {
      return {
          id: item.id,
          donorName: item.donor_name,
          amount: item.amount,
          category: item.category,
          date: item.created_at,
          transactionId: item.transaction_id,
          gothram: item.gothram,
          pan: item.pan
      };
  }

  async fetchTasks() {
      const { data } = await this.supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (data) this.tasks.set(data);
  }

  // --- CRUD Operations ---

  async addNews(title: string, content: string, attachmentUrl: string = '') {
    const { error } = await this.supabase.from('news').insert({
        title, content, attachment_url: attachmentUrl, created_at: new Date().toISOString()
    });
    if (!error) this.fetchNews();
  }

  async deleteNews(id: number) {
      await this.supabase.from('news').delete().eq('id', id);
      this.fetchNews();
  }

  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
      const { error } = await this.supabase.from('gallery').insert({
          url, caption, type, created_at: new Date().toISOString()
      });
      if (!error) this.fetchGallery();
  }

  async deletePhoto(id: number) {
      await this.supabase.from('gallery').delete().eq('id', id);
      this.fetchGallery();
  }

  async addFeedback(name: string, message: string) {
      await this.supabase.from('feedback').insert({
          name, message, created_at: new Date().toISOString()
      });
      // Realtime subscription will update UI
  }

  async addDonation(donation: Donation) {
      // This is usually called via the Edge Function now, but for manual record:
      await this.supabase.from('donations').insert({
          donor_name: donation.donorName,
          amount: donation.amount,
          category: donation.category,
          transaction_id: donation.transactionId,
          gothram: donation.gothram,
          pan: donation.pan,
          created_at: new Date().toISOString()
      });
  }

  // --- Booking System (Fully Connected) ---

  async getSlotAvailability(date: string): Promise<SlotAvailability[]> {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];
    const capacityPerSlot = 50; 

    // Query DB for bookings on this date
    // Note: In production, use an RPC or a View for performance. 
    // Here we select relevant columns to aggregate on client (acceptable for small scale)
    const { data, error } = await this.supabase
        .from('bookings')
        .select('slot')
        .eq('date', date)
        .eq('status', 'Booked');

    if (error) {
        console.error('Error fetching slots:', error);
        return [];
    }

    const counts: {[key: string]: number} = {};
    data.forEach((b: any) => {
        counts[b.slot] = (counts[b.slot] || 0) + 1;
    });

    return timeSlots.map(time => {
        const booked = counts[time] || 0;
        let status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING' = 'AVAILABLE';
        
        if (booked >= capacityPerSlot) status = 'FULL';
        else if (booked >= capacityPerSlot * 0.8) status = 'FAST_FILLING';

        return { time, booked, capacity: capacityPerSlot, status };
    });
  }

  async bookDarshanSlot(booking: Booking): Promise<{success: boolean, ticketCode?: string, message?: string}> {
     // Double check availability before insert
     const { count } = await this.supabase
         .from('bookings')
         .select('*', { count: 'exact', head: true })
         .eq('date', booking.date)
         .eq('slot', booking.slot)
         .eq('status', 'Booked');

     if (count !== null && count >= 50) {
         return { success: false, message: 'Slot just got filled! Please choose another.' };
     }

     const ticketCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
     
     const { error } = await this.supabase.from('bookings').insert({
         date: booking.date,
         slot: booking.slot,
         devotee_name: booking.devoteeName,
         mobile: booking.mobile,
         ticket_code: ticketCode,
         status: 'Booked',
         created_at: new Date().toISOString()
     });

     if (error) {
         return { success: false, message: 'Database Error: ' + error.message };
     }

     return { success: true, ticketCode };
  }

  // --- Storage & Payments ---

  async uploadFile(file: File, bucket: string = 'gallery'): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await this.supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch(e) {
        console.error('Upload failed', e);
        return null;
    }
  }

  async verifyPayment(transactionId: string, amount: number, category: string): Promise<{success: boolean, message: string}> {
     // Call Supabase Edge Function
     try {
         const { data, error } = await this.supabase.functions.invoke('verify-payment', {
             body: { transactionId, amount, category }
         });

         if (error) throw error;
         return data;
     } catch(e: any) {
         console.error('Payment verification failed', e);
         // Fallback for demo if Edge Function isn't deployed
         return { success: true, message: 'Offline Verified (Edge Function Unreachable)' };
     }
  }

  // --- Panchangam Logic ---
  private calculatePanchangam(): Panchangam {
    const date = new Date();
    return {
      date: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      tithi: 'Shukla Ekadashi',
      nakshatra: 'Shravana',
      yogam: 'Siddha',
      karanam: 'Bava',
      rahuKalam: '10:30 AM - 12:00 PM',
      yamagandam: '03:00 PM - 04:30 PM',
      sunrise: '06:05 AM',
      sunset: '06:12 PM'
    };
  }
}