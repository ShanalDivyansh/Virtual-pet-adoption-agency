import { checkId, isValidName } from "../helpers.js";
import validator from "validator";
import { ObjectId } from "mongodb";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { pets, users } from "../config/mongoCollections.js";
import {getAvailablePets} from "../data/pets.js"

//import mongo collections, bcrypt and implement the following data functions
export const registerUser = async (
  firstName,
  lastName,
  email,
  password,
  userType,
  location,
  servicesOffered,
  agencyName
) => {
  if (
    !(
      typeof firstName !== "undefined" &&
      typeof lastName !== "undefined" &&
      typeof email !== "undefined" &&
      typeof password !== "undefined" &&
      typeof userType !== "undefined"
    )
  ) {
    throw "Error All fields need to have valid values";
  }
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim().toLowerCase();
  password = password.trim();
  userType = userType.trim();

  if (!(isValidName(firstName) && isValidName(lastName))) {
    throw "Name should be a valid string and should be at least 2 characters long with a max of 25 characters";
  }
  if (!validator.isEmail(email))
    throw "Error: not in a valid email address format";
  const collection = await users();
  const uniqueEmail = await collection.find({ email }).toArray();
  if (uniqueEmail.length >= 1) throw "User with that email address exists";
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
  if (!validPass)
    throw "Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character";
  const hashPassword = await bcrypt.hash(password, 12);
  const allowedRoles = ["user", "agency", "guardian"];
  if (!allowedRoles.includes(userType.toLowerCase()))
    throw "Error:  ONLY two valid values are admin or user";
  const addUser = await collection.insertOne({
    _id: new ObjectId(),
    firstName,
    lastName,
    email,
    password: hashPassword,
    shortlistedPets: [],
    adoptedPets: [],
    quizAnswers: {
      Type: null,
      Breed: null,
      Age_Group: null,
      Gender: null,
      Breed_Size: null,
      activity_level: null,
      Needs: null,
      House_Trained: null,
    },
    reviews: [],
    userType,
  });
  if (!addUser.insertedId) throw "Insert failed!";
  return { insertedUser: true };
};

