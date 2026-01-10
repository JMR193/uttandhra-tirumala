
# Uttarandhra Tirupati - Temple Management System

An advanced, full-stack Temple Management System built for **Shri Venkateswara Swamy Temple, Pendurthi**. This application serves as a digital gateway for devotees to book darshan, make donations (E-Hundi), view the digital library, and access daily temple updates, while providing a robust CMS for temple administrators.

## 🚀 Technology Stack

- **Frontend Framework**: Angular v18+ (Standalone Components, Signals, Zoneless Change Detection).
- **Styling**: Tailwind CSS (Utility-first CSS).
- **Backend / Database**: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions).
- **Visualization**: D3.js (Admin Dashboard Charts).
- **Icons**: Heroicons (SVG).
- **Routing**: Angular Router (Hash Location Strategy).
- **Hosting**: Firebase Hosting.

## ✨ Features

### 🕉️ For Devotees (Public Interface)
*   **Hero Dashboard**: Immersive landing page with a scrolling news ticker, daily Panchangam (Almanac), and official media links.
*   **Special Entry Darshan Booking**:
    *   Calendar-based slot selection with real-time capacity management.
    *   Form validation for pilgrim details.
    *   **Digital Ticket Generation**: Instant printable ticket with a QR code for entry verification.
*   **E-Hundi (Donations)**:
    *   Support for Online Payment Gateway simulation and Direct Bank Transfer/UPI.
    *   Instant digital receipt generation with transaction details.
    *   Categories: Hundi, Annadanam, Gosala, Saswatha Puja, Construction Fund.
*   **Digital Library**: Access to devotional audio tracks (MP3) and spiritual E-Books (PDF).
*   **Gallery**: Media gallery supporting high-res images and YouTube video embeds.
*   **History & Info**: Detailed temple timeline, architecture info, and visiting hours.
*   **Global Audio Player**: Persistent background chanting (*Om Namo Venkatesaya*) with toggle controls.

### 🛡️ For Administrators (CMS)
*   **Secure Authentication**: Email/Password login with simulated Two-Factor Authentication (2FA).
*   **Dashboard**:
    *   Real-time statistics (Donations, News count, Pending Tasks).
    *   Data visualization (Bar charts & Pie charts using D3.js).
    *   Server Health Check (Edge Function ping).
*   **Content Management**:
    *   **Announcements**: Rich Text Editor for posting news with file attachments.
    *   **Gallery Management**: Upload images/videos directly to Cloud Storage.
    *   **Library Management**: Add/Remove audio and PDF resources.
*   **Task Manager**: Kanban-style task tracking for temple staff (Maintenance, Decor, etc.).
*   **Site Configuration**: Dynamic control over Temple Name, Logos, Contact Info, Daily Panchangam image, and Bank QR codes.
*   **Donation Reports**: Filterable ledger of all transactions.

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   Firebase CLI (`npm install -g firebase-tools`)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/uttarandhra-tirupati.git
    cd uttarandhra-tirupati
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    The app comes with a pre-configured `src/environments/environment.ts`. To use your own backend:
    *   Create a project on [Supabase](https://supabase.com).
    *   Run the provided SQL scripts (see `schema.sql` if available, or infer from `temple.service.ts`) to create tables: `news`, `gallery`, `feedbacks`, `donations`, `library`, `tasks`, `darshan_bookings`.
    *   Update `supabaseUrl` and `supabaseKey` in `src/environments/environment.ts`.

4.  **Run the application**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

### Deployment to Firebase

1.  **Login to Firebase**:
    ```bash
    firebase login
    ```

2.  **Initialize Project** (if not already done):
    ```bash
    firebase init
    ```
    - Select **Hosting**.
    - Select your Firebase project.
    - Public directory: `dist/uttarandhra-tirupati`
    - Configure as single-page app: **Yes**

3.  **Deploy**:
    ```bash
    npm run deploy
    ```
    This command builds the Angular app and deploys it to Firebase Hosting.

## 📂 Project Structure

```
src/
├── app.component.ts         # Main layout, Global Audio, Header/Footer
├── components/              # Feature-specific pages
│   ├── admin.component.ts   # CMS, Dashboard, Auth, Editors
│   ├── booking.component.ts # Slot selection, Ticket generation
│   ├── ehundi.component.ts  # Donation forms, Receipt generation
│   ├── gallery.component.ts # Media grid
│   ├── history.component.ts # Static info pages
│   ├── home.component.ts    # Landing page, Panchangam widget
│   └── ...
├── services/
│   └── temple.service.ts    # Supabase Client, State Signals, Data Logic
└── environments/            # API Keys and Config
```

## 🔮 Roadmap & Future Upgrades

This project is designed to be scalable. Below are the planned features for the next version (v2.0):

### 1. Payment Gateway Integration
*   **Current State**: Simulated online payment/verification via Edge Functions.
*   **Upgrade**: Integrate **Razorpay** or **Stripe** API for real-time payment processing for bookings and donations.

### 2. WhatsApp API Automation
*   **Feature**: Automatically send Booking Tickets and Donation Receipts to the devotee's WhatsApp number using the Meta Business API.

### 3. Progressive Web App (PWA)
*   **Feature**: Enable "Add to Home Screen" functionality, offline access to the Audio Library, and caching of static assets for faster load times in low-network areas.

### 4. Advanced Admin Roles
*   **Current State**: Single Super Admin.
*   **Upgrade**: Role-Based Access Control (RBAC).
    *   *Finance Admin*: View Donations only.
    *   *Content Editor*: Manage News/Gallery only.
    *   *Volunteer*: View Tasks only.

### 5. Virtual Queue Management (Sarva Darshan)
*   **Feature**: A token-based system for free darshan to manage crowd flow during festivals. Users get an estimated wait time and a digital token.

### 6. Multi-Language Support (i18n)
*   **Feature**: Toggle between **English**, **Telugu**, and **Hindi** for broader accessibility using Angular i18n.

### 7. Seva & Accommodation Booking
*   **Feature**: Expand the booking engine to support room bookings (Choultries) and specific Sevas (Kalyanotsavam, Unjal Seva) with inventory management.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
