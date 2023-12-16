//import express, express router as shown in lecture code
import { Router } from "express";
const router = Router();
import { isValidName, array1ContainsAllElementsOfArray2 } from "../helpers.js";
import validator from "validator";
import { pets, users } from "../config/mongoCollections.js";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { readFile } from "fs/promises";

import fileUpload from 'express-fileupload';
import {createPets} from '../data/pets.js';

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
        res.redirect("/agencyHome");
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

router.route("/error").get(async (req, res) => {
  //code here for GET
});

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
    const { petName, petGender, animalType, dogBreed, catBreed, ageGroup, size, energyLevel, houseTrain, petVaccination, spayedNeutered, characteristics, bio, specialNeeds } = req.body;
    // console.log(req.body);
    let characteristicsList = [];
    let errorMessages = [];
    let imgPath = [];
    let specialNeedsList = [];
    let uploadPath = '/Users/pranjalapoorva/Desktop/College/3Fall_2023/CS-546(Web)/Another copy/Virtual-pet-adoption-agency/public/Images/Pets';

    if (petName === undefined ||
      petGender === undefined ||
      animalType === undefined ||
      dogBreed === undefined ||
      catBreed === undefined ||
      ageGroup === undefined ||
      size === undefined ||
      energyLevel === undefined ||
      houseTrain === undefined ||
      petVaccination === undefined ||
      spayedNeutered === undefined ||
      characteristics === undefined ||
      bio === undefined ||
      specialNeeds === undefined)
      errorMessages.push("All fields are must be supplied");

    else {
      if (!image)
        return res.status(400).send("No image uploaded");
      if (!/^image/.test(image.mimetype))
        return res.status(400).send("Invalid file type");

      let imgName = petName;
      if (animalType === 'dog')
        imgName = imgName + dogBreed + '.jpg';
      else
        imgName = imgName + catBreed + '.jpg';
      uploadPath = uploadPath+ imgName;
      imgPath[0] = "public/Images/Pets/" + imgName;

      if (!isValidName(petName.trim().toLowerCase()))
        errorMessages.push("Pet Name not provided correctly");

      if (!['dog', 'cat'].includes(animalType.trim().toLowerCase()))
        errorMessages.push("Pet Type not provided correctly");

      if (!['male', 'female'].includes(petGender.trim().toLowerCase()))
        errorMessages.push("Pet Gender not provided correctly");

      if (animalType === 'dog'){
        const allowedDogBreedsList = await readFile("data/allowedDogBreeds.json", "utf8");
        const allowedDogBreeds = JSON.parse(allowedDogBreedsList);
        if(!allowedDogBreeds.includes(dogBreed))
          errorMessages.push("Dog Breed not provided correctly");
      }
      else if(animalType === 'cat'){
        const allowedCatBreedsList = await readFile("data/allowedCatBreeds.json", "utf8");
        const allowedCogBreeds = JSON.parse(allowedCatBreedsList);
        if(!allowedCogBreeds.includes(catBreed))
          errorMessages.push("Cat Breed not provided correctly");
      }

      if (!['puppy', 'young adult', 'adult', 'senior'].includes(ageGroup.trim().toLowerCase()))
        errorMessages.push("Pet Age group not provided correctly");

      if (!['small', 'medium', 'large', 'giant'].includes(size.trim().toLowerCase()))
        errorMessages.push("Pet Size not provided correctly");

      if (!['low','mediumEnergy','high','very-high'].includes(energyLevel.trim().toLowerCase()))
        errorMessages.push("Pet Energy Level not provided correctly");

      if (!['yes', 'no'].includes(houseTrain.trim().toLowerCase()))
        errorMessages.push("House Trained field not provided correctly");

      if (!["complete", "pending"].includes(petVaccination.trim().toLowerCase()))
        errorMessages.push("Vaccination status not provided correctly");

      if (!['notDone','done'].includes(spayedNeutered.trim().toLowerCase()))
        errorMessages.push("Spayed or Neutered status not provided correctly");

      characteristicsList = characteristics.trim().toLowerCase().split(',')
      for (var i = 0; i < characteristicsList.length; i++) {
        var char1 = characteristicsList[i];
        if (/\d/.test(char1)) {
          errorMessages.push("Characterstics can only be comma seperated strings");
          break;
        }
        if (char1.trim().length < 4) {
          errorMessages.push("Characterstics can not be BLANK");
          break;
        }
      }
      // if(! Array.isArray(characteristicsList))
      //   characteristicsList = Array(characteristicsList);

      if (bio.trim().length < 5 || bio.trim().length > 100)
        errorMessages.push("Bio can only be 5 to 100 words long");

      specialNeedsList = specialNeeds.trim().toLowerCase().split(',')
      if (specialNeeds.length !== 0) {
        for (var i = 0; i < specialNeedsList.length; i++) {
          var char1 = specialNeedsList[i];
          if (/\d/.test(char1)) {
            errorMessages.push("Special Needs can only be comma seperated strings");
            break;
          }
          if (char1.trim().length < 4) {
            errorMessages.push("Special Needs can not be BLANK");
            break;
          }
        }
      }
    }
    if (errorMessages.length === 0) {
      let finalBreed=null;
      if(animalType==='dog')
        finalBreed=dogBreed;
      else
        finalBreed=catBreed;
      let health = [];
      if(petVaccination==='complete')
        health.push('Vaccination Up-To-Date');
      else
        health.push('Vaccination Pending');
      if(spayedNeutered==='done')
        health.push('Spayed/Neutered');
      else
        health.push('Not Spayed/Neutered');
      let ht = false;
      if(houseTrain === 'yes')
        ht = true;
      let aname=req.session.user.firstName+" "+ req.session.user.lastName;

      try {
        let user = await createPets(
          imgPath,
          petName,
          animalType,
          finalBreed,
          ageGroup,
          petGender,
          size,
          characteristicsList,
          energyLevel,
          health,
          bio,
          specialNeedsList,
          ht,
          true,
          aname
          // "abcd"
        );
      } catch (error) {
        errorMessages.push(error);
      }
    }

    if (errorMessages.length === 0){
      try {
        image.mv(uploadPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error uploading image");
          }
        });
      } catch (error) {
        errorMessages.push(error);
      }
    }
    if (errorMessages.length > 0)
      return res
        .status(404)
        .render("addpet", { title: "error", errors: errorMessages });
    else {
      res.render("addPetComplete", { title: 'Pet Added' });
    }
    
  });
