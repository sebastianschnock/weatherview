'use_strict';

$(document).ready(function(){

	/**
	 * Polls the openweathermap api every 10 minutes and shows the weather
	 */
	function pollWeather() {

		$('.weather-cities').empty();

		var HOUR = 60 * 60 * 1000;
		showWeatherFor('cupertino', '5341145', HOUR * -7);
		showWeatherFor('redmond', '5747882', HOUR * -7);
		// showWeatherFor('cairo', '360630', HOUR * 2);

		setTimeout(pollWeather, 600000);
	}

	/**
	 * Shows the weather for a given city
	 */
	function showWeatherFor(name, id, timezoneOffset) {

		// create weather container
		var $weather = $('<div>', { class: 'col-xs-6 weather-city weather-city--' + 'name' });
		$('.weather-cities').append($weather);

		// create header
		var $weatherHeader = $('<h3>', { class: 'weather-city__header' });
		$weatherHeader.html(name);
		$weather.append($weatherHeader);

		// get weather from openweathermap and display the result
		getWeatherFor(id, function(data) {

			var maxEntriesToShow = 7;

			// show icon for the current day
			var $weatherIcon = $('<div>', { class: 'weather-city__icon owf owf-5x owf-' + data.cod });
			$weather.append($weatherIcon);

			// last data is the most current one
			for(var i=data.list.length-1; i>0 && maxEntriesToShow > 0; i--) {
				updateCityWeather(data.list[i], timezoneOffset, $weather);
				maxEntriesToShow--;
			}
		});
	}

	/**
	 * Makes the ajax call to the openweathermap api
	 */
	function getWeatherFor(id, cb) {
		var url = 'http://api.openweathermap.org/data/2.5/history/city?id=' +id +'&type=hour';
		$.getJSON(url).then(cb);
	}

	/**
	 * Updates the dom with new weather data
	 */
	function updateCityWeather(data, timezoneOffset, $container) {

		// create dom elements

		var $weather = $('<p>', { class: 'weather-city__hour' });
		$container.append($weather);

		var $weatherTime = $('<div>', { class: 'weather-city__time text-muted' });
		$weather.append($weatherTime);

		var $weatherTemperature = $('<div>', { class: 'weather-city__temperature' });
		$weather.append($weatherTemperature);

		var $weatherDescription = $('<div>', { class: 'weather-city__description' });
		$weather.append($weatherDescription);

		// fill with data
		var date = new Date(data.dt * 1000);
		date.setTime(date.getTime() + timezoneOffset);
		$weatherTime.html(date.getHours() + ':' + date.getMinutes());
		$weatherTemperature.html(kelvinToCelsius(data.main.temp).toFixed(1) + '<small> C° </small>');
		$weatherDescription.html(' (' +data.weather[0].main + ') ');
	}

	function kelvinToCelsius(inKelvin) {
		return inKelvin - 273.15;
	}



	// start polling
	pollWeather();
});