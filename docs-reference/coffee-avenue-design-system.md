# COFFEE AVENUE — VISUAL DESIGN SYSTEM & COMPONENT SPEC SHEET
**Quick Reference Guide for Designers & Developers**

---

## COLOR PALETTE — QUICK REFERENCE

### Primary Colors
```
┌─────────────────────────────────────────┐
│ DEEP ESPRESSO                           │
│ #2B1810 | RGB(43, 24, 16)              │
│ [████████████] Primary dark, headings   │
├─────────────────────────────────────────┤
│ RICH BROWN                              │
│ #5D4037 | RGB(93, 64, 55)              │
│ [████████████] Secondary accent         │
├─────────────────────────────────────────┤
│ CREAMY BEIGE                            │
│ #F5E6D3 | RGB(245, 230, 211)           │
│ [████████████] Light background         │
├─────────────────────────────────────────┤
│ WARM AMBER                              │
│ #D4A574 | RGB(212, 165, 116)           │
│ [████████████] Accent, CTAs             │
├─────────────────────────────────────────┤
│ GOLD ACCENT                             │
│ #C9A961 | RGB(201, 169, 97)            │
│ [████████████] Premium, hover           │
└─────────────────────────────────────────┘
```

### Semantic Colors
```
Success: #27AE60 (Green) — Order confirmed, available
Error:   #E74C3C (Red) — Out of stock, closed
Warning: #F39C12 (Orange) — Limited time, urgent
Info:    #3498DB (Blue) — General information
```

---

## TYPOGRAPHY SYSTEM

### Heading Font: **Inter Bold** or **Sora Bold**
```
H1: 54px (desktop) / 36px (mobile) | Weight 700 | Line-height 1.2
H2: 42px (desktop) / 28px (mobile) | Weight 700 | Line-height 1.3
H3: 28px (desktop) / 20px (mobile) | Weight 600 | Line-height 1.4
H4: 18px | Weight 600 | Line-height 1.4
```

### Body Font: **Poppins** or **Outfit Regular**
```
Body: 16px (18px desktop) | Weight 400 | Line-height 1.6
Small: 14px | Weight 400 | Line-height 1.5
Button: 16px | Weight 600 | Letter-spacing +0.5px
```

### Accent Font (Taglines): **Playfair Display Bold**
```
Size: 28px–36px | Weight 700
Used for: "Meet with a Rocking Barista", brand moments
```

---

## COMPONENT SPECIFICATIONS

### BUTTONS

#### Solid Button (Primary CTA)
```
Background: #D4A574 (Warm Amber)
Text Color: #FFFFFF (White)
Text Weight: 600
Border: None
Padding: 12px 24px
Border-radius: 8px
Font-size: 16px
Cursor: pointer

Hover State:
  Background: #C9A961 (Gold)
  Box-shadow: 0 8px 24px rgba(212, 165, 116, 0.4)
  Transform: translateY(-2px)
  Transition: 200ms ease

Active State:
  Transform: translateY(0)
  Box-shadow: 0 2px 4px rgba(212, 165, 116, 0.2)

Disabled State:
  Background: #B0B0B0 (Gray)
  Cursor: not-allowed
  Opacity: 0.6
```

#### Outlined Button (Secondary CTA)
```
Background: transparent
Border: 2px solid #2B1810 (Deep Espresso)
Text Color: #2B1810
Text Weight: 600
Padding: 10px 22px (adjusted for 2px border)
Border-radius: 8px
Font-size: 16px

Hover State:
  Background: #2B1810
  Color: #FFFFFF
  Box-shadow: 0 4px 12px rgba(43, 24, 16, 0.15)
  Transition: 200ms ease

Active State:
  Background: #1A1A1A (darker)
  Transform: scale(0.98)
```

