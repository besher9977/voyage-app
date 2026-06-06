import React, { useState, useMemo, createContext, useContext } from 'react';
import { 
  Compass, Calendar, Car, ShieldCheck, Heart, Search, Filter, 
  ChevronDown, ChevronUp, Star, MapPin, Clock, AlertCircle, 
  CheckCircle, ArrowRight, ShoppingBag, Trash2, HelpCircle, PhoneCall
} from 'lucide-react';

// ============================================================================
// 1. GLOBAL STATE & ARCHITECTURAL UTILITIES (Persistent State Pattern)
// ============================================================================

// Global GlobalFilterContext to prevent state erasure across verticals
const FilterContext = createContext();

const initialMockDestinations = [
  { id: 'd1', title: 'Amalfi Coast', country: 'Italy', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80', tag: 'Romantic', rating: 4.9, match: 98 },
  { id: 'd2', title: 'Kyoto Temples', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', tag: 'Cultural', rating: 4.8, match: 95 },
  { id: 'd3', title: 'Reykjavík Aurora', country: 'Iceland', image: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&q=80', tag: 'Adventure', rating: 4.7, match: 92 },
];

const initialMockHotels = [
  { id: 'h1', name: 'The Emerald Cliff Sanctuary', location: 'Amalfi Coast', rating: 4.9, reviews: 142, basePrice: 450, taxFee: 85, resortFee: 40, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', amenities: ['Infinity Pool', 'Private Beach', 'Michelin Rest.'] },
  { id: 'h2', name: 'Palazzo Sand & Stone', location: 'Amalfi Coast', rating: 4.7, reviews: 98, basePrice: 320, taxFee: 60, resortFee: 25, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80', amenities: ['Spa & Wellness', 'Rooftop Terrace', 'Free Shuttle'] },
];

const initialMockCars = [
  { id: 'c1', model: 'Porsche Taycan 4S', type: 'Electric Sport', company: 'AeroDrive Premium', rating: 4.9, basePrice: 180, structuralTax: 35, localSurcharge: 15, image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80', features: ['93 kWh Battery', 'Autonomous Highway Assist', 'Chauffeur Delivery'] },
  { id: 'c2', model: 'Range Rover HSE', type: 'Luxury SUV', company: 'Apex Elite Rentals', rating: 4.8, basePrice: 150, structuralTax: 30, localSurcharge: 12, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', features: ['All-Terrain Mode', 'Panoramic Roof', 'Exploration Kit'] },
];

export function FilterProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('Amalfi Coast');
  const [dates, setDates] = useState({ start: '2026-07-12', end: '2026-07-19' });
  const [guests, setGuests] = useState(2);
  
  // Persistent global filter states to avoid legacy data wipes
  const [hotelFilters, setHotelFilters] = useState({ minRating: 4.5, maxBudget: 600 });
  const [carFilters, setCarFilters] = useState({ electricOnly: false, maxBudget: 300 });
  
  // Cart cross-vertical orchestration state
  const [cart, setCart] = useState({ hotel: null, car: null, itineraryDays: [] });

  const resetCart = () => setCart({ hotel: null, car: null, itineraryDays: [] });

  return (
    <FilterContext.Provider value={{
      searchQuery, setSearchQuery, dates, setDates, guests, setGuests,
      hotelFilters, setHotelFilters, carFilters, setCarFilters, cart, setCart, resetCart
    }}>
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook to access persistent application architecture layer
const useVoyageCore = () => useContext(FilterContext);

// ============================================================================
// 2. STYLES & DESIGN SYSTEM INJECTOR (Premium Emerald & Sand Palette)
// ============================================================================
const designSystemStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  
  :root {
    --emerald-primary: #0F3A20;
    --emerald-hover: #0a2916;
    --emerald-light: #e7f0eb;
    --sand-bg: #F9F6F0;
    --sand-card: #FFFFFF;
    --amber-gold: #D4AF37;
    --charcoal: #1A1A1A;
    --muted-gray: #71717A;
    --border-light: #E4E4E7;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--sand-bg);
    color: var(--charcoal);
    margin: 0;
    padding: 0;
  }

  .premium-blur {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// ============================================================================
// 3. REUSABLE ATOM COMPONENTS (Micro-interactions & All-Inclusive Pricing)
// ============================================================================

function PriceDisplayCard({ base, tax, resort, label = "Total Price" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const grandTotal = base + tax + resort;

  return (
    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs tracking-wider text-stone-500 block uppercase font-semibold">{label}</span>
          <span className="text-2xl font-bold text-emerald-900">${grandTotal}<span className="text-sm font-normal text-stone-500">/all-in</span></span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          {isExpanded ? 'Hide Breakdown' : 'View Taxes'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-stone-300 text-sm space-y-1.5 text-stone-600 animate-fade-in-up">
          <div className="flex justify-between">
            <span>Base rate / Standard fare</span>
            <span>${base}</span>
          </div>
          <div className="flex justify-between">
            <span>Structural Taxes & VAT</span>
            <span>${tax}</span>
          </div>
          {resort > 0 && (
            <div className="flex justify-between">
              <span>Mandatory Resort/Facility Fees</span>
              <span>${resort}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-emerald-900 pt-1 border-t border-stone-200">
            <span>Guaranteed Settlement Price</span>
            <span>${grandTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. VERTICAL MODULES & VIEWS
// ============================================================================

// --- VIEW 1: DISCOVERY HUB ---
function DiscoveryHub({ onNavigate }) {
  const { searchQuery, setSearchQuery } = useVoyageCore();
  const [activeRecommendationTag, setActiveRecommendationTag] = useState('All');

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Brand Section */}
      <div className="relative rounded-3xl overflow-hidden bg-emerald-950 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_1px]"></div>
        <div className="relative max-w-xl space-y-4">
          <span className="bg-amber-500/20 text-amber-400 font-medium px-3 py-1 rounded-full text-xs uppercase tracking-widest border border-amber-500/30">
            AI-Driven Concierge Active
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Seamless Journeys. <br/>
            <span className="text-amber-400">Absolute Transparency.</span>
          </h1>
          <p className="text-stone-300 text-sm md:text-base">
            Eliminate fragmented booking systems. Plan absolute execution across high-end hotels, performance rentals, and hyper-personalized itineraries.
          </p>
        </div>
      </div>

      {/* Global Interactive Search Bar */}
      <div className="bg-white shadow-xl rounded-2xl p-4 -mt-14 relative z-10 border border-stone-100 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-200">
          <MapPin className="text-emerald-700 shrink-0" size={20} />
          <div className="w-full">
            <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Destination</label>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent font-medium text-stone-800 w-full focus:outline-none text-sm"
              placeholder="Where are we venturing?"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-200">
          <Calendar className="text-emerald-700 shrink-0" size={20} />
          <div>
            <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Timeline Windows</label>
            <span className="text-sm font-medium text-stone-800">July 12 – July 19, 2026</span>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('search')}
          className="bg-emerald-900 text-white rounded-xl py-3.5 px-6 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-950 transition-all shadow-md active:scale-95"
        >
          <Search size={18} />
          Search Verticals
        </button>
      </div>

      {/* AI Recommendation Engine Engine Pills */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-950">Curated For Your Profile</h2>
            <p className="text-xs text-stone-500">Derived from implicit tracking metrics and historical preferences</p>
          </div>
          <span className="text-xs text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
            <Compass size={14} /> Engine v2.4
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Romantic', 'Cultural', 'Adventure', 'Wellness'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveRecommendationTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeRecommendationTag === tag 
                  ? 'bg-emerald-900 text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Destination Recommendation Output */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {initialMockDestinations
            .filter(d => activeRecommendationTag === 'All' || d.tag === activeRecommendationTag)
            .map((dest) => (
              <div key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-100 group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-emerald-950/80 premium-blur text-white font-medium text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {dest.rating}
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-emerald-950 font-bold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                    {dest.match}% Autonomous Match
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-xs text-stone-400 font-medium">{dest.country}</span>
                    <h3 className="font-bold text-lg text-emerald-950">{dest.title}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {dest.tag} Track
                    </span>
                    <button 
                      onClick={() => { setSearchQuery(dest.title); onNavigate('search'); }}
                      className="text-xs font-bold text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Initialize Plan <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- VIEW 2: UNIFIED MULTI-VERTICAL SEARCH MODULE ---
function UnifiedSearchModule({ onNavigate }) {
  const { searchQuery, hotelFilters, setHotelFilters, carFilters, setCarFilters, cart, setCart } = useVoyageCore();
  const [activeTab, setActiveTab] = useState('hotels');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Persistent processing of datasets against state constraints
  const filteredHotels = useMemo(() => {
    return initialMockHotels.filter(h => 
      h.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      h.rating >= hotelFilters.minRating &&
      (h.basePrice + h.taxFee + h.resortFee) <= hotelFilters.maxBudget
    );
  }, [searchQuery, hotelFilters]);

  const filteredCars = useMemo(() => {
    return initialMockCars.filter(c => 
      (!carFilters.electricOnly || c.type.includes('Electric')) &&
      (c.basePrice + c.structuralTax + c.localSurcharge) <= carFilters.maxBudget
    );
  }, [carFilters]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Target Route Metadata Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-stone-200 gap-4">
        <div>
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Active Search Corridor</span>
          <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
            <MapPin size={18} className="text-amber-500" /> {searchQuery || "Global Matrix"}
          </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full md:w-auto"
          >
            <Filter size={16} /> Filters Global Stack
          </button>
        </div>
      </div>

      {/* Dynamic Drawer Component for Filter Mutation without State Wiping */}
      {showFilterDrawer && (
        <div className="bg-white border border-emerald-900/20 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <h4 className="font-bold text-emerald-950 text-sm border-b pb-1.5 border-stone-100 flex items-center gap-2">
              Hotel Architecture Restrictions
            </h4>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1">Minimum Rating Matrix ({hotelFilters.minRating}★)</label>
              <input 
                type="range" min="4.0" max="5.0" step="0.1" 
                value={hotelFilters.minRating} 
                onChange={(e) => setHotelFilters({...hotelFilters, minRating: parseFloat(e.target.value)})}
                className="w-full accent-emerald-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1">Max All-In Caps (${hotelFilters.maxBudget})</label>
              <input 
                type="range" min="300" max="1000" step="50" 
                value={hotelFilters.maxBudget} 
                onChange={(e) => setHotelFilters({...hotelFilters, maxBudget: parseInt(e.target.value)})}
                className="w-full accent-emerald-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-emerald-950 text-sm border-b pb-1.5 border-stone-100 flex items-center gap-2">
              Logistics & Fleet Strategy
            </h4>
            <div className="flex items-center justify-between py-2">
              <label className="text-xs font-semibold text-stone-500 cursor-pointer" htmlFor="electric-toggle">Restrict to Next-Gen Electric (EV)</label>
              <input 
                id="electric-toggle"
                type="checkbox" 
                checked={carFilters.electricOnly} 
                onChange={(e) => setCarFilters({...carFilters, electricOnly: e.target.checked})}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-800 accent-emerald-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1">Max All-In Daily Fleet Cap (${carFilters.maxBudget})</label>
              <input 
                type="range" min="150" max="500" step="25" 
                value={carFilters.maxBudget} 
                onChange={(e) => setCarFilters({...carFilters, maxBudget: parseInt(e.target.value)})}
                className="w-full accent-emerald-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Concurrent Vertical Strategy Toggle Tabs */}
      <div className="flex border-b border-stone-200">
        <button 
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'hotels' ? 'border-emerald-900 text-emerald-900' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Compass size={16} /> Premium Accommodations ({filteredHotels.length})
        </button>
        <button 
          onClick={() => setActiveTab('cars')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'cars' ? 'border-emerald-900 text-emerald-900' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Car size={16} /> Curated Fleet Rental ({filteredCars.length})
        </button>
      </div>

      {/* Render Matrices Based on State Selectors */}
      {activeTab === 'hotels' ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
              <AlertCircle className="mx-auto text-stone-400 mb-2" size={32} />
              <p className="text-stone-500 font-medium">No inventory meets current state constraints.</p>
            </div>
          ) : (
            filteredHotels.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col md:flex-row hover:shadow-md transition-shadow">
                <div className="md:w-1/3 h-52 md:h-auto relative">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-950">{hotel.name}</h3>
                        <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5"><MapPin size={12}/>{hotel.location}</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shrink-0">
                        <Star size={12} className="fill-amber-500 text-amber-500"/> {hotel.rating} ({hotel.reviews} reviews)
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-stone-100 text-stone-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-4 border-t border-stone-100">
                    <PriceDisplayCard base={hotel.basePrice} tax={hotel.taxFee} resort={hotel.resortFee} label="Total Stay Cost/Night" />
                    <button 
                      onClick={() => {
                        setCart(prev => ({ ...prev, hotel }));
                        onNavigate('itinerary');
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        cart.hotel?.id === hotel.id 
                          ? 'bg-amber-500 text-emerald-950 shadow-inner' 
                          : 'bg-emerald-900 text-white hover:bg-emerald-950'
                      }`}
                    >
                      {cart.hotel?.id === hotel.id ? <CheckCircle size={16}/> : null}
                      {cart.hotel?.id === hotel.id ? 'Selected Object Locked' : 'Secure Accommodation'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
              <AlertCircle className="mx-auto text-stone-400 mb-2" size={32} />
              <p className="text-stone-500 font-medium">No vehicular fleet units comply with active filter bounds.</p>
            </div>
          ) : (
            filteredCars.map(car => (
              <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col md:flex-row hover:shadow-md transition-shadow">
                <div className="md:w-1/3 h-52 md:h-auto relative bg-stone-100 flex items-center justify-center p-4">
                  <img src={car.image} alt={car.model} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {car.type}
                        </span>
                        <h3 className="text-xl font-bold text-emerald-950 mt-1">{car.model}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">Operated by {car.company}</p>
                      </div>
                      <div className="bg-stone-100 text-stone-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-0.5">
                        <Star size={12} className="fill-amber-500 text-amber-500"/> {car.rating}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {car.features.map((feat, idx) => (
                        <span key={idx} className="bg-stone-50 text-stone-600 border border-stone-200 text-[11px] font-medium px-2.5 py-1 rounded-md">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-4 border-t border-stone-100">
                    <PriceDisplayCard base={car.basePrice} tax={car.structuralTax} resort={car.localSurcharge} label="Total Fleet Rental/Day" />
                    <button 
                      onClick={() => {
                        setCart(prev => ({ ...prev, car }));
                        onNavigate('itinerary');
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        cart.car?.id === car.id 
                          ? 'bg-amber-500 text-emerald-950 shadow-inner' 
                          : 'bg-emerald-900 text-white hover:bg-emerald-950'
                      }`}
                    >
                      {cart.car?.id === car.id ? <CheckCircle size={16}/> : null}
                      {cart.car?.id === car.id ? 'Fleet Vehicle Reserved' : 'Secure Vehicle Assets'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- VIEW 3: INTERACTIVE ITINERARY BUILDER ---
function ItineraryBuilder({ onNavigate }) {
  const { cart, setCart, searchQuery } = useVoyageCore();
  const [dayPlans, setDayPlans] = useState([
    { day: 1, time: '09:00 AM', event: 'Autonomous Fleet Collection', desc: 'Pick up vehicle asset directly from airport tarmac bypass terminal.', type: 'car' },
    { day: 1, time: '02:00 PM', event: 'Resort Authentication & Check-In', desc: 'Priority access processing through digital validation verification.', type: 'hotel' },
    { day: 2, time: '10:00 AM', event: 'AI Guided Path Exploration', desc: 'Curated trek across optimized panoramic vectors to minimize human crowds.', type: 'recommendation' }
  ]);

  const [newEventText, setNewEventText] = useState('');

  const injectCustomEvent = (e) => {
    e.preventDefault();
    if (!newEventText) return;
    const item = {
      day: 2,
      time: '04:00 PM',
      event: newEventText,
      desc: 'User defined activity node dynamically injected into itinerary structure.',
      type: 'recommendation'
    };
    setDayPlans([...dayPlans, item]);
    setNewEventText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      {/* Structural Visual Timeline Map */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950">Your Visual Core Itinerary</h2>
          <p className="text-xs text-stone-500">Chronological matrix unifying all reservation frameworks and recommendation vectors.</p>
        </div>

        <div className="relative border-l-2 border-emerald-900/20 pl-6 ml-4 space-y-6">
          {dayPlans.map((plan, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet Anchor */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-transform group-hover:scale-125 ${
                plan.type === 'hotel' ? 'border-emerald-800' : plan.type === 'car' ? 'border-amber-500' : 'border-stone-400'
              }`} />
              
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-wide">
                  Day {plan.day} &bull; {plan.time}
                </span>
                <h4 className="font-bold text-base text-emerald-950">{plan.event}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{plan.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Context Event Injection */}
        <form onSubmit={injectCustomEvent} className="bg-stone-100 p-4 rounded-xl border border-stone-200 flex gap-2">
          <input 
            type="text" 
            placeholder="Inject custom exploration objective..." 
            value={newEventText}
            onChange={(e) => setNewEventText(e.target.value)}
            className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
          <button type="submit" className="bg-emerald-900 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap hover:bg-emerald-950">
            Add Node
          </button>
        </form>
      </div>

      {/* Side Summary Panel Orchestration */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-emerald-950 text-lg flex items-center gap-2">
            <ShoppingBag size={18} /> Vertical Manifest
          </h3>

          <div className="space-y-3">
            {/* Accommodation Manifest Sync */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 relative">
              <span className="text-[9px] uppercase font-bold tracking-wider block text-stone-400">Vertical Stay Element</span>
              {cart.hotel ? (
                <div className="flex justify-between items-start mt-1">
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950">{cart.hotel.name}</h5>
                    <p className="text-xs text-stone-500">${cart.hotel.basePrice + cart.hotel.taxFee + cart.hotel.resortFee}/All-In</p>
                  </div>
                  <button onClick={() => setCart(p => ({...p, hotel: null}))} className="text-stone-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              ) : (
                <button onClick={() => onNavigate('search')} className="text-xs font-semibold text-emerald-800 underline mt-1 flex items-center gap-1">
                  Link premium stay infrastructure
                </button>
              )}
            </div>

            {/* Logistics Fleet Sync */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 relative">
              <span className="text-[9px] uppercase font-bold tracking-wider block text-stone-400">Vertical Fleet Logistics</span>
              {cart.car ? (
                <div className="flex justify-between items-start mt-1">
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950">{cart.car.model}</h5>
                    <p className="text-xs text-stone-500">${cart.car.basePrice + cart.car.structuralTax + cart.car.localSurcharge}/All-In</p>
                  </div>
                  <button onClick={() => setCart(p => ({...p, car: null}))} className="text-stone-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              ) : (
                <button onClick={() => onNavigate('search')} className="text-xs font-semibold text-emerald-800 underline mt-1 flex items-center gap-1">
                  Deploy premium fleet mechanics
                </button>
              )}
            </div>
          </div>

          <button 
            disabled={!cart.hotel && !cart.car}
            onClick={() => onNavigate('checkout')}
            className="w-full bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-sm hover:bg-emerald-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Advance to Unified Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- VIEW 4: TRANSPARENT CHECKOUT SCREEN & HUMAN ESCALATION SAFETY TRIGGER ---
function TransparentCheckoutScreen({ onNavigate }) {
  const { cart, resetCart } = useVoyageCore();
  const [isEscalated, setIsEscalated] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Computing absolute guaranteed mathematical matrices
  const totals = useMemo(() => {
    let base = 0, legal = 0, operational = 0;
    if (cart.hotel) {
      base += cart.hotel.basePrice * 7; // Assuming 7-day allocation blocks
      legal += cart.hotel.taxFee * 7;
      operational += cart.hotel.resortFee * 7;
    }
    if (cart.car) {
      base += cart.car.basePrice * 7;
      legal += cart.car.structuralTax * 7;
      operational += cart.car.localSurcharge * 7;
    }
    return { base, legal, operational, grand: base + legal + operational };
  }, [cart]);

  const handleCheckoutPayment = () => {
    setIsPaid(true);
  };

  if (isPaid) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-3xl border border-stone-200 shadow-xl space-y-6 animate-fade-in-up">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-emerald-950">Voyage Confirmed</h2>
          <p className="text-xs text-stone-500">Cryptographic reservation tokens locked into provider downstream ledgers seamlessly.</p>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl text-left text-xs space-y-1.5 border border-stone-200">
          <div className="flex justify-between font-mono text-stone-400"><span>System Hash:</span> <span>VYG-2026-9481A</span></div>
          <div className="flex justify-between font-mono text-stone-400"><span>Total Settled:</span> <span className="text-emerald-900 font-bold">${totals.grand}</span></div>
        </div>
        <button 
          onClick={() => { resetCart(); onNavigate('discovery'); }}
          className="w-full bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm hover:bg-emerald-950 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      {/* Detailed Aggregated Ledger Breakdown */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950">Unified Ledger Processing</h2>
          <p className="text-xs text-stone-500">Binding legal cross-vertical operations under unified execution conditions.</p>
        </div>

        <div className="space-y-4">
          {cart.hotel && (
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-900"><Compass size={20}/></div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{cart.hotel.name}</h4>
                  <p className="text-xs text-stone-400">7-Night Premium Stay Structural Allocation</p>
                </div>
              </div>
              <span className="font-bold text-sm text-stone-800">${(cart.hotel.basePrice + cart.hotel.taxFee + cart.hotel.resortFee) * 7}</span>
            </div>
          )}

          {cart.car && (
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-900"><Car size={20}/></div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{cart.car.model}</h4>
                  <p className="text-xs text-stone-400">7-Day High Fidelity Fleet Asset Rental</p>
                </div>
              </div>
              <span className="font-bold text-sm text-stone-800">${(cart.car.basePrice + cart.car.structuralTax + cart.car.localSurcharge) * 7}</span>
            </div>
          )}
        </div>

        {/* Micro-Interaction Breakdown Expansion Block */}
        <div className="bg-stone-50 rounded-xl p-4 space-y-3 border border-stone-200">
          <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400">Granular Legal & Surcharge Disclosures</h4>
          <div className="text-xs text-stone-600 space-y-2">
            <div className="flex justify-between"><span>Aggregated Base Fare Vector</span> <span>${totals.base}</span></div>
            <div className="flex justify-between"><span>Structural Combined State/VAT Taxes</span> <span>${totals.legal}</span></div>
            <div className="flex justify-between"><span>Downstream Resort/Environmental Local Access Fees</span> <span>${totals.operational}</span></div>
            <div className="flex justify-between font-bold text-sm text-emerald-900 pt-2 border-t border-stone-200">
              <span>Final Promised Settlement Price</span> <span>${totals.grand}</span>
            </div>
          </div>
        </div>

        {/* Guaranteed Protection Notice */}
        <div className="bg-emerald-950 text-stone-100 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="text-amber-400 shrink-0 mt-0.5" size={18} />
          <p className="text-xs leading-relaxed text-stone-300">
            <span className="font-bold text-white block mb-0.5">Voyage Absolute Price Protection Protocol</span>
            The matrix locks total finality. No auxiliary counter hidden charges can be requested at properties or collection centers.
          </p>
        </div>
      </div>

      {/* Payment Processing Control Tower & Safety Trigger */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-emerald-950 text-lg">Execution Command</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-stone-500"><span>Subtotal Vector</span> <span>${totals.base}</span></div>
            <div className="flex justify-between text-xs text-stone-500"><span>Regulatory Fees</span> <span>${totals.legal + totals.operational}</span></div>
            <hr className="border-stone-100"/>
            <div className="flex justify-between text-base font-bold text-emerald-950"><span>Total Due</span> <span>${totals.grand}</span></div>
          </div>

          <button 
            onClick={handleCheckoutPayment}
            className="w-full bg-emerald-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-emerald-950 transition-all shadow-md active:scale-98"
          >
            Authorize Complete Package
          </button>
        </div>

        {/* THE HUMAN SUPPORT ESCALATION CRITICAL SAFETY TRIGGER */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-700 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm text-amber-950">Frustration Deflection Protocol</h4>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                Bypass autonomous automated menu loops instantly. Trigger immediate synchronous human support routing.
              </p>
            </div>
          </div>

          {isEscalated ? (
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-xs text-emerald-950 font-semibold flex items-center gap-2 animate-fade-in-up">
              <PhoneCall size={14} className="text-emerald-800 animate-pulse"/>
              Bridging voice corridor to Senior Concierge Specialist (Est: 14s)...
            </div>
          ) : (
            <button 
              onClick={() => setIsEscalated(true)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <HelpCircle size={14}/> Force Real-Time Human Escalation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. MASTER ROUTER & NAVIGATION SYSTEM ORCHESTRATION
// ============================================================================

export default function App() {
  const [currentView, setCurrentView] = useState('discovery'); // Router states: 'discovery' | 'search' | 'itinerary' | 'checkout'

  const navigateToView = (viewKey) => {
    setCurrentView(viewKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FilterProvider>
      <style>{designSystemStyles}</style>
      <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
        
        {/* Core Architectural Global Navigation Bar */}
        <header className="bg-emerald-950 text-white sticky top-0 z-50 px-4 md:px-8 py-4 shadow-md border-b border-emerald-900/40 premium-blur bg-opacity-95">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateToView('discovery')}>
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-emerald-950 font-black tracking-tighter">V</div>
              <span className="text-xl font-bold tracking-wider text-stone-50 font-sans">VOYAGE</span>
            </div>
            
            <nav className="flex items-center gap-1 md:gap-4 bg-emerald-900/50 p-1 rounded-xl border border-emerald-800/60">
              <button 
                onClick={() => navigateToView('discovery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'discovery' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              >
                <Compass size={14} /> Hub
              </button>
              <button 
                onClick={() => navigateToView('search')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'search' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              >
                <Search size={14} /> Verticals
              </button>
              <button 
                onClick={() => navigateToView('itinerary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'itinerary' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              >
                <Calendar size={14} /> Matrix
              </button>
              <button 
                onClick={() => navigateToView('checkout')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'checkout' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              >
                <ShoppingBag size={14} /> Checkout
              </button>
            </nav>
          </div>
        </header>

        {/* Dynamic View Processing Window */}
        <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8">
          {currentView === 'discovery' && <DiscoveryHub onNavigate={navigateToView} />}
          {currentView === 'search' && <UnifiedSearchModule onNavigate={navigateToView} />}
          {currentView === 'itinerary' && <ItineraryBuilder onNavigate={navigateToView} />}
          {currentView === 'checkout' && <TransparentCheckoutScreen onNavigate={navigateToView} />}
        </main>

        {/* Core System Footer Compliance Banner */}
        <footer className="bg-stone-900 text-stone-500 py-6 text-center text-xs border-t border-stone-800 mt-12">
          <p>&copy; 2026 Voyage Next-Gen Logistics Group. Absolute Price Protection Protocol Active.</p>
        </footer>
      </div>
    </FilterProvider>
  );
}
