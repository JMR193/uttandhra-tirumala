# Uttarandhra Tirumala (Uttandratirumala) - Temple Management System

An advanced, full-stack Temple Management System built for **Shri Venkateswara Swamy Temple, Pendurthi**, widely revered as **Uttarandhra Tirumala**. This application serves as a digital gateway for devotees to book darshan, make donations (E-Hundi), view the digital library, perform virtual Arathi, and access daily temple updates, while providing a robust CMS for temple administrators.

## 🚀 Technology Stack

- **Frontend Framework**: Angular v19+ (Standalone Components, Signals, Zoneless Change Detection).
- **Styling**: Tailwind CSS (Utility-first CSS).
- **Backend / Database**: 
  - **Firebase** (Realtime Firestore, Auth, Storage).
  - **Supabase** (PostgreSQL, Auth, Storage).
- **AI & 3D**: 
  - **Google Gemini API** (Digital Sahayak AI Chatbot).
  - **Three.js** (3D Digital Darshan with interactive animations).
- **Visualization**: D3.js (Admin Dashboard Charts).
- **Icons**: Heroicons (SVG).
- **Routing**: Angular Router (Hash Location Strategy).

## ✨ Features

### 🕉️ For Devotees (Public Interface)
*   **Hero Dashboard**: Immersive landing page with a scrolling news ticker, daily Panchangam (Almanac), and official media links.
*   **3D Digital Darshan**: 
    *   Interactive 3D idol of the deity.
    *   Perform virtual **Harathi** and **Pushpanjali** (Flower Rain).
    *   Adjustable camera angles (Netra Darshanam, Pada Darshanam).
*   **AI Digital Sahayak**: 
    *   Conversational AI assistant powered by **Gemini 2.5 Flash**.
    *   Answers queries about timings, history, and booking procedures in natural language.
*   **Special Entry Darshan Booking**:
    *   Calendar-based slot selection with real-time capacity management.
    *   Form validation for pilgrim details.
    *   **Digital Ticket Generation**: Instant printable ticket with a QR code for entry verification.
*   **E-Hundi (Donations)**:
    *   Support for Online Payment Gateway simulation and Direct Bank Transfer/UPI.
    *   Instant digital receipt generation with transaction details.
    *   Categories: Hundi, Annadanam, Gosala, Saswatha Puja, Construction Fund.
*   **Digital Library**: Access to devotional audio tracks (MP3) and spiritual E-Books (PDF) with offline caching.
*   **Gallery**: Media gallery supporting high-res images and YouTube video embeds.
*   **History & Info**: Detailed temple timeline, architecture info, and visiting hours.
*   **Global Audio Player**: Persistent background chanting (*Om Namo Venkatesaya*) with toggle controls.

### 🛡️ For Administrators (CMS)
*   **Secure Authentication**: Email/Password login with simulated Two-Factor Authentication (2FA).
*   **Dashboard**:
    *   Real-time statistics (Donations, News count, Pending Tasks).
    *   Data visualization.
*   **Content Management**:
    *   **Announcements**: Rich Text Editor for posting news with file attachments.
    *   **Gallery Management**: Upload images/videos directly to Cloud Storage.
    *   **Library Management**: Add/Remove audio and PDF resources.
*   **Site Configuration**: Dynamic control over Temple Name, Logos, Contact Info, Daily Panchangam image, and Bank QR codes.
*   **Donation Reports**: Filterable ledger of all transactions.

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/uttandratirumala.git
    cd uttandratirumala
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    The app comes with a pre-configured `src/environments/environment.ts`. 
    
### 🗄️ Supabase Setup
To initialize the backend:
1.  Go to your Supabase Project Dashboard.
2.  Open the **SQL Editor**.
3.  Copy the contents of `supabase_schema.sql` from the project root.
4.  Run the query to create all required tables and policies.
5.  Create a storage bucket named `temple-assets` (Public) in the Storage section.

4.  **Run the application**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 📂 Project Structure

```
src/
├── app.component.ts         # Main layout, Global Audio, Header/Footer
├── components/              # Feature-specific pages
│   ├── admin.component.ts   # CMS, Dashboard, Auth, Editors
│   ├── booking.component.ts # Slot selection, Ticket generation
│   ├── chat.component.ts    # Gemini AI Chatbot
│   ├── digital-darshan.ts   # Three.js 3D View
│   ├── ehundi.component.ts  # Donation forms, Receipt generation
│   ├── gallery.component.ts # Media grid
│   ├── history.component.ts # Static info pages
│   ├── home.component.ts    # Landing page, Panchangam widget
│   └── ...
├── services/
│   └── temple.service.ts    # Firebase/Supabase Clients, State Signals
└── environments/            # API Keys and Config
```

## 🔮 Future Upgrades

### 1. Payment Gateway Integration
*   Integrate **Razorpay** or **Stripe** API for real-time payment processing for bookings and donations.

### 2. WhatsApp API Automation
*   Automatically send Booking Tickets and Donation Receipts to the devotee's WhatsApp number.

### 3. Progressive Web App (PWA) Enhancements
*   Enable push notifications for temple events and festivals.

## 📄 License

This project is licensed under the MIT License.