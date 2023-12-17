
const type = document.querySelector('.type-selector');

const dog = document.querySelector('.dog-selector');
const cat = document.querySelector('.cat-selector');
type.addEventListener('change', (e) => {
    console.log(type.value);
    if (type.value === 'cat') {
        dog.classList.add("selector-dogShow");
        cat.classList.remove("selector-catShow");
    }
    if (type.value === 'dog') {
        dog.classList.remove("selector-dogShow");
        cat.classList.add("selector-catShow");
    }

})

let addPet_form = document.getElementById("addpet-form");

if (addPet_form) {
    addPet_form.addEventListener("submit", (event) => {
        event.preventDefault();
        let errorMessages = [];
        let petName = document.getElementById("petName").value;
        let petType = document.getElementById("animalType").value;
        let petGender = document.getElementById("petGender").value;
        let dogBreed = document.getElementById("dogBreed").value;
        let catBreed = document.getElementById("catBreed").value;
        let ageGroup = document.getElementById("ageGroup").value;
        let petSize = document.getElementById("size").value;
        let energyLevel = document.getElementById("energyLevel").value;
        let houseTrain = document.getElementById("houseTrain").value;
        let characteristics = document.getElementById("characteristics").value;
        let bio = document.getElementById("bio").value;
        let petVaccination = document.getElementById("petVaccination").value;
        let spayedNeutered = document.getElementById("spayedNeutered").value;
        let specialNeeds = document.getElementById("specialNeeds").value;
        if (
            petName.trim() === "" ||
            petType.trim() === "" ||
            petGender.trim() === "" ||
            dogBreed.trim() === "" ||
            catBreed.trim() === "" ||
            ageGroup.trim() === "" ||
            petSize.trim() === "" ||
            energyLevel.trim() === "" ||
            houseTrain.trim() === "" ||
            characteristics.trim() === "" ||
            bio.trim() === "" ||
            petVaccination.trim() === "" ||
            spayedNeutered.trim() === ""
        )
            errorMessages.push("All the fields are mandatory except Special Needs");
        else {

            if (!isValidName(petName.trim().toLowerCase()))
                errorMessages.push("Pet Name not provided correctly");

            if (!['dog', 'cat'].includes(petType.trim().toLowerCase()))
                errorMessages.push("Pet Type not provided correctly");

            if (!['male', 'female'].includes(petGender.trim().toLowerCase()))
                errorMessages.push("Pet Gender not provided correctly");

            // if (!['male', 'female'].includes(dogBreed.trim().toLowerCase()))
            //     errorMessages.push("Pet Gender not provided correctly");
            // if (!['male', 'female'].includes(catBreed.trim().toLowerCase()))
            //     errorMessages.push("Pet Gender not provided correctly");
            // if (!['low','mediumEnergy','high','very-high'].includes(energyLevel.trim().toLowerCase()))
            //     errorMessages.push("Pet Energy Level not provided correctly");
            // if (!['notDone','done'].includes(spayedNeutered.trim().toLowerCase()))
            //     errorMessages.push("Spayed or Neutered status not provided correctly");

            if (!['puppy', 'young adult', "adult", "senior"].includes(ageGroup.trim().toLowerCase()))
                errorMessages.push("Pet Age group not provided correctly");

            if (!['small', 'medium', 'large', 'giant'].includes(petSize.trim().toLowerCase()))
                errorMessages.push("Pet Size not provided correctly");

            if (!['yes', 'no'].includes(houseTrain.trim().toLowerCase()))
                errorMessages.push("House Trained field not provided correctly");

            let characteristicsList = characteristics.trim().toLowerCase().split(',')
            for (let i = 0; i < characteristicsList.length; i++) {
                let char1 = characteristicsList[i];
                if (/\d/.test(char1)) {
                    errorMessages.push("Characterstics can only be comma seperated strings");
                    break;
                }
                if (char1.trim().length < 4) {
                    errorMessages.push("Characterstics can not be BLANK");
                    break;
                }
            }
            if (!["complete", "pending"].includes(petVaccination.trim().toLowerCase()))
                errorMessages.push("Vaccination status not provided correctly");

            let specialNeedsList = specialNeeds.trim().toLowerCase().split(',')
            if (specialNeeds.length !== 0 ) {
                for (let i = 0; i < specialNeedsList.length; i++) {
                    let char1 = specialNeedsList[i];
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

            if (bio.trim().length < 5 || bio.trim().length > 100)
                errorMessages.push("Bio can only be 5 to 100 words long");
        }

if (errorMessages.length > 0) {
    //console.log('----------->CSV logs');
    displayError(errorMessages);
    return;
}
// console.log("all good")
addPet_form.submit();
    });
}
function displayError(errorMessages) {
    removeError();
    let errorElement = document.createElement("ul");
    errorElement.classList.add("error");
    for (let msg of errorMessages) {
        let listItem = document.createElement("li");
        listItem.textContent = msg;
        errorElement.appendChild(listItem);
    }
    addPet_form.appendChild(errorElement);
}

function removeError() {
    let existingError = addPet_form.querySelector(".error");
    if (existingError) {
        addPet_form.removeChild(existingError);
    }
}

function isValidName(name) {
    const notContainsNum = [...name].every((char) => {
        if (char.trim() === "") {
            return true;
        } else {
            return isNaN(char);
        }
    });
    return (
        typeof name === "string" &&
        name !== undefined &&
        name !== null &&
        name.trim().length > 0 &&
        name.length >= 2 &&
        name.length <= 25 &&
        notContainsNum
    );
}