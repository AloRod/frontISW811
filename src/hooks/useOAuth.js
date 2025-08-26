import { useState, useEffect, useRef } from 'react';

export const useOAuth = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const processingRef = useRef(false);

  const startProcessing = () => {
    if (processingRef.current) {
      return false; // Ya se está procesando
    }
    processingRef.current = true;
    setIsProcessing(true);
    setHasProcessed(false);
    return true;
  };

  const finishProcessing = () => {
    processingRef.current = false;
    setIsProcessing(false);
    setHasProcessed(true);
  };

  const reset = () => {
    processingRef.current = false;
    setIsProcessing(false);
    setHasProcessed(false);
  };

  // Resetear el estado cuando cambie la URL
  useEffect(() => {
    const handleUrlChange = () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (!code) {
        reset();
      }
    };

    // Escuchar cambios en la URL
    window.addEventListener('popstate', handleUrlChange);
    
    // Verificar URL inicial
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  return {
    isProcessing,
    hasProcessed,
    startProcessing,
    finishProcessing,
    reset
  };
};
