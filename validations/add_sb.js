
    document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addSbForm');

  const decimalFields = ['exportBillValue', 'billRealizedValue', 'billOutstandingValue'];

  function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('error-message')) {
      error = document.createElement('div');
      error.className = 'error-message';
      error.style.color = 'red';
      error.style.fontSize = '0.9em';
      input.after(error);
    }
    error.textContent = message;
  }

  function clearError(input) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.textContent = '';
    }
  }

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      // Enforce maxlength
      if (input.maxLength > 0 && input.value.length > input.maxLength) {
        input.value = input.value.slice(0, input.maxLength);
      }

      // Decimal field live filter with cursor fix
      if (decimalFields.includes(input.id)) {
        let val = input.value;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        // Remove invalid chars except digits and decimal
        val = val.replace(/[^0-9.]/g, '');

        // Keep only first decimal point
        const firstDecimalIndex = val.indexOf('.');
        if (firstDecimalIndex !== -1) {
          val = val.slice(0, firstDecimalIndex + 1) + val.slice(firstDecimalIndex + 1).replace(/\./g, '');
        }

        // Split integer and fraction
        const parts = val.split('.');

        // Limit digits before decimal to 18
        parts[0] = parts[0].slice(0, 18);

        // Limit digits after decimal to 2
        if (parts.length > 1) {
          parts[1] = parts[1].slice(0, 2);
          val = parts[0] + '.' + parts[1];
        } else {
          val = parts[0];
        }

        if (input.value !== val) {
          input.value = val;

          // Restore cursor position
          let newPos = selectionStart;

          // If user typed a decimal that got removed or added before cursor, adjust position
          // (This is a simple heuristic)
          if (val.length < input.value.length) newPos--;
          if (newPos < 0) newPos = 0;

          input.setSelectionRange(newPos, newPos);
        }
      }
    });

    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  function validateField(input) {
    clearError(input);
    const val = input.value.trim();

    // Required check
    if (input.hasAttribute('required') && val === '') {
      showError(input, 'This field is required');
      return false;
    }

    // Max length check
    if (input.maxLength > 0 && val.length > input.maxLength) {
      showError(input, `Maximum length is ${input.maxLength}`);
      return false;
    }

    switch (input.id) {
      case 'shippingBill':
        if (!/^\d{1,10}$/.test(val)) {
          showError(input, 'Enter a valid number (up to 10 digits)');
          return false;
        }
        break;

      case 'sbDate':
      case 'invoiceDate':
      case 'blDate':
        if (val && !isValidDate(val)) {
          showError(input, 'Enter a valid date');
          return false;
        }
        break;

      case 'exportBillValue':
      case 'billRealizedValue':
      case 'billOutstandingValue':
        if (val === '') {
          if (input.hasAttribute('required')) {
            showError(input, 'This field is required');
            return false;
          }
          break;
        }
        if (!/^\d{1,18}(\.\d{1,2})?$/.test(val)) {
          showError(input, 'Enter a valid number (up to 18 digits before decimal and 2 decimals)');
          return false;
        }
        break;
    }

    return true;
  }

  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input').forEach(input => {
      if (!validateField(input)) {
        valid = false;
      }
    });
    if (valid) {
      alert('Form submitted successfully!');
      // Your submit logic here
    } else {
      alert('Please fix errors before submitting.');
    }
  });
});
