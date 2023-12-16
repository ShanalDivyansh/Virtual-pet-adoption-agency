const loginBtn = document.querySelector(".login-button");
const loginPopup = document.querySelector(".login-popup");
const overlay = document.querySelector(".overlay-bg");
const registerBtn = document.querySelector('.register-button')
const registerPopup = document.querySelector('.register-popup')
loginBtn.addEventListener("click", () => {
  console.log("clicked");
  loginPopup.classList.toggle("show-login");
  overlay.classList.toggle("show-overlay");
});
console.log(registerBtn)
registerBtn.addEventListener('click',()=>{
  console.log("hi")
  registerPopup.classList.toggle('show-register');
})