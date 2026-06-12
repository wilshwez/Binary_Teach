// ==========================================
// STATE VARIABLES
// ==========================================
let currentDecimal = 172;
let numBits = 8; // Can be 8 or 16 depending on value size
let quizTarget = 43;
let quizScore = 0;
let quizStreak = 0;

// DOM Elements
const decimalInput = document.getElementById('decimal-input');
const convertBtn = document.getElementById('convert-btn');
const bitBoard = document.getElementById('bit-board');
const decimalSumDisp = document.getElementById('decimal-sum');
const binarySumDisp = document.getElementById('binary-sum');
const teacherBubble = document.getElementById('teacher-bubble');
const stepsTimeline = document.getElementById('steps-timeline');

// Quiz Elements
const quizBitBoard = document.getElementById('quiz-bit-board');
const targetNumberDisp = document.getElementById('target-number');
const targetNumberHint = document.getElementById('target-number-hint');
const quizCurrentSumDisp = document.getElementById('quiz-current-sum');
const quizFeedback = document.getElementById('quiz-feedback');
const quizScoreDisp = document.getElementById('quiz-score');
const quizStreakDisp = document.getElementById('quiz-streak');
const quizNextBtn = document.getElementById('quiz-next-btn');

// ==========================================
// EVENT LISTENERS & INITS
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Sandbox
    runSandboxConversion(currentDecimal);
    
    // Initialize Quiz
    generateNewQuizQuestion();
    
    // Event listeners
    convertBtn.addEventListener('click', () => {
        const val = parseInt(decimalInput.value);
        if (isNaN(val) || val < 0 || val > 65535) {
            alert("Please enter a valid decimal number between 0 and 65,535.");
            return;
        }
        currentDecimal = val;
        runSandboxConversion(currentDecimal);
    });

    decimalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
});

// Tab Switcher
function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'learn') {
        document.getElementById('tab-learn').classList.add('active');
        document.getElementById('section-learn').classList.add('active');
        runSandboxConversion(currentDecimal);
    } else {
        document.getElementById('tab-quiz').classList.add('active');
        document.getElementById('section-quiz').classList.add('active');
        generateNewQuizQuestion();
    }
}

// ==========================================
// SANDBOX: DECIMAL TO BINARY CONVERSION LOGIC
// ==========================================
function runSandboxConversion(decimalVal) {
    // Determine how many bits we need
    numBits = decimalVal > 255 ? 16 : 8;
    
    // Generate the powers list
    const powers = [];
    for (let i = numBits - 1; i >= 0; i--) {
        powers.push(Math.pow(2, i));
    }
    
    // Compute binary states and step subtraction steps
    let remaining = decimalVal;
    const bitStates = [];
    const steps = [];
    
    powers.forEach((power, index) => {
        const bitIndex = numBits - 1 - index;
        if (remaining >= power) {
            bitStates.push({ power, bitIndex, state: 1 });
            steps.push({
                power,
                bitIndex,
                fits: true,
                startVal: remaining,
                endVal: remaining - power,
                bitValue: 1,
                explanation: `Fits! Since ${remaining} is greater than or equal to ${power}, we write a 1 in this column and subtract ${power}.`
            });
            remaining -= power;
        } else {
            bitStates.push({ power, bitIndex, state: 0 });
            steps.push({
                power,
                bitIndex,
                fits: false,
                startVal: remaining,
                endVal: remaining,
                bitValue: 0,
                explanation: `Too big! Since ${remaining} is smaller than ${power}, it cannot fit, so we write a 0 in this column.`
            });
        }
    });

    // Update state & displays
    renderBitBoard(bitStates);
    renderTimeline(steps, decimalVal);
    renderTeacherExplanation(decimalVal, steps);
    
    // Update summary values
    decimalSumDisp.textContent = decimalVal;
    
    const binaryStr = bitStates.map(b => b.state).join('');
    binarySumDisp.textContent = binaryStr;
    decimalInput.value = decimalVal;
}

// Render the Interactive Bit Board
function renderBitBoard(bitStates) {
    bitBoard.innerHTML = '';
    bitStates.forEach(bit => {
        const bitCard = document.createElement('div');
        bitCard.className = `bit-card ${bit.state === 1 ? 'active' : ''}`;
        bitCard.dataset.power = bit.power;
        
        bitCard.innerHTML = `
            <div class="bit-power">2<sup>${bit.bitIndex}</sup></div>
            <div class="bit-value">${bit.power}</div>
            <div class="bit-state">${bit.state}</div>
        `;
        
        // Let the user toggle the bit
        bitCard.addEventListener('click', () => {
            toggleSandboxBit(bit.power);
        });
        
        bitBoard.appendChild(bitCard);
    });
}

// User clicked a bit card in the Sandbox: recalculate the decimal sum
function toggleSandboxBit(clickedPower) {
    let sum = 0;
    const cards = bitBoard.querySelectorAll('.bit-card');
    cards.forEach(card => {
        const power = parseInt(card.dataset.power);
        let state = card.classList.contains('active') ? 1 : 0;
        
        if (power === clickedPower) {
            state = state === 1 ? 0 : 1;
        }
        
        if (state === 1) {
            sum += power;
        }
    });
    
    currentDecimal = sum;
    runSandboxConversion(currentDecimal);
}

