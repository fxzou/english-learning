const dayNav = document.getElementById("dayNav");
const lessonDay = document.getElementById("lessonDay");
const lessonTitle = document.getElementById("lessonTitle");
const lessonTheme = document.getElementById("lessonTheme");
const lessonDuration = document.getElementById("lessonDuration");
const lessonScore = document.getElementById("lessonScore");
const lessonStatus = document.getElementById("lessonStatus");
const focusText = document.getElementById("focusText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const masteredWords = document.getElementById("masteredWords");
const exerciseProgress = document.getElementById("exerciseProgress");
const availableDays = document.getElementById("availableDays");
const goalPills = document.getElementById("goalPills");
const wordCount = document.getElementById("wordCount");
const sentenceCount = document.getElementById("sentenceCount");
const dialogueCount = document.getElementById("dialogueCount");
const exerciseCount = document.getElementById("exerciseCount");
const vocabIndexSummary = document.getElementById("vocabIndexSummary");
const vocabDuplicateStatus = document.getElementById("vocabDuplicateStatus");
const vocabIndexSearch = document.getElementById("vocabIndexSearch");
const copyVocabIndex = document.getElementById("copyVocabIndex");
const vocabIndexMeta = document.getElementById("vocabIndexMeta");
const vocabIndexList = document.getElementById("vocabIndexList");
const reviewTitle = document.getElementById("reviewTitle");
const reviewList = document.getElementById("reviewList");
const previewScenario = document.getElementById("previewScenario");
const previewList = document.getElementById("previewList");
const vocabGrid = document.getElementById("vocabGrid");
const sentenceGrid = document.getElementById("sentenceGrid");
const analysisGrid = document.getElementById("analysisGrid");
const dialogueList = document.getElementById("dialogueList");
const longDialogueList = document.getElementById("longDialogueList");
const exerciseList = document.getElementById("exerciseList");
const homeworkList = document.getElementById("homeworkList");
const feedback = document.getElementById("feedback");
const markDone = document.getElementById("markDone");
const copyTts = document.getElementById("copyTts");
const speakLesson = document.getElementById("speakLesson");
const defaultVoiceSelect = document.getElementById("defaultVoiceSelect");
const customerVoiceSelect = document.getElementById("customerVoiceSelect");
const salesVoiceSelect = document.getElementById("salesVoiceSelect");
const previewDefaultVoice = document.getElementById("previewDefaultVoice");
const previewCustomerVoice = document.getElementById("previewCustomerVoice");
const previewSalesVoice = document.getElementById("previewSalesVoice");
const speechDock = document.getElementById("speechDock");
const pauseSpeech = document.getElementById("pauseSpeech");
const stopSpeech = document.getElementById("stopSpeech");

const vocabTemplate = document.getElementById("vocabTemplate");
const sentenceTemplate = document.getElementById("sentenceTemplate");
const analysisTemplate = document.getElementById("analysisTemplate");
const dialogueTemplate = document.getElementById("dialogueTemplate");
const exerciseTemplate = document.getElementById("exerciseTemplate");

let currentLesson = null;
let currentDay = 1;
let progress = JSON.parse(localStorage.getItem("salesCoachProgress") || "{}");
const readyDays = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
const ttsEndpoint = "https://tts-voice-magic-2.fxzouv.workers.dev/v1/audio/speech";
const defaultTtsVoice = "en-US-JennyNeural";
const defaultCustomerVoice = "en-CA-LiamNeural";
const defaultSalesVoice = "en-US-JennyNeural";
const audioStartDelayMs = 350;
const defaultVoiceConfig = {
  default: defaultTtsVoice,
  Customer: defaultCustomerVoice,
  Sales: defaultSalesVoice,
};
const voiceConfigVersion = 3;
const savedVoiceConfig = JSON.parse(localStorage.getItem("salesCoachVoiceConfig") || "null");
let voiceConfig = {
  ...defaultVoiceConfig,
  ...(savedVoiceConfig || {}),
};
if (!savedVoiceConfig || savedVoiceConfig.version !== voiceConfigVersion) {
  voiceConfig = { ...defaultVoiceConfig };
  saveVoiceConfig();
}
let activeAudio = null;
let activeAudioUrl = null;
let activeTtsRequest = null;
let activeDialogueSession = null;
let activePlaybackButton = null;
let vocabularyIndex = null;

const englishVoices = [
  { shortName: "en-AU-NatashaNeural", gender: "Female", locale: "en-AU", name: "Natasha" },
  { shortName: "en-AU-WilliamMultilingualNeural", gender: "Male", locale: "en-AU", name: "WilliamMultilingual" },
  { shortName: "en-CA-ClaraNeural", gender: "Female", locale: "en-CA", name: "Clara" },
  { shortName: "en-CA-LiamNeural", gender: "Male", locale: "en-CA", name: "Liam" },
  { shortName: "en-GB-LibbyNeural", gender: "Female", locale: "en-GB", name: "Libby" },
  { shortName: "en-GB-MaisieNeural", gender: "Female", locale: "en-GB", name: "Maisie" },
  { shortName: "en-GB-SoniaNeural", gender: "Female", locale: "en-GB", name: "Sonia" },
  { shortName: "en-GB-RyanNeural", gender: "Male", locale: "en-GB", name: "Ryan" },
  { shortName: "en-GB-ThomasNeural", gender: "Male", locale: "en-GB", name: "Thomas" },
  { shortName: "en-HK-YanNeural", gender: "Female", locale: "en-HK", name: "Yan" },
  { shortName: "en-HK-SamNeural", gender: "Male", locale: "en-HK", name: "Sam" },
  { shortName: "en-IE-EmilyNeural", gender: "Female", locale: "en-IE", name: "Emily" },
  { shortName: "en-IE-ConnorNeural", gender: "Male", locale: "en-IE", name: "Connor" },
  { shortName: "en-IN-NeerjaExpressiveNeural", gender: "Female", locale: "en-IN", name: "Neerja Expressive" },
  { shortName: "en-IN-NeerjaNeural", gender: "Female", locale: "en-IN", name: "Neerja" },
  { shortName: "en-IN-PrabhatNeural", gender: "Male", locale: "en-IN", name: "Prabhat" },
  { shortName: "en-KE-AsiliaNeural", gender: "Female", locale: "en-KE", name: "Asilia" },
  { shortName: "en-KE-ChilembaNeural", gender: "Male", locale: "en-KE", name: "Chilemba" },
  { shortName: "en-NG-EzinneNeural", gender: "Female", locale: "en-NG", name: "Ezinne" },
  { shortName: "en-NG-AbeoNeural", gender: "Male", locale: "en-NG", name: "Abeo" },
  { shortName: "en-NZ-MollyNeural", gender: "Female", locale: "en-NZ", name: "Molly" },
  { shortName: "en-NZ-MitchellNeural", gender: "Male", locale: "en-NZ", name: "Mitchell" },
  { shortName: "en-PH-RosaNeural", gender: "Female", locale: "en-PH", name: "Rosa" },
  { shortName: "en-PH-JamesNeural", gender: "Male", locale: "en-PH", name: "James" },
  { shortName: "en-SG-LunaNeural", gender: "Female", locale: "en-SG", name: "Luna" },
  { shortName: "en-SG-WayneNeural", gender: "Male", locale: "en-SG", name: "Wayne" },
  { shortName: "en-TZ-ImaniNeural", gender: "Female", locale: "en-TZ", name: "Imani" },
  { shortName: "en-TZ-ElimuNeural", gender: "Male", locale: "en-TZ", name: "Elimu" },
  { shortName: "en-US-AnaNeural", gender: "Female", locale: "en-US", name: "Ana" },
  { shortName: "en-US-AriaNeural", gender: "Female", locale: "en-US", name: "Aria" },
  { shortName: "en-US-AvaMultilingualNeural", gender: "Female", locale: "en-US", name: "Ava Multilingual" },
  { shortName: "en-US-AvaNeural", gender: "Female", locale: "en-US", name: "Ava" },
  { shortName: "en-US-EmmaMultilingualNeural", gender: "Female", locale: "en-US", name: "Emma Multilingual" },
  { shortName: "en-US-EmmaNeural", gender: "Female", locale: "en-US", name: "Emma" },
  { shortName: "en-US-JennyNeural", gender: "Female", locale: "en-US", name: "Jenny" },
  { shortName: "en-US-MichelleNeural", gender: "Female", locale: "en-US", name: "Michelle" },
  { shortName: "en-US-AndrewMultilingualNeural", gender: "Male", locale: "en-US", name: "Andrew Multilingual" },
  { shortName: "en-US-AndrewNeural", gender: "Male", locale: "en-US", name: "Andrew" },
  { shortName: "en-US-BrianMultilingualNeural", gender: "Male", locale: "en-US", name: "Brian Multilingual" },
  { shortName: "en-US-BrianNeural", gender: "Male", locale: "en-US", name: "Brian" },
  { shortName: "en-US-ChristopherNeural", gender: "Male", locale: "en-US", name: "Christopher" },
  { shortName: "en-US-EricNeural", gender: "Male", locale: "en-US", name: "Eric" },
  { shortName: "en-US-GuyNeural", gender: "Male", locale: "en-US", name: "Guy" },
  { shortName: "en-US-RogerNeural", gender: "Male", locale: "en-US", name: "Roger" },
  { shortName: "en-US-SteffanNeural", gender: "Male", locale: "en-US", name: "Steffan" },
  { shortName: "en-ZA-LeahNeural", gender: "Female", locale: "en-ZA", name: "Leah" },
  { shortName: "en-ZA-LukeNeural", gender: "Male", locale: "en-ZA", name: "Luke" },
];

const icons = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7z"></path></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h10v12H8z"></path><path d="M6 16H4V4h10v2H6z"></path></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 16.6 4.9 12.3 3.5 13.7 9.2 19.4 20.5 8.1 19.1 6.7z"></path></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20 21 12 3 4v6l11 2-11 2z"></path></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13v2H8zM8 11h13v2H8zM8 16h13v2H8zM3 6h2v2H3zM3 11h2v2H3zM3 16h2v2H3z"></path></svg>',
};

