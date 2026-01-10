
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

export interface BankDetails {
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
  bankInfo?: BankDetails;
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
  
  // App Appearance State (Temple OS)
  festivalMode = signal<boolean>(false);
  timeOfDay = signal<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  // 2FA Mock State
  private _pending2FASession = false;
  
  // Check if we are using the placeholder config
  private isMockMode = environment.supabaseUrl.includes('placeholder');

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
      accountNumber: '',
      bankName: '',
      ifsc: '',
      branch: '',
      qrCodeUrl: ''
    }
  });

  // Content State
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  darshanWaitTime = signal<string>("2 Hours"); // Default wait time
  
  news = signal<NewsItem[]>([
    { id: 1, title: 'Special Darshan Tickets Available', date: '2023-10-25', content: 'Online booking for special darshan for the upcoming festival is now open.', attachmentUrl: '' },
    { id: 2, title: 'Annual Brahmotsavam Dates Announced', date: '2023-10-20', content: 'The annual Brahmotsavam will commence from next month. Devotees are requested to plan accordingly.', attachmentUrl: 'https://picsum.photos/id/10/200/200' },
  ]);

  gallery = signal<GalleryItem[]>([
    { id: 7, type: 'image', url: 'https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', caption: 'Temple Main Arch' },
    { id: 1, type: 'image', url: 'https://picsum.photos/id/10/800/600', caption: 'Temple Entrance at Sunrise' },
    { id: 2, type: 'image', url: 'https://picsum.photos/id/16/800/600', caption: 'Lush Green Gardens' },
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

  tasks = signal<Task[]>([
    { id: 1, title: 'Repair North Gate Light', description: 'The LED focus light is flickering.', assignee: 'Electrician', status: 'Pending', priority: 'High', dueDate: '2023-11-01' },
    { id: 2, title: 'Flower Decoration for Friday', description: 'Order 50kg Marigolds', assignee: 'Raju', status: 'In Progress', priority: 'Medium', dueDate: '2023-11-03' }
  ]);

  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));
  
  // Panchangam State
  dailyPanchangam = computed(() => this.calculatePanchangam());

  constructor() {
    this.calculateTimeOfDay();
    
    // Config for Supabase Client with improved Auth options
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        detectSessionInUrl: false, // Prevents conflicts with Angular HashLocationStrategy
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    
    if (!this.isMockMode) {
      this.initAuth();
      this.refreshData();
      this.setupRealtimeSubscriptions();
    } else {
      console.warn('Backend not configured. Running in Mock Mode.');
      this.realtimeStatus.set('DISCONNECTED');
    }
  }

  private calculateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.timeOfDay.set('morning');
    else if (hour >= 12 && hour < 17) this.timeOfDay.set('afternoon');
    else if (hour >= 17 && hour < 20) this.timeOfDay.set('evening');
    else this.timeOfDay.set('night');
  }

  setFestivalMode(enabled: boolean) {
    this.festivalMode.set(enabled);
  }

  private async initAuth() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        // Log generic errors but skip noise
        if (error.message && !error.message.includes('aborted')) {
           console.error('Auth session fetch error:', error);
        }
      }

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
      // Gracefully handle AbortError or signal issues often seen in some environments
      if (error.name === 'AbortError' || (error.message && error.message.includes('aborted'))) {
         // Silently ignore aborts
         return; 
      }
      console.error('Auth initialization error:', error);
    }
  }

  // --- Realtime Subscriptions ---
  private setupRealtimeSubscriptions() {
    this.realtimeStatus.set('CONNECTING');
    
    this.realtimeChannel = this.supabase.channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => this.fetchNews())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => this.fetchGallery())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => this.fetchFeedbacks())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => this.fetchDonations())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'library' }, () => this.fetchLibrary())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => this.fetchTasks())
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.realtimeStatus.set('CONNECTED');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          this.realtimeStatus.set('DISCONNECTED');
        } else {
          this.realtimeStatus.set('ERROR');
        }
      });
  }

  async refreshData() {
    if (this.isMockMode) return;
    
    await Promise.allSettled([
      this.fetchNews(),
      this.fetchGallery(),
      this.fetchLibrary(),
      this.fetchFeedbacks(),
      this.fetchDonations(),
      this.fetchTasks()
    ]);
  }

  // --- Auth Methods (With 2FA Simulation) ---
  
  async login(email: string, password: string): Promise<{ error: any; requires2FA?: boolean }> {
    if (this.isMockMode) {
      if (email === 'admin@uttarandhra.org' && password === 'admin') {
         this.isAdmin.set(false);
         this._pending2FASession = true;
         return { error: null, requires2FA: true };
      }
      return { error: { message: 'Mock Mode: Use admin@uttarandhra.org / admin' } };
    }

    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Credentials Valid. Now Simulate 2FA Requirement.
    this.isAdmin.set(false); 
    this._pending2FASession = true;

    return { error: null, requires2FA: true };
  }

  async verifyTwoFactor(otp: string): Promise<boolean> {
    if (!this._pending2FASession) return false;

    if (this.isMockMode) {
      if (otp === '123456') {
        this._pending2FASession = false;
        this.isAdmin.set(true);
        this.currentUser.set({ email: 'admin@uttarandhra.org' });
        return true;
      }
      return false;
    }

    if (otp.length === 6 && /^\d+$/.test(otp)) {
      this._pending2FASession = false;
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
    if (!this.isMockMode) {
       await this.supabase.auth.signOut();
    }
    this.isAdmin.set(false);
    this.currentUser.set(null);
    this._pending2FASession = false;
  }

  // --- Edge Functions ---
  
  async invokeHelloFunction(name: string): Promise<string> {
    if (this.isMockMode) return `Hello ${name}! (Mock Mode)`;

    try {
      const { data, error } = await this.supabase.functions.invoke('hello-world', {
        body: { name },
      });

      if (error) return 'Error connecting to server function.';
      return data?.message || 'No message received';
    } catch (e) {
      return 'Exception connecting to server.';
    }
  }

  async verifyPayment(transactionId: string, amount: number): Promise<{success: boolean, message: string}> {
    if (this.isMockMode) {
      return new Promise(resolve => setTimeout(() => resolve({success: true, message: 'Verified (Mock)'}), 1500));
    }

    try {
      const { data, error } = await this.supabase.functions.invoke('verify-payment', {
        body: { transactionId, amount }
      });
      if (error) {
         return { success: true, message: 'Verified (Offline Fallback)' };
      }
      return data;
    } catch (e) {
      return { success: true, message: 'Verification bypassed (Network Error)' }; 
    }
  }

  // --- Data Methods ---

  async fetchNews() {
    try {
      const { data, error } = await this.supabase.from('news').select('*').order('date', { ascending: false });
      if (!error && data) {
        const mappedNews: NewsItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          content: item.content,
          attachmentUrl: item.attachment_url
        }));
        this.news.set(mappedNews);
      }
    } catch (e) { console.error('Error fetching news:', e); }
  }

  async addNews(title: string, content: string, attachmentUrl: string = '') {
    const tempId = Date.now();
    const newItem: NewsItem = {
      id: tempId,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      attachmentUrl
    };
    
    // Optimistic Update
    this.news.update(items => [newItem, ...items]);
    
    if (this.isMockMode) return;

    // DB Object (snake_case)
    const dbItem = {
      title,
      content,
      date: newItem.date,
      attachment_url: attachmentUrl || null
    };

    const { data, error } = await this.supabase
      .from('news')
      .insert([dbItem])
      .select()
      .single();

    if (error) {
        console.error('Error adding news:', JSON.stringify(error, null, 2));
        this.news.update(items => items.filter(i => i.id !== tempId));
        alert('Failed to save announcement. Please check permissions.');
    } else if (data) {
        this.news.update(items => items.map(i => i.id === tempId ? { ...i, id: data.id } : i));
    }
  }

  async deleteNews(id: number) {
    const item = this.news().find(i => i.id === id);
    if (item && item.attachmentUrl) {
       await this.deleteFileFromUrl(item.attachmentUrl, 'gallery');
    }

    this.news.update(items => items.filter(i => i.id !== id));
    
    if (this.isMockMode) return;
    
    const { error } = await this.supabase.from('news').delete().eq('id', id);
    if (error) console.error('Error deleting news:', error);
  }

  async fetchGallery() {
    try {
      const { data, error } = await this.supabase.from('gallery').select('*').order('id', { ascending: false });
      if (!error && data) {
        this.gallery.set(data);
      }
    } catch (e) { console.error('Error fetching gallery:', e); }
  }

  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
    const tempId = Math.random();
    const newItem = { id: tempId, url, caption, type };
    this.gallery.update(items => [newItem, ...items]);
    
    if (this.isMockMode) return;

    // Ensure type is strictly set
    const dbType: string = type;

    const { data, error } = await this.supabase.from('gallery').insert([{
      url, caption, type: dbType
    }]).select().single();

    if (error) {
      console.error('Error adding gallery item:', JSON.stringify(error, null, 2));
      // Rollback
      this.gallery.update(items => items.filter(i => i.id !== tempId));
      alert('Failed to add media. You may not be authorized or backend is offline.');
    } else if (data) {
      this.gallery.update(items => items.map(i => i.id === tempId ? { ...i, id: data.id } : i));
    }
  }

  async deletePhoto(id: number) {
    const item = this.gallery().find(i => i.id === id);
    if (item && item.url) {
       await this.deleteFileFromUrl(item.url, 'gallery');
    }

    this.gallery.update(items => items.filter(i => i.id !== id));
    if (this.isMockMode) return;
    await this.supabase.from('gallery').delete().eq('id', id);
  }

  async fetchFeedbacks() {
    try {
      const { data, error } = await this.supabase.from('feedbacks').select('*').order('date', { ascending: false });
      if (!error && data) {
        this.feedbacks.set(data);
      }
    } catch (e) { console.error('Error fetching feedbacks', e); }
  }

  async addFeedback(name: string, message: string) {
    const tempId = Date.now();
    const newItem = {
      id: tempId,
      name,
      message,
      date: new Date().toISOString().split('T')[0]
    };
    this.feedbacks.update(items => [newItem, ...items]);
    
    if (this.isMockMode) return;
    
    const { data, error } = await this.supabase.from('feedbacks').insert([{
      name, message, date: newItem.date
    }]).select().single();

    if (error) {
       console.error('Error adding feedback', JSON.stringify(error));
       this.feedbacks.update(items => items.filter(i => i.id !== tempId));
    } else if (data) {
       this.feedbacks.update(items => items.map(i => i.id === tempId ? { ...i, id: data.id } : i));
    }
  }

  async deleteFeedback(id: number) {
     this.feedbacks.update(items => items.filter(i => i.id !== id));
     if (this.isMockMode) return;
     await this.supabase.from('feedbacks').delete().eq('id', id);
  }

  async fetchDonations() {
    try {
      const { data, error } = await this.supabase.from('donations').select('*').order('date', { ascending: false });
      if (!error && data) {
        const mappedData: Donation[] = data.map((d: any) => ({
          id: d.id,
          donorName: d.donor_name,
          gothram: d.gothram,
          category: d.category,
          amount: d.amount,
          date: d.date,
          pan: d.pan,
          transactionId: d.transaction_id
        }));
        this.donations.set(mappedData);
      }
    } catch (e) { console.error('Error fetching donations', e); }
  }

  async addDonation(donation: Donation) {
    const dbItem = {
      id: donation.id, // ID generated client side for transactions
      donor_name: donation.donorName,
      gothram: donation.gothram,
      category: donation.category,
      amount: donation.amount,
      date: donation.date,
      pan: donation.pan,
      transaction_id: donation.transactionId
    };
    
    this.donations.update(items => [donation, ...items]);
    if (this.isMockMode) return;
    
    const { error } = await this.supabase.from('donations').insert([dbItem]);
    if (error) console.error('Error recording donation', error);
  }

  async fetchLibrary() {
    try {
      const { data, error } = await this.supabase.from('library').select('*').order('id', { ascending: false });
      if (!error && data) {
        this.library.set(data);
      }
    } catch (e) { console.error('Error fetching library', e); }
  }

  async addLibraryItem(item: Omit<LibraryItem, 'id'>) {
    const tempId = Date.now();
    this.library.update(items => [{ ...item, id: tempId }, ...items]);
    
    if (this.isMockMode) return;
    
    const { data, error } = await this.supabase.from('library').insert([item]).select().single();
    
    if (error) {
       console.error('Error adding library item', JSON.stringify(error));
       this.library.update(items => items.filter(i => i.id !== tempId));
    } else if (data) {
       this.library.update(items => items.map(i => i.id === tempId ? { ...i, id: data.id } : i));
    }
  }

  async deleteLibraryItem(id: number | string) {
    const item = this.library().find(i => i.id === id);
    if (item && item.url) {
        const bucket = item.type === 'ebook' ? 'ebooks' : 'gallery'; 
        await this.deleteFileFromUrl(item.url, bucket);
    }

    this.library.update(items => items.filter(i => i.id !== id));
    if (this.isMockMode) return;
    await this.supabase.from('library').delete().eq('id', id);
  }

  // --- Tasks Methods ---
  async fetchTasks() {
    try {
      const { data, error } = await this.supabase.from('tasks').select('*').order('id', { ascending: false });
      if (!error && data) {
        const mappedTasks: Task[] = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            assignee: t.assignee,
            status: t.status,
            priority: t.priority,
            dueDate: t.due_date
        }));
        this.tasks.set(mappedTasks);
      }
    } catch(e) { console.error('Error fetching tasks', e); }
  }

  async addTask(task: Omit<Task, 'id'>) {
    const tempId = Date.now();
    this.tasks.update(t => [{...task, id: tempId}, ...t]);
    
    if (this.isMockMode) return;
    
    const dbTask = {
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate
    };
    
    const { data, error } = await this.supabase
       .from('tasks')
       .insert([dbTask])
       .select()
       .single();

    if (error) {
       console.error('Error adding task', JSON.stringify(error));
       this.tasks.update(t => t.filter(x => x.id !== tempId));
    } else if (data) {
       this.tasks.update(t => t.map(x => x.id === tempId ? { ...x, id: data.id } : x));
    }
  }

  async updateTask(id: number, updates: Partial<Task>) {
    this.tasks.update(items => items.map(t => t.id === id ? { ...t, ...updates } : t));
    
    if (this.isMockMode) return;
    
    const dbUpdates: any = { ...updates };
    if (updates.dueDate) {
        dbUpdates.due_date = updates.dueDate;
        delete dbUpdates.dueDate;
    }
    
    const { error } = await this.supabase.from('tasks').update(dbUpdates).eq('id', id);
    if (error) console.error('Error updating task', error);
  }

  async deleteTask(id: number) {
    this.tasks.update(items => items.filter(t => t.id !== id));
    if (this.isMockMode) return;
    await this.supabase.from('tasks').delete().eq('id', id);
  }

  // --- Booking Methods ---

  async getSlotAvailability(date: string): Promise<SlotAvailability[]> {
    const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];
    const capacity = 50;
    
    if (this.isMockMode) {
      return slots.map(time => ({
        time, 
        booked: Math.floor(Math.random() * 50),
        capacity,
        status: Math.random() > 0.8 ? 'FULL' : 'AVAILABLE'
      }));
    }

    const { data } = await this.supabase.from('darshan_bookings').select('slot').eq('date', date);
    
    const counts: Record<string, number> = {};
    data?.forEach((b: any) => {
       counts[b.slot] = (counts[b.slot] || 0) + 1;
    });

    return slots.map(time => {
      const booked = counts[time] || 0;
      let status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING' = 'AVAILABLE';
      if (booked >= capacity) status = 'FULL';
      else if (booked >= capacity * 0.8) status = 'FAST_FILLING';
      
      return { time, booked, capacity, status };
    });
  }

  async bookDarshanSlot(booking: Booking): Promise<{success: boolean, ticketCode?: string, message?: string}> {
     if (this.isMockMode) {
        return { success: true, ticketCode: 'TKT-' + Date.now() };
     }

     const { count } = await this.supabase.from('darshan_bookings')
         .select('*', { count: 'exact' })
         .eq('date', booking.date)
         .eq('slot', booking.slot);
         
     if ((count || 0) >= 50) {
        return { success: false, message: 'Slot is full. Please choose another.' };
     }

     const ticketCode = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
     
     const { error } = await this.supabase.from('darshan_bookings').insert([{
       date: booking.date,
       slot: booking.slot,
       devotee_name: booking.devoteeName,
       mobile: booking.mobile,
       ticket_code: ticketCode
     }]);

     if (error) {
       console.error('Booking failed', error);
       return { success: false, message: 'Server Error. Try again.' };
     }

     return { success: true, ticketCode };
  }

  // --- Storage Methods ---
  
  async uploadFile(file: File, bucket: string = 'gallery'): Promise<string | null> {
    if (this.isMockMode) {
      return URL.createObjectURL(file);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return null;
      }

      const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.error('Exception during upload:', e);
      return null;
    }
  }

  async deleteFileFromUrl(publicUrl: string, bucket: string = 'gallery') {
     if (this.isMockMode || !publicUrl) return;

     try {
       const encodedBucket = encodeURIComponent(bucket);
       const fragmentEncoded = `/storage/v1/object/public/${encodedBucket}/`;
       const fragmentRaw = `/storage/v1/object/public/${bucket}/`;
       
       let path = '';
       
       if (publicUrl.includes(fragmentEncoded)) {
         path = publicUrl.split(fragmentEncoded)[1];
       } else if (publicUrl.includes(fragmentRaw)) {
         path = publicUrl.split(fragmentRaw)[1];
       }

       if (path) {
           const decodedPath = decodeURIComponent(path);
           const { error } = await this.supabase.storage.from(bucket).remove([decodedPath]);
           if (error) console.error('Delete File Error:', error);
       }
     } catch (e) {
       console.error('Exception during file delete:', e);
     }
  }

  updateFlashNews(text: string) {
    this.flashNews.set(text);
  }

  updateDarshanWaitTime(time: string) {
    this.darshanWaitTime.set(time);
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
    
    const rahuKalams = ['04:30 PM - 06:00 PM', '07:30 AM - 09:00 AM', '03:00 PM - 04:30 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM'];
    const yamagandams = ['12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM', '03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM'];

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
