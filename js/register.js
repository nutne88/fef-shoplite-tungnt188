
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const successAlert = document.getElementById("success-alert");
  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    phone: document.getElementById("phone"),
    city: document.getElementById("city"),
    agreeTerms: document.getElementById("agreeTerms"),
  };

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isFormValid = validateAllFields();

    if (isFormValid) {
      successAlert.classList.remove("d-none");
      registerForm.reset(); 

      Object.values(fields).forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
      });

      // Direct user back to homepage after 2.5 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2500);
    }
  });

  /**
   * @returns {boolean} True if all fields are valid, otherwise false
   */
  function validateAllFields() {
    let isValid = true;

    // Full name validation
    const nameVal = fields.fullName.value.trim();
    const isNameValid = /^[a-zA-Z\s\u00C0-\u1EF9]{10,}$/.test(nameVal);

    setFieldError(fields.fullName, !isNameValid);
    if (!isNameValid) isValid = false;

    // Email validation
    const emailVal = fields.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setFieldError(fields.email, true);
      isValid = false;
    } else {
      setFieldError(fields.email, false);
    }

    // Password validation
    const passVal = fields.password.value;
    if (passVal.length < 6) {
      setFieldError(fields.password, true);
      isValid = false;
    } else {
      setFieldError(fields.password, false);
    }

    // Phone number validation
    const phoneVal = fields.phone.value.trim();
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      setFieldError(fields.phone, true);
      isValid = false;
    } else {
      setFieldError(fields.phone, false);
    }

    // City
    if (fields.city.value === "") {
      setFieldError(fields.city, true);
      isValid = false;
    } else {
      setFieldError(fields.city, false);
    }

    // Checkbox
    if (!fields.agreeTerms.checked) {
      setFieldError(fields.agreeTerms, true);
      isValid = false;
    } else {
      setFieldError(fields.agreeTerms, false);
    }

    return isValid;
  }

  /**
   * @param {HTMLElement} inputElement
   * @param {boolean} hasError - Error status
   */
  function setFieldError(inputElement, hasError) {
    if (hasError) {
      inputElement.classList.add("is-invalid");
      inputElement.classList.remove("is-valid");
    } else {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
    }
  }

  // Real-time valdation
  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("is-invalid");
    });
  });
});
