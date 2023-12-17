document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll('input[name="selectedGuardian"]');
  const submitBtn = document.getElementById("submitBtn");

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function () {
      submitBtn.style = "display:block";
    });
  }
});
