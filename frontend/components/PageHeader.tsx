import Image from 'next/image';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  backLabel?: string;
  onBack: () => void;
  actionButton?: ReactNode;
  showLogo?: boolean;
}

export function PageHeader({
  title,
  backLabel = 'Back',
  onBack,
  actionButton,
  showLogo = true,
}: PageHeaderProps) {
  return (
    <div className={title ? 'mb-8' : 'mb-6'}>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">{backLabel}</span>
        </button>
        {actionButton}
      </div>
      {title && (
        <div className="flex items-center gap-3 mb-2">
          {showLogo && <Image src="/logo.svg" alt="Unstuck Logo" width={40} height={40} />}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
    </div>
  );
}

