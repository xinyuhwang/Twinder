# Twinder Visual Brand Guidelines v0.1

Date: 2026-06-07

## 1. Brand read from the logo

The Twinder logo communicates:

- **Duality:** metal face + luminous face, rational signal + emotional aura.
- **Reflection:** two profiles facing each other, suggesting digital twins, resonance, and conversation.
- **Soft futurism:** metallic edges, pearl background, gentle glow, rounded app-icon geometry.
- **Trust + magic:** silver structure makes it credible; iridescence makes it delightful and serendipitous.

The product UI should feel like a **premium social AI wingman**: calm, helpful, intelligent, lightly magical, and event-ready.

---

## 2. Visual personality

### Primary adjectives
- Magical
- Delightful
- Technologically interesting
- Serendipitous
- Trustworthy
- Cool
- Hopeful
- Helpful

### Avoid
- Cyberpunk
- Neon-heavy AI cliché
- Corporate SaaS blandness
- Dating-app thirstiness
- Dark nightclub aesthetic
- Overly childish sparkles

---

## 3. Color system

The logo has three dominant color families:

1. **Pearl / fog background**
2. **Brushed silver / graphite metal**
3. **Iridescent aura glow**

Use mostly pearl and silver, with glow accents used intentionally.

### 3.1 Core palette

| Token | Hex | Use |
|---|---:|---|
| Pearl White | `#F6F8F8` | Main app background, cards |
| Soft Pearl | `#EEF2F2` | Secondary backgrounds |
| Fog Gray | `#E4E9EA` | Dividers, inactive surfaces |
| Brushed Silver | `#B8C0C2` | Borders, icon strokes, neutral accents |
| Chrome Highlight | `#DDE3E4` | Elevated borders, highlights |
| Soft Graphite | `#3F4648` | Secondary text, icons |
| Deep Slate | `#1F2527` | Primary text |
| Electric White | `#FFFFFF` | Glow edges, elevated surfaces |

### 3.2 Aura accent palette

| Token | Hex | Use |
|---|---:|---|
| Aura Cyan | `#B7FFF4` | Positive active states, resonance highlights |
| Soft Lilac | `#DCC6FF` | Magical/AI states, twin talk |
| Warm Blush | `#FFD6E8` | Human/social warmth, flirty-but-safe moments |
| Pale Gold | `#FFF4B8` | Serendipity, special match moments |
| Mist Blue | `#CFE9FF` | Calm informational states |

### 3.3 Semantic colors

Keep semantic states soft, not loud.

| Token | Hex | Use |
|---|---:|---|
| Success Glow | `#B7F5D8` | Intro accepted, twin ready |
| Warning Glow | `#FFE6A8` | Incomplete profile, pending review |
| Error Rose | `#FFB8C8` | Errors, blocked actions |
| Info Blue | `#CFE9FF` | Explanations, system notes |

### 3.4 Color usage ratio

Recommended UI ratio:

- 65% pearl / white / fog
- 20% silver / chrome / graphite
- 10% iridescent aura accents
- 5% deep slate text and high-contrast controls

The product should feel luminous, not rainbow.

---

## 4. Gradients

### 4.1 App background

Use a subtle pearlescent background, not plain white.

```css
.twinder-background {
  background:
    radial-gradient(circle at 82% 14%, rgba(183,255,244,.34), transparent 30%),
    radial-gradient(circle at 72% 68%, rgba(220,198,255,.26), transparent 36%),
    radial-gradient(circle at 28% 20%, rgba(255,255,255,.72), transparent 32%),
    linear-gradient(180deg, #F8FAFA 0%, #E7ECEC 100%);
}
```

### 4.2 Aura gradient

Use for special states: high resonance, AI thinking, twin talk, primary CTA background.

```css
--gradient-aura: linear-gradient(
  135deg,
  #FFFFFF 0%,
  #B7FFF4 24%,
  #DCC6FF 58%,
  #FFD6E8 82%,
  #FFF4B8 100%
);
```

### 4.3 Silver gradient

Use for subtle borders, icon containers, inactive premium surfaces.

```css
--gradient-silver: linear-gradient(
  135deg,
  #FFFFFF 0%,
  #DDE3E4 35%,
  #AEB8BB 70%,
  #F4F7F7 100%
);
```

---

