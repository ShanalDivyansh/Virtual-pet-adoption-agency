import { checkId, isValidName } from "../helpers.js";
import validator from "validator";
import { ObjectId } from "mongodb";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { pets, users } from "../config/mongoCollections.js";

//import mongo collections, bcrypt and implement the following data functions
export const registerUser = async (
  firstName,
  lastName,
  email,
  password,
  userType
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
  if (typeof shortlistedPets === "undefined" && typeof userID === "undefined") {
    throw "Error All fields need to have valid values";
  }
  const petID = checkId(shortlistedPetsID);
  const usersID = checkId(userID);
  const collection = await users();
  const existingInfo = await collection.findOne({ _id: new ObjectId(usersID) });
  if (!existingInfo) throw "User not found";
  // console.log(existingInfo);
  const isPetExisting = existingInfo.shortlistedPets.every((p) => {
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
  const isPetExisting = existingInfo.adoptedPets.every((pet) => pet === petID);
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

export const loginUser = async (email, password) => {
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
  if (comparePass)
    return {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
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
