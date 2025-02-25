
if (darkmode){

}
//DARKMODE
function toggleDarkMode() {
  let darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

  if (darkModeEnabled) {
    // Wechsel zu Lightmode
    document.body.style.backgroundColor = "#f0f4f8";
    document.body.style.color = "#333";
    document.querySelectorAll('.content, .popup, header').forEach(element => {
      element.style.backgroundColor = "white";
      element.style.color = "#333";
    });
    document.querySelectorAll('button, header').forEach(button => {
      button.style.backgroundColor = "#4CAF50";
      button.style.color = "white";
    });

    localStorage.setItem('darkMode', 'disabled');
  } else {
    // Wechsel zu Darkmode
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "#f0f4f8";
    document.querySelectorAll('.content, .popup, header').forEach(element => {
      element.style.backgroundColor = "#444";
      element.style.color = "#f0f4f8";
    });
    document.querySelectorAll('button').forEach(button => {
      button.style.backgroundColor = "#555";
      button.style.color = "#f0f4f8";
    });

    localStorage.setItem('darkMode', 'enabled');
  }
}

// Darkmode beim Laden der Seite aktivieren, falls er gespeichert ist
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    toggleDarkMode();
  }
});
//DARKMODE



    let xp = localStorage.getItem('xp') ? parseInt(localStorage.getItem('xp')) :9999;
    document.getElementById('xpDisplay').textContent = xp;
    const germanToSpanishWords = [
      { word: "Hund", translation: "perro" },
      { word: "Katze", translation: "gato" },
      { word: "Haus", translation: "casa" },
      { word: "Auto", translation: "coche" },
      { word: "Stadt", translation: "ciudad" }
    ];

    const spanishToGermanWords = [
      { word: "perro", translation: "Hund" },
      { word: "gato", translation: "Katze" },
      { word: "casa", translation: "Haus" },
      { word: "coche", translation: "Auto" },
      { word: "ciudad", translation: "Stadt" }
    ];

    let currentLevel = 1;
    let currentIndex = 0;
    let attempts = 0;
    let correctAnswers = 0;
    let currentWords = germanToSpanishWords;
    let isGermanToSpanish = true;
    let startTime = Date.now();

    function saveXP() {
      localStorage.setItem('xp', xp);
      document.getElementById('xpDisplay').textContent = xp;
    }

    function skipWord() { 
      if (xp >= 20) {
        xp -= 20;
        saveXP();
        nextWord();
      }
    }

    function testSkip(){
      nextWord();
      saveXP();
      updateProgressBar();
    
      
    }

    function checkAnswer() {
      const userInput = document.getElementById('translationInput').value.trim().toLowerCase();
      const correctAnswer = currentWords[currentIndex].translation;
      const feedbackMessage = document.getElementById('feedbackMessage');

      attempts++;

      if (userInput === correctAnswer) {
        correctAnswers++;
        feedbackMessage.textContent = "Richtig! Gut gemacht.";
        feedbackMessage.classList.remove("incorrect");
        feedbackMessage.classList.add("correct");

        updateProgressBar();
        nextWord();
      } else {
        feedbackMessage.textContent = "Leider falsch. Versuche es noch einmal.";
        feedbackMessage.classList.remove("correct");
        feedbackMessage.classList.add("incorrect");

        const solutionMessage = document.createElement("p");
        solutionMessage.textContent = "Die richtige Antwort ist: " + correctAnswer;
        solutionMessage.style.fontSize = "14px";
        solutionMessage.style.color = "#888";
        feedbackMessage.appendChild(solutionMessage);
      }

      if (correctAnswers === 5) {
        let timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        let errorPercentage = (((attempts - correctAnswers) / attempts) * 100).toFixed(2);
        xp += 10;
        saveXP();
        showPopup(timeTaken, correctAnswers, errorPercentage);

        correctAnswers = 0;
        attempts = 0;
        startTime = Date.now();
        currentLevel++;
        resetProgressBar();
      }
    }

    function nextWord() {
      currentIndex++;
      if (currentIndex >= currentWords.length) {
        currentIndex = 0;
      }
      loadWord();
    }

    function loadWord() {
      const wordElement = document.getElementById('wordToTranslate');
      wordElement.textContent = currentWords[currentIndex].word;
      document.getElementById('translationInput').value = '';
      document.getElementById('feedbackMessage').textContent = '';

      document.getElementById('skipButton').disabled = xp < 50;
    }

    function updateProgressBar() {
      const progressBar = document.getElementById('progressBar');
      const progress = ((currentIndex + 1) / currentWords.length) * 100;
      progressBar.style.width = `${progress}%`;
    }

    function resetProgressBar() {
      const progressBar = document.getElementById('progressBar');
      progressBar.style.width = '0%';
    }

    function showPopup(timeTaken, correctAnswers, errorPercentage) {
      document.getElementById('timeTaken').textContent = timeTaken;
      document.getElementById('correctAnswersCount').textContent = correctAnswers;
      document.getElementById('errorPercentage').textContent = errorPercentage;

      document.getElementById('overlay').style.display = 'block';
      document.getElementById('popup').style.display = 'block';
    }

    function closePopup() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('popup').style.display = 'none';
      loadWord();
    }

    function toggleLanguage() {
      isGermanToSpanish = !isGermanToSpanish;
      currentWords = isGermanToSpanish ? germanToSpanishWords : spanishToGermanWords;

      document.getElementById('languageToggleButton').textContent = isGermanToSpanish ? 'Wechsel zu Spanisch' : 'Wechsel zu Deutsch';

      currentIndex = 0;
      loadWord();
    }


    function darkmode() {
      document.body.style.backgroundColor = "#333";
      document.body.style.color = "#f0f4f8";
      document.querySelectorAll('.content, .popup, header').forEach(element => {
        element.style.backgroundColor = "#444";
        element.style.color = "#f0f4f8";
      });
      document.querySelectorAll('button').forEach(button => {
        button.style.backgroundColor = "#555";
        button.style.color = "#f0f4f8";
      });
    }




    document.getElementById('translationInput').addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        checkAnswer();
      }
    });


    document.getElementById('translationInput').addEventListener('keypress', function (event) {
      if (event.key === 'Space') {
        checkAnswer();
      }
    });

    loadWord();