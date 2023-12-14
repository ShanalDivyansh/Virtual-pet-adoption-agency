// Setup server, session and middleware here.

// Setup server, session and middleware here.

import { guardian, reviews } from "./config/mongoCollections.js";
import { createGuardian } from "./data/guardian.js";
import { createReview, getReview } from "./data/reviews.js";
import { registerUser, addUserShortListedPets } from "./data/users.js";

// User;
try {
  console.log(
    await registerUser(
      "Shanal",
      "Divyansh",
      "shanalDivyansh@gmail.com",
      "12345678S#",
      "user"
    )
  );
} catch (error) {
  console.log(error);
}
// try {
//   await addUserShortListedPets(
//     "657a8e8bc9dbb988257b61f7",
//     "657a2fa123f2b9c93596a09b"
//   );
// } catch (error) {
//   console.log(error);
// }

// try {
//   await createGuardian(
//     "shanal",
//     "divyansh",
//     "sd@gmail.com",
//     "123456789S#",
//     "guardian",
//     "123 street",
//     "test 123"
//   );
// } catch (error) {
//   console.log(error);
// }

// try {
//   await createReview(
//     "657a8e8bc9dbb988257b61f7",
//     "This is a second review",
//     "657a8eb0178ffffbcc744e87",
//     5
//   );
// } catch (error) {
//   console.log(error);
// }

// try {
//   await getReview("657a61089bc46b451d9c90b6");
// } catch (error) {
//   console.log(error);
// }