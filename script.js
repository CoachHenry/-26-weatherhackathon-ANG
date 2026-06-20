// 지역별 더미 데이터 (API 연동 시 이 부분만 교체)
const regionData = {
  seoul:  { name: '서울', pm10: 95,  pm25: 28, windDir: '북서풍', windSpeed: 6,  rain: 30 },
  busan:  { name: '부산', pm10: 22,  pm25: 12, windDir: '남동풍', windSpeed: 9,  rain: 70 },
  jeju:   { name: '제주', pm10: 18,  pm25: 8,  windDir: '남풍',   windSpeed: 12, rain: 80 },
  daegu:  { name: '대구', pm10: 110, pm25: 55, windDir: '북동풍', windSpeed: 3,  rain: 10 },
  incheon:{ name: '인천', pm10: 65,  pm25: 30, windDir: '서풍',   windSpeed: 7,  rain: 50 },
};

function getDustGrade(pm10) {
  if (pm10 <= 30)  return { label: '좋음',    cls: 'grade-good' };
  if (pm10 <= 80)  return { label: '보통',    cls: 'grade-normal' };
  if (pm10 <= 150) return { label: '나쁨',    cls: 'grade-bad' };
  return               { label: '매우나쁨', cls: 'grade-very-bad' };
}

function getWindGrade(speed) {
  if (speed <= 3)  return { label: '약한 바람',    cls: 'grade-good' };
  if (speed <= 8)  return { label: '보통 바람',    cls: 'grade-normal' };
  if (speed <= 13) return { label: '강한 바람',    cls: 'grade-bad' };
  return               { label: '매우 강한 바람', cls: 'grade-very-bad' };
}

function getRainGrade(prob) {
  if (prob <= 20) return { label: '낮음',  cls: 'grade-good' };
  if (prob <= 50) return { label: '보통',  cls: 'grade-normal' };
  if (prob <= 70) return { label: '높음',  cls: 'grade-bad' };
  return              { label: '매우높음', cls: 'grade-very-bad' };
}

function updateWeatherSummary(key) {
  const d = regionData[key];

  const dustGrade = getDustGrade(d.pm10);
  document.getElementById('val-pm10').textContent = `${d.pm10} μg/m³`;
  const gradepm10 = document.getElementById('grade-pm10');
  gradepm10.textContent = dustGrade.label;
  gradepm10.className = 'summary-grade ' + dustGrade.cls;

  const windGrade = getWindGrade(d.windSpeed);
  document.getElementById('val-wind').textContent = `${d.windDir} ${d.windSpeed} m/s`;
  const gradeWind = document.getElementById('grade-wind');
  gradeWind.textContent = windGrade.label;
  gradeWind.className = 'summary-grade ' + windGrade.cls;

  const rainGrade = getRainGrade(d.rain);
  document.getElementById('val-rain').textContent = `${d.rain}%`;
  const gradeRain = document.getElementById('grade-rain');
  gradeRain.textContent = rainGrade.label;
  gradeRain.className = 'summary-grade ' + rainGrade.cls;
}

const regionSelect = document.getElementById('region-select');
regionSelect.addEventListener('change', (e) => updateWeatherSummary(e.target.value));
updateWeatherSummary('seoul');

