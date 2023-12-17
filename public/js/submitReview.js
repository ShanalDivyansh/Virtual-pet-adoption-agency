const form = document.querySelector("#review-form");
const review = document.querySelector("#guardian-review");
const rating = document.querySelector("#guardian-rating");
const guardianId = document.querySelector("#guardian-review-id");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
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
