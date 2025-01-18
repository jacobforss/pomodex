let timer = 0;
let isRunning = false;
let isRestMode = false; // To track if in Rest mode

chrome.storage.local.get(["timer", "isRunning", "isRestMode"], (res) => {
    timer = res.timer || 0;
    isRunning = res.isRunning || false;
    isRestMode = res.isRestMode || false;
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.isRunning) {
        isRunning = changes.isRunning.newValue;
    }
    if (changes.timer) {
        timer = changes.timer.newValue;
    }
    if (changes.isRestMode) {
        isRestMode = changes.isRestMode.newValue;
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer" && isRunning) {
        if (timer > 0) {
            timer--; // Decrement timer
            chrome.storage.local.set({ timer });
        } else {
            // When timer reaches 0
            isRunning = false;
            chrome.storage.local.set({ isRunning });

            if (isRestMode) {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "./img/poke-ball.png",  // Update with your icon
                    title: "Rest Time Over",
                    message: "Your rest period is over! Time to get back to work!",
                });
            } else {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "./img/poke-ball.png",  // Update with your icon
                    title: "Pomodoro Complete",
                    message: "Your Pomodoro session is complete! Time to take a break!",
                });
            }
        }
    }
});

// Create an alarm to trigger the timer every minute
chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60,  // Set alarm to trigger every second
});