// 퀴즈
const questions = [
  {
    q: "미세먼지 PM10 농도가 95 μg/m³일 때 등급은 무엇인가요?",
    options: ["좋음", "보통", "나쁨", "매우나쁨"],
    answer: 2,
    explain: "PM10 기준으로 81~150 μg/m³는 '나쁨' 등급이에요. 외출 시 마스크를 착용해야 해요!"
  },
  {
    q: "풍속이 '6 m/s'일 때 어떤 현상이 나타날 수 있나요?",
    options: [
      "나뭇잎이 살랑살랑 흔들린다",
      "우산이 뒤집힐 수 있다",
      "나무가 부러질 수 있다",
      "아무 변화 없다"
    ],
    answer: 1,
    explain: "4~8 m/s는 보통 바람으로, 우산이 뒤집힐 수 있어요. 외출 시 주의가 필요해요."
  },
  {
    q: "강수확률 70%의 의미로 가장 올바른 것은?",
    options: [
      "하루의 70% 시간 동안 비가 온다",
      "비가 올 가능성이 70%이다",
      "강수량이 70mm이다",
      "비가 반드시 온다"
    ],
    answer: 1,
    explain: "강수확률은 '비가 올 가능성'을 나타내요. 하루 중 시간이나 강수량과는 관계없어요!"
  },
  {
    q: "다음 예보를 보고 오늘 행동으로 가장 적절한 것을 고르세요.\n\n미세먼지: 좋음 | 강수확률: 80% | 풍속: 10 m/s",
    options: [
      "마스크 없이 자전거를 타러 간다",
      "큰 우산을 챙기고 강한 바람에 주의한다",
      "야외 활동을 마음껏 즐긴다",
      "미세먼지 때문에 외출을 자제한다"
    ],
    answer: 1,
    explain: "미세먼지는 좋음이라 괜찮지만, 강수확률 80%로 비가 거의 확실하고 풍속 10 m/s는 강한 바람이에요. 큰 우산과 함께 바람에 조심해야 해요!"
  },
  {
    q: "'북서풍이 분다'는 예보의 의미는?",
    options: [
      "북서쪽으로 바람이 불어간다",
      "북서쪽에서 바람이 불어온다",
      "북쪽과 서쪽 두 방향에서 바람이 분다",
      "바람이 북서쪽으로 돌아간다"
    ],
    answer: 1,
    explain: "풍향은 바람이 '불어오는 방향'이에요. 북서풍은 북서쪽에서 불어오는 바람이랍니다!"
  }
];

let current = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-btn');
const quizCard = document.getElementById('quiz-card');
const quizResult = document.getElementById('quiz-result');
const scoreText = document.getElementById('score-text');
const scoreMessage = document.getElementById('score-message');
const retryBtn = document.getElementById('retry-btn');
const currentQEl = document.getElementById('current-q');
const totalQEl = document.getElementById('total-q');

totalQEl.textContent = questions.length;

function loadQuestion() {
  answered = false;
  feedbackEl.textContent = '';
  feedbackEl.className = '';
  nextBtn.style.display = 'none';

  const q = questions[current];
  currentQEl.textContent = current + 1;
  questionEl.textContent = q.q;

  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const buttons = optionsEl.querySelectorAll('.option-btn');

  buttons.forEach(btn => btn.disabled = true);

  if (index === q.answer) {
    buttons[index].classList.add('correct');
    feedbackEl.textContent = '✅ 정답! ' + q.explain;
    feedbackEl.className = 'correct';
    score++;
  } else {
    buttons[index].classList.add('wrong');
    buttons[q.answer].classList.add('correct');
    feedbackEl.textContent = '❌ 틀렸어요. ' + q.explain;
    feedbackEl.className = 'wrong';
  }

  nextBtn.style.display = 'block';
  nextBtn.textContent = current < questions.length - 1 ? '다음 문제 →' : '결과 보기';
}

nextBtn.addEventListener('click', () => {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizCard.style.display = 'none';
  quizResult.style.display = 'block';

  scoreText.textContent = `${questions.length}문제 중 ${score}문제 맞혔어요!`;

  if (score === questions.length) {
    scoreMessage.textContent = '🏆 완벽해요! 날씨 예보 마스터!';
  } else if (score >= 3) {
    scoreMessage.textContent = '👍 잘했어요! 조금만 더 공부하면 완벽해질 거예요.';
  } else {
    scoreMessage.textContent = '📖 다시 한번 내용을 읽고 도전해보세요!';
  }
}

retryBtn.addEventListener('click', () => {
  current = 0;
  score = 0;
  quizResult.style.display = 'none';
  quizCard.style.display = 'block';
  loadQuestion();
});

loadQuestion();
