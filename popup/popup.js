



const startTimerBtn = document.getElementById("start-timer")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Resume Timer";
            resetTimerBtn.style.display = "inline-block";
            restTimerBtn.style.display = "none";
        })
    })
 })


const resetTimerBtn = document.getElementById("reset-timer")
resetTimerBtn.addEventListener("click", () => {
        chrome.storage.local.set({
            timer: 0,
            isRunning: false,
        }, () => {
            startTimerBtn.textContent = "Start Timer";
            resetTimerBtn.style.display = "none";
            restTimerBtn.style.display = "inline-block";
        })
    })


function updateTime() {
    chrome.storage.local.get(["timer"], (res) => {
        const timeDisplay = document.getElementById("timer-display")
        const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let seconds = "00"
        if (res.timer % 60 != 0){
         seconds = `${60 - res.timer % 60}`.padStart(2, "0")
    }
    timeDisplay.textContent = `${minutes}:${seconds}`   })
}

updateTime()
setInterval(updateTime, 1000)



const restTimerBtn = document.getElementById("rest-timer")



