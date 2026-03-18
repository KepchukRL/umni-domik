export const validateName = (name) => {
  const nameRegex = /^[А-Яа-яA-Za-z]{1,15}$/;
  return nameRegex.test(name);
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const phoneRegex = /^(\+7|8)?[0-9]{10}$/;
  return phoneRegex.test(cleaned);
};

export const validateLogin = (login) => {
  return login.length >= 3;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('минимум 6 символов');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('заглавная буква');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('прописная буква');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('цифра');
  }

  return {
    isValid: errors.length === 0,
    message: errors.length ? `Пароль должен содержать: ${errors.join(', ')}` : ''
  };
};

export const validatePin = (pin) => {
  const pinRegex = /^\d{4}$/;
  return pinRegex.test(pin);
};

export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    if (cleaned.startsWith('8')) {
      return '+7' + cleaned.slice(1);
    }
    if (cleaned.startsWith('7')) {
      return '+' + cleaned;
    }
  }
  return phone;
};