#### Button Sizes
```
Small:  height 36px | padding 8px 16px | font-size 14px
Medium: height 44px | padding 12px 24px | font-size 16px
Large:  height 52px | padding 16px 32px | font-size 18px

Touch Target (Mobile Minimum): 44px × 44px
Recommended (Android): 48px × 48px
```

---

### CARDS

#### Standard Card (Service/Why Card)
```
Background: #F5E6D3 (Creamy Beige)
Border: None
Border-radius: 12px
Padding: 32px 24px
Box-shadow: 0 4px 12px rgba(43, 24, 16, 0.08)
Min-height: 280px

Hover State (Desktop):
  Box-shadow: 0 12px 32px rgba(43, 24, 16, 0.15)
  Transform: translateY(-6px)
  Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)

Typography:
  Title: 20px | Weight 600 | Color #2B1810
  Copy: 16px | Weight 400 | Color #7F8C8D | Line-height 1.6
  Icon: 48px | Color #D4A574
```

#### Menu Item Card
```
Background: #FFFFFF (White)
Border: 1px solid #E0D4C4 (soft border)
Border-radius: 8px
Padding: 0
Width: 280px (desktop) | 100% - 40px (mobile)
Height: auto

Image Section:
  Height: 180px (desktop) | 160px (mobile)
  Object-fit: cover
  Border-radius: 8px 8px 0 0
  Aspect-ratio: 16/9

Content Section:
  Padding: 16px

Typography:
  Title: 18px | Weight 600 | Color #2B1810
  Description: 14px | Weight 400 | Color #7F8C8D | Line-height 1.5
  Price: 16px | Weight 700 | Color #D4A574

Button (Add to Cart):
  Width: calc(100% + 32px)
  Margin: 12px -16px -16px -16px
  Height: 40px
  Background: Outlined (transparent, border #E0D4C4)
  Hover: Background #D4A574, color white

Card Hover:
  Box-shadow: 0 8px 20px rgba(43, 24, 16, 0.12)
  Image: transform scale(1.05)
  Transition: 300ms
```

#### Review/Testimonial Card
```
Background: rgba(255, 255, 255, 0.1) (semi-transparent on dark)
Border: 1px solid rgba(255, 255, 255, 0.15)
Border-radius: 12px
Padding: 32px 28px
Backdrop-filter: blur(4px) (optional, premium)
Width: 320px (desktop) | 100% (mobile)

Typography:
  Star Rating: 16px | Color #D4A574
  Quote: 16px | Weight 400 | Color #FFFFFF | Italic | Line-height 1.8
  Author: 14px | Weight 600 | Color #D4A574
  Detail: 13px | Weight 400 | Color rgba(255, 255, 255, 0.7)

Avatar:
  Size: 40px circle
  Margin-right: 12px
```

---

### INPUTS & FORMS

#### Text Input
```
Background: #FFFFFF
Border: 1px solid #E0D4C4
Border-radius: 8px
Padding: 12px 16px
Font-size: 16px
Font-family: var(--font-sans)
Height: 44px (min-height for touch)
Color: #2B1810

Placeholder:
  Color: #B0B0B0

Focus State:
  Border-color: #D4A574
  Box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1)
  Outline: none

Error State:
  Border-color: #E74C3C
  Box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1)
  
Error Message:
  Color: #E74C3C
  Font-size: 12px
  Margin-top: 4px
```

#### Select Dropdown
```
Same as text input
Padding-right: 40px (for arrow icon)
Background-image: Custom arrow SVG (right-aligned)
Appearance: none (remove default styling)
Cursor: pointer
```

#### Checkbox
```
Size: 20px × 20px
Border: 2px solid #D4A574
Border-radius: 4px
Background: #FFFFFF
Cursor: pointer

Checked State:
  Background: #D4A574
  Border-color: #D4A574
  Content: ✓ (checkmark, white, 14px)

Focus State:
  Box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2)
```

#### Radio Button
```
Size: 20px × 20px (outer circle)
Border: 2px solid #D4A574
Border-radius: 50%
Background: #FFFFFF
Cursor: pointer

Checked State:
  Inner circle: 10px diameter
  Background: #D4A574
  Position: center

Focus State:
  Box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2)
```

---

### NAVIGATION & HEADER

#### Sticky Header
```
Height: 70px (desktop) | 64px (mobile)
Background: #2B1810 (Deep Espresso)
Backdrop-filter: blur(10px)
Opacity: 0.95
Position: sticky (top: 0)
Z-index: 1000
Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

Layout:
  [Logo 48px] [Spacer] [Nav Links] [Spacer] [Call Button] [CTA]
  Padding: 0 40px (desktop) | 0 20px (mobile)
  Alignment: flex | justify-content: space-between | align-items: center

Logo:
  Width: 48px
  Height: 48px
  Aspect-ratio: 1/1

Nav Links (Desktop Only):
  Font-size: 16px
  Color: #FFFFFF
  Weight: 400
  Margin: 0 24px
  Hover: Color #D4A574 + underline (3px, bottom, 200ms)

Call Button (Outlined, Mobile Icon):
  Desktop: "☎️ +88 01327-419695" (visible)
  Mobile (md): Icon only (☎️)
  Font-size: 14px

CTA Button:
  "Order Now" (Solid Warm Amber)
  Always visible, prominent
```

#### Mobile Hamburger Menu
```
Icon Size: 24px
Color: #FFFFFF
Trigger: < 768px
Menu Drawer:
  Position: fixed (right: 0, top: 0)
  Width: 100% (full screen)
  Height: 100vh
  Background: #2B1810
  Z-index: 999
  Animation: slideInRight 300ms ease-out
  
Menu Items:
  List (vertical)
  Font-size: 18px
  Color: #FFFFFF
  Padding: 16px 20px per item
  Height: 48px (touch-friendly)
  Hover/Active: Background #5D4037, color #D4A574
  
Close Button:
  Top-right corner (✕)
  Size: 32px
  Color: #FFFFFF
  Tap to close + ESC key to close
```

---

### BADGES & LABELS

#### Featured Badge (Menu/Card)
```
Background: #F5E6D3 (Creamy Beige)
Border: 1px solid #D4A574
Border-radius: 20px (pill)
Padding: 4px 12px
Font-size: 12px
Font-weight: 600
Color: #D4A574
Margin-right: 8px

Examples:
  "HOUSE FAVORITE ⭐"
  "SIGNATURE"
  "NEW"
  "EVENING SPECIAL 🥃"
```

#### Status Badge (Open/Closed)
```
Open Badge:
  Background: #27AE60 (Success Green)
  Color: #FFFFFF
  Icon: 🟢
  Text: "Open until 1 AM"
  Padding: 8px 12px
  Border-radius: 6px
  Font-size: 13px
  Font-weight: 600

Closed Badge:
  Background: #E74C3C (Error Red)
  Color: #FFFFFF
  Icon: 🔴
  Text: "Closed (Opens at 10 AM)"
  Same styling as above
```

---

### DIVIDERS & SPACING

#### Horizontal Divider (HR)
```
Border: none
Border-top: 0.5px solid #E0D4C4
Margin: 32px 0 (standard)
Margin: 40px 0 (between major sections)
Height: 0 (no visible height)
```

#### Section Spacing (Vertical Padding)
```
Small Section: 40px top/bottom
Standard Section: 60px top/bottom
Large Section: 80px top/bottom
Hero Section: 100px top/bottom

Mobile Adjustments:
  Small: 24px
  Standard: 40px
  Large: 60px
```

#### Horizontal Margins/Gaps
```
Page Container Max-width: 1200px
Container Padding: 0 40px (desktop) | 0 20px (tablet) | 0 16px (mobile)
Column Gap: 40px (desktop) | 20px (mobile)
Item Gap (cards): 24px (desktop) | 16px (mobile)
```

