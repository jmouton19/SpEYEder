const baseURL = "http://localhost:8080";
// const baseURL =
//   "http://speyeder-env.eba-nkypmpps.eu-west-1.elasticbeanstalk.com";
document.addEventListener("DOMContentLoaded", async function () {
  //On website load check if the user is logged in to determine what screen to show
  let isUserLoggedIn = await checkIfLoggedIn();
  if (isUserLoggedIn) {
    showMainContent();
    displayGoogleInfo();
    displayGitHubInfo();
    displayPwnedInfo();
  } else {
    showLoginScreen();
  }

  //Create listeners for all the buttons
  document.getElementById("logoutButton").addEventListener("click", logOut);
  document.getElementById("googleLoginButton").addEventListener("click", login);
  document
    .getElementById("googleLoginButtonOnCard")
    .addEventListener("click", login);
  document
    .getElementById("githubLoginButton")
    .addEventListener("click", githubLogin);
  document
    .getElementById("toggleButton")
    .addEventListener("click", toggleContent);
});

//Performs the login
function login() {
  const backendUrl = baseURL + "/auth/login";
  window.location.href = backendUrl;
}

function githubLogin() {
  const backendUrl = baseURL + "/auth/github";
  window.location.href = backendUrl;
}

//Makes API call to logout + show the login screen
async function logOut() {
  const apiUrl = baseURL + "/auth/logout";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      showLoginScreen();
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

//Calls the refresh endpoint to check if the user is logged in
async function checkIfLoggedIn() {
  const apiUrl = baseURL + "/auth/session";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to check if user is logged in:", error);
    return false;
  }
}

//Shows the login screen + hides the main content
function showLoginScreen() {
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("toggleButton").style.visibility = "hidden";
  document.getElementById("logoutButton").style.visibility = "hidden";
}

//Shows the main content and hides the login screen
function showMainContent() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainContent").style.display = "flex";
  document.getElementById("toggleButton").style.visibility = "visible";
  document.getElementById("logoutButton").style.visibility = "visible";
}

//Loads in the the PWNed information cards
function displayPwnedInfo() {
  const apiUrl = baseURL + "/pwned/pwnedemail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 404) {
        noBreachedData();
      } else if (!response.ok) {
        throw new Error("Failed to fetch: " + response.statusText);
      } else return response.json();
    })
    .then((data) => {
      data.forEach(renderPwnedCard);
    })
    .catch((error) => console.error("Failed to fetch Pwned data:", error));
}

function noBreachedData() {
  const cardContent = document.getElementById("dataBreachContainer");
  cardContent.style.display = "flex";
  cardContent.style.alignContent = "center";
  cardContent.style.justifyContent = "center";

  const textContainer = document.createElement("section");
  textContainer.classList.add("noDataBreach");

  const displayText = document.createElement("h3");
  displayText.textContent = "No Breached Data!";
  displayText.style.color = "Green";

  textContainer.appendChild(displayText);

  cardContent.appendChild(textContainer);
}

//Render Pwned info card and add it to the parent container
function renderPwnedCard(data) {
  const dataBreachCard = document.createElement("section");
  dataBreachCard.classList.add("dataBreachCard");

  const dataBreachCardText = document.createElement("section");

  const dataClassesArray = Array.isArray(data.DataClasses)
    ? data.DataClasses
    : [data.DataClasses];

  const dataClassesElements = dataClassesArray.map((dataClass) => {
    const dataClassElement = document.createElement("h6");
    dataClassElement.textContent = ` - ${dataClass}`;
    return dataClassElement;
  });

  const logoImage = document.createElement("img");
  logoImage.src = data.LogoPath;
  logoImage.alt = "Company Logo";

  const breachDateHeader = document.createElement("h5");
  breachDateHeader.textContent = "Breach Date:";

  const breachDate = document.createElement("h6");
  breachDate.textContent = data.BreachDate;

  const leakedDataHeader = document.createElement("h5");
  leakedDataHeader.textContent = "What was leaked:";

  dataBreachCardText.appendChild(logoImage);
  dataBreachCardText.appendChild(breachDateHeader);
  dataBreachCardText.appendChild(breachDate);
  dataBreachCardText.appendChild(leakedDataHeader);
  dataClassesElements.forEach((dataClassElement) => {
    dataBreachCardText.appendChild(dataClassElement);
  });

  dataBreachCard.appendChild(dataBreachCardText);

  createFlipCard(dataBreachCard, data.LogoPath, data.Name);
}

//Loads in the the Google data and calls method to render it
function displayGoogleInfo() {
  const apiUrl = baseURL + "/details/gmail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById("googleLoginButtonOnCard").style.display =
          "flex";
        throw new Error("Failed to fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("googleLoginButtonOnCard").style.display = "none";
      renderGoogleInfo(data);
    })
    .catch((error) => console.error("Failed to fetch Google data:", error));
}

