// src/components/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}