document.addEventListener('DOMContentLoaded', function () {
    const factorRange = [...Array(27).keys()].map(i => i - 13);
    const factorCheckboxes = document.getElementById('factorCheckboxes');
    const goButton = document.getElementById('goButton');
    const selectAllButton = document.getElementById('selectAllButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const selectRandomButton = document.getElementById('selectRandomButton');
    const questionNumberDiv = document.getElementById('questionNumber');
    const questionTextDiv = document.getElementById('questionText');
    const countdownDiv = document.getElementById('countdown');
    const skipButton = document.getElementById('skipButton');
    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');
    const restartButton = document.getElementById('restartButton');
    let selectedFactors = [];
    let questions = [];
    let currentQuestion = 0;
    let countdownInterval;

    // Create checkboxes for each factor
    factorRange.forEach(factor => {
        let label = document.createElement('label');
        label.innerText = factor;
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = factor;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            selectedFactors = Array.from(document.querySelectorAll('#factorCheckboxes input:checked')).map(cb => parseInt(cb.value));
        });
        label.appendChild(checkbox);
        factorCheckboxes.appendChild(label);
    });

    // Initialize selected factors
    selectedFactors = factorRange;

    // Select All button
    selectAllButton.addEventListener('click', () => {
        factorCheckboxes.querySelectorAll('input').forEach(cb => cb.checked = true);
        selectedFactors = factorRange;
    });

    // Clear All button
    clearAllButton.addEventListener('click', () => {
        factorCheckboxes.querySelectorAll('input').forEach(cb => cb.checked = false);
        selectedFactors = [];
    });

    // Select Random button
    selectRandomButton.addEventListener('click', () => {
        clearAllButton.click();
        const randomCount = Math.floor(Math.random() * 7) + 10; // 10 to 16 factors
        const shuffledFactors = factorRange.sort(() => 0.5 - Math.random());
        shuffledFactors.slice(0, randomCount).forEach(factor => {
            let checkbox = factorCheckboxes.querySelector(`input[value="${factor}"]`);
            if (checkbox) checkbox.checked = true;
        });
        selectedFactors = Array.from(document.querySelectorAll('#factorCheckboxes input:checked')).map(cb => parseInt(cb.value));
    });

    // Start quiz
    goButton.addEventListener('click', () => {
        document.getElementById('settings').style.display = 'none'; // Hide settings
        goButton.disabled = true;
        questions = generateQuestions(selectedFactors, 10);
        currentQuestion = 0;
        displayNextQuestion();
    });

    // Display next question with countdown timer
    function displayNextQuestion() {
        if (currentQuestion < questions.length) {
            const [a, b] = questions[currentQuestion];
            questionNumberDiv.innerText = `Question ${currentQuestion + 1}`;
            questionTextDiv.innerText = `${a} x ${b}`;
            skipButton.style.display = 'block'; // Show skip button
            countdownDiv.style.display = 'block'; // Show countdown
            startCountdown(7);
        } else {
            showResults();
        }
    }

    // Start countdown
    function startCountdown(seconds) {
        let countdown = seconds;
        countdownDiv.innerText = `Next question in: ${countdown} seconds`;
        countdownInterval = setInterval(() => {
            countdown--;
            countdownDiv.innerText = `Next question in: ${countdown} seconds`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                displayNextQuestion();
            }
        }, 1000);
    }

    // Skip countdown
    skipButton.addEventListener('click', () => {
        clearInterval(countdownInterval);
        skipButton.style.display = 'none'; // Hide skip button
        countdownDiv.style.display = 'none'; // Hide countdown
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            displayNextQuestion();
        } else {
            showResults();
        }
    });

    // Show results
    function showResults() {
        questionNumberDiv.innerText = '';
        questionTextDiv.innerText = '';
        countdownDiv.innerText = '';
        skipButton.style.display = 'none'; // Hide skip button
        questions.forEach(([a, b], index) => {
            let row = document.createElement('tr');
            let numberCell = document.createElement('td');
            numberCell.innerText = `Question ${index + 1}`;
            let questionCell = document.createElement('td');
            questionCell.innerText = `${a} x ${b}`;
            let answerCell = document.createElement('td');
            answerCell.innerText = a * b;
            row.appendChild(numberCell);
            row.appendChild(questionCell);
            row.appendChild(answerCell);
            resultBody.appendChild(row);
        });
        resultTable.style.display = 'block';
        restartButton.style.display = 'block';
    }

    // Restart quiz
    restartButton.addEventListener('click', () => {
        resultBody.innerHTML = '';
        resultTable.style.display = 'none';
        restartButton.style.display = 'none';
        document.getElementById('settings').style.display = 'block'; // Show settings again
        goButton.disabled = false;
    });

    // Generate multiplication questions
    function generateQuestions(factors, count) {
        let questions = [];
        for (let i = 0; i < count; i++) {
            let a = factors[Math.floor(Math.random() * factors.length)];
            let b = factors[Math.floor(Math.random() * factors.length)];
            questions.push([a, b]);
        }
        return questions;
    }
});
