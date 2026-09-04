/* =========================================================
   표정 맞추기 게임 (Emotion Match) — 웹 초안 (MVP, v2)
   PRD.md + 사용자 협의 반영: 카드 그리드 매칭 대신,
   감정 1개씩 카드로 넘기며 이모지→뜻→실사→상황 순으로
   정보가 쌓이는 학습형 플로우로 재구성.
   데이터는 fetch 없이 이 파일에 내장 (file:// 로도 동작).
   ========================================================= */

/* ---------- 1. 데이터: 감정 31개 ---------- */
const EMOTIONS = [
  { id: "감격하다", emoji: "🥹", desc: "너무 좋아서 눈물이 날 것 같은 마음", example: "오래 연습한 걸 성공했을 때" },
  { id: "걱정하다", emoji: "😟", desc: "안 좋은 일이 생길까 봐 불안한 마음", example: "엄마가 늦게 올 때" },
  { id: "괜찮다", emoji: "🙂", desc: "나쁘지 않고 편안한 마음", example: "넘어졌지만 아프지 않을 때" },
  { id: "궁금하다", emoji: "🤔", desc: "알고 싶어서 두근거리는 마음", example: "선물 상자 안이 궁금할 때" },
  { id: "다행스럽다", emoji: "😅", desc: "나쁜 일이 안 생겨서 마음이 놓이는 느낌", example: "잃어버린 물건을 찾았을 때" },
  { id: "두렵다", emoji: "😨", desc: "무서워서 피하고 싶은 마음", example: "높은 곳에 올라갔을 때" },
  { id: "따분하다", emoji: "😐", desc: "재미없고 지루한 마음", example: "똑같은 놀이를 계속할 때" },
  { id: "미안하다", emoji: "😔", desc: "잘못해서 마음이 무거운 느낌", example: "친구를 실수로 밀쳤을 때" },
  { id: "부끄럽다", emoji: "🙈", desc: "얼굴이 빨개지고 숨고 싶은 마음", example: "사람들 앞에서 실수했을 때" },
  { id: "불쌍하다", emoji: "🥺", desc: "안됐고 마음이 아픈 느낌", example: "다친 강아지를 봤을 때" },
  { id: "뿌듯하다", emoji: "😊", desc: "내가 해냈다는 게 자랑스러운 마음", example: "혼자 신발끈을 처음 묶었을 때" },
  { id: "서럽다", emoji: "😢", desc: "억울하고 슬퍼서 눈물이 나는 마음", example: "나만 빼고 놀러 갔을 때" },
  { id: "안타깝다", emoji: "😥", desc: "마음이 아프고 아쉬운 느낌", example: "친구가 넘어지는 걸 봤을 때" },
  { id: "유쾌하다", emoji: "😄", desc: "기분 좋고 즐거운 마음", example: "친구들과 신나게 웃을 때" },
  { id: "창피하다", emoji: "😳", desc: "남들 앞에서 부끄러운 마음", example: "옷에 음식을 흘렸을 때" },
  { id: "초조하다", emoji: "😬", desc: "조마조마하고 불안한 마음", example: "시험 결과를 기다릴 때" },
  { id: "편안하다", emoji: "😌", desc: "마음이 느긋하고 좋은 상태", example: "포근한 이불 속에 있을 때" },
  { id: "놀라다", emoji: "😲", desc: "\"어?!\" 하고 깜짝하는 마음", example: "갑자기 큰 소리가 났을 때" },
  { id: "무섭다", emoji: "😱", desc: "심장이 콩닥콩닥 떨리는 마음", example: "어두운 방에 혼자 있을 때" },
  { id: "억울하다", emoji: "😤", desc: "내 잘못이 아닌데 혼났을 때 드는 마음", example: "친구가 잘못했는데 나만 혼났을 때" },
  { id: "짜증나다", emoji: "😠", desc: "자꾸 신경 쓰이고 귀찮은 마음", example: "하던 놀이를 자꾸 방해받을 때" },
  { id: "실망하다", emoji: "🙁", desc: "기대한 것과 달라서 속상한 마음", example: "놀이공원이 문을 닫았을 때" },
  { id: "좋아하다", emoji: "😍", desc: "마음이 끌리고 기분 좋은 느낌", example: "좋아하는 친구를 만났을 때" },
  { id: "부럽다", emoji: "😏", desc: "남이 가진 걸 나도 갖고 싶은 마음", example: "친구의 새 장난감을 봤을 때" },
  { id: "피곤하다", emoji: "😴", desc: "힘이 다 빠진 느낌", example: "하루 종일 뛰어놀았을 때" },
  { id: "자랑스럽다", emoji: "😎", desc: "내가 잘했다고 뽐내고 싶은 마음", example: "그림이 상을 받았을 때" },
  { id: "밉다", emoji: "😒", desc: "싫고 화가 나는 마음", example: "동생이 내 물건을 망가뜨렸을 때" },
  { id: "설레다", emoji: "🤩", desc: "기대돼서 두근거리는 마음", example: "소풍 가기 전날 밤" },
  { id: "속상하다", emoji: "😣", desc: "마음이 아프고 서운한 느낌", example: "아끼던 색연필을 잃어버렸을 때" },
  { id: "심심하다", emoji: "🥱", desc: "할 게 없어서 지루한 마음", example: "혼자 집에 있을 때" },
  { id: "서운하다", emoji: "😞", desc: "섭섭하고 속상한 마음", example: "친구가 나만 안 끼워줄 때" },
];

