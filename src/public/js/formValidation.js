document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".user-form");
  const usernameInput = form.querySelector('input[name="username"]');
  const passwordInput = form.querySelector('input[name="password"]');

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;

    if (!username) {
      isValid = false;
      alert("لطفا شماره همراه خود را وارد کنید");
    } else if (!/^\d{11}$/.test(username)) {
      isValid = false;
      alert("  شماره موبایل 11 رقمی معتبر وارد کنید.");
    }

    if (!password) {
      isValid = false;
      alert("لطفاً رمز عبور را وارد کنید.");
    } else if (password.length < 6) {
      isValid = false;
      alert("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    }

    if (isValid) {
      form.submit();
    }
  });
});
