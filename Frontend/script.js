const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const testGoogleData = {
  names: {
    displayName: "Liam Talberg",
    familyName: "Talberg",
    givenName: "Liam",
    displayNameLastFirst: "Talberg, Liam",
    unstructuredName: "Liam Talberg",
  },
  photos: {
    url: "https://lh3.googleusercontent.com/a/ACg8ocIkhU2g9k1YNo_6kdSQsey4ivGTUnZAKUaiQs_K3QLv4JfUhCU=s100",
  },
  emailAddresses: {
    value: "liamtalberg@gmail.com",
  },
  phoneNumbers: {
    value: "+1234567890",
  },

  genders: {
    value: "male",
    formattedValue: "Male",
  },
  birthdays: {
    date: {
      month: 6,
      day: 3,
    },
  },
  occupations: {
    value: "Dev",
  },
};

document.addEventListener("DOMContentLoaded", async function () {
  //On website load check if the user is logged in to determine what screen to show
  let isUserLoggedIn = await checkIfLoggedIn();
  if (isUserLoggedIn) {
    showMainContent();
    displayGoogleInfo();
    // renderGoogleInfo(testGoogleData);
  } else {
    showLoginScreen();
  }

  //Create listeners for all the buttons
  document
    .getElementById("checkPwnedButton")
    .addEventListener("click", displayPwnedInfo);
  document.getElementById("logoutButton").addEventListener("click", logOut);
  document.getElementById("googleLoginButton").addEventListener("click", login);
});

//Performs the login
function login() {
  //TODO: This route will change
  const backendUrl = "http://localhost:8080/auth/login";
  window.location.href = backendUrl;
}

//Makes API call to logout + show the login screen
async function logOut() {
  const apiUrl = "http://localhost:8080/auth/logout";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      showLoginScreen();
    }
  } catch (error) {
    console.error("Failed to fetch Pwned data:", error);
  }
}

//Calls the refresh endpoint to check if the user is logged in
async function checkIfLoggedIn() {
  //TODO: Need a new endpoint
  const apiUrl = "TODO";

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
  document.getElementById("logoutButton").style.display = "none";
}

//Shows the main content and hides hte login screen
function showMainContent() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainContent").style.display = "flex";
  document.getElementById("logoutButton").style.display = "flex";
}

//Loads in the the PWNed information cards
function displayPwnedInfo() {
  const apiUrl = "http://localhost:8080/pwned/pwnedemail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach(renderPwnedCard);
      document.getElementById("checkPwnedButton").style.display = "none";
    })
    .catch((error) => console.error("Failed to fetch Pwned data:", error));
}

//Render Pwned info card and add it to the parent container
function renderPwnedCard(data) {
  const dataBreachCard = document.createElement("section");
  dataBreachCard.classList.add("dataBreachCard");

  const dataBreachCardText = document.createElement("section");
  dataBreachCardText.classList.add("dataBreachCardText");

  const dataClassesArray = Array.isArray(data.DataClasses)
    ? data.DataClasses
    : [data.DataClasses];

  const dataClassesElements = dataClassesArray.map((dataClass) => {
    const dataClassElement = document.createElement("h6");
    dataClassElement.textContent = ` - ${dataClass}`;
    return dataClassElement;
  });

  const nameAndLogoContainer = document.createElement("div");
  nameAndLogoContainer.classList.add("nameAndLogoContainer");

  const companyName = document.createElement("h4");
  companyName.textContent = data.Name;
  nameAndLogoContainer.appendChild(companyName);

  const logoImage = document.createElement("img");
  logoImage.classList.add("dataBreachCardLogo");
  logoImage.src = data.LogoPath;
  logoImage.alt = "Company Logo";
  nameAndLogoContainer.appendChild(logoImage);

  const breachDateHeader = document.createElement("h5");
  breachDateHeader.textContent = "Breach Date:";

  const breachDate = document.createElement("h6");
  breachDate.textContent = data.BreachDate;

  const leakedDataHeader = document.createElement("h5");
  leakedDataHeader.textContent = "What was leaked:";

  dataBreachCardText.appendChild(nameAndLogoContainer);
  dataBreachCardText.appendChild(breachDateHeader);
  dataBreachCardText.appendChild(breachDate);
  dataBreachCardText.appendChild(leakedDataHeader);
  dataClassesElements.forEach((dataClassElement) => {
    dataBreachCardText.appendChild(dataClassElement);
  });

  dataBreachCard.appendChild(dataBreachCardText);

  document.getElementById("dataBreachContainer").appendChild(dataBreachCard);
}

//Loads in the the Google data and calls method to render it
function displayGoogleInfo() {
  const apiUrl = "http://localhost:8080/details/gmail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      renderGoogleInfo(data);
    })
    .catch((error) => console.error("Failed to fetch Google data:", error));
}

function renderGoogleInfo(data) {
  const googleInfoItem = document.createElement("section");
  googleInfoItem.classList.add("googleInfoContent");

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value) {
        const heading = document.createElement("h4");
        const paragraph = document.createElement("p");

        switch (key) {
          case "photos":
            heading.textContent = "Profile Picture:";
            const imageContainer = document.createElement("div");
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
            heading.textContent = "Occupations:";
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
