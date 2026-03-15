# MINDFORGE UI Components

## Core Components

### PrimaryButton
Reusable button with gradient/solid variants.

**Usage:**
```jsx
<PrimaryButton 
  variant="gradient"
  gradientColors={['#6366F1', '#818CF8']}
  onPress={() => navigation.navigate('Screen')}
>
  Button Text
</PrimaryButton>
```

**Props:**
- `variant`: 'gradient' | 'solid'
- `gradientColors`: string[] (for gradient variant)
- `onPress`: function
- `disabled`: boolean

---

### Card
Reusable container component.

**Usage:**
```jsx
<Card type="standard" width="48%">
  <Text>Content here</Text>
</Card>
```

**Variants:**
- `standard`: Default card
- `stat`: For stat boxes (48% width, centered)
- `chart`: Extra padding for charts
- `score`: Centered content for results
- `primary`: Highlighted card with accent border

**Props:**
- `type`: string
- `width`: string (optional)
- `padding`: 'xs' | 's' | 'm' | 'l' | 'xl'

---

### ProgressBar
Animated progress bar with gradient fill.

**Usage:**
```jsx
<ProgressBar 
  percentage={75}
  variant="primary"
  showLabel={true}
  label="Progress"
/>
```

**Variants:**
- `primary`: Purple gradient
- `success`: Green gradient
- `warning`: Orange gradient
- `timer`: Timer-style (smaller height)

**Props:**
- `percentage`: number (0-100)
- `animated`: boolean
- `showLabel`: boolean
- `label`: string
- `height`: number (default: 8)

---

### Header
Screen header with back button and profile.

**Usage:**
```jsx
<Header 
  title="Screen Title"
  showBack={true}
  showProfile={true}
/>
```

**Props:**
- `title`: string
- `showBack`: boolean
- `onBack`: function
- `showProfile`: boolean
- `onProfile`: function

---

## Theme

Colors:
- Primary: `#6366F1` (Indigo)
- Success: `#22C55E` (Green)
- Warning: `#F59E0B` (Orange)
- Background: `#0F172A` (Dark blue)
- Surface: `#1E293B` (Darker blue)
- Text: `#F8FAFC` (Off-white)

Spacing (4px scale):
- xs: 4px
- s: 8px
- m: 16px
- l: 24px
- xl: 32px

Typography:
- Font: Inter
- H1: 28px bold
- H2: 24px semibold
- Body: 16px regular
- Label: 14px medium
