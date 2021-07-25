// Set the work hours
const workDay = { start: 9, end: 18 }

var values, dateKey

function init(now=moment()) {
    // Add the current date to top of screen
    $('#currentDay').text(now.format('dddd, MMMM Do'))

    // Get the current hour
    var hour = now.hour()

    // Get values from local storage
    var localStr = localStorage.getItem('schedulerData') || "{}"
    values = JSON.parse(localStr)
    dateKey = now.format('YYYYMMDD')
    if (!(dateKey in values)) values[dateKey] = {}

    // Build the time slots
    var container = $('.container')
    for (let hr = workDay.start; hr < workDay.end; hr++) {
        let time = moment(hr, 'H')
        let frame = hour > hr ? 'past' : hour < hr ? 'future' : 'present'
        var eventText = values[dateKey][hr] || ''
        let row = $(`
        <div id='time-slot-${hr}' class='time-block row'>
            <span class='hour time-column col-1'>
                <span class='hour-display'>${time.format('hA')}</span>
            </span>
            <span class='info-column col ${frame}'>
                <textarea id='event-input-${hr}' data-hr=${hr} type="text" class='event-input'>${eventText}</textarea>
            </span>
            <span id='save-button-${hr}' data-hr=${hr} class='saveBtn col-1'>
            </span>
        </div>`)
        container.append(row)
    }
    container.on('click', event => {
        if (event.target.matches('.saveBtn')) {
            var button = event.target
            var hr = button.dataset.hr
            var inputValue = $(`#event-input-${hr}`)[0].value
            values[dateKey][hr] = inputValue
            localStorage.setItem('schedulerData', JSON.stringify(values))
        }
    })

    localStorage.setItem('schedulerData', JSON.stringify(values))

    setAlarm(now)
}
init()
// init(moment('20201101 135955'))

var timer

function setAlarm(now=moment()) {
    // Update display at the start of the next hour
    var startOfNextHour = now.clone().endOf('hour').add(1, 'second')
    var durationToNextHour = startOfNextHour - now
    timer = setInterval(function() {
        clearInterval(timer)
        updateDisplay(startOfNextHour)
    }, durationToNextHour)
}

function updateDisplay(now=moment()) {
    // Get the current hour
    var hour = now.hour()

    // Update each color
    var cells = $('.info-column')
    console.log(cells);
    for (let i = 0, hr = workDay.start; i < cells.length; i++, hr++) {
        let cell = $(cells[i])
        cell.removeClass(['past', 'present', 'future'])
        cell.addClass(hour > hr ? 'past' : hour < hr ? 'future' : 'present')
    }
    
    setAlarm(now)
}