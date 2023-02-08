let key = '64f2ee2a8261daa4d9f780f5b365f275';
let city = "Atlanta"

// uses day.js to get the current date and time 
let date = dayjs().format('dddd, MMMM D, YYYY');
let dateTime = dayjs().format('YYYY-MM-DD HH:MM:SS')

let cityList = [];


// saves the city input saves it to an array
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityList.push(city);

	localStorage.setItem('city', JSON.stringify(cityList));
	fiveForecastEl.empty();
	getWeatherToday();
	getHistory();
});


let cardTodayBody = $('.cardBodyToday')
// provides today's weather to main card, and also shows the five day forecast
function getWeatherToday() {
	let getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		let pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		let pElWind = $('<p>').text(`Wind: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
		let pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
	});
	getFiveDayForecast();
};

let fiveForecastEl = $('.fiveForecast');

// displays the five day forecast with temperature, wind speed, and humidity
function getFiveDayForecast() {
	let getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		let fiveDayArray = response.list;
		let myWeather = [];
		$.each(fiveDayArray, function (index, value) {
			objects = {
				date: value.dt_txt.split(' ')[0],
				temp: value.main.temp,
				wind: value.wind.speed,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(objects);
			}
		})

		for (let i = 0; i < myWeather.length; i++) {

			let divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 250px;');
			fiveForecastEl.append(divElCard);

			let divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			let m = dayjs(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			let divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			let divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			let pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
		
			let pElWindSpeed = $('<p>').text(`Wind: ${myWeather[i].wind} MPH`);
			divElBody.append(pElWindSpeed);
	
			let pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

// creates buttons for recent city searches to allow the forecast to be reviewed
let contHistEl = $('.cityList');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityList.length; i++) {

		let rowEl = $('<row>');
		let btnEl = $('<button>').text(`${cityList[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}

	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};

function initLoad() {

	let cityListStore = JSON.parse(localStorage.getItem('city'));

	if (cityListStore !== null) {
		cityList = cityListStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();