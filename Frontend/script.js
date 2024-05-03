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
    .then((data) => console.log("Protected data:", data))
    .catch((error) => console.error("Failed to fetch protected data:", error));
}

document
  .getElementById("checkPwnedButton")
  .addEventListener("click", fetchProtectedData);
