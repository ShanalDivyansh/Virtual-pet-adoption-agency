import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createPets } from "../data/pets.js";
import {readFile} from 'fs/promises'

const petList = await readFile("seed/PetSeed.json", "utf8");
const petDetails = JSON.parse(petList);
const db = await dbConnection();
await db.dropDatabase();

for(let i=0;i<petDetails.length;i++)
{
    try {
        await createPets(petDetails[i].pictures,
            petDetails[i].name,
            petDetails[i].type,
            petDetails[i].breed,
            petDetails[i].age,
            petDetails[i].gender,
            petDetails[i].breedSize,
            petDetails[i].characteristics,
            petDetails[i].energyLevel,
            petDetails[i].health,
            petDetails[i].description,
            petDetails[i].needs,
            petDetails[i].houseTrained,
            petDetails[i].availability,
            petDetails[i].agency)
    } catch (error) {
        console.log(petDetails[i].breed);
        console.log(error);
    }

}
await closeConnection();
