document.addEventListener('DOMContentLoaded', function () {
    const factorRangeNegative = [...Array(14).keys()].map(i => i - 13); // -13 to 0
    const factorRangePositive = [...Array(13).keys()].map(i => i + 1);  // 1 to 13
    const factorCheckboxesNegative = document.getElementById('factorCheckboxesNegative');
    const factorCheckboxesPositive = document.getElementById('factorCheckboxesPositive');
    const goButton = document.getElementById('goButton');
    const selectAllButton = document.getElementById('selectAllButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const selectRandomButton = document.getElementById('selectRandomButton');
    const positivesOnlyButton = document.getElementById('positivesOnlyButton');
    const durationInput = document.getElementById('durationInput');
    const questionNumberDiv = document.getElementById('questionNumber');
    const questionTextDiv = document.getElementById('questionText');
    const countdownDiv = document.getElementById('countdown');
    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');
    const restartButton = document.getElementById('restartButton');
    let selectedFactors = [];
    let questions = [];
    let currentQuestion = 0;
    let countdownInterval;
    let duration = 7; // Default duration in seconds

    // Create checkboxes for negative and zero factors
    factorRangeNegative.forEach(factor => {
        let label = document.createElement('label');
        label.innerText = factor;
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = factor;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            selectedFactors = getSelectedFactors();
        });
        label.appendChild(checkbox);
        factorCheckboxesNegative.appendChild(label);
    });

    // Create checkboxes for positive factors
    factorRangePositive.forEach(factor => {
        let label = document.createElement('label');
        label.innerText = factor;
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = factor;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            selectedFactors = getSelectedFactors();
        });
        label.appendChild(checkbox);
        factorCheckboxesPositive.appendChild(label);
    });

    // Initialize selected factors
    selectedFactors = [...factorRangeNegative, ...factorRangePositive];

    // Select All button
    selectAllButton.addEventListener('click', () => {
        factorCheckboxesNegative.querySelectorAll('input').forEach(cb => cb.checked = true);
        factorCheckboxesPositive.querySelectorAll('input').forEach(cb => cb.checked = true);
        selectedFactors = [...factorRangeNegative, ...factorRangePositive];
    });

    // Clear All button
    clearAllButton.addEventListener('click', () => {
        factorCheckboxesNegative.querySelectorAll('input').forEach(cb => cb.checked = false);
        factorCheckboxesPositive.querySelectorAll('input').forEach(cb => cb.checked = false);
        selectedFactors = [];
    });

    // Select Random button
    selectRandomButton.addEventListener('click', () => {
        clearAllButton.click();
        const randomCount = Math.floor(Math.random() * 7) + 10; // 10 to 16 factors
        const shuffledFactors = [...factorRangeNegative, ...factorRangePositive].sort(() => 0.5 - Math.random());
        shuffledFactors.slice(0, randomCount).forEach(factor => {
            let checkbox = document.querySelector(`input[value="${factor}"]`);
            if (checkbox) checkbox.checked = true;
        });
        selectedFactors = getSelectedFactors();
    });

    // Positives Only button
    positivesOnlyButton.addEventListener('click', () => {
        clearAllButton.click();
        factorCheckboxesPositive.querySelectorAll('input').forEach(cb => cb.checked = true);
        selectedFactors = factorRangePositive;
    });

    // Update duration based on input
    durationInput.addEventListener('input', (e) => {
        duration = parseInt(e.target.value) || 7; // Default to 7 if input is invalid
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
            startCountdown(duration);
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
                currentQuestion++;
                displayNextQuestion();
            }
        }, 1000);
    }

    // Show results
    function showResults() {
        questionNumberDiv.innerText = '';
        questionTextDiv.innerText = '';
        countdownDiv.innerText = '';
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

    // Get selected factors
    function getSelectedFactors() {
        return Array.from(document.querySelectorAll('#factorCheckboxesNegative input:checked, #factorCheckboxesPositive input:checked'))
            .map(cb => parseInt(cb.value));
    }
});
