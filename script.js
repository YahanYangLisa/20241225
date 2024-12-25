// 題目和學生資料
const allQuizData = {
    quiz1: {
        multipleChoice: [
            {
                question: "下列為七年二班發生的情形，請問哪個同學遭受性別歧視？",
                options: ["1. 正男為外籍轉學生取「白鬼」的綽號", "2. 小香選擇籃球社鍛鍊球技", "3. 小華嘲笑妮妮是男人婆", "4. 小新逼迫小葵交出新買的機器人"],
                correctAnswer: "3. 小華嘲笑妮妮是男人婆",
                points: 20
            },
            {
                question: "傳統中國社會一般人認為男孩子要剛強勇敢；女孩子要溫柔氣質，這種說法含有何種性別概念？",
                options: ["1. 多元性別", "2. 生理性別", "3. 性別平等", "4. 社會性別"],
                correctAnswer: "4. 社會性別",
                points: 20
            },
            {
                question: "「性別歧視」是因性別偏見而對某性別採取實際的行動，形成不利的差別待遇。下列何種情況不屬於上述情形？",
                options: ["1. 女生不被允許繼承祖產、家業", "2. 升遷時，限制管理職僅限男性擔任", "3. 俗話說：女人頭髮長，見識短", "4. 規定只有女性員工可申請育嬰假"],
                correctAnswer: "3. 俗話說：女人頭髮長，見識短",
                points: 20
            }
        ],
        fillBlank: [
            {
                question: "一句廣告詞如下：「花花洗碗機好用又方便，真是家庭主婦最好的幫手。」根據廣告詞判斷，其顯示出性別__的觀念。",
                correctAnswer: "刻板印象",
                points: 20
            },
            {
                question: "女性如果懷孕，就一定不能專心工作」，這是性別__的觀念。",
                correctAnswer: "偏見",
                points: 20
            }
        ]
    },
    quiz2: {
        multipleChoice: [
            // 第二次測驗的選擇題
        ],
        fillBlank: [
            // 第二次測驗的填空題
        ]
    },
    quiz3: {
        multipleChoice: [
            // 第三次測驗的選擇題
        ],
        fillBlank: [
            // 第三次測驗的填空題
        ]
    }
};

const students = [
    { id: "1", name: "張小明" },
    { id: "2", name: "李小華" },
    { id: "3", name: "王小美" },
    { id: "4", name: "陳小晴" }
];

let currentQuizId = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let currentStudent = '';
let studentScores = JSON.parse(localStorage.getItem('studentScores') || '{}');

// 更新學生選單
function updateStudentSelect() {
    const select = document.getElementById('student-select');
    select.innerHTML = '<option value="">請選擇...</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

// 測驗選擇函數
function selectQuiz(quizNumber) {
    currentQuizId = `quiz${quizNumber}`;
    quizData = allQuizData[currentQuizId];
    
    // 更新頁面標題
    document.title = '極端氣候下的女性求生攻略－第一次隨堂測驗';
    document.querySelector('h1').innerHTML = '<i class="fas fa-graduation-cap"></i> 極端氣候下的女性求生攻略－第一次隨堂測驗';
    
    document.getElementById('quiz-selection').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    
    updateStudentSelect();
}

// 返回測驗選擇
function backToQuizSelection() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-selection').style.display = 'block';
    currentQuizId = null;
    
    // 恢復原始標題
    document.title = '極端氣候下的女性求生攻略－隨堂測驗';
    document.querySelector('h1').innerHTML = '<i class="fas fa-graduation-cap"></i> 極端氣候下的女性求生攻略－隨堂測驗';
}

// 準備題目
function prepareQuestions() {
    shuffledQuestions = [
        ...quizData.multipleChoice.map(q => ({...q, type: 'multipleChoice'})),
        ...quizData.fillBlank.map(q => ({...q, type: 'fillBlank'}))
    ];
    shuffleArray(shuffledQuestions);
}

