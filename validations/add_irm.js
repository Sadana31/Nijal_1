document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addIrmForm');

  // Validation rules by field
  const rules = {
    adCode: { required: true, maxLength: 8 },
    bankName: { required: true, maxLength: 20 },
    ieCode: { required: true, maxLength: 10 },
    remittanceRef: { required: true },
    remittanceDate: { required: true, isDate: true },
    purposeCode: { required: true, maxLength: 5 },
    remittanceCurrency: { required: true, maxLength: 3 },
    remittanceAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
    utilizedAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
    outstandingAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
    remitterName: { required: false, maxLength: 30 },
    remitterAddress: { required: false, maxLength: 50 },
    remitterCountryCode: { required: false, maxLength: 2 },
    remitterBank: { required: false, maxLength: 20 },
    otherBankRef: { required: false, maxLength: 20 },
    status: { required: false, maxLength: 20 },
    remittanceType: { required: false, maxLength: 10 }
  };

  // Utility to show error
  function showError(field, message) {
    const errDiv = document.getElementById(field + '-error');
    if (errDiv) {
      errDiv.textContent = message;
      errDiv.style.color = 'red';
    }
  }

  function clearError(field) {
    const errDiv = document.getElementById(field + '-error');
    if (errDiv) errDiv.textContent = '';
  }

  // Validate single field
  function validateField(field) {
    const input = document.getElementById(field);
    const value = input.value.trim();
    const rule = rules[field];

    // Required check
    if (rule.required && !value) {
      showError(field, 'This field is required');
      return false;
    }

    if (!value) { // optional empty clear errors
      clearError(field);
      return true;
    }

    // Max length check
    if (rule.maxLength && value.length > rule.maxLength) {
      showError(field, `Maximum length is ${rule.maxLength} characters`);
      return false;
    }

    // Date validation
    if (rule.isDate) {
      const dateVal = new Date(value);
      if (isNaN(dateVal.getTime())) {
        showError(field, 'Invalid date');
        return false;
      }
    }

    // Number validation with decimals
    if (rule.isNumber) {
      // Check number format (allow decimals up to 2 places, max digits before decimal)
      // Regex: optional digits before decimal max 18, optional decimal point with up to 2 decimals
      const regex = new RegExp(`^\\d{1,${rule.maxDigitsBeforeDecimal}}(\\.\\d{0,${rule.maxDecimals}})?$`);
      if (!regex.test(value)) {
        showError(field, `Invalid number format. Max ${rule.maxDigitsBeforeDecimal} digits before decimal and ${rule.maxDecimals} decimals allowed.`);
        return false;
      }
    }

    // If all OK
    clearError(field);
    return true;
  }

  // Add onblur event listeners to inputs for validation
  Object.keys(rules).forEach(field => {
    const input = document.getElementById(field);
    if (!input) return;
    input.addEventListener('blur', () => validateField(field));
  });

  // Form submit validation
  form.addEventListener('submit', (e) => {
    let valid = true;
    Object.keys(rules).forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      e.preventDefault();
      alert('Please fix the errors before submitting');
    }
  });
});
