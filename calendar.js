//Using HTML, Bootstrap, and JavaScript create a single page website that contains the following:
//A Bootstrap styled table representing your choice of data. 
// A Bootstrap styled form that allows a user to add a new row to the table when clicking on submit.
//


const calendarGrid = document.getElementById("calendarGrid");
const monthYearDisplay = document.getElementById("monthYear");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const addEventButton = document.getElementById("addEventButton");
const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
const saveEventButton = document.getElementById("saveEventButton");
const eventTitleInput = document.getElementById("eventTitle");
const eventDateInput = document.getElementById("eventDate");
const eventTimeInput = document.getElementById("eventTime");
const eventLocationInput = document.getElementById("eventLocation");

const scheduleContainer = document.querySelector(".schedule-container");
const scheduleDayDisplay = document.getElementById("scheduleDay");
const scheduleList = document.getElementById("scheduleList");
const addScheduleEventButton = document.getElementById("addScheduleEvent");

let currentDate = new Date();
let events = {}; 
let schedule = {}; 

// Function to render the calendar grid
function renderCalendar(date) {
  const month = date.getMonth();
  const year = date.getFullYear();

  // Update the month/year display
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  monthYearDisplay.textContent = `${months[month]} ${year}`;

  // Get the first day of the month and the total number of days in the month
  const firstDay = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Clear the previous calendar grid
  calendarGrid.innerHTML = '';

  // Generate empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('col', 'day', 'empty');
    calendarGrid.appendChild(emptyCell);
  }

  // Generate the days of the current month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('col', 'day');
    dayCell.textContent = day;

    // Add event(s) if present for the day
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (events[dateKey]) {
      events[dateKey].forEach(event => {
        const eventTag = document.createElement('div');
        eventTag.classList.add('event');
        eventTag.textContent = event.title;
        dayCell.appendChild(eventTag);
      });
    }

    // Add click event to open detailed schedule for the selected day
    dayCell.addEventListener('click', () => {
      openScheduleView(dateKey);
    });

    calendarGrid.appendChild(dayCell);
  }
}


// Function to open the schedule view for a specific day
function openScheduleView(dateKey) {
  scheduleDayDisplay.textContent = dateKey; // Display the selected day
  renderSchedule(dateKey); // Render the events for that day
}

// Function to render the schedule events for a specific day
function renderSchedule(dateKey) {
  scheduleList.innerHTML = ''; // Clear previous events

  if (schedule[dateKey]) {
    schedule[dateKey].forEach(event => {
      const listItem = document.createElement('li');
      listItem.classList.add('schedule-item');
      listItem.innerHTML = `
        <strong>${event.title}</strong><br>
        <span>Time: ${event.time}</span><br>
        <span>Location: ${event.location}</span>
      `;
      scheduleList.appendChild(listItem);
    });
  } else {
    scheduleList.innerHTML = '<li>No events scheduled for this day.</li>';
  }
}

// Function to save a new event to the schedule
function saveEvent(dateKey) {
  const eventTitle = eventTitleInput.value;
  const eventTime = eventTimeInput.value;
  const eventLocation = eventLocationInput.value;

  if (!eventTitle || !eventTime || !eventLocation) {
    alert("Please complete all fields.");
    return;
  }

  // Add event to the schedule
  const newEvent = { title: eventTitle, time: eventTime, location: eventLocation };

  if (!schedule[dateKey]) {
    schedule[dateKey] = [];
  }
  schedule[dateKey].push(newEvent);

  // Close the modal and reset input fields
  eventModal.hide();
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventLocationInput.value = '';

  // Re-render schedule
  renderSchedule(dateKey);
}

// Event listeners for changing months
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Event listener for adding an event
addEventButton.addEventListener('click', () => {
  eventModal.show();
});

// Event listener for adding schedule event
addScheduleEventButton.addEventListener('click', () => {
  const dateKey = scheduleDayDisplay.textContent;
  eventModal.show();
  saveEventButton.onclick = () => saveEvent(dateKey);
});

// Initial render
renderCalendar(currentDate);

