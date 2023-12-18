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

//////////////////// client side validation
const loginForm = document.getElementById("login-form");
const emailInputLogin = document.getElementById("login-email-input");
const passwordInputLogin = document.getElementById("login-password-input");
// const errorBody = document.getElementById("login-error-message");
// const passError = document.getElementById("login-pass-message");

loginForm?.addEventListener("submit", (e) => {
  let errors = "";
  e.preventDefault();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  console.log(emailInputLogin.value.trim().match(emailRegex));
  if (!emailInputLogin.value.trim().match(emailRegex)) {
    errors += "The email is not in correct format";
  }
  const passCheckLength = passwordInputLogin.value.trim().length >= 8;
  const hasSpace = [...passwordInputLogin.value.trim()].every((char) => {
    return char.trim() !== "";
  });
  const containsUppercase = passwordInputLogin.value.trim().match(/[A-Z]/);
  const containsNum = passwordInputLogin.value.trim().match(/\d/);
  const containsSpecialCHar = passwordInputLogin.value
    .trim()
    .match(/[^a-zA-Z0-9]/);

  if (
    passCheckLength &&
    hasSpace &&
    containsUppercase &&
    containsNum &&
    containsSpecialCHar
  ) {
  } else {
    errors += "Password invalid.";
  }
  if (
    passCheckLength &&
    hasSpace &&
    containsUppercase &&
    containsNum &&
    containsSpecialCHar &&
    emailInputLogin.value.trim().match(emailRegex)
  ) {
    // console.log(loginForm.subm);
    loginForm.submit();
  } else {
    alert(errors);
  }
});

//////// Register form
const registerForm = document.getElementById("registerForm");
const fname = document.getElementById("firstName");
const lname = document.getElementById("lastName");
const email = document.getElementById("email");
const pass = document.getElementById("password");
const passConformInp = document.getElementById("passwordConfirm");
const role = document.getElementById("userTypeRegister");

// // error displays
// const fnameDisplay = document.querySelector(".fname");
// const lnameDisplay = document.querySelector(".lname");
// const emailErrorDisplay = document.querySelector(".errEmail");
// const passErr = document.querySelector(".errPass");
// const passConfirmErr = document.querySelector(".errPassCon");
// const passNotEqual = document.querySelector(".notsame");
// const roleAdminErr = document.querySelector(".roleErrorUser");
// const roleUserErr = document.querySelector(".roleErrorAdmin");

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  let errors = "";
  console.log(passConformInp)

  const firstName = fname.value.trim();
  const lastName = lname.value.trim();
  const emailAddress = email.value.trim();
  const roleInp = role.value.trim();
  if (roleInp === "user" || roleInp === "agency") {
    // roleAdminErr.classList.add("client-adminRole");
  } else {
    console.log("should not run");
  }

  if (!isValidName(firstName)) {
    errors += `Not valid First name. `;
  } else {
    // fnameDisplay.classList.add("client-fname");
  }
  if (!isValidName(lastName)) {
    errors += `Not valid Last name. `;
    // lnameDisplay.classList.remove("client-lname");
  } else {
    // lnameDisplay.classList.add("client-lname");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailAddress.match(emailRegex)) {
    errors += "Email not valid.";
    // emailErrorDisplay.classList.remove("client-errEmail");
  } else {
    // emailErrorDisplay.classList.add("client-errEmail");
  }
  if (!passCheck(pass)) {
    errors += "Password not valid.";
  }
  if (!passCheck(passConformInp)) {
    errors += "Password not valid.";
  }
  // console.log(pass.value)
  // console.log(passConformInp.value)
  if(passConformInp.value.trim()!==pass.value.trim()){
    errors += "Password do not match.";

  }

  if (
    isValidName(firstName) &&
    isValidName(lastName) &&
    emailAddress.match(emailRegex) &&
    passCheck(pass) &&
    // passCheck(passConformInp) &&
    pass.value.trim() === passConformInp.value.trim()
  ) {
    registerForm.submit();
  } else {
    alert(errors);
  }
});

function isValidName(name) {
  const notContainsNum = [...name].every((char) => {
    if (char.trim() === "") {
      return true;
    } else {
      return isNaN(char);
    }
  });
  return (
    typeof name === "string" &&
    name !== undefined &&
    name !== null &&
    name.trim().length > 0 &&
    name.length >= 2 &&
    name.length <= 25 &&
    notContainsNum
  );
}

function passCheck(passwordInput) {
  const passCheckLength = passwordInput.value.trim().length >= 8;
  const hasSpace = [...passwordInput.value.trim()].every((char) => {
    return char.trim() !== "";
  });
  const containsUppercase = passwordInput.value.trim().match(/[A-Z]/);
  const containsNum = passwordInput.value.trim().match(/\d/);
  const containsSpecialCHar = passwordInput.value.trim().match(/[^a-zA-Z0-9]/);

  if (
    passCheckLength &&
    hasSpace &&
    containsUppercase &&
    containsNum &&
    containsSpecialCHar
  ) {
    return true;
  } else {
    return false;
  }
}