// 실사 이미지가 아직 없는 감정 (assets/images/photos/ 에 파일 미존재)
const MISSING_PHOTOS = new Set(["안타깝다", "피곤하다", "자랑스럽다"]);
EMOTIONS.forEach(e => {
  e.photo = MISSING_PHOTOS.has(e.id) ? null : `assets/images/photos/${e.id}.jpg`;
});
const EMOTION_MAP = Object.fromEntries(EMOTIONS.map(e => [e.id, e]));
const ALL_EMOTION_IDS = EMOTIONS.map(e => e.id);

/* ---------- 2. 상황 카드 데이터 (우선순위 8개 감정, PRD 4.3 / 6장) ---------- */
const SITUATIONS = [
  {
    id: "toy-turn",
    desc: "친구랑 장난감 하나를 같이 쓰고 싶은데, 순서를 못 정했어요.",
    a: { emotionId: "짜증나다", line: "내가 먼저 가지고 놀고 있었는데!" },
    b: { emotionId: "서운하다", line: "친구가 안 빌려줘서 속상해요." },
  },
  {
    id: "surprise-party",
    desc: "갑자기 불이 켜지더니 친구들이 짠! 하고 나타났어요.",
    a: { emotionId: "놀라다", line: "심장이 쿵! 깜짝 놀랐어요." },
    b: { emotionId: "감격하다", line: "친구들이 이렇게 준비해준 게 고마워서 눈물이 날 것 같아요." },
  },
  {
    id: "stage-mistake",
    desc: "발표 시간에 목소리가 떨리고 순서를 깜빡했어요.",
    a: { emotionId: "부끄럽다", line: "내 목소리가 떨려서 숨고 싶어요." },
    b: { emotionId: "창피하다", line: "친구들이 웃는 것 같아서 얼굴이 빨개져요." },
  },
  {
    id: "rainy-day",
    desc: "비가 와서 놀이터에 못 나가고 집에만 있어요.",
    a: { emotionId: "심심하다", line: "할 게 없어서 지루해요." },
    b: { emotionId: "궁금하다", line: "비 오는 날 밖은 어떤 모습일지 궁금해요." },
  },
];

// emotionId -> situationId 역인덱스 (해당 감정 카드에서 상황 단계 노출 여부 판단용)
const EMOTION_TO_SITUATION = {};
SITUATIONS.forEach(s => {
  EMOTION_TO_SITUATION[s.a.emotionId] = s.id;
  EMOTION_TO_SITUATION[s.b.emotionId] = s.id;
});

