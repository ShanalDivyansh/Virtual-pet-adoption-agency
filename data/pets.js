import { pets } from "../config/mongoCollections.js";
import { readFile } from "fs/promises";
import { checkId, isValidName } from "../helpers.js";
import { ObjectId } from "mongodb";
export const createPets = async function (
  name,
  breed,
  description,
  needs,
  pictures,
  availability
) {
  if (
    !(
      typeof name !== "undefined" &&
      typeof breed !== "undefined" &&
      typeof description !== "undefined" &&
      typeof needs !== "undefined" &&
      typeof pictures !== "undefined" &&
      typeof availability !== "undefined"
    )
  ) {
    throw "All fields must be given";
  }
  name = name.trim();
  breed = breed.trim();
  description = description.trim();
  if (typeof availability !== "boolean")
    throw "Availability needs to be a boolean";
  if (!Array.isArray(needs)) throw "Needs should be an array";
  if (!Array.isArray(pictures)) throw "Pictures should be an array";

  if (!(isValidName(name) && isValidName(breed))) {
    throw "Name and brred should be a valid string and should be at least 2 characters long with a max of 25 characters";
  }
  const breedsList = await readFile("data/allowedBreeds.json", "utf8");
  const breedsData = JSON.parse(breedsList);
  const breedExists = breedsData.find(
    (b) => b.name.trim().toLowerCase() === breed.trim().toLowerCase()
  );
  if (!breedExists) throw "Enter a valid breed.";

  const collection = await pets();
  const addPet = await collection.insertOne({
    _id: new ObjectId(),
    name,
    breed,
    description,
    needs,
    pictures,
    availability,
    adoptedBy: null,
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
          localField: "adoptedBy",
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
