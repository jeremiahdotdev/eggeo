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
      <div className={['home-clouds', 'sky-clouds', `sky-clouds-${variant}`, variant === 'auth' ? 'auth-clouds' : ''].filter(Boolean).join(' ')} aria-hidden="true">
        {clouds.map((cloud) => (
          <span className={`cloud cloud-${cloud}`} key={cloud} />
        ))}
      </div>
      {showHill && <div className="sky-scene-hill" aria-hidden="true" />}
      {children}
    </main>
  );
}

export function SkyPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <SkyScene className="sky-page-scene">
      <div className={['page', 'stack', 'sky-page-content', className].filter(Boolean).join(' ')}>{children}</div>
    </SkyScene>
  );
}