---

## ANIMATIONS & TRANSITIONS

### Standard Easing Curve
```
Cubic-bezier(0.4, 0, 0.2, 1)
Used for: Smooth, natural motion
Applies to: All hover, scroll, and UI transitions
```

### Timing
```
Instant:     0ms (no animation)
Quick:       150ms (micro-interactions)
Standard:    200ms (hover states)
Smooth:      300ms (card reveal, scroll)
Slow:        600ms (page load, large transitions)
```

### Animations

#### Fade-in
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 600ms
Easing: ease-out
Applied to: Page sections on scroll, image reveals
```

#### Slide-up
```css
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 600ms
Easing: ease-out
Applied to: Text blocks, cards, barista section
```

#### Scale-in
```css
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
Duration: 600ms
Easing: ease-out
Applied to: Feature cards, menu items
```

#### Stagger Effect (Child Elements)
```
First child: animation-delay 0ms
Second child: animation-delay 100ms
Third child: animation-delay 200ms
Etc.
Creates waterfall/cascade effect for lists
```

#### Hover Lift (Cards)
```css
Transform: translateY(-6px)
Duration: 300ms
Easing: ease
Box-shadow increases simultaneously
```

#### Button Press
```css
Active state: transform: scale(0.98)
Duration: 100ms
Creates tactile "push" feedback
```

---

## ELEVATION & SHADOWS

### Shadow System
```
Elevation 0 (Flat):
  box-shadow: none

Elevation 1 (Subtle):
  box-shadow: 0 2px 4px rgba(43, 24, 16, 0.08)

Elevation 2 (Standard):
  box-shadow: 0 4px 12px rgba(43, 24, 16, 0.08)

Elevation 3 (Medium):
  box-shadow: 0 8px 24px rgba(43, 24, 16, 0.12)

Elevation 4 (High):
  box-shadow: 0 12px 32px rgba(43, 24, 16, 0.15)

Elevation 5 (Maximum):
  box-shadow: 0 16px 40px rgba(43, 24, 16, 0.15)
```

### Usage
```
Default cards: Elevation 2
Hovered cards: Elevation 3–4
Modal/Overlay: Elevation 5
Header/Navigation: Elevation 1
Buttons: Elevation 0 (no shadow by default)
Button Hover: Elevation 3
```

---

## RESPONSIVE BREAKPOINTS

### Device Sizes
```
Extra Small (XS): 0–479px (phones)
Small (SM):       480–767px (large phones)
Medium (MD):      768–1023px (tablets)
Large (LG):       1024–1199px (small laptops)
Extra Large (XL): 1200px+ (desktops)
2XL:              1600px+ (large screens)
```

### Behavior by Breakpoint
```
XS / SM (< 768px):
  - Single-column layouts
  - Hamburger menu
  - Full-width images
  - Stacked buttons
  - Hero height: 400px
  - Font sizes reduced 10–20%

MD (768px–1023px):
  - 2-column layouts
  - Condensed menu
  - Larger touch targets
  - Hero height: 500px

LG / XL (1024px+):
  - 3–4 column layouts
  - Full navigation visible
  - Parallax scroll enabled
  - Hover effects enabled
  - Hero height: 600px