/* ---------- 3. 로컬 저장소 (오답노트) ---------- */
const STORAGE_KEY = "emotionMatch_wrongSet_v2";

function getWrongSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}
function addWrong(emotionId) {
  const set = getWrongSet();
  set.add(emotionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}
function resetAllRecords() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ---------- 4. 사운드 (합성음 — 실제 mp3 파일 없이도 동작) ---------- */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", volume = 0.18, delay = 0) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain).connect(ctx.destination);
  const startAt = ctx.currentTime + delay;
  osc.start(startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration / 1000);
  osc.stop(startAt + duration / 1000 + 0.02);
}

function playFlip() { playTone(700, 90, "triangle", 0.12); }
function playCorrect() {
  playTone(880, 120, "sine", 0.18, 0);
  playTone(1180, 160, "sine", 0.18, 0.09);
}
function playWrong() { playTone(220, 180, "sine", 0.12); }
function playCelebration() {
  // 짧은 팡파레 + 폭죽 느낌의 노이즈 버스트
  const notes = [523, 659, 784, 1046, 1318];
  notes.forEach((f, i) => playTone(f, 180, "triangle", 0.16, i * 0.09));
  const ctx = getAudioCtx();
  if (!ctx) return;
  for (let i = 0; i < 3; i++) {
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.2;
    noise.connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime + 0.35 + i * 0.28);
  }
}

/* ---------- 5. 유틸 ---------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sampleN(arr, n) { return shuffle(arr).slice(0, n); }

function launchConfetti() {
  const layer = document.getElementById("confetti-layer");
  const colors = ["#ff8c42", "#4fb3ff", "#3ecf6b", "#ffe066", "#ff6b9d"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
    piece.style.animationDelay = Math.random() * 0.4 + "s";
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

function shakeEl(el) {
  if (!el) return;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 400);
}

/* ---------- 6. 게임 상태 ----------
   카드(감정)는 한 번에 하나씩만 보여주고, 누를 때마다 정보가 쌓인다.
   모드 A 순서: 이모지 → 뜻카드 → 실사 표정 → (있으면) 상황카드
   모드 B 순서: 실사 표정 → 뜻카드 → 이모지 → (있으면) 상황카드
   1단계에서만 선택지 퀴즈로 정답 판정, 이후 단계는 눌러서 정보 확장.
------------------------------------ */
const ROUND_SIZE = 8;
const QUIZ_CHOICE_COUNT = 4;

const LAYER_ORDER = {
  A: ["emoji", "word", "photo"],
  B: ["photo", "word", "emoji"],
};

const state = {
  mode: "A",
  roundEmotions: [],
  currentIndex: 0,
  stage: 1,             // 1~3: 정보 누적 단계 / 4: 상황(+표정 따라하기) 단계
  situationSub: null,   // stage 4일 때: 'scene' | 'closing'
  quizChoices: [],
};

function currentEmotion() {
  return EMOTION_MAP[state.roundEmotions[state.currentIndex]];
}
function hasSituation(emotionId) {
  return !!EMOTION_TO_SITUATION[emotionId];
}
function maxStageFor(emotionId) {
  return hasSituation(emotionId) ? 4 : 3;
}

function buildQuizChoices(correctId) {
  const distractors = sampleN(ALL_EMOTION_IDS.filter(id => id !== correctId), QUIZ_CHOICE_COUNT - 1);
  return shuffle([correctId, ...distractors]);
}

function startRound(mode, presetEmotions) {
  state.mode = mode;
  state.roundEmotions = presetEmotions && presetEmotions.length
    ? presetEmotions
    : sampleN(ALL_EMOTION_IDS, ROUND_SIZE);
  enterCard(0);
}

function enterCard(index) {
  state.currentIndex = index;
  state.stage = 1;
  state.situationSub = null;
  if (index < state.roundEmotions.length) {
    state.quizChoices = buildQuizChoices(state.roundEmotions[index]);
  }
  renderGame();
}

function goToNextCard() {
  enterCard(state.currentIndex + 1);
}

