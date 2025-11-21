interface ErrorAlertProps {
  error?: string;
  uploadError?: Error | null;
}

function extractErrorMessage(uploadError: Error | null): string {
  if (!uploadError) return 'Failed to upload PDF. Please try again.';
  
  const errorMsg = uploadError.message;
  
  if (errorMsg.includes('OpenAI API quota exceeded')) {
    return 'OpenAI API quota exceeded. Please add billing credits to your OpenAI account or contact your administrator.';
  }
  
  if (errorMsg.includes('Invalid OpenAI API key')) {
    return 'Invalid API key configuration. Please contact your administrator.';
  }
  
  if (errorMsg.includes('rate_limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  return errorMsg;
}

export function ErrorAlert({ error, uploadError }: ErrorAlertProps) {
  if (!error && !uploadError) return null;

  const displayError = error || extractErrorMessage(uploadError || null);
  const isApiQuotaError = displayError.includes('quota exceeded') || displayError.includes('billing credits');

  return (
    <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <p className="text-red-700 text-sm sm:text-base">{displayError}</p>
          {isApiQuotaError && (
            <a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
            >
              Add billing credits
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

