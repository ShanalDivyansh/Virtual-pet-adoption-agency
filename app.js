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
  loginUser,
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
// try {
//   console.log(
//     await loginUser("shanalDivyansh@gmail.com", "12345678S#", "admin")
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
//     { zip: "07307", state: "NJ", city: "hoboken", streetAddress: "123 street" },
//     "testing"
//   );
// } catch (error) {
//   console.log(error);
// }

// create review
// try {
//   await createReview(
//     "657ea375e1336330c3eb26c6",
//     "This is a second test review",
//     "657eafe14fe099504f3fd489",
//     3
//   );
// } catch (error) {
//   console.log(error);
// }
// try {
//   await createPets(
//     ["public/Images/Pets/AthenaGreatDane.jpeg"],
//     "athena dog",
//     "Dog",
//     "Great Dane",
//     "Young",
//     "Female",
//     "Extra-Large",
//     ["Playful", "Affectionate", "Energetic"],
//     "High",
//     ["Up-to-date on shots"],
//     "Athena is a playful and affectionate young Great Dane, full of energy and ready to bring joy to an active family.",
//     ["Interactive play", "Regular exercise"],
//     true,
//     true,
//     "abcd"
//   );
// } catch (error) {
//   console.log(error);
// }

// shortlist pet
// try {
//   await addUserShortListedPets(
//     "657e5557ed7c7293490e25be",
//     "657e87c06bd27b342905c4a0"
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
    "657ea375e1336330c3eb26c6",
    "657eafe14fe099504f3fd489",
    "this is an updated review",
    3.5
  );
} catch (error) {
  console.log(error);
}

import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import session from "express-session";
// const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use(
  session({
    name: "AuthState",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 6000000 },
  })
);

// app.use('/public', staticDir);
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// For Guardians and Pet Stories - Suraj (182 - 230 )

const guardiansData = [
  {
    email: "phill.guardian@gmail.com",
    firstName: "Patrick",
    lastName: "Hill",
    location: "1 Castle Point Terrace, Hoboken, NJ, 07030",
    servicesOffered: ["Pet Sitter", "Pet Grooming", "Pet Walking"],
  },
  {
    email: "sdivyansh.guardian@gmail.com",
    firstName: "Shanal",
    lastName: "Divyansh",
    location: "3629 JFK BLVD, Jersey City, NJ, 07307",
    servicesOffered: ["Pet Sitter", "Pet Walking"],
  },
  {
    email: "ssingh.guardian@gmail.com",
    firstName: "Suraj",
    lastName: "Singh",
    location: "310 Thorne Street, Jersey City, NJ, 07307",
    servicesOffered: ["Pet Sitter"],
  },
  {
    email: "papoorva.guardian@gmail.com",
    firstName: "Pranjal",
    lastName: "Apoorva",
    location: "107 Charles Street, Jersey City, NJ, 07307",
    servicesOffered: ["Pet Sitter", "Pet Grooming", "Pet Walking"],
  },
  {
    email: "ayadav..guardian@gmail.com",
    firstName: "Ansh",
    lastName: "Yadav",
    location: "534 Adams Street, Hoboken, NJ, 07030",
    servicesOffered: ["Pet Sitter", "Pet Grooming"],
  },
];

app.get("/guardian", (req, res) => {
  const selectedGuardian = req.session.selectedGuardian;

  res.render("guardian", { guardians: guardiansData, selectedGuardian });
});

app.post("/select-guardian", (req, res) => {
  const selectedGuardianEmail = req.body.selectedGuardian;

  const selectedGuardian = guardiansData.find(
    (guardian) => guardian.email === selectedGuardianEmail
  );

  if (selectedGuardian) {
    req.session.selectedGuardian = selectedGuardian;
    res.render("selectedGuardian", {
      guardian: selectedGuardian,
      message:
        "Please Contact Your Selected Guardian And Confirm Thier Validity",
    });
  } else {
    res.render("error", { message: "Selected guardian not found." });
  }
});

const dummyPetStories = [
  {
    title: "Happy Tails: From Shelter to Forever Home",
    content:
      "Our beloved furry friend, Max, was adopted from the local shelter. He has brought so much joy and love into our lives. Max enjoys long walks in the park and cuddling on the couch.",
    author: "Pet Lover 1",
  },
  {
    title: "Rescued and Thriving",
    content:
      "Meet Luna, the resilient cat we rescued from a tough situation. Despite her challenging past, Luna has blossomed into a playful and affectionate companion. She is the queen of our household.",
    author: "Cat Enthusiast",
  },
  {
    title: "A Purrfect Match",
    content:
      "We found our perfect match in Whiskers. This charming little kitty stole our hearts from the moment we met. Whiskers loves to entertain us with acrobatic jumps and endless purring.",
    author: "Happy Cat Parent",
  },
];

app.get("/petStories", (req, res) => {
  res.render("petStories", { petStories: dummyPetStories });
});

app.use("/", (req, res, next) => {
  const reqRoute = req.originalUrl;
  if (reqRoute === "/") {
    return res.redirect("/login");
  }
  next();
});
app.use("/login", (req, res, next) => {
  if (req.session.user && req.session.user.userType === "user") {
    // console.log(req.session.user.id)

    return res.redirect("/home");
  } else if (req.session.user && req.session.user.userType === "guardian") {
    return res.redirect("/guardian");
  } else if (req.session.user && req.session.user.userType === "agency") {
    return res.redirect("/agency");
  } else if (!req.session.user && req.originalUrl !== "/login") {
    return res.redirect("/login");
  }
  next();
});
app.use("/register", (req, res, next) => {
  if (req.session.user && req.session.user.userType === "user") {
    return res.redirect("/home");
  } else if (req.session.user && req.session.user.userType === "guardian") {
    return res.redirect("/guardian");
  } else if (req.session.user && req.session.user.userType === "agency") {
    return res.redirect("/agency");
  }
  next();
});
app.use("/home", async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (req.session.user.userType === "user") {
    const user = await getUserDetails(req.session.user.id);
    console.error(user[0]);
    if (!user[0].quizAnswers.Type) return res.redirect("/questionnaire");
  }
  next();
});
app.use("/questionnaire", async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});
app.use("/viewPets", async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});
app.use("/petUpdate", async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