function advanceStage() {
  const emotion = currentEmotion();
  const max = maxStageFor(emotion.id);
  playFlip();
  if (state.stage < max) {
    state.stage += 1;
    if (state.stage === 4) state.situationSub = "scene";
    renderGame();
  } else {
    goToNextCard();
  }
}

function goToClosing() {
  state.situationSub = "closing";
  renderGame();
}

/* ---------- 7. 뷰 렌더링 ---------- */
const app = document.getElementById("app");

function renderHome() {
  app.innerHTML = `
    <section class="home-hero">
      <h2>오늘은 어떤 표정을 만나볼까요?</h2>
      <p>표정과 감정 단어를 하나씩 살펴보며 마음을 알아가요.</p>
    </section>
    <div class="mode-grid">
      <div class="mode-card">
        <span class="mode-emoji">😊<span class="plain-arrow">→</span>🔤</span>
        <h3>모드 A</h3>
        <p>이모지 표정부터 차례대로 살펴보며 감정을 배워요.</p>
        <button class="btn btn-primary" id="start-mode-a">모드 A 시작</button>
      </div>
      <div class="mode-card">
        <span class="mode-emoji">🔤<span class="plain-arrow">→</span>😊</span>
        <h3>모드 B</h3>
        <p>실사 표정부터 차례대로 살펴보며 감정을 배워요.</p>
        <button class="btn btn-secondary" id="start-mode-b">모드 B 시작</button>
      </div>
    </div>
    <div class="home-links">
      <button class="btn btn-plain" id="start-demo">예시 라운드로 체험하기</button>
      <button class="btn btn-plain" id="goto-dictionary-home">감정도감 보러가기</button>
    </div>
  `;
  document.getElementById("start-mode-a").onclick = () => startRound("A");
  document.getElementById("start-mode-b").onclick = () => startRound("B");
  document.getElementById("start-demo").onclick = () =>
    startRound("A", ["놀라다", "감격하다", "부끄럽다", "심심하다", "짜증나다", "서운하다", "궁금하다", "창피하다"]);
  document.getElementById("goto-dictionary-home").onclick = renderDictionary;
}

/* ----- 레이어(이모지/뜻/실사) HTML ----- */
function photoHTML(emotion, size = 160) {
  const style = `width:${size}px;height:${size}px;`;
  return emotion.photo
    ? `<img class="stage-photo" style="${style}" src="${emotion.photo}" alt="${emotion.id} 표정 사진" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'stage-photo stage-photo-missing',textContent:'사진 준비중'}))">`
    : `<div class="stage-photo stage-photo-missing" style="${style}">사진<br>준비중</div>`;
}

function renderLayer(type, emotion) {
  if (type === "emoji") return `<div class="stage-emoji">${emotion.emoji}</div>`;
  if (type === "photo") return photoHTML(emotion);
  if (type === "word") return `
    <div class="stage-word-box">
      <h3>${emotion.id}</h3>
      <p>${emotion.desc}</p>
    </div>`;
  return "";
}

function quizRowHTML(emotion, mode) {
  const instruction = mode === "A"
    ? "이 표정에 어울리는 감정 단어를 골라보세요"
    : "이 사진과 어울리는 표정을 골라보세요";
  const choicesHTML = state.quizChoices.map(id => {
    const e = EMOTION_MAP[id];
    return mode === "A"
      ? `<button class="choice-btn" data-quiz-id="${id}">${e.id}</button>`
      : `<button class="choice-btn choice-btn-emoji" data-quiz-id="${id}">${e.emoji}</button>`;
  }).join("");
  return `
    <p class="game-instruction">${instruction}</p>
    <div class="choice-row">${choicesHTML}</div>`;
}