## 5. Typography

The logo is soft, premium, and futuristic. The typography should be clean and modern, but not cold.

### 5.1 Recommended font pairings

#### Option A — best default
**Primary UI:** Inter  
**Display:** Geist or Satoshi

Use this if building quickly in web/mobile.

#### Option B — Apple-like
**Primary UI:** SF Pro / system font  
**Display:** SF Pro Rounded or system font

Use this if you want the app to feel iOS-native and polished.

#### Option C — warmer social product
**Primary UI:** Satoshi  
**Display:** Satoshi or Plus Jakarta Sans

Use this if you want more Hinge-like warmth.

### 5.2 Final recommendation

Use:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Then optionally use **Satoshi** or **Geist** for headings once the brand is more mature.

### 5.3 Type scale

Mobile-first type scale:

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Hero | 34px | 650–700 | 1.05 |
| Page title | 28px | 650 | 1.1 |
| Section title | 20px | 600 | 1.25 |
| Card title | 17px | 600 | 1.3 |
| Body | 15.5–16px | 400–450 | 1.45 |
| Small body | 14px | 400 | 1.4 |
| Metadata | 12–13px | 450–500 | 1.25 |
| Button | 15–16px | 600 | 1.1 |

### 5.4 Typography rules

- Use generous line height. The product should feel calm.
- Avoid all-caps except tiny labels.
- Use semibold sparingly for hierarchy.
- Do not use futuristic display fonts. The logo already provides the sci-fi signal.
- Avoid overly romantic serif fonts for MVP.

---

## 6. Shape language

The logo is built from rounded-square geometry and smooth face contours.

### 6.1 Radius tokens

```css
--radius-xs: 8px;
--radius-sm: 12px;
--radius-md: 18px;
--radius-lg: 24px;
--radius-xl: 28px;
--radius-2xl: 36px;
--radius-pill: 999px;
```

### 6.2 Usage

| Component | Radius |
|---|---:|
| App cards | 24–28px |
| Match cards | 28px |
| Bottom sheets | 32–36px top corners |
| Buttons | 999px |
| Chips | 999px |
| Small inputs | 16–18px |
| Large text areas | 24px |

Avoid sharp rectangles.

---

## 7. Surfaces and elevation

### 7.1 Glass card

```css
.glass-card {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.84);
  box-shadow: 0 20px 60px rgba(31, 37, 39, 0.12);
  backdrop-filter: blur(18px);
}
```

### 7.2 Silver card

Use for profile/twin status sections.

```css
.silver-card {
  border-radius: 28px;
  background:
    linear-gradient(145deg, rgba(255,255,255,.92), rgba(228,233,234,.76));
  border: 1px solid rgba(184,192,194,.55);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.85),
    0 16px 48px rgba(31,37,39,.10);
}
```

### 7.3 Aura card

Use sparingly for high-resonance match moments.

```css
.aura-card {
  border-radius: 28px;
  background:
    radial-gradient(circle at 80% 20%, rgba(183,255,244,.32), transparent 34%),
    radial-gradient(circle at 20% 80%, rgba(255,214,232,.28), transparent 36%),
    rgba(255,255,255,.76);
  border: 1px solid rgba(255,255,255,.9);
  box-shadow: 0 18px 56px rgba(183,255,244,.20);
}
```

---

## 8. Buttons

### 8.1 Primary button

Use for one main action per screen.

```css
.primary-button {
  min-height: 52px;
  padding: 0 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #FFFFFF, #B7FFF4 24%, #DCC6FF 66%, #FFD6E8);
  color: #1F2527;
  font-weight: 650;
  box-shadow: 0 8px 28px rgba(183,255,244,.35);
}
```

Recommended labels:
- Create my twin
- Enter the room
- Let our twins talk
- Request intro
- Send intro

### 8.2 Secondary button

```css
.secondary-button {
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  background: rgba(255,255,255,.68);
  border: 1px solid rgba(184,192,194,.58);
  color: #1F2527;
  font-weight: 600;
}
```

### 8.3 Destructive / safety actions

Do not use harsh red unless urgent.

```css
.safety-button {
  color: #7A2638;
  background: rgba(255,184,200,.22);
  border: 1px solid rgba(255,184,200,.55);
}
```

---

## 9. Icons and illustration style

