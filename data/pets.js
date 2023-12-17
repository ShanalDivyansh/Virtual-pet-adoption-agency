import { pets } from "../config/mongoCollections.js";
import { readFile } from "fs/promises";
import { checkId, isValidName } from "../helpers.js";
import { ObjectId } from "mongodb";
import validator from "validator";
export const createPets = async function (
  pictures,
  name,
  type,
  breed,
  age,
  gender,
  breedSize,
  characteristics,
  energyLevel,
  health,
  description,
  needs,
  houseTrained,
  availability,
  agencyName
) {
  if (
    !(
      typeof type !== "undefined" &&
      typeof age !== "undefined" &&
      typeof gender !== "undefined" &&
      typeof breedSize !== "undefined" &&
      typeof characteristics !== "undefined" &&
      typeof energyLevel !== "undefined" &&
      typeof health !== "undefined" &&
      typeof houseTrained !== "undefined" &&
      typeof name !== "undefined" &&
      typeof breed !== "undefined" &&
      typeof description !== "undefined" &&
      typeof needs !== "undefined" &&
      typeof pictures !== "undefined" &&
      typeof availability !== "undefined" &&
      typeof agencyName !== "undefined"
    )
  ) {
    throw "All fields must be given";
  }
  name = name.trim();
  breed = breed.trim();
  description = description.trim();
  agencyName = agencyName.trim();
  energyLevel = energyLevel.trim();
  if (!validator.isEmail(agencyName)) throw "Error: Invalid agency details";
  if (typeof availability !== "boolean")
    throw "Availability needs to be a boolean";
  if (typeof houseTrained !== "boolean")
    throw "House Trained needs to be a boolean";
  if (!Array.isArray(needs)) throw "Needs should be an array";
  if (!Array.isArray(pictures)) throw "Pictures should be an array";
  if (!Array.isArray(characteristics))
    throw "Characteristics should be an array";
  if (!Array.isArray(health)) throw "Health should be an array";

  if (!(isValidName(name) && isValidName(breed))) {
    throw "Name and brred should be a valid string and should be at least 2 characters long with a max of 25 characters";
  }
  const breedsList = await readFile("data/allowedBreeds.json", "utf8");
  const breedsData = JSON.parse(breedsList);
  const breedExists = breedsData.find(
    (b) => b.trim().toLowerCase() === breed.trim().toLowerCase()
  );
  if (!breedExists) throw "Enter a valid breed.";

  const collection = await pets();
  const addPet = await collection.insertOne({
    _id: new ObjectId(),
    name,
    type,
    breed,
    age,
    gender,
    breedSize,
    characteristics,
    energyLevel,
    health,
    description,
    needs,
    houseTrained,
    pictures,
    availability,
    adoptedBy: null,
    agencyName: agencyName.trim().toLowerCase(),
    intrestedUsers: [],
  });
  if (!addPet.insertedId) throw "Insert failed!";
  return { insertedUser: true };
};

export const getPet = async function (petId) {
  const id = checkId(petId);
  const collection = await pets();
  const petDetails = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "intrestedUsers",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
    ])
    .toArray();
  if (!petDetails) throw "No pets found.";
  return petDetails;
};

export const getAdoptedPets = async function () {
  const collection = await pets();
  const adoptedPets = await collection
    .find({ availability: { $eq: false } })
    .toArray();
  if (!adoptedPets) throw "No pets failed!";
  return adoptedPets;
};
export const getAvailablePets = async function () {
  const collection = await pets();
  const availablePets = await collection
    .find({ availability: { $eq: true } })
    .toArray();
  if (!availablePets) throw "No pets failed!";
  return availablePets;
};
export const getAvailablePetsByAgency = async function (agencyName) {
  if (!validator.isEmail(agencyName)) throw "Error agency name is invalid";
  const collection = await pets();
  const availablePets = await collection
    .find({ agencyName, availability: { $eq: false } })
    .toArray();
  // console.log(availablePets);
  if (!availablePets) throw "No pets failed!";
  return availablePets;
};

export const changeAvailability = async function (petID, story, availability) {
  const id = checkId(petID);
  if (!(`${availability}` === "false" || `${availability}` === "true"))
    throw "Availabilty must be true or false";
  const collection = await pets();
  const update = collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        availability: Boolean(availability),
        successStory: story,
      },
    },
    { returnDocument: "after" }
  );

  if (!update) throw "Pet not found";
  return update;
};