export const addUserShortListedPets = async (userID, shortlistedPetsID) => {
  if (
    typeof shortlistedPetsID === "undefined" &&
    typeof userID === "undefined"
  ) {
    throw "Error All fields need to have valid values";
  }
  const petID = checkId(shortlistedPetsID);
  const usersID = checkId(userID);
  const collection = await users();
  const existingInfo = await collection.findOne({ _id: new ObjectId(usersID) });
  if (!existingInfo) throw "User not found";
  // console.log(existingInfo);
  const isPetExisting = existingInfo.shortlistedPets.find((p) => {
    return p.toString() === petID;
  });
  if (isPetExisting && existingInfo.shortlistedPets.length > 0)
    throw "Pet already exists in your short listed pets.";
  const updateInfo = await collection.findOneAndUpdate(
    { _id: new ObjectId(usersID) },
    {
      $set: {
        shortlistedPets: [...existingInfo.shortlistedPets, new ObjectId(petID)],
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Error: Update failed";

  const petsCollection = await pets();
  const existingPetsInfo = await petsCollection.findOne({
    _id: new ObjectId(petID),
  });
  console.log(existingPetsInfo);
  const addUser = petsCollection.findOneAndUpdate(
    { _id: new ObjectId(petID) },
    {
      $set: {
        intrestedUsers: [
          ...existingPetsInfo.intrestedUsers,
          new ObjectId(usersID),
        ],
      },
    },
    { returnDocument: "after" }
  );

  return await updateInfo;
};

export const addUserAdoptedPets = async (userId, adoptedPets) => {
  if (typeof adoptedPets === "undefined" && typeof userId === "undefined") {
    throw "Error All fields need to have valid values";
  }
  const petID = checkId(adoptedPets);
  const usersID = checkId(userID);
  const collection = await users();
  const existingInfo = await collection.findOne({ _id: new ObjectId(usersID) });
  if (!existingInfo) throw "User not found";
  const isPetExisting = existingInfo.adoptedPets.find((pet) => pet === petID);
  if (isPetExisting && existingInfo.adoptedPets.length > 0)
    throw "Pet already adopted.";
  const updateInfo = await collection.findOneAndUpdate(
    { _id: new ObjectId(usersID) },
    {
      $set: {
        adoptedPets: [...existingInfo.adoptedPets, new ObjectId(petID)],
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Error: Update failed";

  const petCollection = await pets();
  const markAdopted = await petCollection.findOneAndUpdate(
    { _id: new ObjectId(petID) },
    {
      $set: {
        availability: false,
      },
    }
  );
  if (!markAdopted) throw "Error: Update failed";

  return await updateInfo;
};

// to do check the validation for quiz ans
export const addUserQuizAns = async (
  userID,
  Type,
  // Breed,
  Age_Group,
  Gender,
  Breed_Size,
  activity_level,
  Needs,
  House_Trained
) => {
  if (
    typeof Type === "undefined" &&
    typeof userID === "undefined" &&
    // typeof Breed === "undefined" &&
    typeof Age_Group === "undefined" &&
    typeof Gender === "undefined" &&
    typeof Breed_Size === "undefined" &&
    typeof activity_level === "undefined" &&
    typeof Needs === "undefined" &&
    typeof House_Trained === "undefined"
  ) {
    throw "Error All fields need to have valid values";
  }
  const usersID = checkId(userID);
  const collection = await users();
  const existingInfo = await collection.findOne({ _id: new ObjectId(usersID) });
  if (!existingInfo) throw "User not found";
  console.log(existingInfo);
  const updateInfo = await collection.findOneAndUpdate(
    { _id: new ObjectId(usersID) },
    {
      $set: {
        quizAnswers: {
          Type,
          // Breed,
          Age_Group,
          Gender,
          Breed_Size,
          activity_level,
          Needs,
          House_Trained,
        },
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Error: Update failed";

  return await updateInfo;
};
export const updateUserReviews = async (userdId, reviews) => {
  if (typeof reviews === "undefined" && typeof userdId === "undefined") {
    throw "Error All fields need to have valid values";
  }
  const reviewsID = checkId(reviews);
  const usersID = checkId(userdId);
  const collection = await users();
  const existingInfo = await collection.findOne({ _id: new ObjectId(usersID) });
  if (!existingInfo) throw "User not found";
  const updateInfo = await collection.findOneAndUpdate(
    { _id: new ObjectId(usersID) },
    {
      $set: {
        reviews: [...existingInfo.reviews, new ObjectId(reviewsID)],
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Error: Update failed";

  return await updateInfo;
};

export const loginUser = async (email, password, role) => {
  if (!(typeof email !== "undefined" && typeof password !== "undefined")) {
    throw "Error All fields need to have valid values";
  }
  email = email.trim().toLowerCase();
  password = password.trim();
  if (!validator.isEmail(email))
    throw "Error: not in a valid email address format";
  const isPassSpaces = [...password].every((char) => {
    return char.trim() !== "";
  });
  if (!isPassSpaces) throw "Error: password contains spaces";
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
  if (!validPass)
    throw "Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character";
  const collection = await users();
  const userInfo = await collection.findOne({ email });
  if (!userInfo) throw "Either the email address or password is invalid";
  const comparePass = await bcrypt.compare(password, userInfo.password);
  if (!comparePass) throw "Either the email address or password is invalid";
  if (userInfo.userType !== role.trim().toLowerCase())
    throw "Error: User type not matching.";
  if (comparePass) {
  }
  return {
    id: userInfo._id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    userType: role,
  };
};

export const getUserDetails = async function (userID) {
  const id = checkId(userID);
  const collection = await users();
  const details = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "pets",
          localField: "shortlistedPets",
          foreignField: "_id",
          as: "shortListedPetsInfo",
        },
      },
      {
        $lookup: {
          from: "pets",
          localField: "adoptedPets",
          foreignField: "_id",
          as: "AdoptedPetsInfo",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "ReviewsInfo",
        },
      },
    ])
    .toArray();
  if (!details) throw "Error: user not found";
  return details;
};

export const getUserPetRecommendation = async function (userID) {
  const userCollection = await users();
  const userInfo = await userCollection.findOne({ _id: new ObjectId(userID) });
  let userQuizAnswer = userInfo.quizAnswers;
  let allPetDetails = 0;
  // console.log(userQuizAnswer);
  try {
    allPetDetails = await getAvailablePets();
    // console.log(allPetDetails.length);
    // for(let i =0 ;i<allPetDetails.length ;i++)
    for (let i = 0; i < allPetDetails.length; i++) {
      let matchScore = 0;
      if(userQuizAnswer.Type.toLowerCase() === 'none')
        matchScore += 2;
      if (userQuizAnswer.Type.toLowerCase() === allPetDetails[i].type.toLowerCase()) {
        matchScore += 2;
        // console.log("type match")  
      }
      // // console.log(userInfo.quizAnswers.Age_Group);
      if (userQuizAnswer.Age_Group.length > 1) {
        for (let x = 0; x < userQuizAnswer.Age_Group.length; x++) {
          if (userQuizAnswer.Age_Group[x].toLowerCase() === allPetDetails[i].age.toLowerCase()) {
            matchScore += 1;
            // console.log("age match")  
          }
        }
      }
      else if (userQuizAnswer.Age_Group === allPetDetails[i].age) {
        matchScore += 1;
        // console.log("age match")  
      }
      if(userQuizAnswer.Gender.toLowerCase() === 'none')
        matchScore += 1;
      if (userQuizAnswer.Gender.toLowerCase() === allPetDetails[i].gender.toLowerCase()) {
        matchScore += 1;
        // console.log("gender match")  
      }
      if (userQuizAnswer.Breed_Size.length > 1) {
        for (let x = 0; x < userQuizAnswer.Breed_Size.length; x++) {
          if (userQuizAnswer.Breed_Size[x].toLowerCase() === allPetDetails[i].breedSize.toLowerCase()) {
            matchScore += 1;
            // console.log("breed match")  
          }
        }
      }
      else if (userQuizAnswer.Breed_Size === allPetDetails[i].breedSize) {
        matchScore += 1;
        // console.log("breed match")  
      }

      if (userQuizAnswer.activity_level.length > 1) {
        for (let x = 0; x < userQuizAnswer.activity_level.length; x++) {
          if (userQuizAnswer.activity_level[x].toLowerCase() === allPetDetails[i].energyLevel.toLowerCase()) {
            matchScore += 1;
            // console.log("activity match")  
          }
        }
      }
      else if (userQuizAnswer.activity_level === allPetDetails[i].energyLevel) {
        matchScore += 1;
        // console.log("activity match")  
      }

      let tempNeeds = allPetDetails[i].needs;
      for (let aa = 0; aa < allPetDetails[i].needs.length; aa++) {
        tempNeeds[aa] = tempNeeds[aa].toLowerCase();
      }
      if (userQuizAnswer.Needs.toLowerCase() === 'yes' && tempNeeds.length !== 0 && !tempNeeds.includes('none')) {
        matchScore += 1;
        // console.log("yes needs match")
      }
      if (userQuizAnswer.Needs.toLowerCase() === 'no' && (tempNeeds.length === 0 || tempNeeds.includes('none'))) {
        matchScore += 1;
        // console.log("no needs match")  
      }
      if(userQuizAnswer.House_Trained.toLowerCase() === 'no')
        matchScore += 1;
      else if (userQuizAnswer.House_Trained === allPetDetails[i].houseTrained) {
        matchScore += 1;
        // console.log("HT match")  
      }

      allPetDetails[i].matchingScore = matchScore;
      // // console.log(`score for ${allPetDetails[i].name} is ${matchScore}`);
    }
  } catch (error) {
    // console.log(error);
  }
  // let temp1= [allPetDetails[0],allPetDetails[1],allPetDetails[2],allPetDetails[3]];
  allPetDetails.sort((a, b) => b.matchingScore - a.matchingScore);
  // // console.log(temp1);
  return allPetDetails;
  // // console.log(userInfo.quizAnswers.Type);
  // // console.log(allPetDetails);

}