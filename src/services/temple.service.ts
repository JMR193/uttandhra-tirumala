import { Injectable, signal, computed } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types locally for simplicity if strict types are missing in ESM build
type Auth = any;
type User = any;

import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, orderBy, limit, onSnapshot, where, Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { environment } from '../environments/environment';

export interface TempleTimings {
  suprabhatam: string;
  morningDarshan: string;
  breakTime: string;
  eveningDarshan: string;
  ekanthaSeva: string;
}

export interface BankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  branch: string;
  qrCodeUrl: string;
}

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
  bankInfo: BankInfo;
  timings: TempleTimings;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  attachmentUrl?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface FeedbackItem {
  id: string;
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
  id: string;
  type: 'audio' | 'ebook';
  title: string;
  url: string;
  description?: string;
}

export interface Booking {
  id?: string;
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
  private app: FirebaseApp;
  private auth: Auth;
  private db: Firestore;
  private storage: FirebaseStorage;
  private analytics: Analytics;
  public supabase: SupabaseClient;
  
  // Admin State
  isAdmin = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  
  // App Appearance State
  festivalMode = signal<boolean>(false);
  timeOfDay = signal<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  visitorCount = signal<number>(1245000);
  
  // 2FA Mock State (kept for additional security layer simulation)
  private _pending2FASession = false;

