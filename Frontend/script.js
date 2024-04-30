document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  const originalTitles = [];
  cards.forEach(function (card) {
    originalTitles.push(card.querySelector("h1").textContent);
  });

  cards.forEach(function (card, index) {
    let isTitle = true;

    card.addEventListener("click", function () {
      if (!isTitle) {
        card.querySelector("h1").textContent = originalTitles[index];
      } else {
        card.querySelector("h1").textContent = "YOUR DATA....";
      }

      isTitle = !isTitle;
      card.classList.toggle("flipped");
    });
  });

  const googleButton = document.getElementById("googleButton");
  googleButton.addEventListener("click", function () {
    window.open("https://google.com");
  });

  const githubButton = document.getElementById("githubButton");
  githubButton.addEventListener("click", function () {
    window.open("https://github.com");
  });
});
