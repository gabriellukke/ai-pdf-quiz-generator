import Image from 'next/image';

interface LoadingStateProps {
  title: string;
  subtitle: string;
}

export function LoadingState({ title, subtitle }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-64 animate-pulse-slow">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 animate-bounce-slow">
                  <Image
                    src="/logo.svg"
                    alt="Unstuck"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex-1 space-y-2 mt-2">
                  <div className="h-2 bg-primary-500 rounded-full w-3/4 animate-shimmer" />
                  <div className="h-2 bg-gray-200 rounded-full w-full" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full border-2 border-primary-500 bg-primary-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full flex-1" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />
                  <div className="h-2 bg-gray-200 rounded-full flex-1" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />
                  <div className="h-2 bg-gray-200 rounded-full flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