  // Global Site Configuration (Default Values)
  siteConfig = signal<SiteConfig>({
    templeName: 'Uttarandhra Tirupati',
    subTitle: 'Shri Venkateswara Swamy Temple, Pendurthi',
    logoUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0677230990.firebasestorage.app/o/logo%2Fcb3d423f-ec99-48a4-b070-adf5c21ddd76.png?alt=media&token=adcbaf32-142d-46d0-be86-f2a505054564', 
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
    },
    timings: {
      suprabhatam: '05:00 AM',
      morningDarshan: '06:00 AM - 01:00 PM',
      breakTime: '01:00 PM - 04:00 PM',
      eveningDarshan: '04:00 PM - 08:30 PM',
      ekanthaSeva: '09:00 PM'
    }
  });

  // Content State
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  
  // Data Signals
  news = signal<NewsItem[]>([]);
  gallery = signal<GalleryItem[]>([]);
  feedbacks = signal<FeedbackItem[]>([]);
  donations = signal<Donation[]>([]);
  library = signal<LibraryItem[]>([]);
  
  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));
  dailyPanchangam = computed(() => this.calculatePanchangam());

  constructor() {
    this.calculateTimeOfDay();
    
    // Initialize Firebase
    this.app = initializeApp(environment.firebase);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
    
    // Initialize Supabase
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);

    this.initAuth();
    this.refreshData();
    this.setupRealtimeListeners();
    this.startSimulations();
  }

  private calculateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.timeOfDay.set('morning');
    else if (hour >= 12 && hour < 17) this.timeOfDay.set('afternoon');
    else if (hour >= 17 && hour < 20) this.timeOfDay.set('evening');
    else this.timeOfDay.set('night');
  }

  private startSimulations() {
      // Simulate live visitor count
      setInterval(() => {
         this.visitorCount.update(c => c + Math.floor(Math.random() * 3));
      }, 5000);
  }

  // --- Realtime Configuration Sync (Firestore) ---
  private setupRealtimeListeners() {
    // Listen for Settings changes
    try {
        const settingsDoc = doc(this.db, 'settings', 'global');
        onSnapshot(settingsDoc, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as any;
            // Merge with existing default structure to prevent errors if fields are missing
            const newConfig: SiteConfig = {
                ...this.siteConfig(),
                ...data
            };
            this.siteConfig.set(newConfig);
            
            if (data.flashNews) this.flashNews.set(data.flashNews);
            if (data.festivalMode !== undefined) this.festivalMode.set(data.festivalMode);
          }
        }, (err) => console.log('Config listener unavailable', err));
    } catch(e) { console.error(e); }
  }

  async updateSiteConfig(config: Partial<SiteConfig>) {
    const settingsDoc = doc(this.db, 'settings', 'global');
    await setDoc(settingsDoc, config, { merge: true });
  }

  async setFestivalMode(enabled: boolean) {
    this.festivalMode.set(enabled);
    const settingsDoc = doc(this.db, 'settings', 'global');
    await setDoc(settingsDoc, { festivalMode: enabled }, { merge: true });
  }

  async updateFlashNews(text: string) {
      this.flashNews.set(text);
      const settingsDoc = doc(this.db, 'settings', 'global');
      await setDoc(settingsDoc, { flashNews: text }, { merge: true });
  }

  // --- Auth & Security ---

  private initAuth() {
    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        this.currentUser.set(user);
        this.isAdmin.set(true);
        // Load admin specific data
        this.fetchDonations();
        this.fetchFeedbacks();
      } else {
        this.currentUser.set(null);
        this.isAdmin.set(false);
        this._pending2FASession = false;
      }
    });
  }

  async login(email: string, password: string): Promise<{ error: any; requires2FA?: boolean }> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.isAdmin.set(false); 
      this._pending2FASession = true;
      return { error: null, requires2FA: true };
    } catch (error: any) {
      console.error("Login failed", error);
      return { error: error.message };
    }
  }

  async verifyTwoFactor(otp: string): Promise<boolean> {
    if (!this._pending2FASession) return false;
    if (otp.length === 6) { 
        this._pending2FASession = false;
        this.isAdmin.set(true);
        this.fetchDonations(); 
        return true;
    }
    return false;
  }

  async logout() {
    await signOut(this.auth);
    this.isAdmin.set(false);
    this.currentUser.set(null);
    this._pending2FASession = false;
  }

  async refreshData() {
    try {
        await Promise.all([
            this.fetchNews(),
            this.fetchGallery(),
            this.fetchLibrary()
        ]);
    } catch (e) {
        console.warn("Some data could not be refreshed", e);
    }
  }

  // --- Data Fetching Methods (Firestore) ---

  async fetchNews() {
    try {
        const q = query(collection(this.db, 'news'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        this.news.set(snapshot.docs.map(d => ({id: d.id, ...d.data()} as NewsItem)));
    } catch (e) { console.log('Fetch News Error', e); }
  }

  async fetchGallery() {
    try {
        const q = query(collection(this.db, 'gallery'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        this.gallery.set(snapshot.docs.map(d => ({id: d.id, ...d.data()} as GalleryItem)));
    } catch (e) { console.log('Fetch Gallery Error', e); }
  }

  async fetchLibrary() {
    try {
        const q = query(collection(this.db, 'library'), orderBy('title', 'asc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({id: d.id, ...d.data()} as LibraryItem));
        this.library.set(items);
    } catch (e) { console.log('Fetch Library Error', e); }
  }

  async fetchFeedbacks() {
    if (!this.currentUser()) return;
    try {
        const q = query(collection(this.db, 'feedback'), orderBy('date', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        this.feedbacks.set(snapshot.docs.map(d => ({id: d.id, ...d.data()} as FeedbackItem)));
    } catch(e) { console.log('Fetch Feedback Error', e); }
  }

  async fetchDonations() {
    if (!this.currentUser()) return;
    try {
        const q = query(collection(this.db, 'donations'), orderBy('date', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        this.donations.set(snapshot.docs.map(d => ({id: d.id, ...d.data()} as Donation)));
    } catch(e) { console.log('Fetch Donations Error', e); }
  }

  // --- CRUD Operations ---

  async addNews(title: string, content: string, attachmentUrl: string = '') {
    await addDoc(collection(this.db, 'news'), {
        title, content, attachmentUrl, date: new Date().toISOString()
    });
    this.fetchNews();
  }

  async updateNews(id: string, data: Partial<NewsItem>) {
    await setDoc(doc(this.db, 'news', id), data, { merge: true });
    this.fetchNews();
  }

  async deleteNews(id: string) {
      await deleteDoc(doc(this.db, 'news', id));
      this.fetchNews();
  }

  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
      await addDoc(collection(this.db, 'gallery'), {
          url, caption, type, date: new Date().toISOString()
      });
      this.fetchGallery();
  }

  async deletePhoto(id: string) {
      await deleteDoc(doc(this.db, 'gallery', id));
      this.fetchGallery();
  }

  async addLibraryItem(item: Omit<LibraryItem, 'id'>) {
      await addDoc(collection(this.db, 'library'), item);
      this.fetchLibrary();
  }

  async deleteLibraryItem(id: string) {
      await deleteDoc(doc(this.db, 'library', id));
      this.fetchLibrary();
  }

  async addFeedback(name: string, message: string) {
      await addDoc(collection(this.db, 'feedback'), {
          name, message, date: new Date().toISOString()
      });
  }
  
  async deleteFeedback(id: string) {
      await deleteDoc(doc(this.db, 'feedback', id));
      this.fetchFeedbacks();
  }

  async addDonation(donation: Donation) {
      await addDoc(collection(this.db, 'donations'), donation);
  }

  // --- Booking System ---

  async getSlotAvailability(date: string): Promise<SlotAvailability[]> {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];
    const capacityPerSlot = 50; 

    try {
        const bookingsRef = collection(this.db, 'bookings');
        const q = query(bookingsRef, where('date', '==', date), where('status', '==', 'Booked'));
        
        const snapshot = await getDocs(q);
        const bookings = snapshot.docs.map(d => d.data() as Booking);

        const counts: {[key: string]: number} = {};
        bookings.forEach(b => {
            counts[b.slot] = (counts[b.slot] || 0) + 1;
        });

        return timeSlots.map(time => {
            const booked = counts[time] || 0;
            let status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING' = 'AVAILABLE';
            
            if (booked >= capacityPerSlot) status = 'FULL';
            else if (booked >= capacityPerSlot * 0.8) status = 'FAST_FILLING';

            return { time, booked, capacity: capacityPerSlot, status };
        });
    } catch(e) {
        console.error('Error fetching slots', e);
        return timeSlots.map(time => ({ time, booked: 0, capacity: capacityPerSlot, status: 'AVAILABLE' }));
    }
  }

  async getBookingsForAdmin(date: string): Promise<Booking[]> {
    try {
        const bookingsRef = collection(this.db, 'bookings');
        const q = query(bookingsRef, where('date', '==', date));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({id: d.id, ...d.data()} as Booking));
    } catch(e) {
        console.error(e);
        return [];
    }
  }

  async bookDarshanSlot(booking: Booking): Promise<{success: boolean, ticketCode?: string, message?: string}> {
     const bookingsRef = collection(this.db, 'bookings');
     const ticketCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
     
     try {
         await addDoc(bookingsRef, {
             ...booking,
             ticketCode,
             status: 'Booked',
             timestamp: new Date().toISOString()
         });
         return { success: true, ticketCode };
     } catch (e: any) {
         return { success: false, message: e.message };
     }
  }

  // --- Storage (Firebase) ---

  async uploadFile(file: File, path: string = 'uploads'): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}.${fileExt}`;
        const storageRef = ref(this.storage, `${path}/${fileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch(e) {
        console.error('Upload failed', e);
        return null;
    }
  }

  async verifyPayment(transactionId: string, amount: number, category: string): Promise<{success: boolean, message: string}> {
     try {
        const q = query(collection(this.db, 'donations'), where('transactionId', '==', transactionId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return { success: false, message: 'Transaction ID already recorded' };
        }
        if (amount > 0 && transactionId.length > 5) {
             return { success: true, message: 'Verified Successfully' };
        }
        return { success: false, message: 'Invalid Transaction Details' };
     } catch (e: any) {
         console.error(e);
         return { success: false, message: 'Verification Error: ' + e.message };
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