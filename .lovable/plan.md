# Desktop Onboarding Responsive Update

## Goal
Expand the current mobile-only onboarding (`max-w-md` single column) into a comfortable centered wide-card layout on tablet and desktop, keeping the same step flow and starfield background.

## Changes to `src/routes/onboarding.tsx`

1. **Container width**
   - Replace `max-w-md` with `max-w-md md:max-w-xl lg:max-w-2xl` so the card grows on larger screens.

2. **Padding & spacing**
   - Increase horizontal padding: `px-6 md:px-10 lg:px-16`
   - Increase vertical padding: `py-10 md:py-16 lg:py-20`
   - Increase gap between sections (`mt-10` → `md:mt-14 lg:mt-20`, etc.)

3. **Typography scale**
   - Hero heading: `text-4xl` → `md:text-5xl lg:text-6xl`
   - Step headings: `text-3xl` → `md:text-4xl lg:text-5xl`
   - Body text: `text-starlight/70` → `md:text-lg` on descriptive paragraphs
   - Input text: `text-lg` → `md:text-xl`
   - Button: `text-base` → `md:text-lg md:py-5`

4. **Logo / tagline area**
   - Keep the existing logo + "nova" wordmark + "new beginnings" tagline at the top.
   - Slightly larger logo on desktop (`size={40}` → `md:size={48} lg:size={56}`).
   - Increase wordmark size: `text-2xl` → `md:text-3xl`.

5. **Step progress bar**
   - Keep the 4-segment bar but make it slightly thicker and wider on desktop (`h-1` → `md:h-1.5`).

6. **Form elements**
   - Inputs and buttons stretch to the wider container naturally via `w-full`.
   - Wristband size buttons: keep 3-col grid but with more internal padding on desktop.

7. **Starfield**
   - Already absolute full-bleed (`absolute inset-0`) — no change needed, it will fill the wider viewport.

## Out of scope
- No new images or illustrations.
- No changes to the step logic, validation, or navigation.
- No dark/light mode toggle.

## Single file touched
- `src/routes/onboarding.tsx`