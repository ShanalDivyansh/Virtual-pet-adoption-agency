import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createPets } from "../data/pets.js";
import { createGuardian } from "../data/guardian.js";
import { registerUser } from "../data/users.js";
import {readFile} from 'fs/promises'
import { read } from "fs";

const petList = await readFile("seed/PetSeed.json", "utf8");
const petDetails = JSON.parse(petList);
const userList = await readFile("seed/Users.json","utf8");
const UserDetails = JSON.parse(userList);
const guardianList = await readFile("seed/guardian.json","utf8");
const guardianDetails = JSON.parse(guardianList);
const agencyList = await readFile("seed/Agency.json","utf8");
const agencyDetails = JSON.parse(agencyList);
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
        console.log(error);
    }

}

for(let i=0;i<UserDetails.length;i++)
{
    try {
        await registerUser(UserDetails[i].firstName,
            UserDetails[i].lastName,
            UserDetails[i].email,
            UserDetails[i].password,
            UserDetails[i].userType)
    } catch (error) {
        console.log(error);
    }

}

for(let i=0;i<guardianDetails.length;i++)
{
    try {
        await createGuardian(guardianDetails[i].firstName,
            guardianDetails[i].lastName,
            guardianDetails[i].email,
            guardianDetails[i].password,
            guardianDetails[i].userType,
            guardianDetails[i].location,
            guardianDetails[i].servicesOffered)
    } catch (error) {
        console.log(error);
    }

}

for(let i=0;i<agencyDetails.length;i++)
{
    try {
        await registerUser(agencyDetails[i].firstName,
            agencyDetails[i].lastName,
            agencyDetails[i].email,
            agencyDetails[i].password,
            agencyDetails[i].userType)
    } catch (error) {
        console.log(error);
    }

}

await closeConnection();
