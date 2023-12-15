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

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// app.use('/public', staticDir);
app.use("/public", express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});