// ==========================================
// EDUCATIVE TEACHER WRITING ENGINE
// ==========================================
function renderTeacherExplanation(number, steps) {
    let text = "";
    
    if (number === 0) {
        text = "Hello! Let's convert **0**. Zero is special because **none** of the powers of 2 can fit into it. Therefore, every single bit from left to right is turned **OFF (0)**. The result is just a series of zeros!";
    } else if (isPowerOfTwo(number)) {
        const powerIndex = Math.log2(number);
        text = `Welcome! Today we are converting **${number}**. This is an exciting one because **${number} is a perfect power of 2 ($2^{${powerIndex}}$)**! This means it will fit exactly into the $2^{${powerIndex}}$ column, leaving us with a remainder of 0. Thus, that column gets a **1** and all smaller columns get **0**!`;
    } else {
        const activePowers = steps.filter(s => s.fits).map(s => s.power);
        const formula = activePowers.join(" + ");
        text = `Hi student! Let's learn how to convert **${number}** to binary. Using the powers of 2 subtraction method, we test each power of 2 starting from the largest one ($2^{${numBits-1}} = ${steps[0].power}$). <br><br>By adding up the columns that fit, we find that **${number} = ${formula}**. Let's review the steps below!`;
    }
    
    // Simple markdown wrapper for bold styling
    teacherBubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function renderTimeline(steps, originalNum) {
    stepsTimeline.innerHTML = '';
    
    steps.forEach((step, index) => {
        const timelineStep = document.createElement('div');
        timelineStep.className = `timeline-step ${step.fits ? 'active-step' : 'inactive-step'}`;
        
        const bitClass = step.bitValue === 1 ? 'text-1' : 'text-0';
        
        timelineStep.innerHTML = `
            <div class="step-marker">${numBits - 1 - index}</div>
            <div class="step-content">
                <div class="step-title">
                    <h4>Power 2<sup>${step.bitIndex}</sup> (${step.power})</h4>
                    <span class="step-bit-result ${bitClass}">Bit: ${step.bitValue}</span>
                </div>
                <div class="step-math">
                    ${step.fits ? 
                        `Remainder: ${step.startVal} - ${step.power} = ${step.endVal}` : 
                        `Remainder: ${step.startVal} < ${step.power} (Doesn't fit)`
                    }
                </div>
                <p class="step-desc">${step.explanation}</p>
            </div>
        `;
        stepsTimeline.appendChild(timelineStep);
    });
}

function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

// ==========================================
// QUIZ SECTION LOGIC (THE TEACHER CHALLENGE)
// ==========================================
function generateNewQuizQuestion() {
    // Pick a random number between 1 and 255 for standard 8-bit practice
    quizTarget = Math.floor(Math.random() * 254) + 1;
    
    targetNumberDisp.textContent = quizTarget;
    targetNumberHint.textContent = quizTarget;
    quizCurrentSumDisp.textContent = "0";
    quizFeedback.textContent = "Select bits below to start building your answer!";
    quizFeedback.className = "quiz-feedback";
    
    // Render quiz bits (8 bits)
    quizBitBoard.innerHTML = '';
    for (let i = 7; i >= 0; i--) {
        const power = Math.pow(2, i);
        const bitCard = document.createElement('div');
        bitCard.className = 'bit-card';
        bitCard.dataset.power = power;
        
        bitCard.innerHTML = `
            <div class="bit-power">2<sup>${i}</sup></div>
            <div class="bit-value">${power}</div>
            <div class="bit-state">0</div>
        `;
        
        bitCard.addEventListener('click', () => {
            bitCard.classList.toggle('active');
            const stateEl = bitCard.querySelector('.bit-state');
            stateEl.textContent = bitCard.classList.contains('active') ? "1" : "0";
            updateQuizSum();
        });
        
        quizBitBoard.appendChild(bitCard);
    }
}

function updateQuizSum() {
    let sum = 0;
    const cards = quizBitBoard.querySelectorAll('.bit-card');
    cards.forEach(card => {
        if (card.classList.contains('active')) {
            sum += parseInt(card.dataset.power);
        }
    });
    
    quizCurrentSumDisp.textContent = sum;
    
    // Interactive teacher assistant helps while they toggle
    if (sum === quizTarget) {
        quizFeedback.textContent = "Excellent! You got the exact number! Click 'Submit Answer' to claim your points! 🎉";
        quizFeedback.className = "quiz-feedback success";
    } else if (sum > quizTarget) {
        quizFeedback.textContent = "Whoops! Your sum is too big. Turn off some of the larger bits! ⚠️";
        quizFeedback.className = "quiz-feedback error";
    } else {
        const diff = quizTarget - sum;
        quizFeedback.textContent = `Keep going! You still need to add ${diff}.`;
        quizFeedback.className = "quiz-feedback";
    }
}

function checkQuizAnswer() {
    let sum = 0;
    const cards = quizBitBoard.querySelectorAll('.bit-card');
    cards.forEach(card => {
        if (card.classList.contains('active')) {
            sum += parseInt(card.dataset.power);
        }
    });
    
    if (sum === quizTarget) {
        quizScore += 10;
        quizStreak += 1;
        quizScoreDisp.textContent = quizScore;
        quizStreakDisp.textContent = quizStreak;
        
        alert(`🎉 Correct! You built ${quizTarget} perfectly! (+10 pts)`);
        generateNewQuizQuestion();
    } else {
        quizStreak = 0;
        quizStreakDisp.textContent = quizStreak;
        alert(`❌ Not quite! The current sum is ${sum}, but the target is ${quizTarget}. Remember: start with the largest power of 2 that fits!`);
    }
}
