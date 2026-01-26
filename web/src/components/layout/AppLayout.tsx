// web/src/components/layout/AppLayout.tsx
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-6">
        {children}
      </div>
    </div>
  );
}
