let timer = 0;
let isRunning = false;

chrome.storage.local.get(["timer", "isRunning"], (res) => {
    timer = res.timer || 0;
    isRunning = res.isRunning || false;
});

chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer" && isRunning) {
        timer++;
        chrome.storage.local.set({ timer });
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.isRunning) {
        isRunning = changes.isRunning.newValue;
    }
    if (changes.timer) {
        timer = changes.timer.newValue;
    }
});