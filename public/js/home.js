const pets = document.querySelector(".pets-available");
const petImg = document.querySelector(".pet-img");
const petBio = document.querySelector(".pet-bio");
const petDesc = document.querySelector(".pet-desc");
const userId = document.querySelector(".user-logged");
const shortListedListContainer = document.querySelector(".pets-list");
const tinderLogo = document.querySelector(".tinder-logo");
const detailsContainer = document.querySelector(".pet-details-container");
const backBtn = document.querySelector(".details-back-btn");
const petsDetails = [];
for (let i = 0; i < pets.children.length; i++) {
  petsDetails.push(pets.children.item(i).innerHTML);
}
console.log(petsDetails[0].split("%%"));

let index = 0;
let liked = null;

document.addEventListener("DOMContentLoaded", function () {
  const hammer = new Hammer(petImg);
  updatePetInfo();

  hammer.on("swipe", function (event) {
    if (event.direction === Hammer.DIRECTION_LEFT) {
      console.log("Swiped left!");
      if (index > 0) {
        index--;
        updatePetInfo();
      }
    } else if (event.direction === Hammer.DIRECTION_RIGHT) {
      console.log("Swiped right!");
      if (index < pets.children.length - 1) {
        index++;
        updatePetInfo();
        console.log(index);
      }
    }
  });
  const heartElement = document.querySelector(".shortList");
  heartElement.addEventListener("click", handleHeartClick);
});
async function handleHeartClick() {
  if (!liked || liked !== index) {
    liked = index;
    const values = pets.children.item(index).innerHTML.split("%%");
    try {
      const response = await fetch("/addToShortList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId: values[0] }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error:", error);
    }
  } else {
    console.log("Already liked");
  }

  fetch("/getUserDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userId.innerText }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      shortListedListContainer.innerHTML = "";
      const userDetails = data.data[0];
      for (let pet of userDetails.shortListedPetsInfo) {
        const addPetToShortList = document.createElement("li");
        const petImage = document.createElement("img");
        petImage.src = pet.pictures[0];
        petImage.alt = "pet";
        petImage.className = "pet-shotlist-logo";
        const petName = document.createElement("span");
        petName.textContent = pet.name;
        const clickMe = document.createElement("span");
        clickMe.textContent = "Click for Details";
        clickMe.className = "click-me";
        addPetToShortList.id = `${pet._id}`;

        addPetToShortList.appendChild(petImage);
        addPetToShortList.appendChild(petName);
        addPetToShortList.appendChild(clickMe);
        shortListedListContainer.appendChild(addPetToShortList);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
function updatePetInfo() {
  const values = pets.children.item(index).innerHTML.split("%%");
  let createImg = document.createElement("img");
  createImg.src = `${values[8]}`;
  petImg.innerHTML = "";
  petImg.appendChild(createImg);
  let petName = document.createElement("p");
  petName.innerText = `${values[1]}`;
  let breed = document.createElement("p");
  breed.innerText = `${values[2]} - ${values[3]}`;
  petBio.innerHTML = "";
  let heart = document.createElement("button");
  heart.innerHTML = "&#10084;&#65039;";
  heart.classList.add("shortList");
  heart.addEventListener("click", handleHeartClick);
  petBio.appendChild(petName);
  petBio.appendChild(breed);
  petBio.appendChild(heart);
  let petDescription = document.createElement("p");
  petDescription.innerText = `${values[9]}`;
  petDesc.innerHTML = "";
  petDesc.appendChild(petDescription);
}

fetch("/getUserDetails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ userId: userId.innerText }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error");
    }
    return response.json();
  })
  .then((data) => {
    shortListedListContainer.innerHTML = "";
    const userDetails = data.data[0];
    for (let pet of userDetails.shortListedPetsInfo) {
      console.log(pet);
      const addPetToShortList = document.createElement("li");
      const petImage = document.createElement("img");
      petImage.src = pet.pictures[0];
      petImage.alt = "pet";
      petImage.className = "pet-shotlist-logo";
      const petName = document.createElement("span");
      petName.textContent = pet.name;
      const clickMe = document.createElement("span");
      clickMe.textContent = "Click for Details";
      clickMe.className = "click-me";

      addPetToShortList.id = `${pet._id}`;

      addPetToShortList.appendChild(petImage);
      addPetToShortList.appendChild(petName);
      addPetToShortList.appendChild(clickMe);
      shortListedListContainer.appendChild(addPetToShortList);
    }
  })
  .catch((error) => {
    console.log("Error:", error);
  });

shortListedListContainer.addEventListener("click", async (e) => {
  const img = document.querySelector(".details-img");
  const name = document.querySelector(".details-pet-name");
  const type = document.querySelector(".details-pet-type");
  const breed = document.querySelector(".details-pet-breed");
  const breedSize = document.querySelector(".details-pet-breedSize");
  const age = document.querySelector(".details-pet-age");
  const gender = document.querySelector(".details-pet-gender");
  const chars = document.querySelector(".details-pet-charecterstics");
  const health = document.querySelector(".details-pet-health");
  const needs = document.querySelector(".details-pet-needs");
  const trained = document.querySelector(".details-pet-houseTrained");
  const descr = document.querySelector(".details-pet-description-placeHolder");

  const clickedPet = e.target.id;
  petImg.classList.toggle("hide-tinder");
  tinderLogo.classList.toggle("hide-tinder");
  petBio.classList.toggle("hide-tinder");
  petDesc.classList.toggle("hide-tinder");
  detailsContainer.classList.toggle("details-show");
  backBtn.addEventListener("click", () => {
    petImg.classList.remove("hide-tinder");
    tinderLogo.classList.remove("hide-tinder");
    petBio.classList.remove("hide-tinder");
    petDesc.classList.remove("hide-tinder");
    detailsContainer.classList.add("details-show");
  });
  try {
    const response = await fetch("/getPetDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petId: clickedPet }),
    });
    if (!response.ok) {
      throw new Error("Error");
    }
    const data = await response.json();
    console.log(data);
    const petsData = data.data[0];
    img.src = `${petsData.pictures[0]}`;
    name.innerText = `Name: ${petsData.name}`;
    type.innerText = `${petsData.type}`;
    breed.innerText = `Breed: ${petsData.breed}`;
    breedSize.innerText = `Breed: ${petsData.breedSize}`;
    age.innerText = `Age: ${petsData.age}`;
    gender.innerText = `${petsData.gender}`;
    health.innerText = `Health: ${petsData.health.join(",")}`;
    chars.innerText = `Gender: ${petsData.characteristics.join(",")}`;
    needs.innerText = `Needs: ${petsData.needs.join(",")}`;
    trained.innerText = `House Trained: ${petsData.houseTrained}`;
    descr.innerText = `${petsData.description}`;
  } catch (error) {
    console.log("Error:", error);
  }
});
