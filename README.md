# Khet2Cart (खेत से सीधा कार्ट तक)
> **Direct Farm-to-Consumer Agricultural Commerce Platform**

Khet2Cart eliminates extortionate intermediaries in agricultural supply chains by providing a direct digital marketplace connecting local farmers directly with consumers. 

---

## 1. Value Proposition & Core Concept
- **Problem**: Traditional 4–5 tier intermediary chains (Village Trader → APMC Wholesaler → Commission Agent → Sub-Distributor → Retailer) strip 50%+ of market value, resulting in depressed farmer earnings and inflated consumer prices.
- **Khet2Cart Solution**: Direct Farm-to-Table connection where 100% of produce price goes directly into farmer accounts, while consumers pay lower prices for fresher (<12h harvested) produce.

### Illustrative Value Comparison (Demo Figures)
| Model | Farmer Receives | Consumer Pays | Middlemen Cut | Transparency | Freshness |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Traditional Chain** | ₹20/kg | ₹40/kg | ₹20/kg (50%) | Opaque | 3-5 days in transit |
| **Khet2Cart Direct** | **₹30/kg (+50%)** | **₹34/kg (-15%)** | **₹0 (0%)** | **100% Direct** | **<12h Harvest** |

*Note: The values above are illustrative demo values representing typical agricultural market dynamics.*

---

## 2. Multi-Regional Indian Language Support
Khet2Cart supports 8 official Indian languages with comprehensive UI translation dictionaries:
1. **English** (`en`)
2. **Hindi / हिन्दी** (`hi` - default when browser language is Hindi)
3. **Marathi / मराठी** (`mr`)
4. **Gujarati / ગુજરાતી** (`gu`)
5. **Punjabi / ਪੰਜਾਬੀ** (`pa`)
6. **Tamil / தமிழ்** (`ta`)
7. **Telugu / తెలుగు** (`te`)
8. **Bengali / বাংলা** (`bn`)

Language preference persists in `localStorage` across user sessions.

---

## 3. Technology Stack & Architecture

```
User (Browser)
      ↓
React + Vite + Tailwind CSS + Lucide Icons + Motion
      ↓
Centralized API Service Layer (`src/services/api.ts`)
      ↓
REST API (`/api/*`)
      ↓
Full-Stack Server (`server.ts` with Vite Middlewares) / FastAPI Backend (`backend/`)
      ↓
JWT Authentication & Role Protection (Consumer / Farmer / Admin)
      ↓
Persistent Database (`data/khet2cart_db.json` / SQLite `khet2cart.db`)
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend**: Express + TSX full-stack server mounted on port 3000 in unified preview; FastAPI + SQLAlchemy ORM backend files in `backend/` for standalone Python environments.
- **Persistence**: Relational JSON file storage (`data/khet2cart_db.json`) initialized automatically with 10+ farmers, 30+ products, 10+ consumers, and demo orders.

---

## 4. Demo Accounts (1-Click Instant Login)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Consumer** | `consumer@demo.com` | `demo123` | Pooja Agrawal (Vijay Nagar, Indore) |
| **Farmer** | `farmer@demo.com` | `demo123` | Ramesh Patidar (Sanwer, 8.5 Acres) |
| **Admin** | `admin@demo.com` | `admin123` | Platform Superintendent |

---

## 5. Hackathon Demonstration Flow
1. **Open Khet2Cart**: Landing page loads with live harvest ticker and trust indicators.
2. **Select Hindi**: Switch language to हिन्दी in the top bar to verify translation of all UI cards, buttons, and badges.
3. **Select Location**: Verify location selector ("Deliver to: Indore", "Bhopal", etc.).
4. **Marketplace & Filters**: Browse fresh produce, filter by category or organic produce, sort by nearest distance.
5. **Product Detail**: Click on **Farm Fresh Desi Tomatoes (देसी टमाटर)**; verify farmer info and *"Farmer receives ₹34 from your ₹34 purchase"* USP note.
6. **Add to Cart & Checkout**: Add 2 kg, open cart, choose Home Delivery or Farm Pickup, and complete simulated payment.
7. **Order Tracking**: Order ID generated (e.g. `K2C-XXXX`), progress tracker displays the 5 lifecycle stages with the animated route.
8. **Farmer Login**: Click Logout → Login as **Farmer (Ramesh Patidar)**.
9. **Accept Order & Mark Prepared**: Go to Farmer Dashboard → Orders → Click "Accept Order" then "Mark Produce Prepared".
10. **Earnings Calculator**: Open the Earnings Calculator to simulate middleman-free profits for various crops.

---

## 6. Local Setup & Running Commands

### Frontend & Full-Stack Node Server
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Port 3000)
npm run dev

# 3. Build for production
npm run build
```

### Standalone Python FastAPI Backend (Optional)
```bash
# 1. Install Python requirements
pip install -r requirements.txt

# 2. Start FastAPI with uvicorn
uvicorn backend.main:app --reload --port 8000
```
