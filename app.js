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
// try {
//   await updateReview(
//     "657c7bf23f89ba9b60fca181",
//     "657c7ceec8ddfc78feb1212f",
//     "this is an updated review",
//     3
//   );
// } catch (error) {
//   console.log(error);
// }

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

// app.get('/education', (req, res) => {
//   res.render('education', { title: 'Education Center' });
// });
app.use("/", (req, res, next) => {
  const reqRoute = req.originalUrl;
  if (reqRoute === "/") {
    return res.redirect("/login");
  }
  next();
});
app.use("/login", (req, res, next) => {
  if (req.session.user && req.session.user.userType === "user") {
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
app.use("/home", (req, res, next) => {
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
