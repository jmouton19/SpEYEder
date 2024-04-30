document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  const originalTitles = [];
  cards.forEach(function (card) {
    originalTitles.push(card.querySelector("h1").textContent);
  });

  cards.forEach(function (card, index) {
    let isTitle = true;
    let isRed = true;

    card.addEventListener("click", function () {
      if (!isTitle) {
        card.querySelector("h1").textContent = originalTitles[index];
      } else {
        card.querySelector("h1").textContent = "YOUR DATA....";
      }

      if (isRed) {
        card.style.background = "blue";
      } else {
        card.style.background = "red";
      }

      isTitle = !isTitle;
      isRed = !isRed;
      card.classList.toggle("flipped");
    });
  });
});