function renderGoogleInfo(data) {
  const googleInfoItem = document.createElement("section");
  googleInfoItem.classList.add("infoContent");

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value) {
        const heading = document.createElement("h4");
        const paragraph = document.createElement("p");

        switch (key) {
          case "photos":
            heading.textContent = "Profile Picture:";
            const imageContainer = document.createElement("section");
            imageContainer.classList.add("imageContainer");
            const image = document.createElement("img");
            image.src = value.url;
            image.alt = "Profile Picture";
            imageContainer.appendChild(heading);
            imageContainer.appendChild(image);
            googleInfoItem.appendChild(imageContainer);
            continue;
          case "names":
            heading.textContent = "Name:";
            paragraph.textContent = `${value.givenName} ${value.familyName}`;
            break;
          case "phoneNumbers":
            heading.textContent = "Phone Number:";
            paragraph.textContent = value.value;
            break;
          case "emailAddresses":
            heading.textContent = "Email Address:";
            paragraph.textContent = value.value;
            break;
          case "genders":
            heading.textContent = "Gender:";
            paragraph.textContent = value.formattedValue;
            break;
          case "birthdays":
            heading.textContent = "Birthday:";
            const birthday = value.date;
            const monthWord = monthNames[birthday.month - 1];
            paragraph.textContent = `${birthday.day} ${monthWord}`;
            break;
          case "occupations":
            heading.textContent = "Occupation:";
            paragraph.textContent = value.value;
            break;
          default:
            continue;
        }
        googleInfoItem.appendChild(heading);
        googleInfoItem.appendChild(paragraph);
      }
    }
  }

  document.getElementById("googleInfoContainer").appendChild(googleInfoItem);
}

//Loads in the the Github data and calls method to render it
function displayGitHubInfo() {
  const apiUrl = baseURL + "/details/github";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById("githubLoginButton").style.display = "flex";
        throw new Error("Failed to fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("githubLoginButton").style.display = "none";
      renderGitHubInfo(data);
    })
    .catch((error) => console.error("Failed to fetch Github data:", error));
}

function renderGitHubInfo(data) {
  const githubInfoItem = document.createElement("section");
  githubInfoItem.classList.add("infoContent");

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value) {
        const heading = document.createElement("h4");
        const paragraph = document.createElement("p");

        switch (key) {
          case "avatar_url":
            heading.textContent = "Profile Picture:";
            const imageContainer = document.createElement("section");
            const image = document.createElement("img");
            image.src = value;
            image.alt = "Profile Picture";
            imageContainer.appendChild(heading);
            imageContainer.appendChild(image);
            githubInfoItem.appendChild(imageContainer);
            break;
          case "name":
            heading.textContent = "Name:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "location":
            heading.textContent = "Location:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "email":
            heading.textContent = "Email:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "followers":
            heading.textContent = "Followers:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "following":
            heading.textContent = "Following:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "bio":
            heading.textContent = "Bio:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "twitter_username":
            heading.textContent = "Twitter Username:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
          case "public_repos":
            heading.textContent = "Public Repositories:";
            paragraph.textContent = value;
            githubInfoItem.appendChild(heading);
            githubInfoItem.appendChild(paragraph);
            break;
        }
      }
    }
  }

  document.getElementById("githubInfoContainer").appendChild(githubInfoItem);
}

let toggle = false;

function createFlipCard(cardContentInner, logoURL, companyName) {
  const flipCardSection = document.createElement("section");
  flipCardSection.classList.add("flipCard");

  const flipCardInnerSection = document.createElement("section");
  flipCardInnerSection.classList.add("flipCardInner");

  const flipCardFrontSection = document.createElement("section");
  flipCardFrontSection.classList.add("flipCardFront");

  const dataBreachCardFront = document.createElement("section");

  const companyNameElement = document.createElement("h4");
  companyNameElement.textContent = companyName;

  const logoImage = document.createElement("img");
  logoImage.src = logoURL;
  logoImage.alt = "Company Logo";

  dataBreachCardFront.appendChild(logoImage);
  dataBreachCardFront.appendChild(companyNameElement);

  flipCardFrontSection.appendChild(dataBreachCardFront);

  const flipCardBackSection = document.createElement("section");
  flipCardBackSection.classList.add("flipCardBack");

  flipCardInnerSection.appendChild(flipCardFrontSection);
  flipCardInnerSection.appendChild(flipCardBackSection);

  flipCardBackSection.appendChild(cardContentInner);

  flipCardSection.appendChild(flipCardInnerSection);

  const cardContent = document.getElementById("dataBreachContainer");
  cardContent.appendChild(flipCardSection);
}

function toggleContent() {
  const cardContent = document.getElementById("cardContainerContainer");
  const breachContent = document.getElementById("dataBreachContainer");
  const toggleButton = document.getElementById("toggleButton");

  if (!toggle) {
    cardContent.style.display = "none";
    breachContent.style.display = "flex";
    toggleButton.textContent = "Show your Public Data";
  } else {
    cardContent.style.display = "flex";
    breachContent.style.display = "none";
    toggleButton.textContent = "Show your Breached Data";
  }

  toggle = !toggle;
}
