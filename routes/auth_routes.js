//import express, express router as shown in lecture code
import { Router } from "express";
const router = Router();
import { isValidName, array1ContainsAllElementsOfArray2 } from "../helpers.js";
import validator from "validator";
import { guardian, pets, users } from "../config/mongoCollections.js";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { readFile } from "fs/promises";
import fileUpload from "express-fileupload";
import {
  changeAvailability,
  changeAvailability1,
  createPets,
  getAvailablePetsByAgency,
  getUnavailablePets,
} from "../data/pets.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
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
  getUserPetRecommendation,
} from "../data/users.js";
import { loginUser } from "../data/users.js";
import { getAvailablePets, getPet } from "../data/pets.js";
import { getGuardian } from "../data/guardian.js";
import {
  createReview,
  getGuardianReviews,
  getUsersReviews,
  updateReview,
} from "../data/reviews.js";
router.route("/").get(async (req, res) => {
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    if(!req.session.user && req.route!="/login") return res.redirect("/login")
    return res.render("questionnaire", { title: "Questionnaire" });
  })
  .post(async (req, res) => {
    //code here for POST
    // console.log(req.body);
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
        return res.redirect("/login");
      }
    } catch (error) {
      return res.render("login", { error, title:"Login/Register" });
      console.log(error);
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.registered) {
      return res.render("login", { openLogin: true, title:"Login/Register" });
    } else {
      return res.render("login", {title:"Login/Register"});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let email = req.body["login-email-input"];
    let password = req.body["login-password-input"];
    let userType = req.body["userType"];

    if (!(typeof email !== "undefined" && typeof password !== "undefined")) {
      return res
        .status(400)
        .render("login", { error: "Invalid Email and/or Password", title:"Login/Register" });
    }
    email = email.trim().toLowerCase();
    password = password.trim();
    if (!validator.isEmail(email)) {
      return res.status(400).render("login", { error: "Invalid Email Format", title:"Login/Register" });
    }
    const isPassSpaces = [...password].every((char) => {
      return char.trim() !== "";
    });
    if (!isPassSpaces) {
      return res
        .status(400)
        .render("login", { error: "Password Contains Spaces", title:"Login/Register" });
    }
    let passSchema = new PasswordValidator();
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
      return res.status(400).render("login", {
        error:
          "Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character",
          title:"Login/Register"
      });
    }
    const collection = await users();
    const userInfo = await collection.findOne({ email });
    if (!userInfo) {
      // console.log("I am here");

      return res.status(400).render("login", {
        error: "Either the Email, Password or UserType is invalid",
        title:"Login/Register"
      });
    }
    const comparePass = await bcrypt.compare(password, userInfo.password);
    if (!comparePass) {
      return res.status(400).render("login", {
        error: "Either the Email, Password or UserType is invalid",
        title:"Login/Register"
      });
    }
    try {
      const userLoginAttempt = await loginUser(email, password, userType);
      // console.log(userLoginAttempt);
      if (userLoginAttempt) {
        req.session.user = {
          ...userLoginAttempt,
        };
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "user") {
        return res.redirect("/home");
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "agency") {
        return res.redirect("/agencyHome");
      }
      if (userLoginAttempt.userType.trim().toLowerCase() === "guardian") {
        return res.redirect("/guardian");
      }
    } catch (error) {
      console.log(error);
      return res.render("login", { error, title:"Login/Register" });
    }
  });

