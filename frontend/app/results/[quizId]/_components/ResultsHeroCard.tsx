import Image from 'next/image';

interface ResultsHeroCardProps {
  score: number;
  total: number;
  percentage: number;
  incorrectAnswers: number;
  feedbackMessage: string;
  onShare: () => void;
}

export function ResultsHeroCard({
  score,
  total,
  percentage,
  incorrectAnswers,
  feedbackMessage,
  onShare,
}: ResultsHeroCardProps) {
  return (
    <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top,#fef9f5,transparent_50%)]" />
      </div>
      <div className="absolute inset-0 pointer-events-none flex flex-wrap justify-center gap-4 text-xs text-purple-200">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            ✦
          </span>
        ))}
      </div>
      <div className="relative flex flex-col items-center text-center gap-4">
        <Image src="/checkmark.svg" alt="Success" width={54} height={54} />
        <p className="text-lg sm:text-xl text-gray-600">
          {feedbackMessage}
        </p>
        <p className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          {score}/{total}
        </p>
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Score breakdown</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="bg-[#46CD94]"
              style={{ width: total === 0 ? '0%' : `${(score / total) * 100}%` }}
            />
            <div
              className="bg-[#FF6258]"
              style={{ width: total === 0 ? '0%' : `${(incorrectAnswers / total) * 100}%` }}
            />
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-600 mt-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#46CD94]" />
              <span>Answered Correctly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6258]" />
              <span>Missed Answers</span>
            </div>
          </div>
        </div>
        <button
          onClick={onShare}
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors shadow-md"
        >
          Share results
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4m0 0L8 6m4-4v14" />
          </svg>
        </button>
      </div>
    </div>
  );
}


