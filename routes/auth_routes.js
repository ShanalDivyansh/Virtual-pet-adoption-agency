//import express, express router as shown in lecture code
import { Router } from "express";
const router = Router();
import { array1ContainsAllElementsOfArray2 } from "../helpers.js";
import validator from "validator";
import { pets, users } from "../config/mongoCollections.js";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { readFile } from "fs/promises";

import fileUpload from 'express-fileupload';

router.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // 10 MB
    },
    abortOnLimit: true,
  })
);

import {
  addUserQuizAns,
  addUserShortListedPets,
  getUserDetails,
  registerUser,
} from "../data/users.js";
import { loginUser } from "../data/users.js";
import { getAvailablePets, getPet } from "../data/pets.js";
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
    console.log(req.body);
    const { firstName, lastName, email, password, userTypeRegister } = req.body;
    try {
      const result = await registerUser(
        firstName,
        lastName,
        email,
        password,
        userTypeRegister
      );
      if (result) {
        req.session.registered = true;
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
    
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.registered) {
      res.render("login", { openLogin: true });
    } else {
      res.render("login");
    }
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
    if (!validator.isEmail(email)) {
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
    if (!validPass) {
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
    try {
      const userLoginAttempt = await loginUser(email, password, userType);
      console.log(userLoginAttempt);
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
      res.render("login");
    }
  });

  router.route("/home").get(async (req, res) => {
    //code here for GET
    console.log(req.session.user.id);
    const pets = await getAvailablePets();
    res.render("home", { pets, userId: req.session.user.id });
  });
router.route("/addToShortList").post(async (req, res) => {
  try {
    console.log(req.session.user.id);
    const result = await addUserShortListedPets(
      req.session.user.id,
      req.body.petId
    );
    if (result) {
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});
router.route("/getUserDetails").post(async (req, res) => {
  try {
    console.log(req.session.user.id);
    const result = await getUserDetails(req.session.user.id);
    if (result) {
      return res.status(200).json({ status: "success", data: result });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});
router.route("/getPetDetails").post(async (req, res) => {
  try {
    const result = await getPet(req.body.petId);
    if (result) {
      return res.status(200).json({ status: "success", data: result });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});


router.route("/addToShortList").post(async (req, res) => {
  try {
    console.log(req.session.user.id);
    const result = await addUserShortListedPets(
      req.session.user.id,
      req.body.petId
    );
    if (result) {
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});
router.route("/getUserDetails").post(async (req, res) => {
  try {
    console.log(req.session.user.id);
    const result = await getUserDetails(req.session.user.id);
    if (result) {
      return res.status(200).json({ status: "success", data: result });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});
router.route("/getPetDetails").post(async (req, res) => {
  try {
    const result = await getPet(req.body.petId);
    if (result) {
      return res.status(200).json({ status: "success", data: result });
    }
  } catch (error) {
    return res.status(400).json({ status: "bad request" });
  }
});

router.route("/questionnaire").get(async (req, res) => {
 
    return res.render("questionnaire", { title: "done" });
});


router.route("/questionnaire").post(async (req, res) => {
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
          "small",
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
          req.session.user.id,
          petType,
          petAgeGroup,
          petGender,
          petSize,
          energyLevel,
          specialNeeds,
          houseTrained
        );
        console.log("ran")
        return res.redirect("login")
      } catch (error) {
        // errors.push(error);
      }
    }
}
)

router.route("/logout").get(async (req, res) => {
  //code here for GET
});

router.route("/agencyHome").get(async (req, res) => {
  res.render("agencyHome", { title: 'Agency Home' });
});
router.route("/addpet").get(async (req, res) => {
  const dogBreedsList = await readFile("data/allowedDogBreeds.json", "utf8");
  const dogBreeds = JSON.parse(dogBreedsList);
  const catBreedsList = await readFile("data/allowedCatBreeds.json", "utf8");
  const catBreeds = JSON.parse(catBreedsList);
  res.render("addpet", { title: 'Add Pet', dogBreeds: dogBreeds, catBreeds: catBreeds });
})
  .post(async (req, res) => {
    const image = req.files.image; // Access the uploaded image through req.files.image
    const {petName,petGender, petType,dogBreed,catBreed,ageGroup,size,energyLevel,houseTrain,petVaccination,spayedNeutered,characteristics,bio,specialNeeds} = req.body;
    console.log(petName);
    // If no image submitted, exit
    if (!image) return res.status(400).send("No image uploaded");
    console.log(petType);
    // If the file type is not an image, prevent from uploading
    if (!/^image/.test(image.mimetype)) return res.status(400).send("Invalid file type");
    let imgName = petName;
    if(petType==='dog')
      imgName = imgName+dogBreed;
    else
      imgName = imgName+catBreed;
    // Move the uploaded image to a specific folder
    const uploadPath = '/Users/pranjalapoorva/Desktop/College/3Fall_2023/CS-546(Web)/Another copy/Virtual-pet-adoption-agency/public/Images/Pets' + imgName;
    image.mv(uploadPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error uploading image");
      }

      // You can now use the uploadPath or image.name as needed
      // For example, you can save the path to the database or perform other actions
      res.render("addPetComplete", { title: 'Pet Added' });
    });
  });
export default router;




