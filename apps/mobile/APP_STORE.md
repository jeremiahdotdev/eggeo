# Eggeo App Store Prep

This folder has the local config needed for an App Store submission. Apple/App Store Connect setup still has to happen in the browser with the Apple Developer account.

## Already Configured Locally

- iOS bundle ID: `dev.jeremiah.eggeo`
- Android package: `dev.jeremiah.eggeo`
- iPhone-only support
- Camera and location permission copy
- Export compliance flag for standard OS encryption
- EAS build and submit profiles
- EAS metadata file
- Public support and privacy URLs:
  - `https://eggs.jeremiah.dev/support`
  - `https://eggs.jeremiah.dev/privacy`
- In-app account deletion flow

## Local Commands

Run these from `apps/mobile`.

```sh
pnpm run store:check
pnpm run eas:init
pnpm run store:build:ios
pnpm run store:submit:ios
pnpm run store:metadata:push
```

## Manual Items Still Needed

- Log in to Expo before `eas:init`.
- Create the App Store Connect app record.
- Create a reviewer demo account in production.
- Fill `app-store-review-notes.md` with the demo credentials and reviewer phone.
- Upload App Store screenshots.
- Submit for App Review.
- After approval or when ready for final distribution, request unlisted app distribution from Apple.

## Screenshot Checklist

Capture at least one polished iPhone screenshot. Better set:

- Home with selected event and score
- Map with egg markers
- Find QR scanner
- Ranking
- Events or User panel
