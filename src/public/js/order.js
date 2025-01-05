document.addEventListener("DOMContentLoaded", function () {
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const priceElements = document.querySelectorAll(".price");

  priceElements.forEach(function (element) {
    let number = element.textContent.trim();

    number = number.replace(/\D/g, "");

    if (number) {
      element.textContent = formatNumberWithCommas(number);
    }
  });
});

document.getElementById('menu-icon').addEventListener('click', function() {
  const menu = document.querySelector('.responsive-menu');
  document.body.classList.toggle('menu-open'); // اضافه و حذف کلاس برای نمایش منو
});

