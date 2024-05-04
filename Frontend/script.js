document.addEventListener("DOMContentLoaded", async function () {
  if (!checkIfLoggedIn()) {
    console.log("not logged in");
    showLoginScreen;
  } else {
    console.log("logged in");
    showMainContent;
  }

  document
    .getElementById("checkPwnedButton")
    .addEventListener("click", displayPwnedInfo);
  document
    .getElementById("logoutButton")
    .addEventListener("click", showLoginScreen);
  document.getElementById("googleLoginButton").addEventListener("click", login);
});

function login() {
  const backendUrl = "http://localhost:8080/auth/google";
  window.location.href = backendUrl;
}

async function checkIfLoggedIn() {
  const apiUrl = "http://localhost:8080/auth/refresh";

  await fetch(apiUrl, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        return true;
      }
    })
    .catch((error) => console.error(error));

  return false;
}

function showLoginScreen() {
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("logoutButton").style.display = "none";
}

function showMainContent() {
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("logoutButton").style.display = "none";
}

function displayPwnedInfo() {
  const apiUrl = "http://localhost:8080/pwned/pwnedemail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include", //cookies
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
    .catch((error) => console.error("Failed to fetch protected data:", error));
}

function renderPwnedCard(data) {
  const dataBreachCard = document.createElement("section");
  dataBreachCard.classList.add("dataBreachCard");

  const dataBreachCardText = document.createElement("section");
  dataBreachCardText.classList.add("dataBreachCardText");

  const dataClassesArray = Array.isArray(data.DataClasses)
    ? data.DataClasses
    : [data.DataClasses];

  const dataClassesHTML = dataClassesArray
    .map((dataClass) => `<h6> - ${dataClass}</h6>`)
    .join("");

  dataBreachCardText.innerHTML = `
  <div class="nameAndLogoContainer">
    <h4>${data.Name}</h4>
  </div>
  <h5>Breach Date:</h5>
  <h6>${data.BreachDate}</h6>
  <h5>What was leaked:</h5>
  ${dataClassesHTML}
`;

  const logoImage = document.createElement("img");
  logoImage.classList.add("dataBreachCardLogo");
  logoImage.src = data.LogoPath;
  logoImage.alt = "Company Logo";

  const nameAndLogoContainer = dataBreachCardText.querySelector(
    ".nameAndLogoContainer"
  );
  nameAndLogoContainer.appendChild(logoImage);

  dataBreachCard.appendChild(dataBreachCardText);

  document.getElementById("dataBreachContainer").appendChild(dataBreachCard);
}
