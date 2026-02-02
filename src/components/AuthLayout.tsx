import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page hero-grid relative overflow-hidden p-6">
      {/* Grid Background */}
      <div className="absolute inset-0"></div>

      {/* Gradient Orbs */}
      <div className="hero-orb hero-orb-ember top-0 right-0 w-96 h-96"></div>
      <div className="hero-orb hero-orb-iris bottom-0 left-0 w-96 h-96 animate-float-soft"></div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
