let timerCache = 0;
let isRunningCache = false;

const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resumeTimerBtn = document.getElementById("resume-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const restTimerBtn = document.getElementById("rest-timer");
const timeDisplay = document.getElementById("timer-display");

chrome.storage.local.get(["timer", "isRunning"], (res) => {
    timerCache = res.timer || 0;
    isRunningCache = res.isRunning || false;
    updateTime();
    updateButtonState();
});

// timer btns
startTimerBtn.addEventListener("click", () => {
    isRunningCache = true;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache });
});
pauseTimerBtn.addEventListener("click", () => {
    isRunningCache = false;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache });
});
resumeTimerBtn.addEventListener("click", () => {
    isRunningCache = true;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache });
});
resetTimerBtn.addEventListener("click", () => {
    timerCache = 0;
    isRunningCache = false;
    updateButtonState();
    updateTime();
    chrome.storage.local.set({ timer: timerCache, isRunning: isRunningCache });
});
// end timer btns

function updateTime() {
    const minutes = `${25 - Math.ceil(timerCache / 60)}`.padStart(2, "0");
    const seconds = `${60 - (timerCache % 60 || 60)}`.padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

function updateButtonState() {
    if (timerCache === 0 && !isRunningCache) {
        startTimerBtn.style.display = "inline-block";
        pauseTimerBtn.style.display = "none";
        resumeTimerBtn.style.display = "none";
        resetTimerBtn.style.display = "none";
        restTimerBtn.style.display = "inline-block";
    } else if (isRunningCache) {
        startTimerBtn.style.display = "none";
        pauseTimerBtn.style.display = "inline-block";
        resumeTimerBtn.style.display = "none";
        resetTimerBtn.style.display = "inline-block";
        restTimerBtn.style.display = "none";
    } else {
        startTimerBtn.style.display = "none";
        pauseTimerBtn.style.display = "none";
        resumeTimerBtn.style.display = "inline-block";
        resetTimerBtn.style.display = "inline-block";
        restTimerBtn.style.display = "none";
    }
}

setInterval(() => {
    if (isRunningCache) {
        timerCache++;
        updateTime();
    }
}, 1000);