function saveProgress() {
  localStorage.setItem("salesCoachProgress", JSON.stringify(progress));
}

function saveVoiceConfig() {
  localStorage.setItem("salesCoachVoiceConfig", JSON.stringify({
    ...voiceConfig,
    version: voiceConfigVersion,
  }));
}

function setFeedback(text) {
  feedback.textContent = text;
}

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[.?!]+$/g, "")
    .replace(/\s+/g, " ");
}

function setButtonIcon(button, icon, label) {
  button.innerHTML = icons[icon];
  button.setAttribute("aria-label", label);
  button.title = label;
}

function setActivePlaybackButton(button) {
  if (activePlaybackButton) {
    activePlaybackButton.disabled = false;
    activePlaybackButton.setAttribute("aria-busy", "false");
  }
  activePlaybackButton = button || null;
  if (activePlaybackButton) {
    activePlaybackButton.disabled = true;
    activePlaybackButton.setAttribute("aria-busy", "true");
  }
}

function beginPlayback(button) {
  clearActiveAudio({ keepButton: true });
  setActivePlaybackButton(button);
}

function createSpeakButton(label, getText) {
  const button = document.createElement("button");
  button.className = "mini-btn speak-btn icon-btn";
  button.type = "button";
  setButtonIcon(button, "play", label);
  button.addEventListener("click", () => {
    playSpeech(getText(), undefined, button);
  });
  return button;
}

