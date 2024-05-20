import { useEffect, useRef } from 'react';
type ICallback = (data: { nickname: string; email: string }) => void;
export function useEmailEvent(callback: ICallback) {
  const savedCallback = useRef<ICallback>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      const { detail } = event;
      savedCallback.current?.(detail);
    };

    window.addEventListener('tt-email-msg', handleCustomEvent);

    return () => {
      window.removeEventListener('tt-email-msg', handleCustomEvent);
    };
  }, []);
}
