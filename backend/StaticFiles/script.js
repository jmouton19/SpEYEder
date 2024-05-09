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

const testDataGithub = {
  login: "jmouton19",
  id: 122820899,
  node_id: "U_kgDOB1IZIw",
  avatar_url: "https://avatars.githubusercontent.com/u/122820899?v=4",
  type: "User",
  site_admin: false,
  name: "JC Mouton",
  company: null,
  blog: "",
  location: "Cape Town, South Africa",
  email: "jmouton19@gmail.com",
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 6,
  public_gists: 0,
  followers: 1,
  following: 1,
  created_at: "2023-01-16T17:47:09Z",
  updated_at: "2024-05-06T12:28:14Z",
  private_gists: 0,
  total_private_repos: 4,
  owned_private_repos: 4,
  disk_usage: 93366,
  collaborators: 1,
  two_factor_authentication: false,
  plan: {
    name: "pro",
    space: 976562499,
    collaborators: 0,
    private_repos: 9999,
  },
};

const baseURL =
  "http://speyeder-env.eba-nkypmpps.eu-west-1.elasticbeanstalk.com";
document.addEventListener("DOMContentLoaded", async function () {
  //On website load check if the user is logged in to determine what screen to show
  let isUserLoggedIn = await checkIfLoggedIn();
  if (isUserLoggedIn) {
    showMainContent();
    displayGoogleInfo();
    displayGitHubInfo();
    // renderGoogleInfo(testGoogleData);
    // renderGitHubInfo(testDataGithub);
  } else {
    showLoginScreen();
  }

  //Create listeners for all the buttons
  document
    .getElementById("checkPwnedButton")
    .addEventListener("click", displayPwnedInfo);
  document.getElementById("logoutButton").addEventListener("click", logOut);
  document.getElementById("googleLoginButton").addEventListener("click", login);
  document
    .getElementById("githubLoginButton")
    .addEventListener("click", githubLogin);
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
    console.error("Failed to fetch Pwned data:", error);
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
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("header").style.justifyContent = "center";
}

//Shows the main content and hides the login screen
function showMainContent() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainContent").style.display = "flex";
  document.getElementById("logoutButton").style.display = "flex";
}

//Loads in the the PWNed information cards
function displayPwnedInfo() {
  const apiUrl = baseURL + "/pwned/pwnedemail";

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
      document
        .getElementById("dataBreachContainer")
        .classList.add("showScrollbar");
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

  const nameAndLogoContainer = document.createElement("section");
  nameAndLogoContainer.classList.add("nameAndLogoContainer");

  const logoImage = document.createElement("img");
  logoImage.classList.add("dataBreachCardLogo");
  logoImage.src = data.LogoPath;
  logoImage.alt = "Company Logo";
  nameAndLogoContainer.appendChild(logoImage);

  const companyName = document.createElement("h4");
  companyName.textContent = data.Name;
  nameAndLogoContainer.appendChild(companyName);

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
  const apiUrl = baseURL + "/details/gmail";

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
        }
      }
    }
  }

  document.getElementById("githubInfoContainer").appendChild(githubInfoItem);
}
