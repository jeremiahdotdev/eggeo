import { ColorText } from '@/components/ColorText';

export function PageTitle({ children }: { children: string }) {
  return (
    <h1 className="page-title">
      <ColorText>{children}</ColorText>
    </h1>
  );
}