router.route("/home").get(async (req, res) => {
  //code here for GET
  // console.log(req.session.user.id);
  // const pets = await getAvailablePets();
  const pets = await getUserPetRecommendation(req.session.user.id);
  return res.render("home", { pets, userId: req.session.user.id , title:"Home"});
});
router.route("/addToShortList").post(async (req, res) => {
  try {
    // console.log(req.session.user.id);
    const result = await addUserShortListedPets(
      req.session.user.id,
      req.body.petId
    );
    if (result) {
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    console.log(error)
    if(error === 'Pet already exists in your short listed pets.'){
      return res.status(200).json({ status: "Already liked" });
    }
    return res.status(400).json({ status: "bad request" });
  }
});
// router.route("/getUserDetails").post(async (req, res) => {
//   try {
//     // console.log(req.session.user.id);
//     const result = await getUserDetails(req.session.user.id);
//     if (result) {
//       return res.status(200).json({ status: "success", data: result });
//     }
//   } catch (error) {
//     return res.status(400).json({ status: "bad request" });
//   }
// });
// router.route("/getPetDetails").post(async (req, res) => {
//   try {
//     const result = await getPet(req.body.petId);
//     if (result) {
//       return res.status(200).json({ status: "success", data: result });
//     }
//   } catch (error) {
//     return res.status(400).json({ status: "bad request" });
//   }
// });

router.route("/addToShortList").post(async (req, res) => {
  try {
    // console.log(req.session.user.id);
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
    // console.log(req.session.user);
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
  return res.render("questionnaire", { title: "Questionnaire" });
});
router.route("/viewPets").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const getDetails = await getUserDetails(req.session.user.id);
  // console.log(getDetails[0].shortListedPetsInfo);
  const pics = getDetails[0].shortListedPetsInfo.map((p) => {
    return p.pictures[0];
  });

  // console.log(getDetails[0]);
  return res.render("viewPets", {
    title: "Shortlisted Pets",
    pets: getDetails[0].shortListedPetsInfo,
    img: pics,
    quiz: getDetails[0].quizAnswers,
    age: getDetails[0].quizAnswers.Age_Group.join(","),
    BreedSize: getDetails[0].quizAnswers.Breed_Size.join(","),
    Activity: getDetails[0].quizAnswers.activity_level.join(","),
  });
});

router.route("/questionnaire").post(async (req, res) => {
  // console.log("Works");
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
      let ht = false;
      if (houseTrained === "yes") ht = true;
      let user = await addUserQuizAns(
        req.session.user.id,
        petType,
        petAgeGroup,
        petGender,
        petSize,
        energyLevel,
        specialNeeds,
        ht
      );
      // console.log("ran");
      return res.redirect("login");
    } catch (error) {
      // errors.push(error);
    }
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
});

