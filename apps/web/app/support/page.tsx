import { EggeoText } from '@eggeo/ui';
import { SkyPage } from '@/components/SkyScene';

export default function SupportPage() {
  return (
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        Support
      </EggeoText>
      <section className="panel stack">
        <p>Need help with Eggeo, QR codes, event access, maps, or account deletion?</p>
        <p>Email support@jeremiah.dev and include your account email plus a short description of what happened.</p>
        <p>If your issue is about location or camera permissions, include your device model and iOS version if you know them.</p>
      </section>
    </SkyPage>
  );
}