function situationHTML(emotion) {
  const situation = SITUATIONS.find(s => s.id === EMOTION_TO_SITUATION[emotion.id]);
  const a = EMOTION_MAP[situation.a.emotionId];
  const b = EMOTION_MAP[situation.b.emotionId];
  const aIsCurrent = situation.a.emotionId === emotion.id;
  return `
    <div class="situation-card">
      <h3>어떤 상황일까요?</h3>
      <p class="situation-desc">${situation.desc}</p>
      <div class="situation-scene">
        <div class="situation-person ${aIsCurrent ? "is-current" : ""}">
          ${aIsCurrent ? '<span class="current-badge">지금 배우는 감정</span>' : ""}
          <div class="card-emoji">${a.emoji}</div>
          <h4>${a.id}</h4>
          <p>"${situation.a.line}"</p>
        </div>
        <div class="situation-person ${!aIsCurrent ? "is-current" : ""}">
          ${!aIsCurrent ? '<span class="current-badge">지금 배우는 감정</span>' : ""}
          <div class="card-emoji">${b.emoji}</div>
          <h4>${b.id}</h4>
          <p>"${situation.b.line}"</p>
        </div>
      </div>
      <p class="situation-note">같은 상황에서도 사람마다 다르게 느낄 수 있어요.</p>
      <button class="btn btn-secondary btn-big" id="btn-goto-closing">다음: 표정 따라하기</button>
    </div>`;
}

function closingHTML(emotion) {
  const situation = SITUATIONS.find(s => s.id === EMOTION_TO_SITUATION[emotion.id]);
  const a = EMOTION_MAP[situation.a.emotionId];
  const b = EMOTION_MAP[situation.b.emotionId];
  return `
    <div class="situation-card closing-card">
      <h3>${a.id}와 ${b.id}의 표정을 따라해 보세요!</h3>
      <div class="situation-scene">
        <div class="situation-person"><div class="card-emoji" style="font-size:4.5rem">${a.emoji}</div><h4>${a.id}</h4></div>
        <div class="situation-person"><div class="card-emoji" style="font-size:4.5rem">${b.emoji}</div><h4>${b.id}</h4></div>
      </div>
      <button class="btn btn-success btn-big" id="btn-done-closing">다 해봤어요!</button>
    </div>`;
}

function renderGame() {
  if (state.currentIndex >= state.roundEmotions.length) {
    renderRoundComplete();
    return;
  }
  const emotion = currentEmotion();
  const { mode, stage } = state;
  const max = maxStageFor(emotion.id);
  const total = state.roundEmotions.length;

  const dotsHTML = state.roundEmotions.map((_, i) =>
    `<span class="progress-dot ${i < state.currentIndex ? "is-done" : ""} ${i === state.currentIndex ? "is-current" : ""}"></span>`
  ).join("");

  let bodyHTML;
  if (stage === 4) {
    bodyHTML = state.situationSub === "closing" ? closingHTML(emotion) : situationHTML(emotion);
  } else {
    const layers = LAYER_ORDER[mode].slice(0, stage);
    const layersHTML = `<div class="stage-card">${layers.map(l => renderLayer(l, emotion)).join("")}</div>`;
    if (stage === 1) {
      bodyHTML = layersHTML + quizRowHTML(emotion, mode);
    } else if (stage === max) {
      bodyHTML = layersHTML + `<button class="btn btn-primary btn-big" id="btn-stage-advance">다음</button>`;
    } else {
      bodyHTML = layersHTML + `<button class="btn btn-secondary btn-big" id="btn-stage-advance">더 알아보기 ▸</button>`;
    }
  }

  app.innerHTML = `
    <div class="game-toolbar">
      <span class="game-progress">카드 ${state.currentIndex + 1} / ${total}</span>
      <div class="progress-dots">${dotsHTML}</div>
      <button class="btn btn-plain" id="btn-new-round">🔄 새 라운드</button>
    </div>
    <div class="single-card-wrap">${bodyHTML}</div>
  `;

  document.getElementById("btn-new-round").onclick = () => startRound(mode);

  const quizBtns = app.querySelectorAll("[data-quiz-id]");
  quizBtns.forEach(btn => {
    btn.onclick = () => handleQuizChoice(btn.dataset.quizId, btn);
  });

  const advanceBtn = document.getElementById("btn-stage-advance");
  if (advanceBtn) advanceBtn.onclick = advanceStage;

  const closingBtn = document.getElementById("btn-goto-closing");
  if (closingBtn) closingBtn.onclick = goToClosing;

  const doneBtn = document.getElementById("btn-done-closing");
  if (doneBtn) doneBtn.onclick = goToNextCard;
}

