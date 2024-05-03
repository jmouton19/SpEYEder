document.addEventListener("DOMContentLoaded", function () {});

//For testing purposes

document.getElementById("authButton").addEventListener("click", () => {
  const backendUrl = "http://localhost:8080/auth/google";
  window.location.href = backendUrl;
});

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
