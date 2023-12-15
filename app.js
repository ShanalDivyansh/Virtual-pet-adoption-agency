// Setup server, session and middleware here.
import { guardian, reviews } from "./config/mongoCollections.js";
import { createGuardian } from "./data/guardian.js";
import { createPets, getPet } from "./data/pets.js";
import {
  createReview,
  getUsersReviews,
  getGuardianReviews,
  getReview,
  updateReview,
} from "./data/reviews.js";
import {
  registerUser,
  addUserShortListedPets,
  getUserDetails,
} from "./data/users.js";

// User;
// try {
//   console.log(
//     await registerUser(
//       "Shanal",
//       "Divyansh",
//       "shanalDivyansh@gmail.com",
//       "12345678S#",
//       "user"
//     )
//   );
// } catch (error) {
//   console.log(error);
// }

// create pet
// try {
//   console.log(
//     await createPets(
//       "dog name ",
//       "beagle",
//       "funny dog",
//       ["none"],
//       ["pic"],
//       true
//     )
//   );
// } catch (error) {
//   console.log(error);
// }

// create guardian
// try {
//   await createGuardian(
//     "shanal",
//     "divyansh",
//     "sd@gmail.com",
//     "123456789S#",
//     "guardian",
//     "123 street",
//     "testing"
//   );
// } catch (error) {
//   console.log(error);
// }

// create review
// try {
//   await createReview(
//     "657c7bf23f89ba9b60fca181",
//     "This is a test review",
//     "657c7ceec8ddfc78feb1212f",
//     5
//   );
// } catch (error) {
//   console.log(error);
// }

// shortlist pet
// try {
//   await addUserShortListedPets(
//     "657c7bf23f89ba9b60fca181",
//     "657c7c26926d0f64f0b5d48b"
//   );
// } catch (error) {
//   console.log(error);
// }

// try {
//   await getGuardianReviews("657b30102c82a922bcd452bd");
// } catch (error) {
//   console.log(error);
// }
// try {
//   await getUsersReviews("657b2fdf191c13874c8aa31b");
// } catch (error) {
//   console.log(error);
// }

// try {
//   await getUserDetails("657b2fdf191c13874c8aa31b");
// } catch (error) {
//   console.log(error);
// }

// try {
//   const review = await getReview("657b303a6e07b51d5653197d");
//   console.log(review[0].usersInfo);
// } catch (error) {
//   console.log(error);
// }

// try {
//   const pet = await getPet("657b315d9ec33f93239f9d44");
//   console.log(pet[0]);
// } catch (error) {
//   console.log(error);
// }

//
try {
  await updateReview(
    "657c7bf23f89ba9b60fca181",
    "657c7ceec8ddfc78feb1212f",
    "this is an updated review",
    3
  );
} catch (error) {
  console.log(error);
}
