import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export interface Festival {
  id: number;
  name: string;
  month: string;
  date: string;
  description: string;
  icon: string; // SVG path or emoji
  colorClass: string;
}

@Injectable({
  providedIn: 'root'
})
export class TempleService {
  private supabase: SupabaseClient;
  
  // Admin State
  isAdmin = signal<boolean>(false);
  currentUser = signal<any>(null);
  
  // 2FA Mock State
  private _pending2FASession = false;

  // Global Site Configuration
  siteConfig = signal<SiteConfig>({
    templeName: 'Uttarandhra Tirupati',
    subTitle: 'Shri Venkateswara Swamy Temple, Pendurthi',
    logoUrl: 'https://picsum.photos/id/1047/100/100',
    liveLink: 'https://www.youtube.com/@ramanujampendurthi1012',
    contactPhone: '+919999999999',
    contactEmail: 'helpdesk@uttarandhratirupati.org'
  });

  // Content State (Initialized with Mock Data as Fallback)
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  
  news = signal<NewsItem[]>([
    { id: 1, title: 'Special Darshan Tickets Available', date: '2023-10-25', content: 'Online booking for special darshan for the upcoming festival is now open.', attachmentUrl: '' },
    { id: 2, title: 'Annual Brahmotsavam Dates Announced', date: '2023-10-20', content: 'The annual Brahmotsavam will commence from next month. Devotees are requested to plan accordingly.', attachmentUrl: 'https://picsum.photos/id/10/200/200' },
    { id: 3, title: 'Temple Renovation Update', date: '2023-10-15', content: 'The renovation of the eastern Gopuram is nearing completion.', attachmentUrl: '' }
  ]);

  gallery = signal<GalleryItem[]>([
    { id: 7, type: 'image', url: 'https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', caption: 'Temple Main Arch' },
    { id: 1, type: 'image', url: 'https://picsum.photos/id/10/800/600', caption: 'Temple Entrance at Sunrise' },
    { id: 2, type: 'image', url: 'https://picsum.photos/id/16/800/600', caption: 'Lush Green Gardens' },
    { id: 3, type: 'image', url: 'https://picsum.photos/id/28/800/600', caption: 'Evening Aarti' },
  ]);

  feedbacks = signal<FeedbackItem[]>([
    { id: 1, name: 'Srinivas Rao', message: 'A divine experience. Very well maintained.', date: '2023-10-24' }
  ]);

  donations = signal<Donation[]>([
    { id: '1', donorName: 'Venkata Ramana', category: 'Annadanam', amount: 1116, date: '2023-10-26', transactionId: 'TXN8839201' }
  ]);

  library = signal<LibraryItem[]>([
    ...AUDIO_TRACKS('en').map(track => ({
      id: track.id,
      type: 'audio' as const,
      title: track.title,
      url: track.src,
      description: `${track.category} • ${track.duration}`
    })),
    { id: 3, type: 'ebook', title: 'Temple History PDF', url: '#', description: 'Complete history of the temple construction.' }
  ]);

