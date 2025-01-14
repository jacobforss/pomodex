let timer = 0;
let isRunning = false;
const WORK_DURATION = 1 * 5; // 25 minutes in seconds
const REST_DURATION = 1 * 3;  // 5 minutes in seconds

// Initialize timer and running state from storage
chrome.storage.local.get(["timer", "isRunning"], (res) => {
    timer = res.timer || 0;
    isRunning = res.isRunning || false;
});

// Create a periodic alarm to handle timer updates
chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60, // Trigger every second
});

// Listener for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer" && isRunning) {
        timer++;
        chrome.storage.local.set({ timer });

        if (timer >= WORK_DURATION) {
            // Timer completed
            isRunning = false;
            chrome.storage.local.set({ isRunning });
            showNotification();
        }
    }
});

// Show a notification when the timer is complete
function showNotification() {
    chrome.notifications.create("pomodoroNotification", {
        type: "basic",
        iconUrl: "icon.png", // Path to your icon file
        title: "Pomodoro Timer",
        message: "Time's up! What would you like to do?",
        buttons: [
            { title: "Start Timer" },
            { title: "Rest 5 Min" }
        ],
        priority: 2,
    });
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === "pomodoroNotification") {
        if (buttonIndex === 0) {
            // Start a new 25-minute timer
            timer = 0;
            isRunning = true;
            chrome.storage.local.set({ timer, isRunning });
        } else if (buttonIndex === 1) {
            // Start a 5-minute rest timer
            timer = 0;
            isRunning = true;
            chrome.storage.local.set({ timer, isRunning });

            // Set a shorter duration for the rest
            chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 });
            setTimeout(() => {
                isRunning = false;
                chrome.storage.local.set({ isRunning });
                chrome.notifications.create("restCompleteNotification", {
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "Rest Timer",
                    message: "Rest time is over! Ready to start again?",
                    priority: 2,
                });
            }, REST_DURATION * 1000);
        }
    }
});