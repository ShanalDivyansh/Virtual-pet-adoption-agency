// //trying Ajax
// (function ($) {
//     // Get references to form elements
//     let registerForm = $('#registerForm'),
//       firstNameInput = $('#firstName'),
//       lastNameInput = $('#lastName'),
//       emailInput = $('#email'),
//       passwordInput = $('#password'),
//       userTypeInput = $('#userType');
  
//     // Register form submission event
//     registerForm.submit(function (event) {
//       event.preventDefault();
  
//       // Retrieve input values
//       let firstName = firstNameInput.val();
//       let lastName = lastNameInput.val();
//       let email = emailInput.val();
//       let password = passwordInput.val();
//       let userType = userTypeInput.val();
  
//       // Check if all fields are filled
//       if (firstName && lastName && email && password && userType) {
//         // Set up AJAX request config
//         let requestConfig = {
//           method: 'POST',
//           url: '/login',  // Replace with your server endpoint for registration
//           contentType: 'application/json',
//           data: JSON.stringify({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             password: password,
//             userType: userType
//           })
//         };
  
//         // AJAX Call. Handle the server response as needed.
//         $.ajax(requestConfig).then(function (response) {
//           console.log(response);
  
//           console.log("Error: ", error);
//         });
//       }
//     });
//   })(window.jQuery);

// Add this block to your existing login-signup.js file
$(document).ready(function () {
    const registerForm = $('#registerForm');
  
    registerForm.submit(function (event) {
      event.preventDefault();
  
      let firstName = $('#firstName').val();
      let lastName = $('#lastName').val();
      let email = $('#email').val();
      let password = $('#password').val();
      let userType = $('#userType').val();
  
      // Perform client-side validation if needed
  
      // Set up AJAX request config
      let requestConfig = {
        method: 'POST',
        url: '/login', // Replace with your server endpoint for registration
        contentType: 'application/json',
        data: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          userType: userType
        })
      };
  
      // AJAX Call
      $.ajax(requestConfig).then(function (response) {
        // Handle the response from the server (e.g., display a success message, redirect, etc.)
        console.log(response);
  
        // Clear the form fields if registration is successful
        if (response.success) {
          $('#firstName').val('');
          $('#lastName').val('');
          $('#email').val('');
          $('#password').val('');
          $('#userType').val('');
  
          // Optionally, close the registration popup
          registerPopup.removeClass('show-register');
          overlay.removeClass('show-overlay');
  
          // Add any additional handling you need here
        } else {
          // Handle registration failure (e.g., display error messages)
          console.error(response.message);
        }
      });
    });
  });
  