let pomodoroTimerCache = 1 * 6; // 25 minutes for Pomodoro
let restTimerCache = 1 * 3;      // 5 minutes for Rest
let timerCache = pomodoroTimerCache; // Default to Pomodoro
let isRunningCache = false;
let isRestMode = false; // To track which mode is active

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
    timerCache = pomodoroTimerCache; // Set timer to 25 minutes
    isRunningCache = true;
    isRestMode = false; // Not in Rest mode
    updateButtonState();
    updateTime();
    chrome.storage.local.set({
        timer: timerCache,
        isRunning: isRunningCache,
    });
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
restTimerBtn.addEventListener("click", () => {
    timerCache = restTimerCache; // Set timer to 5 minutes
    isRunningCache = true;
    isRestMode = true; // Indicate Rest mode
    updateButtonState();
    updateTime();
    chrome.storage.local.set({
        timer: timerCache,
        isRunning: isRunningCache,
    });
});
// end timer btns

function updateTime() {
    const minutes = Math.floor(timerCache / 60).toString().padStart(2, "0");
    const seconds = (timerCache % 60).toString().padStart(2, "0");
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
        if (timerCache > 0) {
            timerCache--;
            updateTime();
        } else {
            isRunningCache = false;
            if (isRestMode) {
                alert("Rest period is over! Time to get back to work!");
            } else {
                alert("Pomodoro session complete! Time for a break!");
            }
            updateButtonState();
            chrome.storage.local.set({ isRunning: isRunningCache });
        }
    }
}, 1000);

