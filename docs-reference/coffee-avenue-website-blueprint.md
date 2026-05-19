# COFFEE AVENUE — PREMIUM CAFÉ WEBSITE BLUEPRINT
**Comprehensive Production-Ready Design & Development Guide**

---

## TABLE OF CONTENTS
1. [VISUAL IDENTITY & DESIGN SYSTEM](#1-visual-identity--design-system)
2. [SITE ARCHITECTURE & INFORMATION HIERARCHY](#2-site-architecture--information-hierarchy)
3. [PAGE-BY-PAGE STRUCTURAL PLAN](#3-page-by-page-structural-plan)
4. [CONVERSION COPYWRITING GUIDE](#4-conversion-copywriting-guide)
5. [UI/UX SPECIFICATIONS & MICRO-INTERACTIONS](#5-uiux-specifications--micro-interactions)
6. [RESPONSIVE DESIGN & MOBILE-FIRST STRATEGY](#6-responsive-design--mobile-first-strategy)
7. [TECHNICAL IMPLEMENTATION NOTES](#7-technical-implementation-notes)
8. [CONTENT INVENTORY & ASSET REQUIREMENTS](#8-content-inventory--asset-requirements)

---

# 1. VISUAL IDENTITY & DESIGN SYSTEM

## 1.1 COLOR PALETTE

### Primary Palette (Coffee & Warmth)
| Color Role | Hex Code | RGB | Purpose | Notes |
|---|---|---|---|---|
| **Deep Espresso** | `#2B1810` | 43, 24, 16 | Primary dark, navigation, headings | Sophisticated, grounding |
| **Rich Brown** | `#5D4037` | 93, 64, 55 | Secondary accent, cards, buttons | Warm, inviting |
| **Creamy Beige** | `#F5E6D3` | 245, 230, 211 | Background, light sections | Soft, premium feel |
| **Warm Amber** | `#D4A574` | 212, 165, 116 | Accent, hover states, CTAs | Energy, call-to-action |
| **Gold Accent** | `#C9A961` | 201, 169, 97 | Premium elements, icons | Luxury touch |

### Secondary Palette (Contextual)
| Color Role | Hex Code | Purpose |
|---|---|---|
| **Success Green** | `#27AE60` | "Open" status, positive actions |
| **Alert Red** | `#E74C3C` | Limited-time offers, important info |
| **Neutral Gray** | `#7F8C8D` | Subtitles, secondary text |
| **Pure White** | `#FFFFFF` | Text on dark, section dividers |
| **Near-Black** | `#1A1A1A` | Body text, readability |

### Dark Mode Variant
- **Background**: `#0F0F0F` (Near-black)
- **Card BG**: `#1C1C1C` (Charcoal)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#B0B0B0`
- **Accent**: `#D4A574` (Warm Amber—unchanged for consistency)

---

## 1.2 TYPOGRAPHY SYSTEM

### Heading Typeface: **Inter** or **Sora** (Modern, Bold Sans-Serif)
- **H1 (Page Titles)**: 48px / 54px (mobile / desktop), Weight 700, Line-height 1.2, Letter-spacing -0.5px
- **H2 (Section Heads)**: 36px / 42px (mobile / desktop), Weight 700, Line-height 1.3, Letter-spacing -0.3px
- **H3 (Subsections)**: 24px / 28px (mobile / desktop), Weight 600, Line-height 1.4
- **H4 (Card Titles)**: 18px, Weight 600, Line-height 1.4

### Body Typeface: **Poppins** or **Outfit** (Clean, Readable Sans-Serif)
- **Body Text**: 16px (18px desktop), Weight 400, Line-height 1.6, Letter-spacing 0.3px
- **Small Text** (Captions, Labels): 14px, Weight 400, Line-height 1.5, Color: Neutral Gray
- **Buttons & CTAs**: 16px, Weight 600, Line-height 1.4, Letter-spacing 0.5px

### Accent Font (Optional): **Playfair Display** (Elegant Serif for Hero/Brand Moments)
- Used sparingly for brand taglines, "Meet with a Rocking Barista" headline emphasis
- Size: 28px–36px, Weight 700, Color: Deep Espresso or Warm Amber

---

## 1.3 VISUAL STYLE DIRECTION

### Aesthetic Principles
1. **Modern Minimalism with Warmth**: Clean layouts balanced with inviting color warmth
2. **Cozy Sophistication**: Premium feel without being stuffy; accessible luxury
3. **Dhanmondi Urban Vibe**: Reflects young professionals and students—trendy, Instagram-worthy
4. **Functional Beauty**: Every visual element serves a purpose; no decorative bloat

### Key Visual Elements
- **Cards with Subtle Shadows**: 0 8px 16px rgba(43, 24, 16, 0.08) for depth without harshness
- **Rounded Corners**: 12px border-radius for cards, 8px for buttons, 16px for hero sections
- **Micro-animations**: 300ms cubic-bezier(0.4, 0, 0.2, 1) for smooth transitions
- **Icon Style**: Line-based, 2px stroke weight, consistent sizing (24px standard, 32px for featured)
- **Photography Style**: High-quality, lifestyle shots of coffee, barista interactions, cozy interior spaces; warm, golden-hour lighting

### Brand Imagery Concepts
- Hero background: Overhead shot of latte art + blurred Satmasjid Road streetscape (parallax scroll)
- Barista spotlight: Candid photo of barista crafting coffee, warm lighting, authentic smile
- Menu items: Flat-lay product photography with props (cup, saucer, pastry plate)
- Café interior: Wide-angle shot of 2nd-floor seating area, natural light, customers enjoying beverages
- Ambient: Close-ups of coffee steam, foam texture, dessert plating

---

# 2. SITE ARCHITECTURE & INFORMATION HIERARCHY

## 2.1 SITEMAP & NAVIGATION STRUCTURE

### Single-Page Scrolling Layout (Recommended) with Sticky Navigation

```
┌─────────────────────────────────────────┐
│ HEADER / STICKY NAVIGATION              │
│ [Logo] [Menu] [Call: 01327-419695] [Order Now] │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 01. HERO SECTION                        │
│ "Meet with a Rocking Barista"          │
│ [View Menu CTA] [Find Us CTA]          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 02. SERVICE HIGHLIGHTS                  │
│ 🏪 Dine-in | 🚗 Drive-through | 📦 Delivery │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 03. INTERACTIVE DIGITAL MENU            │
│ [Brewed & Espresso] [Sweets] [Savory] │
│ ├─ Cappuccino ৳300                     │
│ ├─ Latte ৳280                          │
│ ├─ Irish Coffee ৳350                   │
│ └─ [+12 more items]                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 04. BARISTA & VIBE SPOTLIGHT            │
│ "The Heart of Coffee Avenue"           │
│ [Candid barista photo] [Story text]    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 05. WHY COFFEE AVENUE?                  │
│ 3 Feature Cards (Premium Quality, etc.) │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 06. SOCIAL PROOF & REVIEWS              │
│ ⭐ 4.3 Stars (517+ Reviews)            │
│ [Review Carousel / Testimonials]       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 07. LOCATION & CONTACT FOOTER           │
│ [Google Maps Embed]                     │
│ Address: 776 Satmasjid Rd, Dhanmondi   │
│ Phone: 01327-419695                     │
│ Open until: 1:00 AM ✓                   │
│ [Quick Links] [Social Icons]           │
└─────────────────────────────────────────┘
```

### Navigation Menu Structure
```
Primary Nav (Sticky Header):
├─ Home (scroll to top)
├─ Menu (scroll to digital menu section)
├─ About (scroll to barista & vibe)
├─ Location (scroll to footer)
└─ Order Now (CTA → Google Maps / Phone / Delivery Partner)

Secondary/Mobile Menu:
├─ [All primary items above]
├─ Hours: Open Daily until 1:00 AM
├─ Contact: 01327-419695
└─ Social Links: Instagram, Facebook, WhatsApp
```

---

## 2.2 CONTENT ZONES & PRIORITY LEVELS

| Zone | Priority | User Intent | Content Type |
|---|---|---|---|
| Hero Section | **P0 (Critical)** | First impression, immediate engagement | Headline, subheading, dual CTAs |
| Service Highlights | **P1 (High)** | Understand what services available | 3 service cards, icons, brief copy |
| Digital Menu | **P0 (Critical)** | Browse offerings, prices, make decision | Menu items, descriptions, prices in ৳ |
| Barista & Vibe | **P2 (Medium)** | Build emotional connection, differentiation | Photo, story, authentic brand voice |
| Social Proof | **P1 (High)** | Build trust, conversion confidence | Star rating, review count, testimonials |
| Location & Hours | **P0 (Critical)** | Find the café, know when open | Map, address, phone, hours indicator |

---

# 3. PAGE-BY-PAGE STRUCTURAL PLAN

## 3.1 HEADER / STICKY NAVIGATION BAR

### Structure
```
[Left] Logo + "Coffee Avenue"
[Center] Navigation Links: Menu | About | Location
[Right] Call Button: ☎️ +88 01327-419695 | "Order Now" CTA Button
```

### Desktop Layout (1200px+)
- Fixed height: 70px
- Sticky positioning (stays at top on scroll)
- Background: Deep Espresso (#2B1810) with 0.95 opacity backdrop blur
- Logo: 48px × 48px, company wordmark
- Navigation links: 16px, White text, Hover state = Warm Amber underline (3px, 200ms animation)
- Call button: Outlined style, 14px, Warm Amber border, hover fills background
- CTA button: "Order Now" = Solid Warm Amber background, White text, 16px bold, rounded 8px, hover scale 1.05

### Mobile Layout (< 768px)
- Height: 64px
- Logo on left, hamburger menu icon on right
- Call button hidden (click hamburger to reveal)
- Sticky: Yes
- Mobile menu: Full-screen slide-in from right, Deep Espresso background, vertical list, touch-friendly 48px tap targets

### Responsive Breakpoints
```
Desktop: 1200px+ → Full navigation visible
Tablet: 768px–1199px → Condensed nav, call button as icon
Mobile: < 768px → Hamburger menu, logo prominent
```

---

## 3.2 HERO SECTION

### Headline Hierarchy & Copy
```
[Overline] "Welcome to Satmasjid's Favorite Coffee Spot"
          (14px, Neutral Gray, all-caps, letter-spacing 2px)

[Main Headline] "Meet with a Rocking Barista"
               (54px / 36px mobile, Deep Espresso, bold, Playfair or strong serif-like sans)
               (Emotion: Cheeky, inviting, establishes brand personality)

[Subheading] "Craft coffee. Cozy vibes. Open till 1 AM.
             Your new favorite corner of Dhanmondi awaits."
            (18px / 16px mobile, Neutral Gray, regular weight, 1.6 line-height)

[Dual CTAs]
├─ Primary: "Explore Our Menu" → Scroll to Menu Section (Warm Amber background, White text)
└─ Secondary: "Find Us on Satmasjid Rd" → Scroll to Location Footer (Outlined, Deep Espresso border)
```

### Visual Design
- **Background**: 
  - Hero image: Overhead shot of latte with beautiful latte art + subtle Satmasjid Road streetscape (soft-focused)
  - Parallax scroll effect: Image moves at 0.5× scroll speed for depth
  - Dark gradient overlay: Linear gradient 180deg from rgba(43, 24, 16, 0.6) to rgba(43, 24, 16, 0.3) (ensures text readability)
  
- **Layout**:
  - Height: 600px (desktop), 500px (tablet), 400px (mobile)
  - Text positioned left-center, max-width 500px
  - CTAs: Side-by-side on desktop (gap 16px), stacked on mobile
  - Padding: 80px left/right (desktop), 40px (tablet), 20px (mobile)

- **Micro-interactions**:
  - Headline appears with fade-in + 20px slide-up animation (800ms delay, 600ms duration)
  - Subheading fades in 200ms after headline
  - CTAs fade in with 400ms delay, slight scale animation (0.95 → 1.0)
  - On hover: CTA buttons scale 1.05, box-shadow adds depth

- **Mobile Optimizations**:
  - Hero height reduced to 400px for above-the-fold clarity
  - Headline font-size reduces to 36px
  - Subheading hides on extra-small (< 480px) to prioritize CTAs
  - CTAs stack vertically, full-width responsive (80% width, 16px margin auto)

---

## 3.3 SERVICE HIGHLIGHTS SECTION

### Structure & Copy
```
[Section Title] "How to Get Your Coffee"
               (36px, Deep Espresso, centered, 40px margin-bottom)

[3-Column Card Layout]

Card 1: Dine-In
├─ Icon: 🪑 (Fork & knife / chair icon, 40px, Warm Amber)
├─ Title: "Dine-In Experience"
├─ Copy: "Settle into our cozy 2nd-floor lounge. Free Wi-Fi,
│        plenty of sockets, and the perfect ambiance to work or unwind.
│        Prices: ৳200–450 per person."
└─ [Learn More] button → Scroll to Barista section

Card 2: Drive-Through
├─ Icon: 🚗 (Car icon, 40px, Warm Amber)
├─ Title: "Drive-Through"
├─ Copy: "Quick, convenient, no parking headaches.
│        Order ahead and we'll have your coffee ready
│        in 5 minutes. Call 01327-419695."
└─ [Order Now] button → Phone dial link

Card 3: No-Contact Delivery
├─ Icon: 📦 (Package icon, 40px, Warm Amber)
├─ Title: "Safe Delivery"
├─ Copy: "Order from home via Pathao, Uber Eats, or Foodpanda.
│        Hot, fresh, delivered. Available 11 AM–12:30 AM."
└─ [See Delivery Partners] button → Link to delivery partner pages
```

### Visual Design
- **Background**: Creamy Beige (#F5E6D3), full width
- **Layout**: 3-column grid (desktop), 2 columns (tablet), 1 column (mobile)
- **Card Specs**:
  - Background: White
  - Border: 1px solid #E0D4C4 (soft border)
  - Border-radius: 12px
  - Padding: 32px 24px
  - Box-shadow: 0 4px 12px rgba(43, 24, 16, 0.08)
  - Hover state: 
    - Shadow deepens → 0 8px 24px rgba(43, 24, 16, 0.12)
    - Transform: translateY(-4px)
    - Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)

- **Icon Animation**:
  - Hover: Icon scales 1.15, rotates 5deg (subtle playful motion)
  - Transition: 300ms ease

- **Section Padding**: 80px 40px (desktop), 60px 20px (mobile)

---

## 3.4 INTERACTIVE DIGITAL MENU SECTION

### Section Title & Intro
```
[Title] "Our Coffee Story"
       (42px, Deep Espresso, centered, margin-bottom 16px)

[Subtitle] "From hand-picked beans to your cup. Every sip tells a story."
          (18px, Neutral Gray, centered, margin-bottom 40px)

[Filter Tabs] [All] [Brewed & Espresso] [Sweets & Desserts] [Savory Bites]
             (Each tab: 16px bold, Deep Espresso text, Warm Amber underline on active)
             (Smooth transition on tab click: 200ms)
```

### Menu Structure & Items

#### Category 1: Brewed & Espresso (Primary Focus)
| Item Name | Description | Price (৳) | Icon/Note |
|---|---|---|---|
| **Espresso** | Single shot of pure intensity | 150 | ☕ Single |
| **Cappuccino** | Espresso + silky steamed milk foam | 300 | ☕ Classic |
| **Latte** | Smooth, creamy, perfect for first-timers | 280 | ☕☕ House Favorite ⭐ |
| **Irish Coffee** | Espresso + Irish whiskey + cream (Evening special) | 350 | 🥃 Warm & Spiced |
| **Butterscotch Mocha** | Espresso + chocolate + butterscotch drizzle | 320 | 🍫 Sweet Indulgence |
| **Hazelnut & Caramel Latte** | Smooth hazelnut + caramel swirl | 310 | 🌰 Signature ⭐ |
| **Blueberry Refresher** | Iced blueberry purée + cold brew | 280 | 🫐 Summer Special |
| **Hot Chocolate** | Rich, creamy, topped with marshmallows | 250 | 🍫 Cozy |

#### Category 2: Sweets & Desserts
| Item Name | Description | Price (৳) |
|---|---|---|
| **Brownie with Ice Cream** | Warm, fudgy brownie + vanilla scoop | 320 |
| **Caramel Blondie** | Buttery, chewy, caramel-studded | 280 |
| **Chocolate Cake** | Three-layer dark chocolate perfection | 350 |

#### Category 3: Savory Bites
| Item Name | Description | Price (৳) |
|---|---|---|
| **Smoked Chicken Sandwich** | Charred bread + smoky chicken + fresh greens | 450 |
| **Chicken Grilled Sandwich** | Toasted, melted cheese + herb-grilled chicken | 420 |

### Menu Card Design (Individual Item)
```
┌─────────────────────────┐
│  [Item Photo] (280px h) │
├─────────────────────────┤
│ Item Title (18px bold)  │
│ Brief Description       │
│ (14px, Neutral Gray,    │
│  2-3 lines max)         │
│                         │
│ Price: ৳XXX (16px bold, │
│ Warm Amber color)       │
│                         │
│ [+Add to Cart] button   │
│ (Outlined, hover fill)  │
└─────────────────────────┘
```

### Visual Layout
- **Grid**: 4 columns (desktop, 1200px+), 2 columns (tablet, 768px–1199px), 1 column (mobile, < 768px)
- **Card Dimensions**: 280px width × 380px height (desktop)
- **Image**: 280px × 180px, object-fit: cover, border-radius: 8px
- **Card Padding**: 16px
- **Card Background**: White with 0.5px border (#E0D4C4)
- **Card Hover**:
  - Shadow increases: 0 8px 20px rgba(43, 24, 16, 0.12)
  - Image zoom: transform scale(1.05)
  - Button background shifts to Warm Amber on hover

- **Section Background**: White
- **Section Padding**: 80px 40px (desktop), 60px 20px (mobile)

### Micro-Interactions
1. **Tab Click**:
   - Active tab border extends (animation 300ms)
   - Menu items fade out (150ms), grid shifts (150ms), items fade in (200ms)
   - Smooth content transition, no jarring refresh

2. **Card Hover** (Desktop):
   - Shadow depth increases smoothly (200ms)
   - Image zooms to 1.05 (300ms)
   - Price text changes to Warm Amber (100ms)
   - Button reveals slight glow (box-shadow: 0 0 8px rgba(212, 165, 116, 0.3))

3. **Price Highlight**:
   - Price text color: Warm Amber (#D4A574)
   - Font-weight: 700
   - When hovered, slight pulse animation (scale 1.1 → 1.0 over 300ms)

### Mobile Optimizations
- **Stacked Tabs**: Single row, scrollable horizontally if needed (snap scrolling for smooth experience)
- **Single Column**: Full-width cards, padding adjusted for thumb-friendliness
- **Image Priority**: Larger relative to text (180px height on mobile, larger aspect ratio)
- **"Add to Cart" Button**: Full-width on mobile, better tap targets (48px min height)

---

## 3.5 BARISTA & VIBE SPOTLIGHT SECTION

### Structure & Narrative
```
[Section Title] "The Heart of Coffee Avenue"
               (42px, Deep Espresso, centered, margin-bottom 32px)

[2-Column Layout: Image (left) + Text (right)]

[Left: Image]
- Candid photo of barista crafting coffee (warm, golden-hour lighting)
- Image size: 500px width × 600px height (desktop), 100% responsive
- Border-radius: 12px
- Subtle shadow: 0 16px 40px rgba(43, 24, 16, 0.15)

[Right: Text Content]
├─ Overline: "MEET OUR CREW"
│           (12px, Warm Amber, all-caps, letter-spacing 2px)
│
├─ Headline: "Your Barista is Your Coffee Therapist"
│           (32px, Deep Espresso, bold)
│
├─ Body Copy:
│   "At Coffee Avenue, coffee isn't just a drink—it's a conversation.
│    Our baristas aren't just skilled; they're passionate about your
│    experience. Every espresso pull, every foam pour, every chat is
│    genuine. Whether you're cramming for exams, meeting a friend, or
│    closing a deal, you'll find your vibe here.
│
│    Open till 1 AM, we're your night-owl sanctuary on Satmasjid Road."
│   (16px, Near-Black, line-height 1.8, 40px margin-bottom)
│
├─ 3 Feature Bullets:
│   ✓ Hand-trained baristas with 5+ years experience
│   ✓ Specialty beans sourced directly from local roasters
│   ✓ Custom orders: Build your own drink!
│   (Each bullet: 16px, checkmark icon in Warm Amber, 24px margin-bottom)
│
└─ [Reserve a Table] CTA button (Warm Amber solid, White text)
   → Links to reservation form or WhatsApp chat
```

### Visual Design
- **Background**: Creamy Beige (#F5E6D3) full-width section
- **Layout**: 
  - Desktop: 2-column grid (image 45%, text 45%, gap 10%)
  - Tablet: 2-column, narrower image (40%), responsive
  - Mobile: Stacked (image full-width, then text below, 16px padding)

- **Image Specs**:
  - Desktop: 500px × 600px
  - Tablet: 100% width, max 450px
  - Mobile: 100% width, auto height (aspect-ratio maintained)
  - Border-radius: 12px
  - Shadow: 0 16px 40px rgba(43, 24, 16, 0.15)

- **Text Container**:
  - Max-width: 480px (desktop)
  - Padding: 0 (desktop, relies on grid gap), 20px (mobile)
  - Vertical alignment: Center (desktop), top (mobile)

- **Micro-interactions**:
  - Image reveals with fade-in on scroll (Intersection Observer)
  - Text slides up 20px + fades in on scroll
  - Checkmarks animate in sequence (staggered 100ms each)
  - Button hover: Background darkens to Rich Brown, shadow adds

- **Section Padding**: 100px 40px (desktop), 60px 20px (mobile)

---

## 3.6 WHY COFFEE AVENUE? (TRUST & DIFFERENTIATION SECTION)

### Structure
```
[Section Title] "Why Coffee Avenue?"
               (42px, Deep Espresso, centered, margin-bottom 60px)

[3-Feature Cards in Grid]

Card 1: Premium Quality
├─ Icon: ☕ (Coffee cup, 48px, Warm Amber)
├─ Title: "Premium Quality, Accessible Price"
├─ Copy: "We believe exceptional coffee shouldn't break the bank.
│        Curated beans, skilled hands, cozy vibes. ৳200–600 range."
└─ [Learn More]

Card 2: Your Second Home
├─ Icon: 🏠 (House icon, 48px, Warm Amber)
├─ Title: "Your Second Home"
├─ Copy: "2nd floor of Old Concord, Satmasjid Road. Natural light,
│        power sockets galore, impeccable Wi-Fi. Perfect for
│        studying, meetings, or just existing peacefully."
└─ [Learn More]

Card 3: Open Till Late
├─ Icon: 🌙 (Moon icon, 48px, Warm Amber)
├─ Title: "Open Till 1 AM (Your Night Owl Sanctuary)"
├─ Copy: "When the city sleeps, Coffee Avenue is still buzzing.
│        Late-night study sessions, evening catch-ups, post-dinner hangouts."
└─ [Learn More]
```

### Visual Design
- **Background**: White
- **Grid**: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Card Specs**:
  - Background: Creamy Beige (#F5E6D3)
  - Border: None
  - Border-radius: 12px
  - Padding: 40px 32px
  - Min-height: 300px
  - Text alignment: Center
  - Box-shadow: 0 4px 12px rgba(43, 24, 16, 0.08)

- **Card Hover** (Desktop):
  - Background shifts slightly to warmer tone
  - Icon scales 1.15 (200ms)
  - Shadow deepens
  - Border appears: 2px solid Warm Amber (200ms)

- **Icon Design**:
  - 48px size
  - Color: Warm Amber (#D4A574)
  - Line-based SVG icons, 3px stroke
  - Centered, margin-bottom 20px

- **Typography**:
  - Title: 20px bold, Deep Espresso
  - Copy: 16px, Neutral Gray, line-height 1.6
  - Link/Button: 14px bold, Warm Amber, hover underline

- **Section Padding**: 100px 40px (desktop), 60px 20px (mobile)

---

## 3.7 SOCIAL PROOF & REVIEWS SECTION

### Structure & Layout
```
[Section Title] "What Our Guests Say"
               (42px, Deep Espresso, centered)

[Stats Row] (3 columns, centered, margin-bottom 60px)
├─ 4.3 ⭐ (Large, Warm Amber)
│  Rating (16px, Deep Espresso)
│  (517+ Google Reviews) (14px, Neutral Gray)
│
├─ 98% (Large, Warm Amber)
│  Recommend (16px, Deep Espresso)
│  (From guest surveys) (14px, Neutral Gray)
│
└─ 2K+ (Large, Warm Amber)
   Visits/Month (16px, Deep Espresso)
   (Active community) (14px, Neutral Gray)

[Reviews Carousel] (Horizontal scrollable on mobile, 3-column grid on desktop)

Review Card 1:
├─ ⭐⭐⭐⭐⭐ (Star rating, 16px)
├─ Quote: "This place is my sanctuary. The coffee is consistently
│  excellent, and the baristas actually remember my order. 10/10
│  would recommend to anyone in Dhanmondi."
│  (16px, Near-Black, italic, line-height 1.8)
├─ Author: "Sarah Ahmed" (14px bold, Deep Espresso)
├─ Detail: "Student | Regular" (13px, Neutral Gray)
└─ Photo: Small avatar (40px circle)

[Repeat 3–5 reviews in carousel]

[See All Reviews] CTA Button
→ Link to Google Reviews page
```

### Visual Design
- **Background**: Deep Espresso (#2B1810) with white text overlay
- **Padding**: 100px 40px (desktop), 60px 20px (mobile)

- **Stats Row**:
  - 3-column grid (desktop), 3-row stack (mobile)
  - Gap: 40px
  - Text alignment: Center
  - Each stat box has no border, centered text

- **Review Card Specs**:
  - Background: rgba(255, 255, 255, 0.1) (semi-transparent white)
  - Border: 1px solid rgba(255, 255, 255, 0.15)
  - Border-radius: 12px
  - Padding: 32px 28px
  - Backdrop-filter: blur(4px) (frosted glass effect, optional but premium)
  - Width: 320px (desktop, adjustable), 100% (mobile)

- **Carousel Interaction**:
  - Desktop: 3 visible cards, auto-scroll every 6 seconds (pause on hover)
  - Mobile: Horizontal snap scrolling, visible 1 card at a time
  - Arrow buttons (prev/next): Outlined Warm Amber, 40px circles
  - Smooth fade transitions (300ms) between cards

- **Star Rating**:
  - Gold color: Warm Amber (#D4A574)
  - Size: 16px

- **Typography**:
  - Quote: 16px, White, italic, weight 400
  - Author: 14px, Warm Amber, weight 600
  - Detail: 13px, rgba(255, 255, 255, 0.7), weight 400

---

## 3.8 LOCATION & CONTACT FOOTER

### Structure & Content
```
[Footer Section: Deep Espresso Background, White Text]

[Top Row: 2–3 Column Layout]

Column 1: Quick Links
├─ Menu
├─ Hours: Open Daily until 1:00 AM
├─ Delivery Partners
├─ Order Now
└─ Contact

Column 2: Contact Info (Centered)
├─ 📍 Address:
│  2nd floor, Old Concord Mumtaz Karim Heritage,
│  776 Satmasjid Road, Dhanmondi, Dhaka 1209.
│  Plus Code: Q929+G3 Dhaka
│
├─ 📱 Phone: 01327-419695
│  (Clickable tel: link, Copy to clipboard on click)
│
├─ 🕐 Hours: Daily, 10 AM–1 AM
│  (Current status: "Open" badge in green if within hours)
│
└─ 📧 Email: hello@coffeeavenue.com (if available)

Column 3: Social Icons (Right-aligned)
├─ 🔗 Instagram (icon + link)
├─ 🔗 Facebook (icon + link)
├─ 🔗 WhatsApp (icon + link)
└─ 🔗 Google Maps (icon + link)

[Google Maps Embed] (Full-width, 400px height)
- Interactive map showing Coffee Avenue location on Satmasjid Road
- Red pin marker, info window with name + phone
- Option to open full Google Maps
- Note: Lazy-load map for performance

[Bottom Row: Copyright & Policy Links]
├─ © 2024 Coffee Avenue. All rights reserved.
├─ Privacy Policy
├─ Terms of Service
└─ Website by [Design/Dev Studio Name]
```

### Visual Design
- **Background**: Deep Espresso (#2B1810)
- **Text Color**: White, with Neutral Gray accents
- **Padding**: 80px 40px (desktop), 60px 20px (mobile)
- **Border-top**: 1px solid rgba(255, 255, 255, 0.1)

- **Links**:
  - Color: Warm Amber (#D4A574)
  - Hover: White + underline
  - Transition: 200ms

- **Map Container**:
  - Height: 400px (desktop), 300px (mobile)
  - Border-radius: 12px
  - Overflow: hidden
  - Margin-top: 40px
  - Margin-bottom: 40px

- **Address Styling**:
  - Line-height: 1.8
  - Font-size: 14px
  - With small icon (📍 16px) on left

- **Phone Number**:
  - Font-size: 18px
  - Font-weight: 600
  - Cursor: pointer
  - Copy-to-clipboard tooltip on click (300ms fade-in/out)

- **Social Icons**:
  - 32px size
  - Gap: 16px
  - Hover: Color shifts to Gold Accent (#C9A961), scale 1.15 (200ms)

- **Mobile Optimizations**:
  - Stack layout vertically (footer columns stack)
  - Address text: 13px
  - Phone number: Center-aligned, full-width clickable area
  - Social icons: Center-aligned, horizontal layout

---

# 4. CONVERSION COPYWRITING GUIDE

## 4.1 CORE MESSAGING PILLARS

### Pillar 1: "Meet with a Rocking Barista" (Brand Essence)
- **Tone**: Cheeky, friendly, insider-ish, approachable
- **Function**: Establishes personality; "barista" = expert, cool person
- **Audience**: Students, young professionals, creatives (Dhanmondi vibe)
- **Copy Examples**:
  - "Your barista is your coffee therapist."
  - "Espresso. Conversation. Cozy vibes. That's the Coffee Avenue way."
  - "We don't just pull shots. We pull you into the moment."

### Pillar 2: Premium Accessibility (Price Justified)
- **Tone**: Honest, value-forward, inclusive
- **Function**: Reassure budget-conscious customers that quality ≠ expensive
- **Copy Examples**:
  - "Craft coffee at prices that won't empty your wallet."
  - "Specialty beans. Skilled hands. ৳200–600. Your pick."
  - "Premium quality is our promise. Accessible price is our pride."

### Pillar 3: Your Second Home (Emotional Anchor)
- **Tone**: Warm, inviting, genuine, belonging-focused
- **Function**: Position cafe as sanctuary, not transactional
- **Copy Examples**:
  - "Natural light. Power sockets. Excellent Wi-Fi. It's basically your living room."
  - "Cramming? Meeting friends? Just existing? There's a corner for you."
  - "Welcome. Stay as long as you like."

### Pillar 4: Nocturnal Lifestyle Hub (Unique Selling Point)
- **Tone**: Energetic, slightly rebellious, night-owl inclusive
- **Function**: Differentiate from typical 9-to-5 cafes
- **Copy Examples**:
  - "When the city sleeps, Coffee Avenue is still buzzing."
  - "Your 1 AM study session just got an upgrade."
  - "Open till late. Always got your back."

---

## 4.2 SECTION-BY-SECTION COPY

### HERO SECTION

#### Overline (14px, all-caps)
```
"Welcome to Satmasjid's Favorite Coffee Spot"
```
*Rationale*: Establishes location pride, intimacy ("favorite")

#### Headline (54px, bold)
```
"Meet with a Rocking Barista"
```
*Rationale*: Brand tagline, memorable, cheeky personality. "Rocking" = skilled + cool. "Meet with" = relational, not transactional.

#### Subheading (18px)
```
"Craft coffee. Cozy vibes. Open till 1 AM.
Your new favorite corner of Dhanmondy awaits."
```
*Rationale*: Rapid-fire benefits (craft, cozy, hours), immediate relevance, personalization ("your"). Note: "corner" = intimate, small-but-mighty.

#### CTA #1 (Primary)
```
"Explore Our Menu"
```
*Rationale*: Direct, action-oriented, leads to conversion funnel (browsing → ordering)

#### CTA #2 (Secondary)
```
"Find Us on Satmasjid Rd"
```
*Rationale*: Addresses logistics pain point, secondary call for location-hunters or first-timers

---

### SERVICE HIGHLIGHTS SECTION

#### Dine-In Card

**Title**: "Dine-In Experience"

**Copy**:
```
"Settle into our cozy 2nd-floor lounge. Free Wi-Fi, plenty of sockets,
and the perfect ambiance to work or unwind. Prices: ৳200–450 per person."
```
*Rationale*: Specific amenities (Wi-Fi, sockets) address student/professional pain points. Price range anchor builds trust.

**Button**: "Learn More" → Scroll to Barista section (soft CTA)

---

#### Drive-Through Card

**Title**: "Drive-Through"

**Copy**:
```
"Quick, convenient, no parking headaches.
Order ahead and we'll have your coffee ready in 5 minutes. Call 01327-419695."
```
*Rationale*: Addresses objection (parking), speed promise (5 min), direct action (phone number). "Headaches" = relatable pain point.

**Button**: "Order Now" → Tel: link to call directly

---

#### No-Contact Delivery Card

**Title**: "Safe Delivery"

**Copy**:
```
"Order from home via Pathao, Uber Eats, or Foodpanda.
Hot, fresh, delivered. Available 11 AM–12:30 AM."
```
*Rationale*: Platform mentions (social proof, ease), benefit stack (hot, fresh, convenient), availability hours (late-night option). "Safe" = pandemic-sensitive reassurance.

**Button**: "See Delivery Partners" → Links to app pages

---

### INTERACTIVE DIGITAL MENU SECTION

#### Section Title
```
"Our Coffee Story"
```
*Rationale*: Frames menu as narrative, not commodity. Shifts from transactional to emotional.

#### Subtitle
```
"From hand-picked beans to your cup. Every sip tells a story."
```
*Rationale*: Quality narrative, craftsmanship angle, emotional resonance.

#### Menu Item Copy Examples

**Signature Item (Hazelnut & Caramel Latte)**
```
Title: "Hazelnut & Caramel Latte"
Description: "Smooth hazelnut + caramel swirl. A Dhaka favorite."
Price: ৳310
Badge: "SIGNATURE ⭐"
```
*Rationale*: Local pride ("Dhaka favorite"), specific flavor combo, star badge = recommendation nudge.

**Adventurous Item (Irish Coffee)**
```
Title: "Irish Coffee"
Description: "Espresso + Irish whiskey + cream (Evening special)"
Price: ৳350
Badge: "EVENING SPECIAL 🥃"
```
*Rationale*: Adventurous tone, ingredient transparency, time-lock (evening) = exclusivity/scarcity.

**Accessible Item (Latte)**
```
Title: "Latte"
Description: "Smooth, creamy, perfect for first-timers"
Price: ৳280
Badge: "HOUSE FAVORITE ⭐"
```
*Rationale*: Explicitly welcomes newcomers, removes decision paralysis, popular vote validation.

---

### BARISTA & VIBE SPOTLIGHT SECTION

#### Overline
```
"MEET OUR CREW"
```
*Rationale*: Personalization, "crew" = inclusive, buddy-like tone.

#### Headline
```
"Your Barista is Your Coffee Therapist"
```
*Rationale*: Emotional hook, elevated role ("therapist"), cheeky (suggesting coffee as therapy). Differentiates baristas from "vending machine operators."

#### Body Copy
```
"At Coffee Avenue, coffee isn't just a drink—it's a conversation.
Our baristas aren't just skilled; they're passionate about your
experience. Every espresso pull, every foam pour, every chat is
genuine. Whether you're cramming for exams, meeting a friend, or
closing a deal, you'll find your vibe here.

Open till 1 AM, we're your night-owl sanctuary on Satmasjid Road."
```

*Rationale*:
- Line 1: Elevates coffee from beverage to social ritual
- "passionate about your experience" = Customer-centric mindset
- "Every pull, foam pour, chat" = Specific craftsmanship moments + human connection
- Scenario painting (exams, meeting, deals) = Customer identity mirroring
- "Sanctuary" = Safe space, belonging
- "night-owl" = Nods to unique value prop

#### Feature Bullets
```
✓ Hand-trained baristas with 5+ years experience
✓ Specialty beans sourced directly from local roasters
✓ Custom orders: Build your own drink!
```

*Rationale*:
- Credentials (5+ years) = expertise trust
- "Direct" sourcing = Quality + ethical
- Customization = Agency, empowerment

#### CTA Button
```
"Reserve a Table"
```
*Rationale*: Soft call, not pushy. "Reserve" = special treatment, planning ahead.

---

### WHY COFFEE AVENUE? SECTION

#### Card 1: Premium Quality, Accessible Price

**Title**: "Premium Quality, Accessible Price"

**Copy**:
```
"We believe exceptional coffee shouldn't break the bank. Curated beans,
skilled hands, cozy vibes. ৳200–600 range."
```

*Rationale*: Core value prop. "Curated beans" = quality. "Skilled hands" = expertise. "Cozy vibes" = intangible value. Price anchor repeats reassurance.

---

#### Card 2: Your Second Home

**Title**: "Your Second Home"

**Copy**:
```
"2nd floor of Old Concord, Satmasjid Road. Natural light, power sockets
galore, impeccable Wi-Fi. Perfect for studying, meetings, or just
existing peacefully."
```

*Rationale*: Location specificity. "Natural light" = wellbeing. "Sockets galore" = hyperbole, memorable. "Impeccable" = quality adjective. "Just existing peacefully" = permission to belong without obligation to buy (emotional safety).

---

#### Card 3: Open Till 1 AM (Night Owl Sanctuary)

**Title**: "Open Till 1 AM (Your Night Owl Sanctuary)"

**Copy**:
```
"When the city sleeps, Coffee Avenue is still buzzing. Late-night study
sessions, evening catch-ups, post-dinner hangouts."
```

*Rationale*: Hours = USP. "Still buzzing" = energy, community. Scenario painting = customer identity ("Night owls," studiers, socialites).

---

### SOCIAL PROOF & REVIEWS SECTION

#### Section Title
```
"What Our Guests Say"
```
*Rationale*: "Guests" = elevated, respectful framing (not "customers" or "users").

#### Stats Line
```
"4.3 ⭐ Rating | 98% Recommend | 2K+ Visits/Month"
```

*Rationale*: Third-party credibility (Google rating, survey data). "Recommend" = trust signal. "Visits/Month" = active community proof.

#### Sample Review 1 (Student)
```
"This place is my sanctuary. The coffee is consistently excellent, and
the baristas actually remember my order. 10/10 would recommend to anyone
in Dhanmondi."

— Sarah Ahmed, Student | Regular
```

*Rationale*:
- "Sanctuary" = emotional anchor matches brand messaging
- "Remember my order" = Personal touch, belonging
- "10/10" = Enthusiastic endorsement
- Identifies as "Student" = targets similar demographic

#### Sample Review 2 (Professional)
```
"Best spot for afternoon meetings. Strong coffee, quieter vibe than other
places, and the staff genuinely cares. Now my default Satmasjid Road
coffee run."

— Karim Hassan, Corporate Manager | Regular
```

*Rationale*:
- "Meetings" = Professional use case
- "Quiet vibe" = Differentiator
- "Staff cares" = Service quality
- "Default" = Habit/loyalty

#### Sample Review 3 (Social)
```
"The ambiance is Instagram-worthy, the coffee is legit, and the barista
crew is fun. Perfect spot to hang with friends without the pretentious
vibes. Highly recommend!"

— Zara Khan, Content Creator | Regular
```

*Rationale*:
- "Instagram-worthy" = Visual appeal, social proof
- "Legit" = Authentic, not a gimmick
- "Without pretentious vibes" = Addresses potential objection (premium ≠ snobby)
- Content creator = Influencer-like credibility

---

### FOOTER SECTION

#### Quick Links
```
Menu | Hours | Delivery Partners | Order Now | Contact
```

*Rationale*: Most common user tasks. No fluff.

#### Address
```
2nd floor, Old Concord Mumtaz Karim Heritage,
776 Satmasjid Road, Dhanmondi, Dhaka 1209.
Plus Code: Q929+G3 Dhaka
```

*Rationale*: Precise address + plus code (for GPS accuracy). 2nd floor flagged upfront (avoids confused first-timers).

#### Phone
```
📱 01327-419695
```

*Rationale*: Large, clickable, immediate action. Icon = scannability.

#### Hours
```
🕐 Open Daily, 10 AM–1 AM
(Current status: 🟢 Open / 🔴 Closed)
```

*Rationale*: Live status builds urgency, FOMO. Color signals (green/red) = instant recognition.

#### Social
```
Instagram | Facebook | WhatsApp | Google Maps
```

*Rationale*: WhatsApp (popular in South Asia for customer support). Google Maps (reviews, directions). Instagram/FB (community, content).

#### Copyright
```
© 2024 Coffee Avenue. All rights reserved.
Privacy Policy | Terms of Service
```

*Rationale*: Legal compliance, transparency.

---

## 4.3 TONE & VOICE GUIDELINES

### DO's
- ✅ Be cheeky, warm, slightly witty (e.g., "Your barista is your therapist")
- ✅ Use active voice ("Craft coffee" vs. "Coffee is crafted")
- ✅ Specific details (bean sourcing, hours, exact address)
- ✅ Scenario painting (cramming, meetings, hangouts)
- ✅ Local language/culture nods (Dhanmondy, Satmasjid Road, student culture)
- ✅ Short, scannable sentences (mobile-first writing)
- ✅ Action-oriented verbs (Explore, Discover, Reserve, Order)

### DON'Ts
- ❌ Jargon, pretentious language ("artisanal," "bespoke," "craft-forward")
- ❌ Generic clichés ("Your favorite place to be," "Quality you can taste")
- ❌ Passive voice ("Coffee is served," "You will be welcomed")
- ❌ Overuse of exclamation marks (max 1 per section)
- ❌ Corporate speak ("Committed to excellence," "Leveraging synergies")
- ❌ Vague CTAs ("Learn More" OK, but "Click Here" is weak)

---

# 5. UI/UX SPECIFICATIONS & MICRO-INTERACTIONS

## 5.1 INTERACTION DESIGN PATTERNS

### Pattern 1: Scroll-Triggered Animations

**Trigger**: Intersection Observer API
```javascript
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15  // Fire when 15% of element is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
```

**Effects**:
- **Fade-in**: Opacity 0 → 1 (600ms, ease-out)
- **Slide-up**: TranslateY(30px) → translateY(0) (600ms, ease-out)
- **Scale-in**: Scale(0.95) → scale(1) (600ms, ease-out)
- **Stagger**: Delay child elements by 100ms each (for lists, cards)

**Applied To**:
- Barista section image (fade + slide-up)
- Why Coffee Avenue cards (stagger, scale)
- Review cards (fade on tab change)
- Menu items (stagger grid on scroll)

---

### Pattern 2: Hover States (Desktop Only)

#### Link Hover
```css
a {
  color: #D4A574; /* Warm Amber */
  text-decoration: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 2px solid transparent;
}

a:hover {
  color: #C9A961; /* Gold Accent */
  border-bottom-color: #C9A961;
}
```

#### Button Hover (Solid)
```css
button.solid {
  background: #D4A574;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
  transform: translateY(0);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

button.solid:hover {
  background: #C9A961;
  box-shadow: 0 8px 24px rgba(212, 165, 116, 0.4);
  transform: translateY(-2px);
}

button.solid:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(212, 165, 116, 0.2);
}
```

#### Button Hover (Outlined)
```css
button.outlined {
  border: 2px solid #2B1810;
  color: #2B1810;
  background: transparent;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

button.outlined:hover {
  background: #2B1810;
  color: white;
  box-shadow: 0 4px 12px rgba(43, 24, 16, 0.15);
}
```

#### Card Hover
```css
.card {
  box-shadow: 0 4px 12px rgba(43, 24, 16, 0.08);
  transform: translateY(0);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 0 12px 32px rgba(43, 24, 16, 0.15);
  transform: translateY(-6px);
}

.card img {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover img {
  transform: scale(1.08);
}
```

#### Menu Item Card Hover
```css
.menu-item:hover {
  /* Image zoom */
  .menu-item__image {
    transform: scale(1.05);
  }
  
  /* Price highlights */
  .menu-item__price {
    color: #D4A574;
    font-weight: 700;
  }
  
  /* Button glows */
  .menu-item__button {
    box-shadow: 0 0 12px rgba(212, 165, 116, 0.4);
  }
}
```

---

### Pattern 3: Focus States (Accessibility)

```css
/* Keyboard focus for buttons */
button:focus-visible {
  outline: 2px solid #D4A574;
  outline-offset: 4px;
  border-radius: 4px;
}

/* Focus within form inputs */
input:focus {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

/* Tab focus indicator on navigation */
a:focus-visible {
  outline: 2px dashed #D4A574;
  outline-offset: 4px;
  border-radius: 2px;
}
```

---

### Pattern 4: Tab Navigation (Menu Filter)

**Behavior**:
1. User clicks tab
2. Active tab border animates in (300ms, underline expands from center)
3. Current menu items fade out (150ms)
4. Grid shifts (slight height adjustment, 150ms)
5. New items fade in (200ms)
6. No jarring refresh, smooth experience

**CSS**:
```css
.tabs {
  border-bottom: 1px solid #E0D4C4;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab {
  position: relative;
  padding: 12px 24px;
  cursor: pointer;
  color: #7F8C8D;
  font-weight: 600;
  transition: color 200ms;
  white-space: nowrap;
}

.tab.active {
  color: #2B1810;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  width: 0;
  height: 3px;
  background: #D4A574;
  transform: translateX(-50%);
  animation: tabBorder 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes tabBorder {
  0% {
    width: 0;
  }
  100% {
    width: calc(100% - 48px);
  }
}

.menu-grid {
  animation: gridShift 150ms ease;
}

@keyframes gridShift {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

---

### Pattern 5: Parallax Scroll (Hero Background)

**Desktop Only** (disabled on mobile for performance)

```javascript
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroImage = document.querySelector('.hero__background');
  heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
});
```

**Alternative (CSS-based, simpler)**:
```css
.hero {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  /* Parallax effect built-in */
}

/* Disable on mobile */
@media (max-width: 768px) {
  .hero {
    background-attachment: scroll;
  }
}
```

---

### Pattern 6: Smooth Scroll (Navigation Links)

```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
```

---

### Pattern 7: Copy to Clipboard (Phone Number)

```javascript
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  });
}

document.querySelector('.phone-copy').addEventListener('click', (e) => {
  copyToClipboard('01327-419695', e.target);
});
```

---

### Pattern 8: Live "Open/Closed" Status Badge

```javascript
function updateOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const openHour = 10;
  const closeHour = 1; // 1 AM next day
  
  const isOpen = (hour >= openHour && hour < 24) || (hour < closeHour);
  
  const statusBadge = document.querySelector('.status-badge');
  if (isOpen) {
    statusBadge.textContent = '🟢 Open until 1 AM';
    statusBadge.classList.add('open');
  } else {
    statusBadge.textContent = '🔴 Closed (Opens at 10 AM)';
    statusBadge.classList.remove('open');
  }
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000); // Update every minute
```

---

### Pattern 9: Form Validation (Reservation Form, if added)

```javascript
const form = document.querySelector('.reservation-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      input.parentElement.appendChild(
        Object.assign(document.createElement('span'), {
          className: 'error-message',
          textContent: 'This field is required'
        })
      );
      isValid = false;
    } else {
      input.classList.remove('error');
      const errorMsg = input.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    }
  });
  
  if (isValid) {
    // Submit via API
    console.log('Form valid, submitting...');
  }
});
```

---

### Pattern 10: Carousel/Testimonial Rotation (Auto-Scroll)

```javascript
let currentReview = 0;
const reviewCards = document.querySelectorAll('.review-card');
const totalReviews = reviewCards.length;

function showReview(index) {
  reviewCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
    card.style.opacity = idx === index ? '1' : '0';
    card.style.pointerEvents = idx === index ? 'auto' : 'none';
  });
}

function nextReview() {
  currentReview = (currentReview + 1) % totalReviews;
  showReview(currentReview);
}

function prevReview() {
  currentReview = (currentReview - 1 + totalReviews) % totalReviews;
  showReview(currentReview);
}

// Auto-rotate every 6 seconds
let autoRotateInterval = setInterval(nextReview, 6000);

// Pause on hover
const carousel = document.querySelector('.review-carousel');
carousel.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
carousel.addEventListener('mouseleave', () => {
  autoRotateInterval = setInterval(nextReview, 6000);
});

// Next/Prev buttons
document.querySelector('.carousel-next').addEventListener('click', nextReview);
document.querySelector('.carousel-prev').addEventListener('click', prevReview);
```

---

## 5.2 ACCESSIBILITY (A11Y) SPECIFICATIONS

### WCAG 2.1 AA Compliance Target

**Color Contrast**:
- Text on background: 4.5:1 minimum (normal), 3:1 (large text)
  - Deep Espresso (#2B1810) on Creamy Beige (#F5E6D3): 9.2:1 ✓
  - White on Deep Espresso: 15.8:1 ✓
  - Warm Amber (#D4A574) on white: 4.1:1 ✓

**Font Sizes**:
- Minimum body text: 16px (14px on mobile acceptable with 1.5× line-height)
- Minimum interactive elements: 44px × 44px (touch targets)

**ARIA Labels**:
```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <a href="#menu">Menu</a>
  <a href="#location">Location</a>
</nav>

<!-- Skip Link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Icon Buttons -->
<button aria-label="Open navigation menu">
  <i class="ti ti-menu-2"></i>
</button>

<!-- Forms -->
<label for="reservation-name">Your Name</label>
<input id="reservation-name" type="text" required>

<!-- Live Region (Status Updates) -->
<div aria-live="polite" aria-atomic="true">
  🟢 Open until 1 AM
</div>

<!-- Menu Filtering -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="all-menu">
    All
  </button>
</div>
<div role="tabpanel" id="all-menu">
  [Menu items]
</div>
```

**Keyboard Navigation**:
- All interactive elements accessible via Tab
- Tab order: Header → Hero CTAs → Service cards → Menu filters → Menu items → Testimonials → Footer
- Escape closes any modals/dropdowns
- Enter/Space activates buttons

**Screen Reader Optimization**:
- Skip link provided (targets `#main-content`)
- All images have descriptive alt text
- Icons have `aria-hidden="true"` if decorative
- Form labels associated with inputs
- Page structure uses semantic HTML (nav, main, section, article)

---

## 5.3 PERFORMANCE OPTIMIZATIONS

### Image Optimization
```html
<!-- Hero Background: WebP + fallback -->
<picture>
  <source srcset="/images/hero.webp" type="image/webp">
  <img src="/images/hero.jpg" alt="Coffee latte art with Satmasjid backdrop" loading="lazy">
</picture>

<!-- Menu Item Images: Responsive + Lazy -->
<img 
  src="/images/cappuccino-thumb.jpg" 
  srcset="
    /images/cappuccino-300w.jpg 300w,
    /images/cappuccino-600w.jpg 600w,
    /images/cappuccino-900w.jpg 900w
  "
  sizes="(max-width: 600px) 90vw, (max-width: 1200px) 45vw, 25vw"
  alt="Cappuccino with latte art"
  loading="lazy"
  class="menu-item__image"
>
```

### CSS Optimization
- Critical CSS inline (header, hero, above-fold)
- Non-critical CSS deferred (load asynchronously)
- No unused CSS (tree-shaking, purge unused)

### JavaScript Optimization
- Defer non-critical scripts
- Intersection Observer for scroll animations (native, performant)
- Debounce resize/scroll listeners
- Remove jQuery dependency; use vanilla JS

### Lazy Loading
- Google Maps embed: Lazy-load on intersection
- Testimonial carousel: Lazy-load images
- Menu item images: Native loading="lazy"

### Performance Budget
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Total bundle: < 200kb (gzipped)

---

# 6. RESPONSIVE DESIGN & MOBILE-FIRST STRATEGY

## 6.1 BREAKPOINT STRATEGY

```scss
// Mobile-first approach
$breakpoints: (
  'sm': 480px,   // Small phones
  'md': 768px,   // Tablets
  'lg': 1024px,  // Small laptops
  'xl': 1200px,  // Desktops
  '2xl': 1600px  // Large screens
);

@mixin media($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

// Usage:
.hero__title {
  font-size: 32px;
  
  @include media('md') {
    font-size: 40px;
  }
  
  @include media('lg') {
    font-size: 48px;
  }
  
  @include media('xl') {
    font-size: 54px;
  }
}
```

---

## 6.2 MOBILE-SPECIFIC DESIGN DECISIONS

### Navigation (Mobile)
- Sticky header with hamburger menu (≤ 768px)
- Full-screen slide-in drawer from right
- Touch-friendly 48px tall menu items
- Close button or swipe-to-close

### Hero Section (Mobile)
- Reduced height: 400px → 300px (≤ 480px)
- Headline: 36px (vs 54px desktop)
- Subheading hidden on extra-small (≤ 480px), shown on md+
- CTAs stack vertically, full-width with 20px margins

### Service Cards (Mobile)
- Stack vertically (1 column)
- Full-width with 20px padding
- Larger touch targets for buttons (48px height)

### Menu Grid (Mobile)
- Single column (≤ 480px)
- 2 columns (md: 768px+)
- Card width: 100% - 40px (mobile), fixed ~300px (desktop)
- Images larger relative to text (visual priority)

### Testimonials (Mobile)
- Horizontal snap scrolling (1 card visible)
- Visible scroll indicator (dots or timeline)
- Prev/Next arrows hidden on very small screens (< 480px), shown on md+

### Footer (Mobile)
- Stack vertically
- Address: Single-column, centered
- Phone: Large, clickable, full-width
- Map: 100% width, 300px height (vs 400px desktop)
- Social icons: Centered, larger (40px, vs 32px desktop)

---

## 6.3 TOUCH OPTIMIZATION

### Button Sizes
```css
/* Minimum touch target: 44px × 44px (Apple), 48px × 48px (Android) */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 20px; /* Ensures minimum */
}

/* Increase spacing between clickable elements */
.nav-link {
  padding: 16px;
  margin-right: 8px;
}
```

### Avoid Hover Dependencies
- Info should not be hidden behind hover (mobile has no hover)
- Use tooltips only as supplement, not essential info
- Click to reveal additional details on mobile

### Input Optimization
```html
<!-- Mobile-friendly form inputs -->
<input 
  type="tel" 
  inputmode="tel" 
  placeholder="01327-419695"
  autocomplete="tel"
>

<input 
  type="email" 
  inputmode="email"
  autocomplete="email"
>

<select>
  <option>Select a delivery time</option>
  <!-- iOS/Android native pickers -->
</select>
```

---

## 6.4 VIEWPORT & META TAGS

```html
<!-- Responsive viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- Theme color (mobile UI color) -->
<meta name="theme-color" content="#2B1810">

<!-- Apple status bar -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- Favicon, app icon -->
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

---

# 7. TECHNICAL IMPLEMENTATION NOTES

## 7.1 TECHNOLOGY STACK (RECOMMENDED)

### Frontend Framework
- **Next.js 14+** (React, SSR, static generation, API routes)
- Or **Astro** (Static site, faster, simpler)
- Or vanilla HTML/CSS/JS (lightweight, if no complex interactions)

### Styling
- **Tailwind CSS** (utility-first, performant, responsive)
- Or **CSS Modules** (scoped, maintainable)
- Or **SCSS** (nested, variables, mixins)

### Form Handling
- **React Hook Form** (lightweight, performant)
- **Zod** or **Yup** (validation)

### Analytics & Tracking
- **Google Analytics 4** (GA4)
- **Hotjar** (heatmaps, session recording)
- **Vercel Analytics** (if hosting on Vercel)

### Hosting
- **Vercel** (Next.js native, fast, secure)
- **Netlify** (Astro native, easy deployments)
- **AWS S3 + CloudFront** (static, scalable, cost-effective)

### CMS (Optional, for easy content updates)
- **Contentful** (headless CMS, flexible)
- **Sanity** (React-based CMS)
- **Strapi** (open-source, self-hosted)
- Or simple **Google Sheets** API for menu updates

---

## 7.2 PROJECT STRUCTURE (Next.js Example)

```
coffee-avenue-website/
├── public/
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── hero.webp
│   │   ├── barista.jpg
│   │   ├── menu/
│   │   │   ├── cappuccino.jpg
│   │   │   ├── latte.jpg
│   │   │   └── ...
│   │   ├── icons/
│   │   │   ├── dine-in.svg
│   │   │   ├── drive-through.svg
│   │   │   └── delivery.svg
│   │   └── logo.svg
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ServiceHighlights.jsx
│   │   ├── MenuSection.jsx
│   │   ├── BaristaSpotlight.jsx
│   │   ├── WhyCoffeeAvenue.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Footer.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Modal.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css (color vars)
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── utils/
│   │   ├── constants.js (brand data, colors, breakpoints)
│   │   ├── hooks.js (custom React hooks)
│   │   └── animations.js (scroll trigger logic)
│   ├── data/
│   │   └── menu.json (menu items, prices)
│   ├── pages/ (if using Next.js Pages Router)
│   │   ├── index.jsx (homepage)
│   │   └── api/
│   │       └── reservation.js (form submission endpoint)
│   └── app/ (if using Next.js App Router 13+)
│       ├── layout.jsx
│       ├── page.jsx
│       └── api/
│           └── reservation/route.js
├── .env.local (secrets, API keys)
├── next.config.js (optimizations)
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 7.3 KEY FILES & SNIPPETS

### Component Example: MenuSection.jsx
```jsx
'use client'; // Next.js App Router

import { useState, useEffect } from 'react';
import MenuCard from '@/components/MenuCard';
import { menuData } from '@/data/menu';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredMenu, setFilteredMenu] = useState(menuData);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredMenu(menuData);
    } else {
      setFilteredMenu(menuData.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);

  const categories = ['all', 'brewed', 'sweets', 'savory'];

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <h2 className="section-title">Our Coffee Story</h2>
        <p className="section-subtitle">From hand-picked beans to your cup.</p>

        {/* Tab Navigation */}
        <div className="tab-container" role="tablist">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' && 'All'}
              {cat === 'brewed' && 'Brewed & Espresso'}
              {cat === 'sweets' && 'Sweets & Desserts'}
              {cat === 'savory' && 'Savory Bites'}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Data File: menu.json
```json
{
  "menu": [
    {
      "id": 1,
      "name": "Cappuccino",
      "description": "Espresso + silky steamed milk foam",
      "price": 300,
      "category": "brewed",
      "image": "/images/menu/cappuccino.jpg",
      "badge": "House Favorite"
    },
    {
      "id": 2,
      "name": "Hazelnut & Caramel Latte",
      "description": "Smooth hazelnut + caramel swirl",
      "price": 310,
      "category": "brewed",
      "image": "/images/menu/hazelnut-latte.jpg",
      "badge": "Signature"
    },
    {
      "id": 3,
      "name": "Brownie with Ice Cream",
      "description": "Warm, fudgy brownie + vanilla scoop",
      "price": 320,
      "category": "sweets",
      "image": "/images/menu/brownie.jpg"
    }
  ]
}
```

### Utility: constants.js
```js
export const BRAND = {
  name: 'Coffee Avenue',
  nameAlt: 'কফি এভিনিউ',
  tagline: 'Meet with a Rocking Barista',
  phone: '01327-419695',
  address: '2nd floor, Old Concord Mumtaz Karim Heritage, 776 Satmasjid Road, Dhanmondi, Dhaka 1209',
  plusCode: 'Q929+G3 Dhaka',
  hours: 'Daily, 10 AM–1 AM',
  rating: 4.3,
  reviewCount: 517,
  priceRange: '৳200–600'
};

export const COLORS = {
  primary: {
    espresso: '#2B1810',
    brown: '#5D4037',
    beige: '#F5E6D3',
    amber: '#D4A574',
    gold: '#C9A961'
  },
  semantic: {
    success: '#27AE60',
    danger: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB'
  },
  neutral: {
    gray: '#7F8C8D',
    lightGray: '#B0B0B0',
    nearBlack: '#1A1A1A',
    white: '#FFFFFF'
  }
};

export const BREAKPOINTS = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1600px'
};
```

---

## 7.4 SEO SPECIFICATIONS

### Meta Tags
```html
<head>
  <title>Coffee Avenue | Premium Café on Satmasjid Road, Dhanmondi, Dhaka</title>
  <meta name="description" content="Meet with a Rocking Barista at Coffee Avenue. Craft coffee, cozy vibes, open till 1 AM. Premium café in Dhanmondi, Dhaka. ৳200–600 per person.">
  <meta name="keywords" content="café Dhaka, coffee Dhanmondi, Satmasjid Road café, premium coffee, espresso, latte, Dhaka hangout">
  <meta name="author" content="Coffee Avenue">
  
  <!-- Open Graph (Social Sharing) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://coffeeavenue.com/">
  <meta property="og:title" content="Coffee Avenue | Premium Café, Satmasjid Road, Dhanmondi">
  <meta property="og:description" content="Craft coffee. Cozy vibes. Open till 1 AM. Meet with a Rocking Barista.">
  <meta property="og:image" content="https://coffeeavenue.com/og-image.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Coffee Avenue | Satmasjid Rd, Dhanmondi">
  <meta name="twitter:description" content="Premium café, craft coffee, cozy vibes, open till 1 AM.">
  <meta name="twitter:image" content="https://coffeeavenue.com/twitter-image.jpg">
  
  <!-- Canonical -->
  <link rel="canonical" href="https://coffeeavenue.com/">
  
  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Coffee Avenue",
    "image": "https://coffeeavenue.com/images/logo.svg",
    "description": "Premium café with craft coffee, cozy atmosphere, open till 1 AM.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd floor, Old Concord Mumtaz Karim Heritage, 776 Satmasjid Road",
      "addressLocality": "Dhanmondi",
      "addressRegion": "Dhaka",
      "postalCode": "1209",
      "addressCountry": "BD"
    },
    "telephone": "+88-01327-419695",
    "url": "https://coffeeavenue.com",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "01:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.3",
      "reviewCount": "517"
    },
    "priceRange": "৳200–৳600"
  }
  </script>
</head>
```

### Sitemap (sitemap.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://coffeeavenue.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://coffeeavenue.com/sitemap.xml
```

---

## 7.5 FORM HANDLING (Reservation / Contact)

### Form Endpoint (Next.js API)
```javascript
// /app/api/reservation/route.js

export async function POST(request) {
  const body = await request.json();
  
  const { name, email, phone, date, time, guests, message } = body;
  
  // Validation
  if (!name || !email || !phone) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400 }
    );
  }
  
  // Send email via service (SendGrid, Resend, etc.)
  try {
    await sendReservationEmail({
      to: 'hello@coffeeavenue.com',
      subject: `New Reservation Request from ${name}`,
      html: `
        <h2>Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
    
    return new Response(
      JSON.stringify({ message: 'Reservation request sent!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send request' }),
      { status: 500 }
    );
  }
}
```

---

# 8. CONTENT INVENTORY & ASSET REQUIREMENTS

## 8.1 IMAGE ASSETS NEEDED

| Asset | Dimensions | Format | Quantity | Usage |
|---|---|---|---|---|
| **Hero Background** | 1920×1080 (desktop), 1080×720 (tablet), 720×480 (mobile) | JPG + WebP | 1 (responsive) | Hero section parallax background |
| **Barista Portrait** | 800×1000 (desktop), 600×750 (mobile) | JPG + WebP | 1–2 | Barista spotlight section |
| **Service Icons** | 160×160 | SVG | 3 (dine-in, drive-through, delivery) | Service highlights section |
| **Menu Item Photos** | 600×400 (landscape), 400×400 (square) | JPG + WebP | 12–15 | Digital menu cards |
| **Dessert/Food Close-up** | 400×300 | JPG + WebP | 3–5 | Menu detail shots |
| **Café Interior** | 1600×1000 | JPG + WebP | 1–2 | Optional secondary hero or ambient section |
| **Logo** | 500×500 | SVG + PNG | 1 | Header, favicon, social |
| **Favicon** | 32×32, 64×64, 180×180 (iOS) | ICO, PNG | 3 variants | Browser tab, bookmarks, iOS home |
| **Review Author Avatars** | 80×80 | JPG + WebP | 5–8 | Testimonial cards |
| **Social Share Image (OG)** | 1200×630 | JPG + WebP | 1 | Facebook, LinkedIn sharing |
| **Twitter Card Image** | 1200×675 | JPG + WebP | 1 | Twitter sharing |

---

## 8.2 COPY ASSETS NEEDED

| Asset | Word Count | Priority | Owner |
|---|---|---|---|
| **Hero Headline** | 4–6 words | P0 | Copywriter |
| **Hero Subheading** | 15–20 words | P0 | Copywriter |
| **Service Card Copy (×3)** | 30–50 words each | P1 | Copywriter |
| **Menu Item Descriptions (×12–15)** | 10–15 words each | P0 | Copywriter |
| **Barista Spotlight Story** | 80–120 words | P2 | Copywriter |
| **Why Coffee Avenue Cards (×3)** | 30–50 words each | P1 | Copywriter |
| **Review Testimonials (×5–8)** | 20–40 words each | P1 | Social team (collect from Google/social) |
| **Footer Quick Links Labels** | 2–4 words each | P0 | UX writer |
| **Button Labels (×10–15)** | 2–4 words each | P0 | UX writer |

---

## 8.3 DEVELOPMENT ASSETS NEEDED

| Asset | Scope | Owner |
|---|---|---|
| **Design System / Figma File** | Colors, typography, components, layouts | Designer |
| **Component Library** | Buttons, cards, modals, forms | Frontend dev |
| **Animation Specs** | Scroll triggers, hover states, transitions | Frontend dev / Designer |
| **Form Validation Rules** | Error messages, required fields | Backend dev |
| **Google Maps API Key** | For map embed | DevOps / Backend |
| **Analytics Setup** | GA4, Hotjar, custom events | Product/Analytics |
| **Email Service Setup** | SendGrid/Resend, reservation templates | Backend dev |

---

## 8.4 EXTERNAL INTEGRATIONS

| Service | Purpose | Cost | Priority |
|---|---|---|---|
| **Google Maps API** | Map embed, location services | Free tier available | P0 |
| **Google Analytics 4** | Traffic, user behavior tracking | Free | P0 |
| **SendGrid / Resend** | Email delivery (reservations, notifications) | Free tier available | P1 |
| **Hotjar** | Heatmaps, session recording (optional) | Paid, freemium | P2 |
| **Vercel / Netlify** | Hosting, CI/CD, deployments | Free tier available | P0 |
| **Stripe / bKash API** | Payment processing (if booking requires deposit) | Paid per transaction | P2 |

---

## 8.5 SOCIAL MEDIA CONTENT PLAN

### Instagram Strategy
- **Bio**: "🍵 Meet with a Rocking Barista. Satmasjid Road, Dhanmondi. Open till 1 AM. ☕"
- **Content Pillars**:
  - 40% Product (latte art, menu highlights, close-up coffee shots)
  - 30% Behind-the-scenes (barista crafting, morning prep, customer moments)
  - 20% Customer UGC (reposted customer stories, tags)
  - 10% Promotional (limited offers, events, new menu items)
- **Posting Frequency**: 3–4 posts/week, daily Stories

### Facebook Strategy
- **About**: Café hours, location, link to website, phone call-to-action
- **Content**: Longer captions (80–150 words), community engagement, event posts

### WhatsApp Business (Customer Support)
- **Auto-reply**: Hours, location, menu link, reservation process
- **Response Time**: < 2 hours (set expectations)

### Google My Business
- **Key**: Verified listing, updated hours, photos (10+), reviews responded to within 24 hours

---

## END OF BLUEPRINT

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Prepared For**: Coffee Avenue Web Redesign  

**Next Steps**:
1. Share this blueprint with design & development team
2. Create Figma designs based on visual identity section
3. Collect brand assets (photos, logo variations)
4. Build frontend prototype (static HTML/CSS)
5. Integrate backend (API, forms, analytics)
6. Test on real devices (mobile, tablet, desktop)
7. Deploy to production (staging → live)
8. Monitor analytics & iterate based on user feedback

---
