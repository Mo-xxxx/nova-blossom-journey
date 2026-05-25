# Responsive redesign across mobile, tablet, desktop

Right now Nova is locked to a phone-sized canvas (`max-w-md`, fixed bottom pill nav, single-column cards). On tablet and desktop it just sits as a narrow strip with empty space on the sides. The plan is to keep the calm rose/night aesthetic but let the layout breathe on larger screens.

## 1. App shell becomes adaptive (`src/components/AppShell.tsx`)

- **Mobile (<768px)**: keep current experience — centered column, floating bottom pill nav.
- **Tablet (768–1024px)**: widen content to `max-w-2xl`, two-column grid for cards where it makes sense, keep bottom nav but slightly wider.
- **Desktop (≥1024px)**: switch to a left **sidebar nav** (vertical, rose-gold active pill, Nova logo + wordmark on top, Settings at the bottom). Content area becomes `max-w-5xl` with generous padding. Hide the bottom pill nav.
- Header gets larger type on desktop (`md:text-4xl lg:text-5xl`) and aligns to a wider container.

## 2. Page-level layout upgrades

Each route currently stacks cards in one column. Make them adapt:

- **Home** (`src/routes/home.tsx`): hero stays full-width; stat/insight cards become a 2-col grid on tablet, 3-col on desktop.
- **Insights** (`src/routes/insights.tsx`): charts go side-by-side on desktop (2-col), share-with-doctor card spans full width.
- **Monitor** (`src/routes/monitor.tsx`): sensor visual centered with max-width; helper text column on the side at desktop.
- **Log** (`src/routes/log.tsx`): entries become a 2-col masonry on tablet+, add-entry sheet stays modal.
- **Resources** (`src/routes/resources.tsx`): card grid 2-col tablet / 3-col desktop.
- **Settings, Profile, Appointments**: form/list stays comfortable reading width (`max-w-xl`) centered; on desktop show a two-pane layout (nav-style section list on the left, detail on the right) only for Settings.
- **Onboarding** (`src/routes/onboarding.tsx`): on desktop becomes split-screen — animated Nova orb/logo on the left half, step content on the right.

## 3. Typography & spacing scale

- Introduce responsive type: e.g. headings `text-3xl md:text-4xl lg:text-5xl`, body `text-base md:text-lg` on hero areas.
- Increase section padding on larger breakpoints (`px-6 md:px-10 lg:px-16`, `py-10 md:py-16`).
- Keep card radius and shadows the same — they already scale well.

## 4. Nav component split

Inside `AppShell`, render:
- `<MobileTabBar />` — current bottom pill, shown `lg:hidden`.
- `<DesktopSidebar />` — new, shown `hidden lg:flex`, fixed left, 240px wide, includes Nova logo, nav items, and a profile/settings footer.

Both consume the same `navItems` array so they stay in sync.

## 5. Out of scope

- No backend/data changes.
- No new routes.
- No change to brand colors, fonts, or the Nova logo itself.
- No dark/light mode toggle.

## Open question

Do you want the **desktop sidebar** style (recommended — feels like a real product on big screens), or should I keep the bottom pill nav centered on all sizes and just widen the content area? The sidebar option is more work but looks much more polished on desktop.