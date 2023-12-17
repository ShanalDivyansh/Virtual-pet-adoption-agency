import { guardian } from "../config/mongoCollections.js";
import { isValidName, checkState, checkZip } from "../helpers.js";
import validator from "validator";
import PasswordValidator from "password-validator";
import bcrypt, { hash } from "bcrypt";
import { ObjectId } from "mongodb";

export const createGuardian = async function (
  firstName,
  lastName,
  email,
  password,
  userType,
  location,
  servicesOffered
) {
  if (
    typeof firstName === "undefined" &&
    typeof lastName === "undefined" &&
    typeof email === "undefined" &&
    typeof password === "undefined" &&
    typeof userType === "undefined"
  ) {
    throw "Error All fields need to have valid values.";
  }

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim().toLowerCase();
  password = password.trim();
  userType = userType.trim();

  if (!(isValidName(firstName) && isValidName(lastName))) {
    throw "Name should be a valid string and should be at least 2 characters long with a max of 25 characters";
  }

  if (typeof location !== "object") throw "Location Must Be Of Object Type";

  if (
    !location.streetAddress ||
    typeof location.streetAddress !== "string" ||
    !location.city ||
    typeof location.city !== "string" ||
    !location.state ||
    typeof location.state !== "string" ||
    !location.zip ||
    typeof location.zip !== "string"
  ) {
    throw "Zip, State, City And StreetAddress Fileds Should Be Provided And Should Be String Type For location";
  }

  location.streetAddress = location.streetAddress.trim();
  location.city = location.city.trim();
  location.state = location.state.trim();
  location.zip = location.zip.trim();

  if (
    location.streetAddress === " " ||
    location.city === " " ||
    location.state === " " ||
    location.zip === " "
  ) {
    throw "Zip, State, City And StreetAddress Fileds Should Not Be Empty";
  }

  if (location.streetAddress.length < 3)
    throw "location.streetAddress Should Not Be Less Than 3 Characters";

  if (location.city.length < 3)
    throw "location.city Should Not Be Less Than 3 Characters";

  if (!checkState(location.state)) throw "State Abbreviation Is Not Valid";

  if (!checkZip(location.zip)) throw "Zip Code Is Not Valid";

  if (!validator.isEmail(email))
    throw "Error: not in a valid email address format";
  const collection = await guardian();
  const uniqueEmail = await collection.find({ email }).toArray();
  if (uniqueEmail.length >= 1) throw "User with that email address exists";
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
  if (!validPass)
    throw "Password needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character";
  const hashPassword = await bcrypt.hash(password, 12);
  const allowedRoles = ["guardian"];
  if (!allowedRoles.includes(userType.toLowerCase()))
    throw "Error:  ONLY two valid values are admin or user";
  const addUser = await collection.insertOne({
    _id: new ObjectId(),
    firstName,
    lastName,
    email,
    password: hashPassword,
    userType,
    location,
    servicesOffered,
    reviews: [],
  });
  if (!addUser.insertedId) throw "Insert failed!";
  return { insertedUser: true };
};
