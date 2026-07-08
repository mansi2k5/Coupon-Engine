# Coupon Engine

![Tests](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/actions/workflows/test.yml/badge.svg)

A React Native (Expo) app for browsing, viewing, and validating discount coupons against a mock cart — built as a case study for the React Native App Development Intern assignment.

## Features

- **Coupon List** — search by code/description, filter by type (Percentage / Flat / Free Shipping), sort by soonest expiry or highest discount, loading/error/empty states, pull-to-refresh. Includes a "Simulate API Error" button so the error state can be demoed on demand, since a real failure isn't otherwise easy to trigger against a mock API.
- **Coupon Detail** — full coupon info, "Copy Code" button (uses `expo-clipboard`)
- **Coupon Validator** — enter a code + cart total, validates against mock rules (not found / expired / below minimum order value), shows discount + final price. Validate button is disabled until both fields are filled, and shows a brief loading state to mirror a real network call.
- **Applied Coupons** — session-local list of coupons applied via the validator, with a Remove option
- **Accessibility** — interactive elements (buttons, search, filters, sort chips) carry `accessibilityLabel`/`accessibilityRole`/`accessibilityState` so the app is usable with screen readers, not just visually.
- **CI** — GitHub Actions (`.github/workflows/test.yml`) runs the unit test suite automatically on every push/PR to `main`.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version)
- [Expo Go](https://expo.dev/go) app installed on your phone (Play Store / App Store) — no Android Studio/Xcode required

### Run the app
```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```
Then scan the QR code shown in the terminal/browser with the Expo Go app (Android: Expo Go's scanner, iOS: Camera app). Press `w` in the terminal to open it in a browser instead.

### Running the tests
Validation logic is covered by unit tests (see `src/utils/__tests__/couponValidation.test.js`):
```bash
npm test
```

## Project Structure

```
coupon-engine/
├── App.js                     # Root component, wraps navigation + context providers
├── src/
│   ├── data/
│   │   └── mockCoupons.js     # Mock "database" + simulated fetch (setTimeout-based)
│   ├── utils/
│   │   └── couponValidation.js # Pure validation/calculation functions (no UI, no state)
│   ├── context/
│   │   └── AppliedCouponsContext.js # Shared session state for applied coupons
│   ├── components/
│   │   ├── CouponCard.js      # Reusable card used in the list screen
│   │   └── StatusBadge.js     # Reusable Active/Expired badge
│   ├── screens/
│   │   ├── CouponListScreen.js
│   │   ├── CouponDetailScreen.js
│   │   ├── CouponValidatorScreen.js
│   │   └── AppliedCouponsScreen.js
│   └── navigation/
│       └── AppNavigator.js    # Bottom tabs (Coupons / Validator / Applied) + stack for detail
```

### Why this structure?
- **`data/`** isolates the mock API so it's a one-line swap to a real API call later (same function signature, same Promise-based return).
- **`utils/couponValidation.js`** holds *all* validation and discount-calculation logic as plain functions, deliberately kept out of any component. See below for why.
- **`context/`** holds only session state that needs to be shared across unrelated screens (Applied Coupons is used by both the Validator screen and the Applied Coupons screen). Everything else uses local `useState` — no need for a heavier state library at this scale.
- **`components/`** holds pieces reused in more than one place (badge, card), keeping screens focused on layout/composition rather than repeated markup.
- Navigation uses a **bottom tab navigator** for the three top-level sections (Coupons, Validator, Applied), with the Coupon List and Coupon Detail nested in their own **stack** inside the Coupons tab, since Detail is a drill-down from the List rather than a top-level section.

### Where is coupon validation logic, and why is it separated?
All validation (code lookup, expiry check, minimum order check) and discount math live in `src/utils/couponValidation.js` as pure functions — they take data in and return a result object, with no dependency on React, navigation, or component state.

Reasons for this separation:
1. **Testability** — pure functions can be unit tested directly (e.g. with Jest) without rendering any component or mocking navigation.
2. **Reuse** — the same `validateCoupon` function could be called from the Validator screen today, and from a future checkout/cart screen later, without duplicating rules.
3. **Single source of truth** — if a rule changes (e.g. how free shipping is calculated), it changes in exactly one file, not in every screen that happens to check coupons.
4. **Clear separation of concerns** — screens are responsible only for *displaying* state and calling these functions; they don't encode business rules themselves.

### How would server-side validation work with a real backend? (optional, as noted in the assignment)
If a backend existed, `validateCoupon` in `utils/` would be replaced by an API call (e.g. `POST /coupons/validate` with `{ code, cartTotal }`), and the server would return the same shape of result (`valid`, `reason`, `discountAmount`, `finalPrice`) so the screen-level code wouldn't need to change — only the data source would. This also closes off the main risk of client-side-only validation: a user could otherwise inspect/bypass client logic, or coupon rules could go stale if the client isn't updated at the same time as a promotion changes. Server-side validation would also be the natural place to enforce usage limits per user, which this assignment explicitly excludes.

## AI-Assisted Development

**Tool used:** Claude (Anthropic), used as a pair-programmer/scaffolding tool inside the chat interface.

**Example prompts used:**
- "Scaffold a React Native Expo project for a coupon engine app with these screens: list, detail, validator, applied coupons. Use React Navigation and expo-clipboard."
- "Write pure validation functions for checking if a coupon is expired, below minimum order value, or not found, and calculating discount amount for percentage/flat/free-shipping types."
- "Set up a Context provider for applied coupons so the validator screen and applied coupons screen can share state."

**Where AI helped most:**
- Generating the initial project scaffold (folder structure, navigation boilerplate, `package.json`/`app.json`/`babel.config.js`) quickly, so the focus could stay on the actual coupon logic and UI rather than Expo project setup.
- Producing consistent StyleSheet-based styling across screens so the app looks cohesive without manually rewriting the same patterns per file.
- Drafting the pure `couponValidation.js` functions with clear, testable input/output shapes.

**What was manually corrected/implemented:**
- Reviewed and tested every generated file rather than accepting it blindly — ran the app after each major addition (list screen, validator, applied coupons) instead of writing everything then testing once.
- Added the pull-to-refresh interaction on the coupon list, the disabled/loading state on the Validate button, and the simulated 500ms validation delay myself, after noticing the original validator felt instant in a way a real network call wouldn't.
- Wrote the Jest unit tests for `couponValidation.js` (case-insensitive code matching, expired coupon, below-minimum-order, not-found, and correct discount math for each coupon type) to have actual proof of correctness rather than relying on manual clicking alone.
- [Add any further tweaks you make yourself — e.g. a color/copy change, a bug you hit on your phone that didn't show up in the browser, etc.]

**How correctness was validated:**
- Automated: `npm test` runs unit tests against the validation logic covering valid coupons, expired coupons, below-minimum-order-value coupons, unknown codes, and discount calculation for all three coupon types (percentage, flat, free shipping).
- Manual: ran the app via Expo Go on a physical device and tested searching/filtering the coupon list, viewing a coupon's detail and copying its code, validating each of the 7 mock coupons (including the two pre-set expired ones and one below-minimum case), and applying/removing coupons from the Applied Coupons screen.
- [Add specific coupon codes + cart totals you personally tried on your device and what you expected vs. saw, e.g. "Tried FLAT100 with cart total 100 — correctly showed the minimum order value error."]

## Notes on Scope (per assignment instructions)
This project intentionally does **not** include: authentication, real payment/checkout, an admin panel, push notifications, or backend-side usage-count tracking — all explicitly out of scope for this assignment.