export default router;




// console.log("Works");
//     let petType = req.body.petType;
//     let petAgeGroup = req.body.petAgeGroup;
//     let petGender = req.body.petGender;
//     let petSize = req.body.petSize;
//     let houseTrained = req.body.houseTrained;
//     let energyLevel = req.body.energyLevel;
//     let specialNeeds = req.body.specialNeeds;
//     let errors = [];

//     if (
//       petType === undefined ||
//       petAgeGroup === undefined ||
//       petGender === undefined ||
//       petSize === undefined ||
//       houseTrained === undefined ||
//       energyLevel === undefined ||
//       specialNeeds === undefined
//     )
//       errors.push("All questions are mandatory - Server");
//     else {
//       // answer 1
//       petType = petType.trim().toLowerCase();
//       // answer 2
//       if (Array.isArray(petAgeGroup))
//         petAgeGroup = petAgeGroup.map((value) => value.trim().toLowerCase());
//       else petAgeGroup = [petAgeGroup.trim().toLowerCase()];
//       // answer 3
//       petGender = petGender.trim().toLowerCase();
//       // answer 4
//       if (Array.isArray(petSize))
//         petSize = petSize.map((value) => value.trim().toLowerCase());
//       else petSize = [petSize.trim().toLowerCase()];
//       // answer 5
//       houseTrained = houseTrained.trim().toLowerCase();
//       // answer 6
//       if (Array.isArray(energyLevel))
//         energyLevel = energyLevel.map((value) => value.trim().toLowerCase());
//       else energyLevel = [energyLevel.trim().toLowerCase()];
//       // answer 7
//       specialNeeds = specialNeeds.trim().toLowerCase();

//       if (!["dog", "cat", "none"].includes(petType))
//         errors.push("Question 1 NOT answered correctly! - server");

//       if (
//         !array1ContainsAllElementsOfArray2(petAgeGroup, [
//           "puppy",
//           "young adult",
//           "adult",
//           "senior",
//         ])
//       )
//         errors.push("Question 2 NOT answered correctly! - server");

//       if (!["male", "female", "none"].includes(petGender))
//         errors.push("Question 3 NOT answered correctly! - server");

//       if (
//         !array1ContainsAllElementsOfArray2(petSize, [
//           "smalee",
//           "medium",
//           "large",
//           "giant",
//         ])
//       )
//         errors.push("Question 4 NOT answered correctly! - server");

//       if (!["yes", "none"].includes(houseTrained))
//         errors.push("Question 5 NOT answered correctly! - server");

//       if (
//         !array1ContainsAllElementsOfArray2(energyLevel, [
//           "low",
//           "medium",
//           "high",
//           "very-high",
//         ])
//       )
//         errors.push("Question 6 NOT answered correctly! - server");

//       if (!["yes", "no"].includes(specialNeeds))
//         errors.push("Question 5 NOT answered correctly! - server");
//     }

//     if (errors.length > 0)
//       return res
//         .status(404)
//         .render("questionnaire", { title: "error", errors: errors });
//     else {
//       try {
//         let user = await addUserQuizAns(
//           "657c1e411fc6eb6de505c450",
//           petType,
//           petAgeGroup,
//           petGender,
//           petSize,
//           energyLevel,
//           specialNeeds,
//           houseTrained
//         );
//       } catch (error) {
//         errors.push(error);
//       }
//     }
//     return res.render("logout", { title: "done" });