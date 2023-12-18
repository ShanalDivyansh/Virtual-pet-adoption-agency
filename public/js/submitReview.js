const form = document.querySelector("#review-form");
const review = document.querySelector("#guardian-review");
const rating = document.querySelector("#guardian-rating");
const guardianId = document.querySelector("#guardian-review-id");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const reviewValue = review.value.trim();
  const ratingValue = rating.value.trim();

  if (reviewValue.length === 0 || ratingValue.length === 0) {
    alert("Review and Rating cannot be empty");
    return;
  }

  if (reviewValue.length < 5 || ratingValue.length < 5) {
    alert("Review and Rating should be at least 5 characters long");
    return;
  }

  try {
    const data = await fetch("/userReviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guardianId: guardianId.innerText,
        review: review.value,
        rating: rating.value,
      }),
    });
    if (!data.ok) {
      throw new Error("Network response was not ok");
    }
    window.location.href = "/userReviews";
  } catch (error) {
    console.log(error);
  }
});