function createDialogueSpeakButton(item) {
  const button = document.createElement("button");
  button.className = "mini-btn speak-btn icon-btn";
  button.type = "button";
  setButtonIcon(button, "play", "朗读对话");
  button.addEventListener("click", () => {
    playDialogueSpeech(item, button);
  });
  return button;
}

function buildVoiceLabel(voice) {
  const gender = voice.gender === "Female" ? "女" : "男";
  return `${voice.locale} · ${voice.name} · ${gender} · ${voice.shortName}`;
}

function fillVoiceSelect(select, value) {
  select.innerHTML = "";
  englishVoices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.shortName;
    option.textContent = buildVoiceLabel(voice);
    select.appendChild(option);
  });
  select.value = value;
}

function setupVoiceConfig() {
  fillVoiceSelect(defaultVoiceSelect, voiceConfig.default || defaultTtsVoice);
  fillVoiceSelect(customerVoiceSelect, voiceConfig.Customer || defaultCustomerVoice);
  fillVoiceSelect(salesVoiceSelect, voiceConfig.Sales || defaultSalesVoice);
  setButtonIcon(previewDefaultVoice, "play", "试听默认音色");
  setButtonIcon(previewCustomerVoice, "play", "试听 Customer 音色");
  setButtonIcon(previewSalesVoice, "play", "试听 Sales 音色");
  defaultVoiceSelect.addEventListener("change", () => {
    voiceConfig.default = defaultVoiceSelect.value;
    saveVoiceConfig();
    setFeedback("已更新默认音色。");
  });
  customerVoiceSelect.addEventListener("change", () => {
    voiceConfig.Customer = customerVoiceSelect.value;
    saveVoiceConfig();
    setFeedback("已更新 Customer 音色。");
  });
  salesVoiceSelect.addEventListener("change", () => {
    voiceConfig.Sales = salesVoiceSelect.value;
    saveVoiceConfig();
    setFeedback("已更新 Sales 音色。");
  });
  previewDefaultVoice.addEventListener("click", () => {
    playSpeech("Voice preview. Could you please confirm the quantity you need?", defaultVoiceSelect.value, previewDefaultVoice);
  });
  previewCustomerVoice.addEventListener("click", () => {
    playSpeech("Customer voice preview. Can you send me the best price today?", customerVoiceSelect.value, previewCustomerVoice);
  });
  previewSalesVoice.addEventListener("click", () => {
    playSpeech("Sales voice preview. Sure, I will check the details and update you today.", salesVoiceSelect.value, previewSalesVoice);
  });
}

function setupStaticIconButtons() {
  setButtonIcon(speakLesson, "play", "朗读本课英文");
  setButtonIcon(pauseSpeech, "pause", "暂停朗读");
  setButtonIcon(stopSpeech, "stop", "停止朗读");
  setButtonIcon(markDone, "check", "标记今日完成");
  setButtonIcon(copyTts, "copy", "复制对话文本");
  setButtonIcon(copyVocabIndex, "copy", "复制单词列表");
}

function clearActiveAudio(options = {}) {
  if (activeDialogueSession) {
    activeDialogueSession.cancelled = true;
    activeDialogueSession.controllers.forEach((controller) => controller.abort());
    activeDialogueSession.urls.forEach((url) => URL.revokeObjectURL(url));
    activeDialogueSession = null;
  }
  if (activeTtsRequest) {
    activeTtsRequest.abort();
    activeTtsRequest = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }
  updateSpeechControls(false);
  if (!options.keepButton) {
    setActivePlaybackButton(null);
  }
}

