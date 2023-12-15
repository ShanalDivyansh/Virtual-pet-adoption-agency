const loginBtn = document.querySelector(".login-button");
const loginPopup = document.querySelector(".login-popup");
const overlay = document.querySelector(".overlay-bg");
console.log("working");
loginBtn.addEventListener("click", () => {
  console.log("clicked");
  loginPopup.classList.toggle("show-login");
  overlay.classList.toggle("show-overlay");
});
