/* ============================================================
   NEXORA — LOGIN
   Validação de formulário, toggle de senha, submit simulado
   e interações sociais/links.
   ============================================================ */

(() => {
  "use strict";

  const form          = document.getElementById("login-form");
  const emailInput    = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError    = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const loginBtn      = document.getElementById("login-btn");
  const formMessage   = document.getElementById("form-message");
  const togglePassBtn = document.getElementById("toggle-password");
  const forgotLink    = document.getElementById("forgot-link");
  const signupLink    = document.getElementById("signup-link");
  const socialButtons = document.querySelectorAll(".social-btn");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD_LENGTH = 6;

  /* ------------------------------------------------------------
     Utilitários de validação
     ------------------------------------------------------------ */

  function setFieldError(input, errorEl, message) {
    const wrap = input.closest(".input-wrap");
    if (message) {
      wrap.classList.add("has-error");
      errorEl.textContent = message;
      errorEl.classList.add("show");
    } else {
      wrap.classList.remove("has-error");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
    }
  }

  function validateEmail(showError = true) {
    const value = emailInput.value.trim();

    if (!value) {
      if (showError) setFieldError(emailInput, emailError, "Informe seu e-mail.");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      if (showError) setFieldError(emailInput, emailError, "Digite um e-mail válido.");
      return false;
    }
    setFieldError(emailInput, emailError, "");
    return true;
  }

  function validatePassword(showError = true) {
    const value = passwordInput.value;

    if (!value) {
      if (showError) setFieldError(passwordInput, passwordError, "Informe sua senha.");
      return false;
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      if (showError) {
        setFieldError(
          passwordInput,
          passwordError,
          `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`
        );
      }
      return false;
    }
    setFieldError(passwordInput, passwordError, "");
    return true;
  }

  // Validação em tempo real, mas só mostra erro depois do primeiro "blur"
  let emailTouched = false;
  let passwordTouched = false;

  emailInput.addEventListener("blur", () => {
    emailTouched = true;
    validateEmail();
  });

  passwordInput.addEventListener("blur", () => {
    passwordTouched = true;
    validatePassword();
  });

  emailInput.addEventListener("input", () => {
    if (emailTouched) validateEmail();
  });

  passwordInput.addEventListener("input", () => {
    if (passwordTouched) validatePassword();
  });

  /* ------------------------------------------------------------
     Mostrar / ocultar senha
     ------------------------------------------------------------ */

  togglePassBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    const eyeIcon    = togglePassBtn.querySelector(".icon-eye");
    const eyeOffIcon = togglePassBtn.querySelector(".icon-eye-off");

    eyeIcon.style.display    = isHidden ? "none" : "block";
    eyeOffIcon.style.display = isHidden ? "block" : "none";

    togglePassBtn.setAttribute("aria-pressed", String(isHidden));
    togglePassBtn.setAttribute(
      "aria-label",
      isHidden ? "Ocultar senha" : "Mostrar senha"
    );

    passwordInput.focus({ preventScroll: true });
  });

  /* ------------------------------------------------------------
     Submissão do formulário (simulada)
     ------------------------------------------------------------ */

  function setLoading(isLoading) {
    loginBtn.classList.toggle("loading", isLoading);
    loginBtn.disabled = isLoading;
  }

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.classList.remove("success", "error");
    if (type) formMessage.classList.add(type);
  }

  function fakeAuthRequest(email) {
    // Simula uma chamada de rede sem depender de backend real.
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, email }), 1400);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    emailTouched = true;
    passwordTouched = true;

    const emailOk    = validateEmail();
    const passwordOk = validatePassword();

    if (!emailOk || !passwordOk) {
      showMessage("Corrija os campos destacados para continuar.", "error");
      loginBtn.classList.add("shake");
      setTimeout(() => loginBtn.classList.remove("shake"), 400);
      return;
    }

    showMessage("", null);
    setLoading(true);

    try {
      const result = await fakeAuthRequest(emailInput.value.trim());
      setLoading(false);

      if (result.ok) {
        showMessage(`Bem-vindo de volta, ${result.email.split("@")[0]}!`, "success");
        form.reset();
        emailTouched = false;
        passwordTouched = false;
      }
    } catch (err) {
      setLoading(false);
      showMessage("Não foi possível entrar. Tente novamente.", "error");
    }
  });

  /* ------------------------------------------------------------
     Links auxiliares (esqueci a senha / cadastro / social)
     ------------------------------------------------------------ */

  forgotLink.addEventListener("click", (event) => {
    event.preventDefault();
    showMessage("Um link de redefinição seria enviado para o seu e-mail.", null);
  });

  signupLink.addEventListener("click", (event) => {
    event.preventDefault();
    showMessage("Redirecionaria para a tela de cadastro.", null);
  });

  socialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.provider;
      const label = provider.charAt(0).toUpperCase() + provider.slice(1);
      showMessage(`Continuando com ${label}...`, null);
    });
  });

  /* ------------------------------------------------------------
     Acessibilidade: permitir "Enter" no campo de senha submeter
     ------------------------------------------------------------ */

  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      form.requestSubmit();
    }
  });

})();