function updateSpeechControls(isActive, canPause = Boolean(activeAudio)) {
  speechDock.hidden = !isActive;
  pauseSpeech.disabled = !isActive || !canPause;
  stopSpeech.disabled = !isActive;
  if (activeAudio?.paused) {
    setButtonIcon(pauseSpeech, "play", "继续朗读");
  } else {
    setButtonIcon(pauseSpeech, "pause", "暂停朗读");
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForAudioReady(audio) {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => {
      audio.removeEventListener("canplay", done);
      audio.removeEventListener("loadeddata", done);
      resolve();
    };
    audio.addEventListener("canplay", done, { once: true });
    audio.addEventListener("loadeddata", done, { once: true });
    setTimeout(done, 800);
  });
}

async function startAudio(audio, delayMs = 0) {
  await waitForAudioReady(audio);
  if (delayMs > 0) {
    await wait(delayMs);
  }
  await audio.play();
}

function extractEnglish(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.match(/[A-Za-z0-9][A-Za-z0-9 ,.'?!:/()-]*/g)?.join(" ") || "")
    .join("\n")
    .replace(/[.。]+(?=\s|$)/g, "\n")
    .replace(/[?!]+(?=\s|$)/g, "\n")
    .replace(/[:：]+(?=\s|$)/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function requestSpeechBlob(input, voice, signal) {
  const response = await fetch(ttsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      input,
      voice,
      speed: 1.0,
      pitch: "0",
      style: "general",
    }),
  });
  if (!response.ok) {
    throw new Error(`TTS request failed: ${response.status}`);
  }
  return response.blob();
}

async function playSpeech(text, voice = voiceConfig.default || defaultTtsVoice, triggerButton = null) {
  const input = extractEnglish(text);
  if (!input) {
    setFeedback("没有可朗读的英文内容。");
    return;
  }
  beginPlayback(triggerButton);
  setFeedback("正在生成朗读音频...");
  activeTtsRequest = new AbortController();
  updateSpeechControls(true, false);
  try {
    const blob = await requestSpeechBlob(input, voice, activeTtsRequest.signal);
    activeTtsRequest = null;
    activeAudioUrl = URL.createObjectURL(blob);
    activeAudio = new Audio(activeAudioUrl);
    activeAudio.addEventListener("ended", clearActiveAudio, { once: true });
    activeAudio.addEventListener("pause", () => updateSpeechControls(Boolean(activeAudio)));
    activeAudio.addEventListener("play", () => updateSpeechControls(true));
    await startAudio(activeAudio, audioStartDelayMs);
    updateSpeechControls(true);
    setFeedback("正在播放朗读。");
  } catch (error) {
    if (error.name === "AbortError") {
      setFeedback("已停止朗读。");
      return;
    }
    clearActiveAudio();
    setFeedback(`朗读失败：${error.message}`);
  }
}

function getVoiceForSpeaker(speaker) {
  return voiceConfig[speaker] || voiceConfig.default || defaultTtsVoice;
}

async function preloadSpeechItems(session, speechItems, concurrency = 4) {
  let nextIndex = 0;
  async function worker() {
    while (!session.cancelled && nextIndex < speechItems.length) {
      const index = nextIndex;
      nextIndex += 1;
      const speechItem = speechItems[index];
      const input = extractEnglish(speechItem.text);
      if (!input) {
        session.items[index] = { skipped: true };
        continue;
      }
      const controller = new AbortController();
      session.controllers.add(controller);
      try {
        const blob = await requestSpeechBlob(input, speechItem.voice, controller.signal);
        const url = URL.createObjectURL(blob);
        session.urls.add(url);
        session.items[index] = { url };
        setFeedback(`正在生成音频 ${Math.min(session.items.filter(Boolean).length, speechItems.length)} / ${speechItems.length}`);
      } finally {
        session.controllers.delete(controller);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, speechItems.length) }, worker));
}

function waitForDialogueItem(session, index) {
  return new Promise((resolve, reject) => {
    const check = () => {
      if (session.cancelled) {
        reject(new DOMException("Dialogue playback stopped", "AbortError"));
        return;
      }
      const item = session.items[index];
      if (item) {
        resolve(item);
        return;
      }
      setTimeout(check, 80);
    };
    check();
  });
}

async function playSpeechItems(speechItems, labels, triggerButton = null) {
  const playableItems = speechItems.filter((item) => extractEnglish(item.text));
  if (playableItems.length === 0) {
    setFeedback("没有可朗读的内容。");
    return;
  }
  beginPlayback(triggerButton);
  const session = {
    cancelled: false,
    controllers: new Set(),
    urls: new Set(),
    items: Array(playableItems.length),
  };
  activeDialogueSession = session;
  updateSpeechControls(true, false);
  setFeedback(`${labels.generating} 0 / ${playableItems.length}`);
  const preloadPromise = preloadSpeechItems(session, playableItems).catch((error) => {
    if (error.name !== "AbortError") throw error;
  });
  try {
    for (let index = 0; index < playableItems.length; index += 1) {
      const item = await waitForDialogueItem(session, index);
      if (item.skipped) continue;
      activeAudio = new Audio(item.url);
      activeAudio.addEventListener("pause", () => updateSpeechControls(Boolean(activeAudio)));
      activeAudio.addEventListener("play", () => updateSpeechControls(true));
      await startAudio(activeAudio, index === 0 ? audioStartDelayMs : 0);
      updateSpeechControls(true);
      setFeedback(`正在播放 ${playableItems[index].label} ${index + 1} / ${playableItems.length}`);
      await new Promise((resolve, reject) => {
        activeAudio.addEventListener("ended", resolve, { once: true });
        activeAudio.addEventListener("error", reject, { once: true });
      });
      activeAudio = null;
    }
    await preloadPromise;
    if (activeDialogueSession === session) {
      clearActiveAudio();
      setFeedback(labels.complete);
    }
  } catch (error) {
    if (error.name === "AbortError") {
      setFeedback(labels.stopped);
      return;
    }
    clearActiveAudio();
    setFeedback(`${labels.failed}：${error.message}`);
  }
}

