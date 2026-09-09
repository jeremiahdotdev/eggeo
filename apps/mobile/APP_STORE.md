# Local iOS builds and TestFlight

Eggeo uses Xcode on your Mac for iOS builds, signing, and uploading to App Store Connect. No Expo account or EAS service is required.

## Prepare the project

Install Xcode and CocoaPods (`brew install cocoapods`). Sign in to your Apple Developer account in Xcode Settings > Accounts.

Run from `apps/mobile`:

```sh
pnpm run store:check
pnpm run ios:prepare
pnpm run ios:open
```

`ios:prepare` generates the native iOS project and installs CocoaPods dependencies. The generated `ios/` directory is ignored by Git. Regenerate after changing native dependencies or app configuration. Open the `.xcworkspace`, not the `.xcodeproj`.

For local development, `pnpm ios` builds and runs the app using Expo CLI.

## Configure the release

Ensure `apps/mobile/.env` contains this before archiving; Expo bundles the value into the app:

```dotenv
EXPO_PUBLIC_APP_URL=https://eggs.jeremiah.dev
```

In Xcode, select the Eggeo project and app target:

1. Under Signing & Capabilities, enable automatic signing and select your paid Apple Developer team.
2. Confirm the bundle identifier is `dev.jeremiah.eggeo`.
3. Select the Eggeo scheme and a generic iOS device destination (not a simulator).
4. Confirm the scheme's Archive action uses the Release configuration.

Create an iOS app named Eggeo in App Store Connect with the same bundle identifier. Register the identifier in your Apple Developer account first if it is not available in the app creation form.

## Archive and upload

1. In Xcode choose Product > Archive.
2. In Organizer select the archive, then Distribute App > App Store Connect, and follow the upload flow.
3. After Apple processes the build, open Eggeo > TestFlight in App Store Connect. Resolve any compliance questions.
4. Create an internal testing group, add your App Store Connect user, and assign the build.
5. Accept the invitation in the TestFlight app on your iPhone.

For subsequent uploads, increment `expo.ios.buildNumber` in `app.json` and run `pnpm run ios:prepare` before archiving. Generated project settings can be replaced by regeneration. You can persist your signing team using `expo.ios.appleTeamId` in `app.json` after selecting the correct team.

Internal testing does not require a finished public App Store listing. External testing requires beta information and may require Apple's beta review.

See [OFFLINE.md](./OFFLINE.md) for offline behavior and device verification steps.

## Public or unlisted release later

- Verify the Privacy Policy action on the native User page opens the public policy.
- Verify account deletion, permissions, camera scanning, maps, login persistence, and offline sync on a physical iPhone.
- Complete App Store privacy disclosures, age rating, pricing and availability, screenshots, and reviewer contact information.
- Supply a working reviewer account, demo event, and scannable QR codes. See `app-store-review-notes.md`; enter credentials directly in App Store Connect rather than committing them.
- Submit for App Review. For unlisted distribution, submit Apple's separate request when the app is ready for distribution and submitted for review.

Support: https://eggs.jeremiah.dev/support

Privacy: https://eggs.jeremiah.dev/privacy

The existing EAS profiles and `store:build:ios` / `store:submit:ios` scripts remain optional cloud tooling; they are not used by this local workflow.
