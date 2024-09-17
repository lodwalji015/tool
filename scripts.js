// Function to start the test
function startTest() {
    const name = document.getElementById("name-input").value.trim();
    const testType = document.getElementById("test-select").value;

    if (name && testType) {
        localStorage.setItem("candidateName", name);
        localStorage.setItem("testType", testType);
        window.location.href = "test.html";
    } else {
        alert("Please enter your name and select a test type.");
    }
}

// Function to check if two words are equivalent
function areWordsEquivalent(word1, word2) {
    const acceptableVariations = {
        'honourable': ['hon’ble', 'hon.', 'honourable', 'hon.'],
        // Add more variations as needed
    };

    const normalize = (word) => word.toLowerCase().replace(/[.,'’]/g, ''); // Normalize words

    const normWord1 = normalize(word1);
    const normWord2 = normalize(word2);

    if (normWord1 === normWord2) {
        return true; // Direct match
    }

    for (const key in acceptableVariations) {
        if (acceptableVariations[key].includes(normWord1) &&
            acceptableVariations[key].includes(normWord2)) {
            return true; // Match found in acceptable variations
        }
    }
    
    return false; // No match
}

// Function to analyze mistakes
function analyzeMistakes(dictatedText, typedText, speed) {
    const dictatedWords = dictatedText.split(' ');
    const typedWords = typedText.split(' ');
    let fullMistakes = 0;
    let halfMistakes = 0;

    for (let i = 0; i < dictatedWords.length; i++) {
        const dictatedWord = dictatedWords[i];
        const typedWord = typedWords[i] || '';

        if (!typedWords[i]) {
            fullMistakes++; // Omission
        } else if (!areWordsEquivalent(dictatedWord, typedWord)) {
            if (typedWord.toLowerCase() === dictatedWord.toLowerCase()) {
                halfMistakes++; // Spelling mistake
            } else {
                fullMistakes++; // Substitution
            }
        }
    }

    // Check for left-over words (typed words not in dictated text)
    if (typedWords.length > dictatedWords.length) {
        fullMistakes += (typedWords.length - dictatedWords.length);
    }

    // Calculate percentage of errors
    const masterPassageWordCount = (speed === 80) ? 800 :
                                   (speed === 100) ? 1000 :
                                   (speed === 120 && dictatedWords.length <= 840) ? 840 : 600;

    const totalErrors = fullMistakes + halfMistakes / 2;
    let percentageOfErrors = (totalErrors * 100) / masterPassageWordCount;

    // Round percentage to two decimal places
    percentageOfErrors = Math.round(percentageOfErrors * 100) / 100;

    return {
        fullMistakes,
        halfMistakes,
        percentageOfErrors
    };
}

// Event listener for page load
document.addEventListener("DOMContentLoaded", function() {
    const candidateName = localStorage.getItem("candidateName");
    const testType = localStorage.getItem("testType");
    const candidateInfo = document.getElementById("candidate-info");
    const timerDisplay = document.getElementById("timer");
    const typingArea = document.getElementById("typing-area");
    const submitButton = document.getElementById("submit-button");
    const pauseButton = document.getElementById("pause-button");

    let timer = 0;
    let timerLimit;
    let timerInterval;
    let isPaused = false;

    // Display candidate information
    if (candidateName && testType) {
        candidateInfo.textContent = `Candidate: ${candidateName}, Test Type: ${testType}`;
    } else {
        candidateInfo.textContent = "No candidate information available.";
    }

    // Set timer limit based on test type
    switch (testType) {
        case "Skill Test Group C":
            timerLimit = 40 * 60; // 40 minutes in seconds
            break;
        case "Skill Test Group D":
            timerLimit = 50 * 60; // 50 minutes in seconds
            break;
        case "Skill Test Practice":
            timerLimit = 60 * 60; // 60 minutes in seconds
            break;
        default:
            timerLimit = 40 * 60; // Default to 40 minutes
    }

    function updateTimer() {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        timerDisplay.textContent = `Time: ${minutes}:${seconds}`;
        if (timer >= timerLimit) {
            clearInterval(timerInterval);
            alert("Time is up!");
            submitButton.click(); // Auto-submit when time is up
        }
    }

    function startTimer() {
        if (!timerInterval) { // Ensure timer is started only once
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    timer++;
                    updateTimer();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "Resume" : "Pause";
    }

    pauseButton.addEventListener("click", pauseTimer);

    submitButton.addEventListener("click", function() {
        clearInterval(timerInterval);
        localStorage.setItem("typedText", typingArea.value);
        localStorage.setItem("timeTaken", timer);
        window.location.href = "result.html";
    });

    // Start timer on page load if the typing area is focused
    typingArea.addEventListener("focus", startTimer, { once: true });
});
