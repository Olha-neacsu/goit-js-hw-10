import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

startBtn.disabled = true;

let userSelectedDate;

    const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
          iziToast.error({
              title: 'Error',
              message: "Please choose a date in the future",
              position: 'topRight',
          });
          startBtn.disabled = true;
      } else {
          userSelectedDate = selectedDate;
          startBtn.disabled = false;
      }
      
  },
};

const fp = flatpickr(dateTimePicker, options);

flatpickr(dateTimePicker, options);

let timerId;

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    dateTimePicker.disabled = true;

    timerId = setInterval(() => {
        const now = new Date();
        const timeLeft = userSelectedDate - now;

        if (timeLeft <= 0) {
            clearInterval(timerId);
    updateTimerDisplay(0);
    dateTimePicker.disabled = false;
    return;
        }
        
    updateTimerDisplay(timeLeft);
    }, 1000); 
});


function addLeadingZero(value) {
    return String(value).padStart(2, "0")
}

function updateTimerDisplay(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