router.route("/agencyHome").get(async (req, res) => {
  return res.render("agencyHome", { title: "Agency Home" });
});
router
  .route("/addpet")
  .get(async (req, res) => {
    const dogBreedsList = await readFile("data/allowedDogBreeds.json", "utf8");
    const dogBreeds = JSON.parse(dogBreedsList);
    const catBreedsList = await readFile("data/allowedCatBreeds.json", "utf8");
    const catBreeds = JSON.parse(catBreedsList);
    return res.render("addpet", {
      title: "Add Pet",
      dogBreeds: dogBreeds,
      catBreeds: catBreeds,
    });
  })
  .post(async (req, res) => {
    const image = req.files.image; // Access the uploaded image through req.files.image
    const {
      petName,
      petGender,
      animalType,
      dogBreed,
      catBreed,
      ageGroup,
      size,
      energyLevel,
      houseTrain,
      petVaccination,
      spayedNeutered,
      characteristics,
      bio,
      specialNeeds,
    } = req.body;
    // console.log(req.body);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let characteristicsList = [];
    let errorMessages = [];
    let imgPath = [];
    let specialNeedsList = [];
    // let uploadPath = `${__dirname}/public/Images/Pets`;
    let uploadPath = join(__dirname, '..', 'public', 'Images', 'Pets/');
    console.log(__dirname)
    console.log(uploadPath)
    // let uploadPath = '/Users/pranjalapoorva/Desktop/College/3Fall_2023/CS-546(Web)/Project/petcopy2/Virtual-pet-adoption-agency/public/Images/Pets/';

    if (
      petName === undefined ||
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
      specialNeeds === undefined
    )
      errorMessages.push("All fields are must be supplied");
    else {
      if (!image) return res.status(400).send("No image uploaded");
      if (!/^image/.test(image.mimetype))
        return res.status(400).send("Invalid file type");

      let imgName = petName;
      let cbreedName = ""
      for(let i of catBreed){
        if(i.trim()===''){
          continue
        } else {
          cbreedName+=i.trim()
        }
      }

      let dbreedName = ""
      for(let i of catBreed){
        if(i.trim()===''){
          continue
        } else {
          dbreedName+=i.trim()
        }
      }
      if (animalType === "dog") imgName = imgName + dbreedName + ".jpg";
      else imgName = imgName + cbreedName + ".jpg";
      uploadPath = uploadPath + imgName;
      imgPath[0] = "public/Images/Pets/" + imgName;

      if (!isValidName(petName.trim().toLowerCase()))
        errorMessages.push("Pet Name not provided correctly");

      if (!["dog", "cat"].includes(animalType.trim().toLowerCase()))
        errorMessages.push("Pet Type not provided correctly");

      if (!["male", "female"].includes(petGender.trim().toLowerCase()))
        errorMessages.push("Pet Gender not provided correctly");

      if (animalType === "dog") {
        const allowedDogBreedsList = await readFile(
          "data/allowedDogBreeds.json",
          "utf8"
        );
        const allowedDogBreeds = JSON.parse(allowedDogBreedsList);
        if (!allowedDogBreeds.includes(dogBreed))
          errorMessages.push("Dog Breed not provided correctly");
      } else if (animalType === "cat") {
        const allowedCatBreedsList = await readFile(
          "data/allowedCatBreeds.json",
          "utf8"
        );
        const allowedCogBreeds = JSON.parse(allowedCatBreedsList);
        if (!allowedCogBreeds.includes(catBreed))
          errorMessages.push("Cat Breed not provided correctly");
      }

      if (
        !["puppy", "young adult", "adult", "senior"].includes(
          ageGroup.trim().toLowerCase()
        )
      )
        errorMessages.push("Pet Age group not provided correctly");

      if (
        !["small", "medium", "large", "giant"].includes(
          size.trim().toLowerCase()
        )
      )
        errorMessages.push("Pet Size not provided correctly");

      if (
        !["low", "mediumenergy", "high", "very-high"].includes(
          energyLevel.trim().toLowerCase()
        )
      )
        errorMessages.push("Pet Energy Level not provided correctly");

      if (!["yes", "no"].includes(houseTrain.trim().toLowerCase()))
        errorMessages.push("House Trained field not provided correctly");

      if (
        !["complete", "pending"].includes(petVaccination.trim().toLowerCase())
      )
        errorMessages.push("Vaccination status not provided correctly");

      if (!["notdone", "done"].includes(spayedNeutered.trim().toLowerCase()))
        errorMessages.push("Spayed or Neutered status not provided correctly");

      characteristicsList = characteristics.trim().toLowerCase().split(",");
      for (let i = 0; i < characteristicsList.length; i++) {
        let char1 = characteristicsList[i];
        if (characteristics.trim().length < 5 || characteristics.trim().length > 100) {
          errorMessages.push("Characteristics can only be be comma seperated strings with a total of 5 to 100 words");
          break;
        }
        if (/\d/.test(char1)) {
          errorMessages.push(
            "Characterstics can only be comma seperated strings"
          );
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

      specialNeedsList = specialNeeds.trim().toLowerCase().split(",");
      if (specialNeeds.length !== 0) {
        for (let i = 0; i < specialNeedsList.length; i++) {
          let char1 = specialNeedsList[i];
          if (specialNeeds.trim().length < 5 || specialNeeds.trim().length > 200) {
            errorMessages.push("Special Needs can only be be comma seperated strings with a total of 5 to 200 words");
            break;
          }
          if (/\d/.test(char1)) {
            errorMessages.push(
              "Special Needs can only be comma seperated strings"
            );
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
      let finalBreed = null;
      if (animalType === "dog") finalBreed = dogBreed;
      else finalBreed = catBreed;
      let health = [];
      if (petVaccination === "complete") health.push("Vaccination Up-To-Date");
      else health.push("Vaccination Pending");
      if (spayedNeutered === "done") health.push("Spayed/Neutered");
      else health.push("Not Spayed/Neutered");
      let ht = false;
      if (houseTrain === "yes") ht = true;
      let aname = req.session.user.email;

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

    if (errorMessages.length === 0) {
      try {
        image.mv(uploadPath, (err) => {
          if (err) {
            errorMessages.push(err);
            //return res.status(500).send("Error uploading image");
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
      return res.render("addPetComplete", { title: "Pet Added" });
    }
  });
router.route("/petStories").get(async (req, res) => {
  //code here for GET
  let availablePets = await getUnavailablePets();
  let petStoryData = [];
  for (let i = 0; i < availablePets.length; i++) {
    if (
      availablePets[i].availability === false &&
      availablePets[i].successStory !== null
      // availablePets[i].hasOwnProperty("successStory")
    )
      petStoryData.push(availablePets[i]);
  }
  // console.log(petStoryData);
  // console.log(availablePets.length);
  return res.render("petStories", {
    title: "Sucessful Pet Stories",
    petStories: petStoryData,
  });
});

router.route("/education").get(async (req, res) => {
  return res.render("education", { title: "Education Centre" });
});

router.route("/guardian").get(async (req, res) => {
  const guardian = await getGuardian();

  return res.render("guardian", { title: "Pet Guardians", guardian });
});
router.route("/select-guardian").get(async (req, res) => {
  return res.redirect("/guardian");
});
router.route("/userReviews").get(async (req, res) => {
  const userReviews = await getUsersReviews(req.session.user.id);
  const guardian = userReviews.map((u) => {
    return u.guardianInfo;
  });

  return res.render("userReviews", { userReviews, gInfo: guardian.flat(Infinity), title:"Reviews" });
});
router.route("/userReviews").post(async (req, res) => {
  // console.log("ran 1");
  try {
    const postReview = await createReview(
      req.session.user.id,
      req.body.review,
      req.body.guardianId,
      parseFloat(req.body.rating)
    );
    if(postReview){
      return res.render("userReviews",{title:"Reviews"});
    }
  } catch (error) {
    // return req.redirect("/error");
    return res.status(500).json({ error: "Internal Server Error" });

  }

});
// router.route("/error", (req, res) => {
//   res.render("error");
// });
router.route("/select-guardian").post(async (req, res) => {
  // console.log(req.body);
  const reviews = await getGuardianReviews(req.body.selectedGuardian);
  const userDetails = reviews.map((r) => {
    return r.usersInfo;
  });

  // const userReviews = await getUsersReviews(req.session.user.id);
  
  // console.log(userReviews);
  const userWhoWroteReviewForGuardian = reviews.map((r)=>{
    return r.usersID.toString()
  })
  console.log(userWhoWroteReviewForGuardian)
  console.log(userWhoWroteReviewForGuardian.includes(req.session.user.id.toString()))

  // const isReviewExisting = userReviews.find((g) => {
  //   return g.guardianID.toString() === req.body.selectedGuardian;
  // });
  // console.log(isReviewExisting);
  // console.log(reviews);
  return res.render("selectedGuardian", {
    title: "Pet Guardians",
    reviews: reviews.length === 0 ? "" : reviews,
    userDetails: userDetails.flat(Infinity),
    guardian: reviews.length === 0 ? "" : reviews[0].guardianInfo[0],
    message: reviews.length === 0 ? "No reviews for this guardian" : "",
    guardianID: req.body.selectedGuardian,
    zeroReviews: !userWhoWroteReviewForGuardian.includes(req.session.user.id) ,
    title:"Select Guardian"
  });
});
router.route("/petUpdate").get(async (req, res) => {
  // console.log(req.session.user.email);
  const collection = await getAvailablePetsByAgency(req.session.user.email);
  return res.render("petUpdate", { title: "Pet Update", collection,petExists:collection.length===0?false:true });
});
router.route("/petUpdate").post(async (req, res) => {
  // console.log("inside /petupdate post");
  // console.log(req.body);
  let records = req.body.formDataArray;
  // console.log(records.length);
  try {
    for (let i = 0; i < records.length; i++) {
      let collection = await changeAvailability1(
        records[i].petID,
        records[i].story
      );
    }
    return res.render("petUpdateSuccess", { title: "Cool" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

// router.route("/updateReview").get(async (req, res) => {
//   // try {
//   //   const update = await updateReview(
//   //     req.session.user.id,
//   //     req.body.guardianId,
//   //     req.body.review,
//   //     parseFloat(req.body.rating)
//   //   );
//   // } catch (error) {
//   //   console.log(error);
//   // }
// });

router.route("/updateReview").post(async (req, res) => {
  try {
    const update = await updateReview(
      req.session.user.id,
      req.body.guardianId,
      req.body.review,
      parseFloat(req.body.rating)
    );
    if(update){
      return res.json({ redirect: "/guardian" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