function playDialogueSpeech(dialogue, triggerButton = null) {
  const speechItems = (dialogue.lines || []).map((line) => ({
    text: line.text,
    voice: getVoiceForSpeaker(line.speaker),
    label: line.speaker,
  }));
  playSpeechItems(speechItems, {
    generating: "正在生成分角色对话音频",
    complete: "对话朗读完成。",
    stopped: "已停止对话朗读。",
    failed: "对话朗读失败",
  }, triggerButton);
}

function buildDayButtons(activeDay = 1) {
  dayNav.innerHTML = "";
  availableDays.textContent = `${readyDays.size} day ready`;
  for (let day = 1; day <= 30; day += 1) {
    const isReady = readyDays.has(day);
    const button = document.createElement("button");
    button.className = `day-btn ${day === activeDay ? "active" : ""} ${isReady ? "ready" : "locked"}`;
    button.disabled = !isReady;
    button.innerHTML = `
      <span>
        <strong>Day ${String(day).padStart(2, "0")}</strong>
        <small>${day <= 5 ? "基础回复" : day <= 10 ? "产品细节" : day <= 15 ? "报价模具" : day <= 20 ? "生产进度" : day <= 25 ? "物流付款" : "实战复盘"}</small>
      </span>
      <span>${isReady ? "Ready" : "Soon"}</span>
    `;
    if (isReady) {
      button.addEventListener("click", () => loadLesson(day));
    }
    dayNav.appendChild(button);
  }
}