// 顯示題目
function showQuestion(index) {
    const question = shuffledQuestions[index];
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    if (question.type === 'multipleChoice') {
        questionDiv.innerHTML = `
            <p><i class="fas fa-question-circle"></i> ${question.question}</p>
            <div class="options">
                ${question.options.map(option => `
                    <div>
                        <input type="radio" name="question" value="${option}" id="option-${option}">
                        <label for="option-${option}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        questionDiv.innerHTML = `
            <p><i class="fas fa-pen"></i> ${question.question}</p>
            <input type="text" class="fill-blank-answer" placeholder="請在此輸入答案">
        `;
    }

    quizContainer.appendChild(questionDiv);
    updateProgress();
}

// 更新進度
function updateProgress() {
    const currentQuestion = document.getElementById('current-question');
    const totalQuestions = document.getElementById('total-questions');
    const progressFill = document.getElementById('progress-fill');
    
    currentQuestion.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = shuffledQuestions.length;
    
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// 計算得分
function calculateScore() {
    let totalScore = 0;
    let totalPoints = 0;

    userAnswers.forEach((answer, index) => {
        const question = shuffledQuestions[index];
        totalPoints += question.points;
        if (answer === question.correctAnswer) {
            totalScore += question.points;
        }
    });

    return (totalScore / totalPoints) * 100;
}

// 顯示結果
function showResult(score) {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message');
    const retryBtn = document.getElementById('retry-btn');
    
    // 修改成績儲存方式，加入測驗編號
    const studentId = currentStudent;
    const studentName = students.find(s => s.id === studentId)?.name || '未知';
    if (!studentScores[studentId]) {
        studentScores[studentId] = {};
    }
    if (!studentScores[studentId][currentQuizId]) {
        studentScores[studentId][currentQuizId] = [];
    }
    
    studentScores[studentId][currentQuizId].push({
        score: score,
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('studentScores', JSON.stringify(studentScores));
    
    // 顯示特定測驗的成績歷史
    const scoreHistory = studentScores[studentId][currentQuizId]
        .map((item, index) => `第 ${index + 1} 次：${item.score.toFixed(1)} 分 (${item.date})`)
        .join('<br>');
    
    scoreElement.innerHTML = `
        <div class="current-score">本次得分：${score.toFixed(1)}</div>
        <div class="score-history">
            <h3>${studentName} 的測驗記錄：</h3>
            ${scoreHistory}
        </div>
    `;
    
    if (score === 100) {
        messageElement.textContent = "太棒了！你獲得了滿分！";
        retryBtn.style.display = 'none';
    } else if (score < 60) {
        messageElement.textContent = "加油！再試一次！";
        retryBtn.style.display = 'block';
    } else if (score > 89) {
        messageElement.textContent = "太棒了！繼續保持喔！";
        retryBtn.style.display = 'block';
    } else {
        messageElement.textContent = "沒關係，再試一次吧！";
        retryBtn.style.display = 'block';
    }

    // 準備分析數據
    const analysisData = {
        studentName: studentName,
        score: score,
        questions: shuffledQuestions.map((q, index) => ({
            question: q.question,
            type: q.type,
            options: q.type === 'multipleChoice' ? q.options : [],
            userAnswer: userAnswers[index],
            isCorrect: userAnswers[index] === q.correctAnswer
        }))
    };

    localStorage.setItem('testAnalysis', JSON.stringify(analysisData));
}

// 工具函數：打亂陣列順序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('quiz-selection').style.display = 'block';
    document.getElementById('start-screen').style.display = 'none';
});

document.getElementById('student-select').addEventListener('change', function() {
    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = !this.value;
    currentStudent = this.value;
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!currentStudent) {
        alert('請選擇學生姓名！');
        return;
    }
    
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    currentQuestionIndex = 0;
    userAnswers = [];
    prepareQuestions();
    showQuestion(currentQuestionIndex);
});

document.getElementById('next-btn').addEventListener('click', () => {
    const answer = getAnswer();
    if (!answer) {
        alert('請選擇或填寫答案！');
        return;
    }

    userAnswers.push(answer);
    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(currentQuestionIndex);
        if (currentQuestionIndex === shuffledQuestions.length - 1) {
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('submit-btn').style.display = 'block';
        }
    }
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const answer = getAnswer();
    if (!answer) {
        alert('請選擇或填寫答案！');
        return;
    }

    userAnswers.push(answer);
    const score = calculateScore();
    showResult(score);
});

document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    currentQuestionIndex = 0;
    userAnswers = [];
    prepareQuestions();
    showQuestion(currentQuestionIndex);
    document.getElementById('next-btn').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'none';
});

// 獲取答案
function getAnswer() {
    const question = shuffledQuestions[currentQuestionIndex];
    if (question.type === 'multipleChoice') {
        const selected = document.querySelector('input[name="question"]:checked');
        return selected ? selected.value : null;
    } else {
        const input = document.querySelector('.fill-blank-answer');
        return input ? input.value.trim() : null;
    }
}

// 加入分析按鈕事件監聽器
document.getElementById('analysis-btn').addEventListener('click', () => {
    window.open('analysis.html', '_blank');
});