import { useCallback, useEffect, useState } from 'react';

interface ShareResultsArgs {
  score: number;
  total: number;
  percentage: number;
}

export function useShareResults({ score, total, percentage }: ShareResultsArgs) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const getSharePayload = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `I scored ${score}/${total} (${percentage}%) on my quiz!`;
    return { text, url };
  }, [percentage, score, total]);

  const copyToClipboard = useCallback(async () => {
    const { text, url } = getSharePayload();

    if (!navigator.clipboard) {
      setToastMessage('Clipboard is not available on this device.');
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setToastMessage('Results copied to clipboard!');
    } catch {
      setToastMessage('Failed to copy results to clipboard.');
    }
  }, [getSharePayload]);


  return {
    copyToClipboard,
    toastMessage,
    dismissToast: () => setToastMessage(null),
  };
}