The logo is dimensional, but the app UI should not become overly 3D.

### Icon rules
- Use thin-to-medium rounded line icons.
- Stroke width: 1.75–2px.
- Rounded stroke caps.
- Use graphite by default.
- Use aura gradient only for active states.
- Avoid filled black icons.

### Avatar style
Since photos are not in MVP:
- Use abstract twin avatars.
- Use soft silhouettes, gradient orbs, or mirrored-profile icons.
- Never use generic faceless corporate avatars.
- Keep avatars calm and premium.

---

## 10. Motion

Motion should feel like reflection and resonance, not gaming.

### Recommended motion
- Soft glow pulse while matching.
- Cards slide up gently.
- Twin talk appears as two facing messages.
- High-resonance card gets a slight aura shimmer.
- Loading states use slow breathing motion.

### Timing

```css
--motion-fast: 140ms;
--motion-base: 220ms;
--motion-slow: 420ms;
--ease-soft: cubic-bezier(.22, .8, .22, 1);
```

### Avoid
- Confetti overload
- Hyperactive bouncing
- Rapid rainbow animation
- Dating-app swipe gimmicks as the core mechanic

---

## 11. Layout

### 11.1 Mobile page padding

```css
--page-padding: 20px;
--section-gap: 24px;
--card-gap: 14px;
```

### 11.2 Card density

Hackathon users will be on phones in a busy environment. Cards should be readable at a glance.

Match card should show:
- Public first name
- Role/project
- Resonance score
- 2–3 shared signals
- One suggested topic
- One CTA

Do not overload cards with AI reasoning.

---

## 12. Component examples

### 12.1 Match card

```text
Maya
AI tools · climate hack

87% resonance
High intro potential

Shared signals:
builder energy · weird ideas · emotionally intelligent conversation

Suggested opener:
Ask what she thinks people misunderstand about climate tech.

[View twin talk]
```

### 12.2 Twin status card

```text
Your twin is live

It has met 18 people in the room.
4 look worth a real conversation.
2 new profiles joined since your last check.

[Recheck the room]
```

### 12.3 Tune my twin

```text
Tune my twin

[This sounds like me]
[Not quite]
[Less flirty]
[More professional]
[More weird]
[Ask me a follow-up]
```

---

## 13. Accessibility

The logo is low-contrast and luminous, but the UI cannot rely on glow alone.

Rules:
- Body text should be Deep Slate `#1F2527`.
- Secondary text should not go lighter than Soft Graphite `#3F4648` on pearl backgrounds.
- Do not put small white text directly on aura gradients.
- Scores and CTAs need text labels, not only color.
- Touch targets should be at least 44px high.
- Use reduced-motion alternatives.

---

## 14. Tailwind token suggestion

```js
export const twinderTheme = {
  colors: {
    pearl: {
      50: "#F8FAFA",
      100: "#F6F8F8",
      200: "#EEF2F2",
      300: "#E4E9EA",
    },
    silver: {
      100: "#DDE3E4",
      300: "#B8C0C2",
      500: "#8F999C",
    },
    slate: {
      700: "#3F4648",
      900: "#1F2527",
    },
    aura: {
      cyan: "#B7FFF4",
      lilac: "#DCC6FF",
      blush: "#FFD6E8",
      gold: "#FFF4B8",
      blue: "#CFE9FF",
    },
    semantic: {
      success: "#B7F5D8",
      warning: "#FFE6A8",
      error: "#FFB8C8",
      info: "#CFE9FF",
    },
  },
  borderRadius: {
    sm: "12px",
    md: "18px",
    lg: "24px",
    xl: "28px",
    "2xl": "36px",
    pill: "999px",
  },
  boxShadow: {
    glass: "0 20px 60px rgba(31,37,39,.12)",
    aura: "0 18px 56px rgba(183,255,244,.20)",
    soft: "0 12px 36px rgba(31,37,39,.10)",
  },
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  },
};
```

---

## 15. Brand summary for developers

Twinder should look like:

> A polished pearlescent social AI app where a structured metallic twin meets a luminous human-intuition twin.

Design all UI around:
- rounded geometry
- soft glass surfaces
- silver structure
- subtle iridescent moments
- clear readable text
- controlled reveal
- professional enough for a hackathon
- warm enough for social serendipity
