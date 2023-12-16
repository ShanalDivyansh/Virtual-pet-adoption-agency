//import express, express router as shown in lecture code
import { Router } from "express";
const router = Router();
import { array1ContainsAllElementsOfArray2 } from "../helpers.js";
import { addUserQuizAns } from "../data/users.js";
import { loginUser } from "../data/users.js";
import validator from "validator";
import { pets, users } from "../config/mongoCollections.js";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { readFile } from "fs/promises";

router.route("/").get(async (req, res) => {
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    return res.render("questionnaire", { title: "Questionnaire" });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Works");
    let petType = req.body.petType;
    let petAgeGroup = req.body.petAgeGroup;
    let petGender = req.body.petGender;
    let petSize = req.body.petSize;
    let houseTrained = req.body.houseTrained;
    let energyLevel = req.body.energyLevel;
    let specialNeeds = req.body.specialNeeds;
    let errors = [];

    if (
      petType === undefined ||
      petAgeGroup === undefined ||
      petGender === undefined ||
      petSize === undefined ||
      houseTrained === undefined ||
      energyLevel === undefined ||
      specialNeeds === undefined
    )
      errors.push("All questions are mandatory - Server");
    else {
      // answer 1
      petType = petType.trim().toLowerCase();
      // answer 2
      if (Array.isArray(petAgeGroup))
        petAgeGroup = petAgeGroup.map((value) => value.trim().toLowerCase());
      else petAgeGroup = [petAgeGroup.trim().toLowerCase()];
      // answer 3
      petGender = petGender.trim().toLowerCase();
      // answer 4
      if (Array.isArray(petSize))
        petSize = petSize.map((value) => value.trim().toLowerCase());
      else petSize = [petSize.trim().toLowerCase()];
      // answer 5
      houseTrained = houseTrained.trim().toLowerCase();
      // answer 6
      if (Array.isArray(energyLevel))
        energyLevel = energyLevel.map((value) => value.trim().toLowerCase());
      else energyLevel = [energyLevel.trim().toLowerCase()];
      // answer 7
      specialNeeds = specialNeeds.trim().toLowerCase();

      if (!["dog", "cat", "none"].includes(petType))
        errors.push("Question 1 NOT answered correctly! - server");

      if (
        !array1ContainsAllElementsOfArray2(petAgeGroup, [
          "puppy",
          "young adult",
          "adult",
          "senior",
        ])
      )
        errors.push("Question 2 NOT answered correctly! - server");

      if (!["male", "female", "none"].includes(petGender))
        errors.push("Question 3 NOT answered correctly! - server");

      if (
        !array1ContainsAllElementsOfArray2(petSize, [
          "smalee",
          "medium",
          "large",
          "giant",
        ])
      )
        errors.push("Question 4 NOT answered correctly! - server");

      if (!["yes", "none"].includes(houseTrained))
        errors.push("Question 5 NOT answered correctly! - server");

      if (
        !array1ContainsAllElementsOfArray2(energyLevel, [
          "low",
          "medium",
          "high",
          "very-high",
        ])
      )
        errors.push("Question 6 NOT answered correctly! - server");

      if (!["yes", "no"].includes(specialNeeds))
        errors.push("Question 5 NOT answered correctly! - server");
    }

    if (errors.length > 0)
      return res
        .status(404)
        .render("questionnaire", { title: "error", errors: errors });
    else {
      try {
        let user = await addUserQuizAns(
          "657c1e411fc6eb6de505c450",
          petType,
          petAgeGroup,
          petGender,
          petSize,
          energyLevel,
          specialNeeds,
          houseTrained
        );
      } catch (error) {
        errors.push(error);
      }
    }
    return res.render("logout", { title: "done" });
  });

  router
  .route("/login")
  .get(async (req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    //code here for POST
    let email = req.body["login-email-input"];
    let password = req.body["login-password-input"];
    let userType = req.body["userType"];

    if (!(typeof email !== "undefined" && typeof password !== "undefined")) {
      return res.status(400).render('login', { error: 'Invalid Email and/or Password' });
    }
    email = email.trim().toLowerCase();
    password = password.trim();
    if (!validator.isEmail(email)){
      return res.status(400).render('login', { error: 'Invalid Email Format' });
    }
    const isPassSpaces = [...password].every((char) => {
      return char.trim() !== "";
    });
  if (!isPassSpaces) {
    return res.status(400).render('login', { error: 'Password Contains Spaces' });
  }
    var passSchema = new PasswordValidator();
    passSchema
      .is()
      .min(8)
      .has()
      .uppercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();
    const validPass = passSchema.validate(password);
    if (!validPass){
      return res.status(400).render('login', { error: "Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character" });
    }
    const collection = await users();
    const userInfo = await collection.findOne({ email });
    if (!userInfo) {
      return res.status(400).render('login', { error: "Either the Email, Password or UserType is invalid" });
    } 
    const comparePass = await bcrypt.compare(password, userInfo.password);
    if (!comparePass) {
      return res.status(400).render('login', { error: "Either the Email, Password or UserType is invalid" });
    }
    if (userInfo.userType !== role.trim().toLowerCase()){
      return res.status(400).render('login', { error: "User type not matching" });
    }
    try {
      const userLoginAttempt = await loginUser(email, password, userType);
      if (userLoginAttempt) {
        req.session.user = {
          ...userLoginAttempt,
        };
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "user") {
        res.redirect("/home");
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "agency") {
        res.redirect("/agency");
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "guardian") {
        res.redirect("/guardian");
      }
    } catch (error) {
      console.log(error);
    }
  });

router.route("/protected").get(async (req, res) => {
  //code here for GET
});

router.route("/admin").get(async (req, res) => {
  //code here for GET
});

router.route("/error").get(async (req, res) => {
  //code here for GET
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  res.render("logout",{title: 'Logged out'});
});

router.route("/agencyHome").get(async (req, res) => {
  res.render("agencyHome", { title: 'Agency Home' });
});
router.route("/addpet").get(async (req, res) => {
  const dogBreedsList = await readFile("data/allowedDogBreeds.json", "utf8");
  const dogBreeds = JSON.parse(dogBreedsList);
  const catBreedsList = await readFile("data/allowedCatBreeds.json", "utf8");
  const catBreeds = JSON.parse(catBreedsList);
  res.render("addpet", { title: 'Add Pet', dogBreeds: dogBreeds, catBreeds: catBreeds});
})
.post(async (req, res) => {
  res.render("petAddComplete", { title: 'Pet Added' });
  // res.redirect("/agencyHome");
});

export default router;
