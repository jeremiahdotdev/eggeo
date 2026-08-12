import { appText } from '@eggeo/domain';
import { EggeoActionPanel, EggeoText, type EggeoActionPanelItem } from '@eggeo/ui';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';
import styles from './page.module.css';

const links: EggeoActionPanelItem[] = [
  { href: '/codes', key: 'codes', label: appText.nav.codes },
  { href: '/create', key: 'create', label: appText.nav.create },
  { href: '/events', key: 'events', label: appText.nav.events },
  { href: '/hide', key: 'hide', label: appText.nav.hide },
  { href: '/score', key: 'score', label: appText.nav.score },
  { href: '/signout', intent: 'ghost', key: 'sign-out', label: appText.common.actions.signOut },
];

export default async function PanelPage() {
  const session = await requirePageSession();
  const displayName = session.name || session.email || session.username;

  return (
    <SkyScene className="hero">
      <section className={`stack ${styles.panelStack}`}>
        <EggeoText className={styles.title} colorized variant="pageTitle">
          {displayName}
        </EggeoText>
        <EggeoActionPanel items={links} />
      </section>
    </SkyScene>
  );
}
