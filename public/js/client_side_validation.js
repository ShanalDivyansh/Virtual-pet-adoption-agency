// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

let questionnaire_form = document.getElementById('questionnaire-form');
if (questionnaire_form) {
    questionnaire_form.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorMessages = [];
        let selectedPetType = document.querySelector('input[name="petType"]:checked');
        let checkSelectedPetAgeGroup = document.querySelectorAll('input[name="petAgeGroup"]:checked');
        let selectedPetGender = document.querySelector('input[name="petGender"]:checked');
        let checkSelectedPetSize = document.querySelectorAll('input[name="petSize"]:checked');
        let houseTrainPreference = document.querySelector('input[name="houseTrained"]:checked');
        let checkSelectedEnergyLevel = document.querySelectorAll('input[name="energyLevel"]:checked');
        let specialNeedPreference = document.querySelector('input[name="specialNeeds"]:checked');

        // let selectedPetType = document.querySelector('input[name="petType"]:checked').value;
        // let checkSelectedPetAgeGroup = document.querySelectorAll('input[name="petAgeGroup"]:checked');
        // let selectedPetAgeGroup = Array.from(checkSelectedPetAgeGroup).map(checkbox => checkbox.value).join(',');
        // let selectedPetGender = document.querySelector('input[name="petGender"]:checked').value;
        // let checkSelectedPetSize = document.querySelectorAll('input[name="petSize"]:checked');
        // let selectedPetSize = Array.from(checkSelectedPetSize).map(checkbox => checkbox.value).join(',');
        // let houseTrainPreference = document.querySelector('input[name="houseTrained"]:checked').value;
        // let checkSelectedEnergyLevel = document.querySelectorAll('input[name="energyLevel"]:checked');
        // let selectedEnergyLevel = Array.from(checkSelectedEnergyLevel).map(checkbox => checkbox.value).join(',');
        // let specialNeedPreference = document.querySelector('input[name="specialNeeds"]:checked').value;
        // console.log(selectedPetGender);
        if (selectedPetType === null ||
            checkSelectedPetAgeGroup === null ||
            selectedPetGender === null ||
            checkSelectedPetSize === null ||
            houseTrainPreference === null ||
            checkSelectedEnergyLevel === null ||
            specialNeedPreference === null)
            errorMessages.push("All questions are mandatory");
        else {
            // answer 1
            selectedPetType = selectedPetType.value.trim().toLowerCase();
            // answer 2
            let selectedPetAgeGroup = Array.from(checkSelectedPetAgeGroup).map(checkbox => checkbox.value.trim().toLowerCase()).join(',');
            // answer 3
            selectedPetGender = selectedPetGender.value.trim().toLowerCase();
            // answer 4
            let selectedPetSize = Array.from(checkSelectedPetSize).map(checkbox => checkbox.value.trim().toLowerCase()).join(',');
            // answer 5
            houseTrainPreference = houseTrainPreference.value.trim().toLowerCase();
            // answer 6
            let selectedEnergyLevel = Array.from(checkSelectedEnergyLevel).map(checkbox => checkbox.value.trim().toLowerCase()).join(',');
            // answer 7
            specialNeedPreference = specialNeedPreference.value.trim().toLowerCase();

            if (!['dog', 'cat', 'none'].includes(selectedPetType))
                errorMessages.push("Question 1 NOT answered correctly!");

            if (!selectedPetAgeGroup.includes("puppy") &&
                !selectedPetAgeGroup.includes("yound adult") &&
                !selectedPetAgeGroup.includes("adult") &&
                !selectedPetAgeGroup.includes("senior"))
                errorMessages.push("Question 2 NOT answered correctly!");

            if (!['male', 'female', 'none'].includes(selectedPetGender))
                errorMessages.push("Question 3 NOT answered correctly!");

            if (!selectedPetSize.includes("small") &&
                !selectedPetSize.includes("medium") &&
                !selectedPetSize.includes("large") &&
                !selectedPetSize.includes("giant"))
                errorMessages.push("Question 4 NOT answered correctly!");

            if (!['yes', 'none'].includes(houseTrainPreference))
                errorMessages.push("Question 5 NOT answered correctly!");

            if (!selectedEnergyLevel.includes("low") &&
                !selectedEnergyLevel.includes("medium") &&
                !selectedEnergyLevel.includes("high") &&
                !selectedEnergyLevel.includes("very-high"))
                errorMessages.push("Question 6 NOT answered correctly!");

            if (!['yes', 'no'].includes(specialNeedPreference))
                errorMessages.push("Question 7 NOT answered correctly!");

        }

        if (errorMessages.length > 0) {
            //console.log('----------->CSV logs');
            displayError(errorMessages);
            return;
        }
        // console.log("clear")
        questionnaire_form.submit();
    });
}
function displayError(errorMessages) {
    removeError();
    let errorElement = document.createElement('ul');
    errorElement.classList.add('error');
    for (let msg of errorMessages) {
        let listItem = document.createElement('li');
        listItem.textContent = msg;
        errorElement.appendChild(listItem);
    }
    questionnaire_form.appendChild(errorElement);
}

function removeError() {
    let existingError = questionnaire_form.querySelector('.error');
    if (existingError) {
        questionnaire_form.removeChild(existingError);
    }
}