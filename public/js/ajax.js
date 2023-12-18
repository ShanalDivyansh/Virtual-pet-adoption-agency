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
// $(document).ready(function () {
//     const registerForm = $('#registerForm');

//     registerForm.submit(function (event) {
//       event.preventDefault();

//       let firstName = $('#firstName').val();
//       let lastName = $('#lastName').val();
//       let email = $('#email').val();
//       let password = $('#password').val();
//       let userType = $('#userType').val();

//       // Perform client-side validation if needed

//       // Set up AJAX request config
//       let requestConfig = {
//         method: 'POST',
//         url: '/login', // Replace with your server endpoint for registration
//         contentType: 'application/json',
//         data: JSON.stringify({
//           firstName: firstName,
//           lastName: lastName,
//           email: email,
//           password: password,
//           userType: userType
//         })
//       };

//       // AJAX Call
//       $.ajax(requestConfig).then(function (response) {
//         // Handle the response from the server (e.g., display a success message, redirect, etc.)
//         console.log(response);

//         // Clear the form fields if registration is successful
//         if (response.success) {
//           $('#firstName').val('');
//           $('#lastName').val('');
//           $('#email').val('');
//           $('#password').val('');
//           $('#userType').val('');

//           // Optionally, close the registration popup
//           registerPopup.removeClass('show-register');
//           overlay.removeClass('show-overlay');

//           // Add any additional handling you need here
//         } else {
//           // Handle registration failure (e.g., display error messages)
//           console.error(response.message);
//         }
//       });
//     });
//   });

// $(document).ready(function () {
//   $("#petUpdateForm").submit(function (event) {
//     event.preventDefault();

//     let availability = $('input[name="answer"]:checked').val();
//     if (availability === "true") {
//       $("#textInput").prop("disabled", true);
//     } else {
//       $("#textInput").prop("disabled", false);
//       let story = $("#textInput").val().trim();
//       if (story === "") {
//         alert("Please provide a story for the pet.");
//         return;
//       }
//     }

//     let formData = {
//       petID: $("span:first").text(),
//       story: $("#textInput").val(),
//       availability: availability,
//     };

//     $.ajax({
//       type: "POST",
//       url: "/petUpdate",
//       data: formData,
//       success: function (response) {
//         console.log(response);
//         window.location.href = "/petUpdateSuccess";
//       },
//       error: function (error) {
//         console.error(error);
//         $("#result-alert").text("Error updating pet. Please try again.").show();
//       },
//     });
//   });
// });

$(document).ready(function () {
  $("#petUpdateForm").submit(function (event) {
    event.preventDefault();
    let checkedCount = 0;
    let formDataArray = [];

    $('input[name="checkForFalse"]').each(function () {
      let checkbox = $(this);
      let textInput = $(`input[name="textInput_${checkbox.val()}"]`);

      if (checkbox.prop("checked")) {
        checkedCount++;
        let story = textInput.val().trim();
        if (story === "") {
          alert(`Please fill in the story for each selected pet11.`);
          return;
        }
        formDataArray.push({
          petID: checkbox.val(),
          story: story,
        });
      }
    });

    if (checkedCount !== formDataArray.length) {
      alert("Please fill in the story for each selected pet.");
      return;
    }

    if (formDataArray.length === 0) {
      return;
    }

    let availability = $('input[name="answer"]:checked').val();

    $.ajax({
      type: "POST",
      url: "/petUpdate",
      data: {
        formDataArray: formDataArray,
        // availability: availability,
      },
      success: function (response) {
        console.log(response);
        window.location.href = "/petUpdateSuccess";
      },
      error: function (error) {
        console.error(error);
        $("#result-alert").text("Error updating pet. Please try again.").show();
      },
    });
  });
});