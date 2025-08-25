import React, { useRef, useEffect } from 'react';

const OTPInput = ({ 
    length = 6, 
    value = [], 
    onChange, 
    onComplete, 
    disabled = false,
    className = "",
    inputClassName = "",
    autoFocus = true
}) => {
    const inputRefs = useRef([]);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        // Auto-focus en el primer input
        if (autoFocus && inputRefs.current[0] && !disabled) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus, disabled]);

    useEffect(() => {
        // Verificar si todos los inputs están llenos
        if (value.length === length && value.every(digit => digit !== '') && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.(value.join(''));
        } else if (value.some(digit => digit === '')) {
            // Reset the flag if any digit is cleared
            hasCompletedRef.current = false;
        }
    }, [value, length, onComplete]);

    // Reset completion flag when all values are empty (component reset)
    useEffect(() => {
        if (value.every(digit => digit === '')) {
            hasCompletedRef.current = false;
        }
    }, [value]);

    const handleInputChange = (index, inputValue) => {
        // Solo permitir números
        if (!/^\d*$/.test(inputValue)) return;

        const newValue = [...value];
        newValue[index] = inputValue;
        onChange(newValue);

        // Auto-focus al siguiente input si se ingresó un dígito
        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Si se borró un dígito, ir al input anterior
        if (!inputValue && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Permitir navegación con flechas
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // Permitir borrar con Backspace
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
        if (pastedData.length === length) {
            const newValue = pastedData.split('').slice(0, length);
            onChange(newValue);
            // Focus en el último input
            inputRefs.current[length - 1]?.focus();
        }
    };

    const handleFocus = (index) => {
        // Seleccionar todo el contenido del input al hacer focus
        inputRefs.current[index]?.select();
    };

    return (
        <div className={`flex justify-center space-x-2 ${className}`}>
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={value[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className={`w-12 h-12 text-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

export default OTPInput;
