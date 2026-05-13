/**
 * Validates a CPF (Cadastro de Pessoas Físicas) number
 * Format: XXX.XXX.XXX-XX
 */
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  let remainder = 0;
  
  // First validation digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10), 10)) return false;
  
  // Second validation digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i), 10) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11), 10)) return false;
  
  return true;
};

/**
 * Validates a passport number (generic)
 * Accepts alphanumeric strings of length 6-15
 */
export const validatePassport = (passport: string): boolean => {
  const cleaned = passport.replace(/\s/g, '');
  return /^[A-Z0-9]{6,15}$/i.test(cleaned);
};

/**
 * Generic document validation
 * Routes to specific validators based on document type
 */
export const validateDocument = (documentNumber: string, documentType: string): boolean => {
  if (!documentNumber || !documentType) return false;
  
  const type = documentType.toUpperCase();
  
  if (type === 'CPF') {
    return validateCPF(documentNumber);
  } else if (type === 'PASSPORT' || type === 'RG') {
    return validatePassport(documentNumber);
  }
  
  return true; // Allow other types by default
};

/**
 * Validates email format (basic)
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (basic international format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};