```

---

## ACCESSIBILITY CHECKLIST

- ✅ Color contrast: 4.5:1 minimum (WCAG AA)
- ✅ Font sizes: 16px minimum (14px with 1.5× line-height)
- ✅ Touch targets: 44px × 44px minimum
- ✅ ARIA labels on buttons, icons, forms
- ✅ Keyboard navigation: Tab order logical, focus visible
- ✅ Focus indicators: 2px outline, 4px offset
- ✅ Alt text on images: Descriptive, concise
- ✅ Form labels: Associated with inputs (for/id)
- ✅ Semantic HTML: nav, main, section, article
- ✅ Color not sole indicator: Icons + text for status
- ✅ Motion: Respects prefers-reduced-motion
- ✅ Language: Captions for videos, transcript for audio

---

## CODE EXAMPLES

### CSS Variables (Root)
```css
:root {
  /* Colors */
  --color-primary-espresso: #2B1810;
  --color-primary-brown: #5D4037;
  --color-primary-beige: #F5E6D3;
  --color-primary-amber: #D4A574;
  --color-primary-gold: #C9A961;
  
  --color-semantic-success: #27AE60;
  --color-semantic-danger: #E74C3C;
  --color-semantic-warning: #F39C12;
  --color-semantic-info: #3498DB;
  
  --color-neutral-gray: #7F8C8D;
  --color-neutral-light-gray: #B0B0B0;
  --color-neutral-near-black: #1A1A1A;
  --color-neutral-white: #FFFFFF;
  
  /* Typography */
  --font-sans: 'Poppins', 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --font-mono: 'Courier New', monospace;
  
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --font-weight-extra-bold: 700;
  
  /* Sizing */
  --size-xs: 4px;
  --size-sm: 8px;
  --size-md: 16px;
  --size-lg: 24px;
  --size-xl: 32px;
  --size-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;
  
  /* Transitions */
  --transition-quick: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-standard: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 600ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(43, 24, 16, 0.08);
  --shadow-md: 0 4px 12px rgba(43, 24, 16, 0.08);
  --shadow-lg: 0 8px 24px rgba(43, 24, 16, 0.12);
  --shadow-xl: 0 12px 32px rgba(43, 24, 16, 0.15);
  --shadow-2xl: 0 16px 40px rgba(43, 24, 16, 0.15);
}
```

### Button Mixin (SCSS)
```scss
@mixin button-variant($bg-color, $text-color, $border-color: transparent) {
  background-color: $bg-color;
  color: $text-color;
  border: 2px solid $border-color;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-standard);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  @include button-variant(var(--color-primary-amber), var(--color-neutral-white));
}

.btn-secondary {
  @include button-variant(transparent, var(--color-primary-espresso), var(--color-primary-espresso));
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-espresso);
    color: var(--color-neutral-white);
  }
}
```

### Responsive Mixin (SCSS)
```scss
@mixin media($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: 480px) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: 768px) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: 1024px) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: 1200px) { @content; }
  }
}

// Usage
.menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @include media('md') {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @include media('lg') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## DESIGN TOKENS SUMMARY

| Token | Value | Usage |
|---|---|---|
| **Primary Color** | #2B1810 | Headings, navigation, primary text |
| **Accent Color** | #D4A574 | CTAs, highlights, hover states |
| **Background Light** | #F5E6D3 | Section backgrounds, cards |
| **Background Dark** | #2B1810 | Header, footer, dark sections |
| **Text Primary** | #1A1A1A | Body text, readability |
| **Text Secondary** | #7F8C8D | Subtitles, hints, secondary info |
| **Border Color** | #E0D4C4 | Card borders, dividers |
| **Success** | #27AE60 | Status, confirmation, available |
| **Error** | #E74C3C | Errors, out of stock, closed |
| **Heading Font** | Inter Bold | All headings (H1–H4) |
| **Body Font** | Poppins | Body text, buttons, forms |
| **Accent Font** | Playfair Display | Brand taglines, special moments |
| **Border Radius** | 8px–12px | Buttons, cards, inputs |
| **Shadow** | 0 4px 12px rgba(0,0,0,0.08) | Standard elevation |
| **Transition** | 200–300ms ease | Smooth animations |

---

**This design system ensures:** Consistency across all pages, accessibility compliance, responsive behavior, and brand coherence.

**For Questions:** Refer back to the main blueprint document for detailed specifications, or contact the design lead.

---

**Version**: 1.0 | **Date**: January 2024 | **For**: Coffee Avenue Website Redesign