function handleQuizChoice(chosenId, btnEl) {
  if (state.stage !== 1) return;
  const correctId = state.roundEmotions[state.currentIndex];
  playFlip();
  if (chosenId === correctId) {
    playCorrect();
    state.stage = 2;
    renderGame();
  } else {
    addWrong(correctId);
    playWrong();
    shakeEl(btnEl);
  }
}

function renderRoundComplete() {
  app.innerHTML = `
    <div class="round-complete-banner">
      🎉 라운드 완료! 정말 잘했어요! 🎉
      <div style="margin-top:14px;">
        <button class="btn btn-success btn-big" id="btn-next-round">다음 라운드</button>
      </div>
    </div>
  `;
  document.getElementById("btn-next-round").onclick = () => startRound(state.mode);
  launchConfetti();
  playCelebration();
}

/* ---------- 8. 감정도감 ---------- */
function renderDictionary() {
  const cardsHTML = EMOTIONS.map(e => `
    <div class="dict-card">
      <div class="card-emoji">${e.emoji}</div>
      <h4>${e.id}</h4>
      <p>${e.desc}</p>
      <p class="dict-example">예) ${e.example}</p>
    </div>
  `).join("");
  app.innerHTML = `
    <h2>감정도감 (전체 ${EMOTIONS.length}개)</h2>
    <div class="dictionary-grid">${cardsHTML}</div>
  `;
}

/* ---------- 9. 오답노트 ---------- */
function renderWrongNote() {
  const wrongIds = [...getWrongSet()];
  if (wrongIds.length === 0) {
    app.innerHTML = `<div class="wrongnote-empty">아직 다시 연습할 감정이 없어요.<br>게임을 즐겨보세요! 🙂</div>`;
    return;
  }
  const cardsHTML = wrongIds.map(id => {
    const e = EMOTION_MAP[id];
    return `
      <div class="dict-card">
        <div class="card-emoji">${e.emoji}</div>
        <h4>${e.id}</h4>
        <p>${e.desc}</p>
      </div>`;
  }).join("");
  app.innerHTML = `
    <h2>다시 연습해볼까요?</h2>
    <div class="wrongnote-list">${cardsHTML}</div>
    <div style="text-align:center;margin-top:24px;">
      <button class="btn btn-primary btn-big" id="btn-practice-wrong">이 감정들로 연습하기</button>
    </div>
  `;
  document.getElementById("btn-practice-wrong").onclick = () => {
    const pool = wrongIds.length >= ROUND_SIZE
      ? sampleN(wrongIds, ROUND_SIZE)
      : [...wrongIds, ...sampleN(ALL_EMOTION_IDS.filter(id => !wrongIds.includes(id)), ROUND_SIZE - wrongIds.length)];
    startRound("A", pool);
  };
}

/* ---------- 10. 헤더/설정 이벤트 ---------- */
document.getElementById("btn-home").onclick = renderHome;
document.getElementById("btn-dictionary").onclick = renderDictionary;
document.getElementById("btn-wrongnote").onclick = renderWrongNote;

const settingsModal = document.getElementById("settings-modal");
document.getElementById("btn-settings").onclick = () => { settingsModal.hidden = false; };
document.getElementById("btn-close-settings").onclick = () => {
  settingsModal.hidden = true;
  document.getElementById("reset-confirm-row").hidden = true;
};
document.getElementById("btn-open-reset-confirm").onclick = () => {
  document.getElementById("reset-confirm-row").hidden = false;
};
document.getElementById("btn-reset-no").onclick = () => {
  document.getElementById("reset-confirm-row").hidden = true;
};
document.getElementById("btn-reset-yes").onclick = () => {
  resetAllRecords();
  document.getElementById("reset-confirm-row").hidden = true;
  settingsModal.hidden = true;
  renderHome();
};

/* ---------- 11. 시작 ---------- */
renderHome();
