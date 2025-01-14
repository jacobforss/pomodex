let timerCache = 0;
let isRunningCache = false;

const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resumeTimerBtn = document.getElementById("resume-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const restTimerBtn = document.getElementById("rest-timer"); // Button for starting the rest timer
const timeDisplay = document.getElementById("timer-display");

const WORK_DURATION = 1 * 5; // 25 minutes in seconds
const REST_DURATION = 1 * 3;  // 5 minutes in seconds
let isResting = false; // Track whether the timer is in rest mode

// Initialize from storage
chrome.storage.local.get(["timer", "isRunning", "isResting"], (res) => {
    timerCache = res.timer || 0;
    isRunningCache = res.isRunning || false;
    isResting = res.isResting || false;
    updateTime();
    updateButtonState();
});

// Event listener for starting the work timer
startTimerBtn.addEventListener("click", () => {
    isRunningCache = true;
    isResting = false;
    timerCache = 0;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache, isResting, timer: timerCache });
});

// Event listener for pausing the timer
pauseTimerBtn.addEventListener("click", () => {
    isRunningCache = false;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache });
});

// Event listener for resuming the timer
resumeTimerBtn.addEventListener("click", () => {
    isRunningCache = true;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache });
});

// Event listener for resetting the timer
resetTimerBtn.addEventListener("click", () => {
    timerCache = 0;
    isRunningCache = false;
    isResting = false;
    updateButtonState();
    updateTime();
    chrome.storage.local.set({ timer: timerCache, isRunning: isRunningCache, isResting });
});

// Event listener for starting the rest timer
restTimerBtn.addEventListener("click", () => {
    isResting = true;
    isRunningCache = true;
    timerCache = 0;
    updateButtonState();
    chrome.storage.local.set({ isRunning: isRunningCache, isResting, timer: timerCache });
});

// Update the timer display
function updateTime() {
    const duration = isResting ? REST_DURATION : WORK_DURATION;
    const remainingTime = duration - timerCache;
    const minutes = `${Math.floor(remainingTime / 60)}`.padStart(2, "0");
    const seconds = `${remainingTime % 60}`.padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

// Update button states based on the current timer state
function updateButtonState() {
    if (timerCache === 0 && !isRunningCache) {
        // Initial or reset state
        startTimerBtn.style.display = "inline-block";
        pauseTimerBtn.style.display = "none";
        resumeTimerBtn.style.display = "none";
        resetTimerBtn.style.display = "none";
        restTimerBtn.style.display = "inline-block"; // Display rest timer button
    } else if (isRunningCache) {
        // Timer is running
        startTimerBtn.style.display = "none";
        pauseTimerBtn.style.display = "inline-block";
        resumeTimerBtn.style.display = "none";
        resetTimerBtn.style.display = "inline-block";
        restTimerBtn.style.display = isResting ? "none" : "inline-block"; // Hide rest timer button when timer is running
    } else {
        // Timer is paused
        startTimerBtn.style.display = "none";
        pauseTimerBtn.style.display = "none";
        resumeTimerBtn.style.display = "inline-block";
        resetTimerBtn.style.display = "inline-block";
        restTimerBtn.style.display = "inline-block"; // Display rest timer button when timer is paused
    }
}

// Timer interval to increment timer and update display
setInterval(() => {
    if (isRunningCache) {
        const duration = isResting ? REST_DURATION : WORK_DURATION;
        if (timerCache < duration) {
            timerCache++;
            updateTime();
        } else {
            // Timer is complete
            isRunningCache = false;
            chrome.storage.local.set({ isRunning: isRunningCache });
            updateButtonState();

            // If resting is finished, show rest completion notification (optional)
            if (isResting) {
                // Notification for rest timer completion
                chrome.notifications.create("restCompleteNotification", {
                    type: "basic",
                    iconUrl: chrome.runtime.getURL("img/poke-ball.png"), // Replace with your icon path
                    title: "Rest Timer",
                    message: "Rest time is over! Ready to start again?",
                    priority: 2,
                });
            } else {
                // Notification for pomodoro timer completion
                chrome.notifications.create("pomodoroCompleteNotification", {
                    type: "basic",
                    iconUrl: chrome.runtime.getURL("img/poke-ball.png"), // Replace with your icon path
                    title: "Pomodoro Timer",
                    message: "Pomodoro session is over! Time to rest.",
                    priority: 2,
                });
            }
        }
    }
}, 1000);