"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });
  }

  const registrationForm = document.querySelector("#registration-form");
  if (registrationForm instanceof HTMLFormElement) {
    const eventSelect = registrationForm.elements.namedItem("event");
    const requestedEvent = new URLSearchParams(window.location.search).get("event");
    if (eventSelect instanceof HTMLSelectElement && requestedEvent) {
      const matchingOption = Array.from(eventSelect.options).find((option) => option.value === requestedEvent);
      if (matchingOption) {
        eventSelect.value = matchingOption.value;
      }
    }

    registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearRegistrationErrors(registrationForm);

      const mobile = registrationForm.elements.namedItem("mobile");
      const password = registrationForm.elements.namedItem("password");
      const name = registrationForm.elements.namedItem("studentName");
      const email = registrationForm.elements.namedItem("email");
      let isValid = registrationForm.checkValidity();

      if (name instanceof HTMLInputElement && name.value.trim().length < 2) {
        showFieldError(name, "student-name-error", "Please enter a name with at least 2 characters.");
        isValid = false;
      }
      if (email instanceof HTMLInputElement && !email.validity.valid) {
        showFieldError(email, "student-email-error", "Please enter a valid email address.");
        isValid = false;
      }
      if (mobile instanceof HTMLInputElement && !/^\d{10}$/.test(mobile.value.trim())) {
        showFieldError(mobile, "mobile-error", "Enter a 10-digit mobile number.");
        isValid = false;
      }
      if (password instanceof HTMLInputElement && password.value.length < 8) {
        showFieldError(password, "password-error", "Your password must be at least 8 characters.");
        isValid = false;
      }

      const message = registrationForm.querySelector("#registration-message");
      if (message instanceof HTMLElement) {
        if (isValid) {
          const studentName = name instanceof HTMLInputElement ? name.value.trim() : "Student";
          message.className = "form-message success";
          message.textContent = `Thanks, ${studentName}! Your registration is complete. (Demo only — your details were not sent or saved.)`;
          registrationForm.reset();
        } else {
          message.className = "form-message error";
          message.textContent = "Please check the highlighted fields and complete all required information.";
          const firstInvalid = registrationForm.querySelector('[aria-invalid="true"], :invalid');
          if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        }
      }
    });

    registrationForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        clearRegistrationErrors(registrationForm);
        const message = registrationForm.querySelector("#registration-message");
        if (message instanceof HTMLElement) {
          message.textContent = "";
          message.className = "form-message";
        }
      }, 0);
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = contactForm.querySelector("#contact-message-status");
      if (!(status instanceof HTMLElement)) return;

      if (!contactForm.checkValidity()) {
        status.className = "form-message error";
        status.textContent = "Please complete your name, a valid email address and your message.";
        contactForm.reportValidity();
        return;
      }

      status.className = "form-message success";
      status.textContent = "Thanks for reaching out! (Demo only — your message was not sent or saved.)";
      contactForm.reset();
    });
  }
});

function showFieldError(field, errorId, message) {
  field.setAttribute("aria-invalid", "true");
  const error = document.getElementById(errorId);
  if (error) error.textContent = message;
}

function clearRegistrationErrors(form) {
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
}