function renderList(el, items) {
  el.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function normalizeSearchText(text) {
  return String(text || "").trim().toLowerCase();
}

function matchesVocabularySearch(day, word, query) {
  if (!query) return true;
  const haystack = normalizeSearchText([
    `day ${String(day.day).padStart(2, "0")}`,
    day.title,
    word.word,
    word.meaning,
  ].join(" "));
  return haystack.includes(query);
}

function renderVocabularyIndex(query = "") {
  if (!vocabularyIndex) return;
  const normalizedQuery = normalizeSearchText(query);
  vocabIndexList.innerHTML = "";
  vocabIndexSummary.textContent = `${vocabularyIndex.lessonCount} days · ${vocabularyIndex.wordCount} words`;
  const duplicateCount = vocabularyIndex.duplicates?.length || 0;
  vocabDuplicateStatus.textContent = duplicateCount > 0
    ? `${duplicateCount} duplicate${duplicateCount > 1 ? "s" : ""} found`
    : "No duplicates";
  vocabDuplicateStatus.className = duplicateCount > 0 ? "duplicate-warning" : "duplicate-ok";

  let visibleWords = 0;
  if (duplicateCount > 0) {
    const duplicateList = vocabularyIndex.duplicates
      .map((item) => `${item.word}: ${item.first.file} / ${item.duplicate.file}`)
      .join(" · ");
    vocabIndexMeta.textContent = duplicateList;
    vocabIndexMeta.className = "vocab-index-meta duplicate-warning";
  } else {
    vocabIndexMeta.textContent = normalizedQuery ? "Filtering learned vocabulary..." : "Copy the plain word list before writing the next day.";
    vocabIndexMeta.className = "vocab-index-meta";
  }

  (vocabularyIndex.days || []).forEach((day) => {
    const words = (vocabularyIndex.words || []).filter((word) => (
      word.day === day.day && matchesVocabularySearch(day, word, normalizedQuery)
    ));
    if (words.length === 0) return;
    visibleWords += words.length;

    const details = document.createElement("details");
    details.className = "vocab-day";
    details.open = Boolean(normalizedQuery) || day.day === currentDay;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span><strong>Day ${String(day.day).padStart(2, "0")}</strong> ${day.title}</span>
      <em>${words.length}</em>
    `;
    details.appendChild(summary);

    const wordList = document.createElement("div");
    wordList.className = "vocab-index-words";
    words.forEach((word) => {
      const item = document.createElement("div");
      item.className = "vocab-index-word";
      item.innerHTML = `
        <strong>${word.word}</strong>
        <span>${word.meaning || ""}</span>
        <small>${word.file}</small>
      `;
      wordList.appendChild(item);
    });
    details.appendChild(wordList);
    vocabIndexList.appendChild(details);
  });

  if (visibleWords === 0) {
    const empty = document.createElement("div");
    empty.className = "vocab-index-empty";
    empty.textContent = "No matching words.";
    vocabIndexList.appendChild(empty);
  } else if (normalizedQuery) {
    vocabIndexMeta.textContent = `Showing ${visibleWords} matching word${visibleWords > 1 ? "s" : ""}.`;
  }
}

async function loadVocabularyIndex() {
  try {
    const response = await fetch("/api/vocabulary");
    if (!response.ok) {
      throw new Error(`Vocabulary index not found: ${response.status}`);
    }
    vocabularyIndex = await response.json();
    renderVocabularyIndex(vocabIndexSearch.value);
  } catch (error) {
    vocabIndexSummary.textContent = "Vocabulary index unavailable";
    vocabDuplicateStatus.textContent = error.message;
    vocabDuplicateStatus.className = "duplicate-warning";
  }
}

function renderVocabulary(items) {
  vocabGrid.innerHTML = "";
  items.forEach((item, index) => {
    const node = vocabTemplate.content.cloneNode(true);
    const card = node.querySelector(".vocab-card");
    node.querySelector(".word").textContent = item.word;
    node.querySelector(".phonetic").textContent = item.phonetic || "";
    node.querySelector(".meaning").textContent = item.meaning;
    node.querySelector(".usage").textContent = item.usage;
    node.querySelector(".example").textContent = item.example;
    node.querySelector(".card-actions").appendChild(createSpeakButton("朗读", () => `${item.word}\n${item.example}`));
    const checkbox = node.querySelector(".vocab-check");
    const key = `day-${currentDay}-vocab-${index}`;
    checkbox.checked = Boolean(progress[key]);
    card.classList.toggle("mastered", checkbox.checked);
    checkbox.addEventListener("change", () => {
      progress[key] = checkbox.checked;
      card.classList.toggle("mastered", checkbox.checked);
      saveProgress();
      updateStatus();
    });
    vocabGrid.appendChild(node);
  });
}

function renderSentences(items) {
  sentenceGrid.innerHTML = "";
  items.forEach((item, index) => {
    const node = sentenceTemplate.content.cloneNode(true);
    node.querySelector(".sentence-label").textContent = item.label;
    node.querySelector(".sentence-basic").textContent = `Basic: ${item.basic}`;
    node.querySelector(".sentence-natural").textContent = `Natural: ${item.natural}`;
    node.querySelector(".sentence-business").textContent = `Business: ${item.business}`;
    node.querySelector(".sentence-actions").appendChild(
      createSpeakButton("朗读", () => [item.basic, item.natural, item.business].join("\n"))
    );
    setButtonIcon(node.querySelector(".copy-btn"), "copy", "复制句子");
    node.querySelector(".copy-btn").addEventListener("click", async () => {
      await navigator.clipboard.writeText([item.basic, item.natural, item.business].join("\n"));
      setFeedback(`已复制句子 ${index + 1}`);
    });
    sentenceGrid.appendChild(node);
  });
}

function renderAnalysis(items) {
  analysisGrid.innerHTML = "";
  items.forEach((item) => {
    const node = analysisTemplate.content.cloneNode(true);
    node.querySelector(".analysis-old strong").textContent = item.old;
    node.querySelector(".analysis-new strong").textContent = item.better;
    node.querySelector(".analysis-note p").textContent = item.problem;
    node.querySelector(".analysis-upgrade p").textContent = item.upgrade || item.better;
    node.querySelector(".analysis-actions").appendChild(
      createSpeakButton("朗读", () => [item.old, item.better, item.upgrade].filter(Boolean).join("\n"))
    );
    analysisGrid.appendChild(node);
  });
}

function renderDialoguesInto(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const node = dialogueTemplate.content.cloneNode(true);
    node.querySelector("h3").textContent = item.title;
    const body = item.lines.map((line) => `${line.speaker}: ${line.text}`).join("\n");
    node.querySelector(".dialogue-body").textContent = body;
    node.querySelector(".dialogue-actions").appendChild(createDialogueSpeakButton(item));
    setButtonIcon(node.querySelector(".copy-dialogue"), "copy", "复制整段");
    node.querySelector(".copy-dialogue").addEventListener("click", async () => {
      await navigator.clipboard.writeText(body);
      setFeedback(`已复制对话：${item.title}`);
    });
    container.appendChild(node);
  });
}

function renderDialogues(items) {
  renderDialoguesInto(dialogueList, items);
}

function renderLongDialogues(items) {
  renderDialoguesInto(longDialogueList, items);
}

function evaluateExercise(exercise, input) {
  const answer = normalize(exercise.answer);
  const user = normalize(input);
  const acceptable = [answer, ...(exercise.acceptable || [])].map(normalize);
  return acceptable.includes(user);
}

function renderExercises(items) {
  exerciseList.innerHTML = "";
  items.forEach((item, index) => {
    const node = exerciseTemplate.content.cloneNode(true);
    node.querySelector(".exercise-type").textContent = item.type;
    node.querySelector(".exercise-prompt").textContent = item.prompt;
    node.querySelector(".exercise-hint").textContent = item.hint || "";
    node.querySelector(".exercise-actions").appendChild(createSpeakButton("朗读", () => `${item.prompt}\n${item.answer}`));
    const input = node.querySelector(".exercise-input");
    const options = node.querySelector(".exercise-options");
    const result = node.querySelector(".exercise-result");
    const submit = node.querySelector(".submit-answer");
    setButtonIcon(submit, "send", "提交答案");
    const key = `day-${currentDay}-exercise-${item.id || index}`;
    if (progress[key]) {
      input.value = progress[key].answer || "";
      result.textContent = progress[key].correct ? "已完成" : "";
      result.className = `exercise-result ${progress[key].correct ? "ok" : ""}`;
    }
    if (Array.isArray(item.options) && item.options.length > 0) {
      item.options.forEach((option) => {
        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.className = "choice-option";
        optionButton.textContent = option;
        optionButton.addEventListener("click", () => {
          input.value = option;
          options.querySelectorAll(".choice-option").forEach((button) => {
            button.classList.toggle("selected", button === optionButton);
          });
        });
        options.appendChild(optionButton);
      });
    } else {
      options.hidden = true;
    }
    submit.addEventListener("click", async () => {
      const value = input.value.trim();
      const correct = evaluateExercise(item, value);
      result.textContent = correct
        ? `正确：${item.answer}`
        : `未通过。参考答案：${item.answer}`;
      result.className = `exercise-result ${correct ? "ok" : "no"}`;
      progress[key] = { answer: value, correct };
      saveProgress();
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: currentDay,
          answers: { [item.id || key]: { answer: value, correct } },
          score: countCorrect(items),
          total: items.length,
        }),
      });
      setFeedback(correct ? "答案已提交，判定正确。" : "答案已提交，可以再练一次。");
      updateStatus();
    });
    exerciseList.appendChild(node);
  });
}

function countCorrect(items) {
  return items.reduce((sum, item, index) => {
    const key = `day-${currentDay}-exercise-${item.id || index}`;
    return sum + (progress[key]?.correct ? 1 : 0);
  }, 0);
}

function countMasteredWords(items) {
  return items.reduce((sum, _item, index) => {
    const key = `day-${currentDay}-vocab-${index}`;
    return sum + (progress[key] ? 1 : 0);
  }, 0);
}

function renderGoalPills(goals) {
  goalPills.innerHTML = "";
  goals.forEach((goal) => {
    const pill = document.createElement("span");
    pill.textContent = goal;
    goalPills.appendChild(pill);
  });
}

function updateStatus() {
  const exercises = currentLesson?.exercises || [];
  const vocab = currentLesson?.vocabulary || [];
  const total = exercises.length;
  const score = countCorrect(exercises);
  const knownWords = countMasteredWords(vocab);
  const totalTasks = total + vocab.length;
  const doneTasks = score + knownWords;
  const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  lessonScore.textContent = `${score} / ${total}`;
  lessonStatus.textContent = score === total && total > 0 ? "Done" : score > 0 ? "In progress" : "Not started";
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  masteredWords.textContent = `${knownWords} / ${vocab.length}`;
  exerciseProgress.textContent = `${score} / ${total}`;
}

function getAllDialogues() {
  return [
    ...(currentLesson?.dialogues || []),
    ...(currentLesson?.longDialogues || []),
  ];
}

function buildTtsText() {
  return getAllDialogues()
    .map((dialogue) => {
      const lines = dialogue.lines.map((line) => `${line.speaker}: ${line.text}`).join("\n");
      return `${dialogue.title}\n${lines}`;
    })
    .join("\n\n");
}

function buildDialogueSpeechText() {
  return getAllDialogues()
    .map((dialogue) => dialogue.lines.map((line) => line.text).join("\n"))
    .join("\n\n");
}

function buildLessonSpeechText() {
  if (!currentLesson) return "";
  const vocabulary = currentLesson.vocabulary
    .map((item) => `${item.word}\n${item.example}`)
    .join("\n");
  const sentences = currentLesson.sentences
    .map((item) => [item.basic, item.natural, item.business].join("\n"))
    .join("\n");
  const shortDialogues = (currentLesson.dialogues || [])
    .map((dialogue) => dialogue.lines.map((line) => line.text).join("\n"))
    .join("\n\n");
  const longDialogues = (currentLesson.longDialogues || [])
    .map((dialogue) => dialogue.lines.map((line) => line.text).join("\n"))
    .join("\n\n");
  return [
    `Vocabulary\n${vocabulary}`,
    `Sentences\n${sentences}`,
    `Short Dialogues\n${shortDialogues}`,
    `Extended Role Play\n${longDialogues}`,
  ]
    .filter((section) => section.trim().split("\n").length > 1)
    .join("\n\n");
}

function getAlternatingSpeaker(index) {
  return index % 2 === 0 ? "Customer" : "Sales";
}

function createLessonHeading(text) {
  return {
    text,
    voice: voiceConfig.default || defaultTtsVoice,
    label: text,
  };
}

function buildLessonSpeechItems() {
  if (!currentLesson) return [];
  const items = [];

  items.push(createLessonHeading("Vocabulary"));
  currentLesson.vocabulary.forEach((item, index) => {
    const speaker = getAlternatingSpeaker(index);
    items.push({
      text: `${item.word}\n${item.example}`,
      voice: getVoiceForSpeaker(speaker),
      label: `Vocabulary ${index + 1}`,
    });
  });

  items.push(createLessonHeading("Sentences"));
  currentLesson.sentences.forEach((item, index) => {
    const speaker = getAlternatingSpeaker(index);
    items.push({
      text: [item.basic, item.natural, item.business].join("\n"),
      voice: getVoiceForSpeaker(speaker),
      label: `Sentence ${index + 1}`,
    });
  });

  items.push(createLessonHeading("Short Dialogues"));
  (currentLesson.dialogues || []).forEach((dialogue, index) => {
    items.push(createLessonHeading(`Dialogue ${index + 1}`));
    dialogue.lines.forEach((line) => {
      items.push({
        text: line.text,
        voice: getVoiceForSpeaker(line.speaker),
        label: line.speaker,
      });
    });
  });

  items.push(createLessonHeading("Extended Role Play"));
  (currentLesson.longDialogues || []).forEach((dialogue, index) => {
    items.push(createLessonHeading(`Extended Dialogue ${index + 1}`));
    dialogue.lines.forEach((line) => {
      items.push({
        text: line.text,
        voice: getVoiceForSpeaker(line.speaker),
        label: line.speaker,
      });
    });
  });

  return items;
}

function playLessonSpeech(triggerButton = null) {
  playSpeechItems(buildLessonSpeechItems(), {
    generating: "正在生成阅读全文音频",
    complete: "阅读全文完成。",
    stopped: "已停止阅读全文。",
    failed: "阅读全文失败",
  }, triggerButton);
}

async function loadLesson(day) {
  currentDay = day;
  buildDayButtons(day);
  const response = await fetch(`/api/lesson?day=${day}`);
  if (!response.ok) {
    setFeedback(`Day ${String(day).padStart(2, "0")} 还没有课程内容。`);
    return;
  }
  const data = await response.json();
  currentLesson = data.lesson;
  progress = { ...progress, ...(data.progress?.answers || {}) };
  lessonDay.textContent = `Day ${String(data.lesson.day).padStart(2, "0")}`;
  lessonTitle.textContent = data.lesson.title;
  lessonTheme.textContent = data.lesson.theme;
  lessonDuration.textContent = `${data.lesson.durationMinutes} min`;
  focusText.textContent = data.lesson.goals.join(" · ");
  renderGoalPills(data.lesson.goals);
  wordCount.textContent = data.lesson.vocabulary.length;
  sentenceCount.textContent = data.lesson.sentences.length;
  dialogueCount.textContent = data.lesson.dialogues.length + (data.lesson.longDialogues || []).length;
  exerciseCount.textContent = data.lesson.exercises.length;
  reviewTitle.textContent = data.lesson.review?.title || "";
  renderList(reviewList, data.lesson.review?.items || []);
  previewScenario.textContent = data.lesson.preview.scenario;
  renderList(previewList, data.lesson.preview.needToKnow);
  renderVocabulary(data.lesson.vocabulary);
  renderSentences(data.lesson.sentences);
  renderAnalysis(data.lesson.chatAnalysis);
  renderDialogues(data.lesson.dialogues);
  renderLongDialogues(data.lesson.longDialogues || []);
  renderExercises(data.lesson.exercises);
  renderList(homeworkList, data.lesson.homework);
  renderVocabularyIndex(vocabIndexSearch.value);
  updateStatus();
  setFeedback(`已加载 Day ${String(day).padStart(2, "0")}。`);
}

markDone.addEventListener("click", async () => {
  const score = countCorrect(currentLesson?.exercises || []);
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ day: currentDay, score, total: currentLesson?.exercises?.length || 0 }),
  });
  setFeedback(`Day ${String(currentDay).padStart(2, "0")} 已标记完成。`);
  lessonStatus.textContent = "Done";
});

copyTts.addEventListener("click", async () => {
  await navigator.clipboard.writeText(buildTtsText());
  setFeedback("已复制 TTS 对话文本。");
});

copyVocabIndex.addEventListener("click", async () => {
  const wordsText = vocabularyIndex?.wordsText
    || (vocabularyIndex?.wordList || vocabularyIndex?.words?.map((item) => item.word) || []).join("\n");
  if (!wordsText) {
    setFeedback("单词列表还没有加载完成。");
    return;
  }
  await navigator.clipboard.writeText(wordsText);
  setFeedback(`已复制 ${vocabularyIndex.wordCount || 0} 个已学单词。`);
});

speakLesson.addEventListener("click", () => {
  playLessonSpeech(speakLesson);
});

pauseSpeech.addEventListener("click", async () => {
  if (!activeAudio) return;
  if (activeAudio.paused) {
    await activeAudio.play();
    setFeedback("继续播放朗读。");
  } else {
    activeAudio.pause();
    setFeedback("已暂停朗读。");
  }
  updateSpeechControls(true);
});

stopSpeech.addEventListener("click", () => {
  clearActiveAudio();
  setFeedback("已停止朗读。");
});

vocabIndexSearch.addEventListener("input", () => {
  renderVocabularyIndex(vocabIndexSearch.value);
});

setupStaticIconButtons();
setupVoiceConfig();
buildDayButtons(1);
loadVocabularyIndex();
loadLesson(1);
