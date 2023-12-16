const loginBtn = document.querySelector(".login-button");
const loginPopup = document.querySelector(".login-popup");
const overlay = document.querySelector(".overlay-bg");
const registerBtn = document.querySelector(".register-button");
const registerPopup = document.querySelector(".register-popup");

let loginOpen = false;
let registerOpen = false;

loginBtn.addEventListener("click", () => {
  if (!loginOpen) {
    loginPopup.classList.add("show-login");
    overlay.classList.add("show-overlay");
    loginOpen = true;
    if (registerOpen) {
      registerPopup.classList.remove("show-register");
      registerOpen = false;
    }
  } else {
    loginPopup.classList.remove("show-login");
    overlay.classList.remove("show-overlay");
    loginOpen = false;
  }
});

registerBtn.addEventListener("click", () => {
  if (!registerOpen) {
    registerPopup.classList.add("show-register");
    registerOpen = true;
    if (loginOpen) {
      loginPopup.classList.remove("show-login");
      overlay.classList.remove("show-overlay");
      loginOpen = false;
    }
  } else {
    registerPopup.classList.remove("show-register");
    registerOpen = false;
  }
});
