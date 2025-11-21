import { PageHeader } from '@/components/PageHeader';

interface ResultsHeaderProps {
  onBack: () => void;
  onRetake: () => void;
}

export function ResultsHeader({ onBack, onRetake }: ResultsHeaderProps) {
  return (
    <PageHeader
      backLabel="Start New Quiz"
      onBack={onBack}
      showLogo={false}
      actionButton={
        <button
          onClick={onRetake}
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-black transition"
        >
          Retake Quiz
        </button>
      }
    />
  );
}


