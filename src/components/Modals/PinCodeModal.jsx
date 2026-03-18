import React, { useState, useRef, useEffect } from 'react';
import styles from './Modals.module.css';

const PinCodeModal = ({ onClose, onSuccess, onError, widgetName, correctPin }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value.replace(/[^0-9]/g, '');
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length === 4) {
      if (enteredPin === correctPin) {
        onSuccess();
        onClose();
      } else {
        setError('Неверный пин-код');
        setPin(['', '', '', '']);
        inputRefs[0].current.focus();
        if (onError) onError();
      }
    }
  };

  const handleDigitClick = (digit) => {
    const emptyIndex = pin.findIndex(d => d === '');
    if (emptyIndex !== -1) {
      handleChange(emptyIndex, digit.toString());
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = pin.reduce((last, digit, index) => 
      digit !== '' ? index : last, -1
    );
    if (lastFilledIndex !== -1) {
      handleChange(lastFilledIndex, '');
    }
  };

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Введите пин-код</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.pinInstruction}>
            Введите пин-код для {widgetName}
          </p>
          
          <div className={styles.pinContainer}>
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="password"
                className={styles.pinInput}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          {error && <div className={styles.pinError}>{error}</div>}

          <div className={styles.pinPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((digit, index) => (
              <button
                key={index}
                className={styles.pinPadButton}
                onClick={() => {
                  if (digit === '⌫') {
                    handleBackspace();
                  } else if (digit !== '') {
                    handleDigitClick(digit);
                  }
                }}
                disabled={digit === ''}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Отмена
          </button>
          <button 
            className={styles.primaryButton}
            onClick={handleSubmit}
            disabled={pin.some(d => d === '')}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinCodeModal;