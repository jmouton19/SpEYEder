document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("googleLoginButton").addEventListener("click", login);
});

//For testing purposes

function login() {
  console.log("clicked");
  var isLoggedIn = false;
  const backendUrl = "http://localhost:8080/auth/google";
  window.location.href = backendUrl;
  //TODO: Check if user logged in to update the variable
  var isLoggedIn = true;

  if (isLoggedIn) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainContent").style.display = "flex";
  }
}

function fetchProtectedData() {
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

document
  .getElementById("checkPwnedButton")
  .addEventListener("click", fetchProtectedData);

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
