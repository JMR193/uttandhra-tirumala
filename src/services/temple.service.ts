import { Injectable, signal, computed } from '@angular/core';

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

export interface GalleryItem {
  id: number;
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
  id: number;
  type: 'audio' | 'ebook';
  title: string;
  url: string; // MP3 link or PDF link
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TempleService {
  // Admin State
  isAdmin = signal<boolean>(false);

  // Content State
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  
  news = signal<NewsItem[]>([
    { id: 1, title: 'Special Darshan Tickets Available', date: '2023-10-25', content: 'Online booking for special darshan for the upcoming festival is now open.' },
    { id: 2, title: 'Annual Brahmotsavam Dates Announced', date: '2023-10-20', content: 'The annual Brahmotsavam will commence from next month. Devotees are requested to plan accordingly.' },
    { id: 3, title: 'Temple Renovation Update', date: '2023-10-15', content: 'The renovation of the eastern Gopuram is nearing completion.' }
  ]);

  gallery = signal<GalleryItem[]>([
    { id: 7, url: 'https://yt3.googleusercontent.com/7y8KChJI_huixiWRFJGfK9-t5E3d7LMvZQN7QdJ2VHdTn8MIwFIH9Mohj0mKmaSGzWlns_ujRQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', caption: 'Temple Main Arch' },
    { id: 1, url: 'https://picsum.photos/id/10/800/600', caption: 'Temple Entrance at Sunrise' },
    { id: 2, url: 'https://picsum.photos/id/16/800/600', caption: 'Lush Green Gardens' },
    { id: 3, url: 'https://picsum.photos/id/28/800/600', caption: 'Evening Aarti' },
  ]);

  feedbacks = signal<FeedbackItem[]>([
    { id: 1, name: 'Srinivas Rao', message: 'A divine experience. Very well maintained.', date: '2023-10-24' }
  ]);

  donations = signal<Donation[]>([
    { id: '1', donorName: 'Venkata Ramana', category: 'Annadanam', amount: 1116, date: '2023-10-26', transactionId: 'TXN8839201' }
  ]);

  library = signal<LibraryItem[]>([
    { id: 1, type: 'audio', title: 'Suprabhatam', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', description: 'Morning invocation' },
    { id: 2, type: 'ebook', title: 'Temple History PDF', url: '#', description: 'Complete history of the temple construction.' }
  ]);

  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));

  // Actions
  login(password: string): boolean {
    if (password === 'admin') {
      this.isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAdmin.set(false);
  }

  updateFlashNews(text: string) {
    this.flashNews.set(text);
  }

  addNews(title: string, content: string) {
    const newItem: NewsItem = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString().split('T')[0]
    };
    this.news.update(items => [newItem, ...items]);
  }

  deleteNews(id: number) {
    this.news.update(items => items.filter(i => i.id !== id));
  }

  addPhoto(url: string, caption: string) {
    const newItem: GalleryItem = {
      id: Date.now(),
      url,
      caption
    };
    this.gallery.update(items => [newItem, ...items]);
  }

  deletePhoto(id: number) {
    this.gallery.update(items => items.filter(i => i.id !== id));
  }

  addFeedback(name: string, message: string) {
    const newItem: FeedbackItem = {
      id: Date.now(),
      name,
      message,
      date: new Date().toISOString().split('T')[0]
    };
    this.feedbacks.update(items => [newItem, ...items]);
  }

  addDonation(donation: Donation) {
    this.donations.update(items => [donation, ...items]);
  }

  addLibraryItem(item: Omit<LibraryItem, 'id'>) {
    const newItem = { ...item, id: Date.now() };
    this.library.update(items => [newItem, ...items]);
  }

  deleteLibraryItem(id: number) {
    this.library.update(items => items.filter(i => i.id !== id));
  }
}
