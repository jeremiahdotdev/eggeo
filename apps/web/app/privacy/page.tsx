import { EggeoText } from '@eggeo/ui';
import { SkyPage } from '@/components/SkyScene';

export default function PrivacyPage() {
  return (
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        Privacy
      </EggeoText>
      <section className="panel stack">
        <p>Last updated: August 23, 2026</p>
        <p>Eggeo uses account information, including email and optional name, to let you sign in, create events, join events, hide eggs, collect eggs, and track scores.</p>
        <p>Eggeo stores event, egg, score, and egg location data so the game can work across devices and sessions.</p>
        <p>The app asks for camera access only to scan QR codes. The app asks for location access to hide eggs and show nearby eggs on the map.</p>
        <p>Eggeo stores a small amount of data on your device, including saved egg map positions and pending offline actions, so the app can keep working when internet access is unavailable.</p>
        <p>You can delete your account from the mobile app user panel. Account deletion removes your account, event memberships, owned events, owned eggs, score records, and local offline egg data.</p>
        <p>For privacy or support requests, contact support@jeremiah.dev.</p>
      </section>
    </SkyPage>
  );
}
