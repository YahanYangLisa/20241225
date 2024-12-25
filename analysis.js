document.addEventListener('DOMContentLoaded', function() {
    // 從 localStorage 獲取測驗結果數據
    const analysisData = JSON.parse(localStorage.getItem('testAnalysis'));
    
    if (!analysisData) {
        document.body.innerHTML = '<h1>無法載入分析數據</h1>';
        return;
    }

    // 更新學生資訊和得分
    document.getElementById('student-name').textContent = analysisData.studentName;
    document.getElementById('final-score').textContent = analysisData.score.toFixed(1);

    // 生成分析內容
    const container = document.getElementById('analysis-container');
    analysisData.questions.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `analysis-item ${item.isCorrect ? '' : 'incorrect'}`;

        let questionContent = `
            <div class="question">
                <strong>題目 ${index + 1}:</strong> ${item.question}
            </div>
        `;

        if (item.type === 'multipleChoice') {
            questionContent += `
                <div class="options">
                    選項：${item.options.join(', ')}
                </div>
            `;
        }

        if (item.isCorrect) {
            questionContent += `
                <div class="answer correct-answer">
                    <i class="fas fa-check"></i> 答案正確：${item.userAnswer}
                </div>
            `;
        } else {
            questionContent += `
                <div class="answer incorrect">
                    <i class="fas fa-times"></i> 您的答案：${item.userAnswer}
                </div>
            `;
        }

        div.innerHTML = questionContent;
        container.appendChild(div);
    });
}); 