  festivals = signal<Festival[]>([
    { 
      id: 1, 
      name: 'Vaikuntha Ekadashi', 
      month: 'JAN', 
      date: '02', 
      description: 'The most auspicious day when the Vaikuntha Dwaram (Northern Gate) is opened. Thousands of devotees seek the darshan of Lord Venkateswara through this gateway.', 
      icon: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
      colorClass: 'border-blue-500 text-blue-600'
    },
    { 
      id: 2, 
      name: 'Rathasapthami', 
      month: 'FEB', 
      date: '16', 
      description: 'Known as "Ardha Brahmotsavam". The Lord is taken in procession on seven different vahanams starting from sunrise to sunset.', 
      icon: 'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z',
      colorClass: 'border-orange-500 text-orange-600'
    },
    { 
      id: 3, 
      name: 'Annual Brahmotsavams', 
      month: 'OCT', 
      date: '04-12', 
      description: 'The grandest nine-day festival. Highlights include Garuda Seva, Rathotsavam, and Chakrasnanam. The temple is decorated with dazzling lights and flowers.', 
      icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Z',
      colorClass: 'border-purple-600 text-purple-600'
    },
    { 
      id: 4, 
      name: 'Sri Vari Kalyanam', 
      month: 'MAY', 
      date: '10', 
      description: 'The celestial wedding ceremony of Lord Venkateswara and Goddess Padmavathi Devi performed with great pomp and gaiety.', 
      icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
      colorClass: 'border-red-600 text-red-600'
    }
  ]);

  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));
  
  // Panchangam State
  dailyPanchangam = computed(() => this.calculatePanchangam());

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initAuth();
    this.refreshData();
  }

  private async initAuth() {
    const { data } = await this.supabase.auth.getSession();
    if (data.session) {
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
  }

  async refreshData() {
    await Promise.all([
      this.fetchNews(),
      this.fetchGallery(),
      this.fetchLibrary(),
      this.fetchFeedbacks(),
      this.fetchDonations()
    ]);
  }

  // --- Auth Methods (With 2FA Simulation) ---
  
  async login(email: string, password: string): Promise<{ error: any; requires2FA?: boolean }> {
    // 1. First step: Validate credentials via Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // 2. Credentials Valid. Now Simulate 2FA Requirement.
    // We immediately sign out internally to prevent full access until 2FA is verified in the UI logic,
    // OR we act as a "pending" state.
    // For this applet, we'll keep the session but hold the isAdmin flag locally or use a temp flag.
    // To implement strict 2FA properly requires backend support. 
    // Here we assume "isAdmin" is only set to true after the verify step in the frontend component.
    
    // Temporarily set admin to false even though session exists, waiting for OTP
    this.isAdmin.set(false); 
    this._pending2FASession = true;

    return { error: null, requires2FA: true };
  }

  async verifyTwoFactor(otp: string): Promise<boolean> {
    if (!this._pending2FASession) return false;

    // Simulate OTP verification (In real world, verify against backend)
    // Hardcoded check for demo purposes or accept any 6 digit code
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      this._pending2FASession = false;
      
      // Now actually enable admin access based on the cached session
      const { data } = await this.supabase.auth.getSession();
      if (data.session) {
        this.isAdmin.set(true);
        this.currentUser.set(data.session.user);
        return true;
      }
    }
    return false;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.isAdmin.set(false);
    this.currentUser.set(null);
    this._pending2FASession = false;
  }

  // --- Data Methods ---

  async fetchNews() {
    const { data, error } = await this.supabase.from('news').select('*').order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      this.news.set(data);
    }
  }

  async addNews(title: string, content: string, attachmentUrl: string = '') {
    const newItem = {
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      attachmentUrl
    };
    
    // Optimistic Update
    this.news.update(items => [{ ...newItem, id: Date.now() }, ...items]);
    
    // Supabase Insert
    const { error } = await this.supabase.from('news').insert([newItem]);
    if (error) console.error('Error adding news:', error);
    else this.fetchNews();
  }

  async deleteNews(id: number) {
    this.news.update(items => items.filter(i => i.id !== id));
    await this.supabase.from('news').delete().eq('id', id);
  }

  async fetchGallery() {
    const { data, error } = await this.supabase.from('gallery').select('*').order('id', { ascending: false });
    if (!error && data && data.length > 0) {
      this.gallery.set(data);
    }
  }

  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
    const newItem = { url, caption, type };
    this.gallery.update(items => [{ ...newItem, id: Math.random() }, ...items]);
    
    const { error } = await this.supabase.from('gallery').insert([newItem]);
    if (error) console.error('Error adding gallery item:', error);
    else this.fetchGallery();
  }

  async deletePhoto(id: number) {
    this.gallery.update(items => items.filter(i => i.id !== id));
    await this.supabase.from('gallery').delete().eq('id', id);
  }

  async fetchFeedbacks() {
    const { data, error } = await this.supabase.from('feedbacks').select('*').order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      this.feedbacks.set(data);
    }
  }

  async addFeedback(name: string, message: string) {
    const newItem = {
      name,
      message,
      date: new Date().toISOString().split('T')[0]
    };
    this.feedbacks.update(items => [{...newItem, id: Date.now()}, ...items]);
    await this.supabase.from('feedbacks').insert([newItem]);
  }

  async fetchDonations() {
    const { data, error } = await this.supabase.from('donations').select('*').order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      this.donations.set(data);
    }
  }

  async addDonation(donation: Donation) {
    const dbItem = {
      donor_name: donation.donorName,
      gothram: donation.gothram,
      category: donation.category,
      amount: donation.amount,
      date: donation.date,
      pan: donation.pan,
      transaction_id: donation.transactionId
    };
    
    this.donations.update(items => [donation, ...items]);
    await this.supabase.from('donations').insert([dbItem]);
  }

  async fetchLibrary() {
    const { data, error } = await this.supabase.from('library').select('*').order('id', { ascending: false });
    if (!error && data && data.length > 0) {
      this.library.set(data);
    }
  }

  async addLibraryItem(item: Omit<LibraryItem, 'id'>) {
    this.library.update(items => [{ ...item, id: Date.now() }, ...items]);
    await this.supabase.from('library').insert([item]);
    this.fetchLibrary();
  }

  async deleteLibraryItem(id: number | string) {
    this.library.update(items => items.filter(i => i.id !== id));
    await this.supabase.from('library').delete().eq('id', id);
  }

  // --- Storage Methods ---
  async uploadFile(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { data } = this.supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  updateFlashNews(text: string) {
    this.flashNews.set(text);
  }
  
  updateSiteConfig(newConfig: SiteConfig) {
    this.siteConfig.set(newConfig);
  }

  // --- Panchangam Logic ---
  private calculatePanchangam(): Panchangam {
    const date = new Date();
    const day = date.getDay();
    const tithis = ['Shukla Padyami', 'Shukla Vidiya', 'Shukla Tadhiya', 'Shukla Chavithi', 'Shukla Panchami', 'Shukla Shashti', 'Shukla Saptami', 'Shukla Ashtami', 'Shukla Navami', 'Shukla Dashami', 'Shukla Ekadashi', 'Shukla Dwadashi', 'Shukla Trayodashi', 'Shukla Chaturdashi', 'Purnima', 'Krishna Padyami', 'Krishna Vidiya', 'Krishna Tadhiya', 'Krishna Chavithi', 'Krishna Panchami', 'Krishna Shashti', 'Krishna Saptami', 'Krishna Ashtami', 'Krishna Navami', 'Krishna Dashami', 'Krishna Ekadashi', 'Krishna Dwadashi', 'Krishna Trayodashi', 'Krishna Chaturdashi', 'Amavasya'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    
    // Rahu Kalam logic (approximate for standard time)
    const rahuKalams = ['04:30 PM - 06:00 PM', '07:30 AM - 09:00 AM', '03:00 PM - 04:30 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM'];
    const yamagandams = ['12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM', '03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM'];

    // Pseudo-calculation for Tithi/Nakshatra based on day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return {
      date: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      tithi: tithis[dayOfYear % tithis.length],
      nakshatra: nakshatras[dayOfYear % nakshatras.length],
      yogam: 'Siddha',
      karanam: 'Bava',
      rahuKalam: rahuKalams[day],
      yamagandam: yamagandams[day],
      sunrise: '06:05 AM',
      sunset: '06:12 PM'
    };
  }
}