import type { ReactNode } from 'react';

const clouds = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

export function SkyScene({
  children,
  className,
  showHill = true,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  showHill?: boolean;
  variant?: 'auth' | 'default' | 'home';
}) {
  return (
    <main className={['sky-scene', `sky-scene-${variant}`, className].filter(Boolean).join(' ')}>
      <div aria-hidden="true" className={['sky-clouds', variant === 'auth' ? 'auth-clouds' : undefined].filter(Boolean).join(' ')}>
        {clouds.map((cloud) => (
          <span aria-hidden="true" className={`cloud cloud-${cloud}`} key={cloud} />
        ))}
      </div>
      {showHill && <div aria-hidden="true" className="sky-scene-hill" />}
      {children}
    </main>
  );
}

export function SkyPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <SkyScene className="sky-page-scene">
      <div className={['page', 'stack', 'sky-page-content', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </SkyScene>
  );
}
