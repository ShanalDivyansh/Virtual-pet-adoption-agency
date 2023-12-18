const editButtons = document.querySelectorAll(".edit-rating");
const form = document.querySelector("#updateReviewForm");
const updateRating = document.querySelector("#rating");
const updateReview = document.querySelector("#review");

editButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    editButtons.forEach(function (resetButton) {
      resetButton.innerText = "Not Selected";
      resetButton.style.backgroundColor = "";
    });

    const buttonId = button.getAttribute("id");
    button.innerText = "Selected";
    button.style.backgroundColor = "red";

    form.style.display = "block";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const uReviewValue = updateReview.value.trim();
      const uRatingValue = updateRating.value.trim();
    
      if (uReviewValue.length === 0 || uRatingValue.length === 0) {
        alert("Review and Rating cannot be empty");
        return;
      }
    
      if (uReviewValue.length < 5) {
        alert("Review and Rating should be at least 5 characters long");
        return;
      }
      try {
        const data = await fetch("/updateReview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guardianId: buttonId,
            review: updateReview.value,
            rating: updateRating.value,
          }),
        });
        if (!data.ok) {
          throw new Error("Network response was not ok");
        }

        form.style.display = "none";
        alert("Success");
        window.location.href = "/guardian";
      } catch (error) {
        console.log(error);
      }
    });
  });
});
