import { useEffect, useCallback } from 'react';

interface UseBarcodeScannerProps {
  onScan: (barcode: string) => void;
  debounceTime?: number;
  disabled?: boolean;
}

export function useBarcodeScanner({ onScan, debounceTime = 50, disabled = false }: UseBarcodeScannerProps) {
  useEffect(() => {
    if (disabled) return;

    let barcode = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastKeyTime;
      
      // If the time between keystrokes is larger than a typical scanner speed, reset
      if (timeElapsed > debounceTime) {
        barcode = '';
      }

      const isInput = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement || 
                      e.target instanceof HTMLSelectElement;

      // If we are in a rapid typing sequence (scanner), prevent the keystroke from affecting inputs
      if (barcode.length > 0 && timeElapsed <= debounceTime && isInput) {
        e.preventDefault();
      }

      lastKeyTime = currentTime;

      // Scanners typically send an Enter key at the end
      if (e.key === 'Enter') {
        if (barcode.length > 2) { // Minimal length for a barcode
          onScan(barcode);
          e.preventDefault();
          if (isInput) {
            (e.target as HTMLElement).blur();
          }
        }
        barcode = '';
        return;
      }

      // Collect printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        barcode += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onScan, debounceTime, disabled]);
}
