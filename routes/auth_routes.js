//import express, express router as shown in lecture code
import { Router } from "express";
const router = Router();
import { array1ContainsAllElementsOfArray2 } from "../helpers.js";
import { addUserQuizAns } from "../data/users.js";

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
});

export default router;
