document.body.style.backgroundImage = "url('./static/img/mostly_cloudy.jpg ')";
const form = document.getElementById("form");
const input = document.getElementById("input");
const filter = document.getElementById("filter");
const unit = document.getElementById("unit");
const validateText = document.getElementById("validText")
let validated = false

const forecast = document.getElementById("forecast");
const high = document.getElementById("high");
const low = document.getElementById("low");
const temp = document.getElementById("temp");
const feelslike = document.getElementById("feelslike");
const humidity = document.getElementById("humidity");

const forecasttemp1 = document.getElementById('forecasttemp1')
const forecasttemp2 = document.getElementById('forecasttemp2')
const forecasttemp3 = document.getElementById('forecasttemp3')

filter.addEventListener("change", event => {
    event.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
    }
    filter.value == "zip"
        ? input.setAttribute("placeholder", "US Zip Code")
        : input.setAttribute("placeholder", "City Name")
});

input.addEventListener("click", event => {
    event.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        input.value = ""
        validated = false
    }
})

unit.addEventListener("click", event => {
    event.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})


filter.addEventListener("click", event => {
    event.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})

async function apiCall(query, checkFilter, unit) {
    let queryInput = ""
    let unitInput = `&units=${unit}`
    checkFilter == "zip" ? queryInput = `zip=${query},us` : queryInput = `q=${query}`
    if (unit == "standard") { unitInput = `` }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${queryInput}&appid=18d3374c7721b978bbe5543ffaba7643${unitInput}`
    )

    if (res.ok) {
        const data = await res.json()
        return data
    } else if (!res.ok) {
        if (checkFilter == "zip") {
            validateText.innerText = "Please enter a valid Zip Code"
            validated = true
        } else {
            validateText.innerText = ""
            validated = true
        }
    } else {
        validateText.innerText = "Error, please try again"
        validated = true
    }
}

(async () => {
    const data = await apiCall("chicago", "city", "imperial");
    fillData(data);
  })();

async function apiCallsecond(query, checkFilter, unit) {
    let queryInput = ""
    let unitInput = `&units=${unit}`
    checkFilter == "zip" ? queryInput = `zip=${query},us` : queryInput = `q=${query}`
    if (unit == "standard") { unitInput = `` }
    const res2 = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=8a3955cb3c0b4605997162718232105&${queryInput}&days=3&aqi=no&alerts=no`
    )

    if (res2.ok) {
        const data2 = await res2.json()
        console.log(data2)
        return data2
        
    } else if (!res2.ok) {
        if (checkFilter == "zip") {
            validateText.innerText = ""
            validated = true
        } else {
            validateText.innerText = ""
            validated = true
        }
    } else {
        validateText.innerText = "Error, please try again"
        validated = true
    }
}

(async () => {
    const data2 = await apiCallsecond("chicago");
    fillDataForecast(data2);
  })();

form.addEventListener("submit", async e => {
    e.preventDefault();
    if (validateForm(filter.value, input.value)) {
        const data = await apiCall(input.value, filter.value, unit.value)
        const data2 = await apiCallsecond(input.value,filter.value)
        if (filter.value == 'zipfilter') {
            fillData(data, input.value)
            fillDataForecast(data2,input.value)
        } else {
            fillData(data)
            fillDataForecast(data2)
        }
    }
});


function validateForm(validFilter, validText) {
    if (validFilter == "zip") {
        if (!validText.length) {
            validateText.innerText = "Please enter a valid location"
            validated = true
            return false
        } else if (validText.match(/[A-Za-z]/i) || validText.length !== 5) {
            validateText.innerText = ""
            validated = true
            return false
        }
    } else if (validFilter == "city") {
        if (!validText.length) {
            validateText.innerText = "Please enter a location"
            validated = true
            return false
        } else if (validText.match(/[0-9]/i)) {
            validateText.innerText = "Please enter a valid location"
            validated = true
            return false
        }
    }
    return true
}

function fillData(data, zip=null) {
    const zipCode = zip ? `${zip} - ` : ''
    cityname.innerText = `${zipCode}${data.name}, ${data.sys.country}`
    forecast.innerText = data.weather[0].main
    high.innerText = `${Math.round(data.main.temp_max)}°`
    low.innerText = `${Math.round(data.main.temp_min)}°`
    currenttemp.innerText = `${Math.round(data.main.temp)}°`
    feelslike.innerText = `${Math.round(data.main.feels_like)}°`
    humidity.innerText = `${Math.round(data.main.humidity)}%`
    changeImage(data.weather[0].main)
    changeBackground(data.weather[0].main)

}

function fillDataForecast(data2) {
    console.log(data2)
    //forecast.innerText = data2.weather[0].main
    forecasttemp1.innerText = `${Math.round(data2.forecast.forecastday[0].day.avgtemp_f)}°`
    forecasttemp2.innerText = `${Math.round(data2.forecast.forecastday[1].day.avgtemp_f)}°`
    forecasttemp3.innerText = `${Math.round(data2.forecast.forecastday[2].day.avgtemp_f)}°`
    changeForecastIcon1(data2.forecast.forecastday[0].day.condition.text)
    changeForecastIcon2(data2.forecast.forecastday[1].day.condition.text)
    changeForecastIcon3(data2.forecast.forecastday[2].day.condition.text)

}

//document.getElementById('myImage');
//            if (image.src.match("colorbottel")) {
//                image.src = "waterbottel.gif";


function changeImage(forecast) {
    if (forecast == "Clear") {
        document.getElementById("weathericonlarge").src = "./static/img/sunny_icon.png";
    } else if (forecast == "Rain") {
        document.getElementById("weathericonlarge").src = "./static/img/light_rain_icon.png";
    } else if (forecast == "Haze") {
        document.getElementById("weathericonlarge").src = "./static/img/haze_icon.png";
    } else if (forecast == "Mist") {
        document.getElementById("weathericonlarge").src = "./static/img/haze_icon.png";
    } else if (forecast == "Clouds") {
        document.getElementById('weathericonlarge').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast == "Smoke") {
        document.getElementById("weathericonlarge").src = "./static/img/haze_icon.png";
    } else if (forecast == "Thunderstorm") {
        document.getElementById("weathericonlarge").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast == "Tornado") {
        document.getElementById("weathericonlarge").src = "./static/img/tornado_icon.png";
    } else if (forecast == "Snow") {
        document.getElementById("weathericonlarge").src = "./static/img/snow_icon.png";
    } else {
        document.getElementById("weathericonlarge").src = "./static/img/sunny_icon.png";
    }
    
  }

function changeBackground(forecast) {
  if (forecast == "Clear") {
    document.body.style.backgroundImage = "url('./static/img/sunny.jpg ')";
  } else if (forecast == "Rain") {
    document.body.style.backgroundImage = "url('./static/img/rain.jpg ')";
  } else if (forecast == "Haze") {
    document.body.style.backgroundImage = "url('./static/img/haze.jpg ')";
} else if (forecast == "Mist") {
    document.body.style.backgroundImage = "url('./static/img/haze.jpg ')";
  } else if (forecast == "Clouds") {
    document.body.style.backgroundImage = "url('./static/img/mostly_cloudy.jpg ')";
  } else if (forecast == "Smoke") {
    document.body.style.backgroundImage = "url('./static/img/haze.jpg ')";
  } else if (forecast == "Thunderstorm") {
    document.body.style.backgroundImage = "url('./static/img/thunderstorm.jpg ')";
  } else if (forecast == "Tornado") {
    document.body.style.backgroundImage = "url('./static/img/tornado.jpg ')";
  } else if (forecast == "Fog") {
    document.body.style.backgroundImage = "url('./static/img/haze.jpg ')";
  } else if (forecast == "Snow") {
    document.body.style.backgroundImage = "url('./static/img/snow.jpg ')";
  } else {
    document.body.style.backgroundImage = "url('./static/img/tornado.jpg ')";
  }
  
}

function changeForecastIcon1(forecast2) {
    console.log(forecast2)
    if (forecast2 == "Clear") {
        document.getElementById("weathericon1").src = "./static/img/sunny_icon.png";
    } else if (forecast2 == "Rain") {
        document.getElementById("weathericon1").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Patchy rain possible") {
        document.getElementById("weathericon1").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Partly cloudy") {
        document.getElementById("weathericon1").src = "./static/img/partly_cloudy_icon.png";
    } else if (forecast2 == "Haze") {
        document.getElementById("weathericon1").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Mist") {
        document.getElementById("weathericon1").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Clouds") {
        document.getElementById('weathericon1').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Overcast") {
        document.getElementById('weathericon3').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Smoke") {
        document.getElementById("weathericon1").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Thunderstorm") {
        document.getElementById("weathericon1").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Moderate rain") {
        document.getElementById("weathericon1").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Tornado") {
        document.getElementById("weathericon1").src = "./static/img/tornado_icon.png";
    } else if (forecast2 == "Snow") {
        document.getElementById("weathericon1").src = "./static/img/snow_icon.png";
    } else {
        document.getElementById("weathericon1").src = "./static/img/sunny_icon.png";
    }
    
  }

  function changeForecastIcon2(forecast2) {
    console.log(forecast2)
    if (forecast2 == "Clear") {
        document.getElementById("weathericon2").src = "./static/img/sunny_icon.png";
    } else if (forecast2 == "Rain") {
        document.getElementById("weathericon2").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Patchy rain possible") {
        document.getElementById("weathericon2").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Partly cloudy") {
        document.getElementById("weathericon2").src = "./static/img/partly_cloudy_icon.png";
    } else if (forecast2 == "Haze") {
        document.getElementById("weathericon2").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Mist") {
        document.getElementById("weathericon2").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Clouds") {
        document.getElementById('weathericon2').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Overcast") {
        document.getElementById('weathericon3').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Smoke") {
        document.getElementById("weathericon2").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Thunderstorm") {
        document.getElementById("weathericon2").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Moderate rain") {
        document.getElementById("weathericon2").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Tornado") {
        document.getElementById("weathericon2").src = "./static/img/tornado_icon.png";
    } else if (forecast2 == "Snow") {
        document.getElementById("weathericon2").src = "./static/img/snow_icon.png";
    } else {
        document.getElementById("weathericon2").src = "./static/img/sunny_icon.png";
    }
    
  }

  function changeForecastIcon3(forecast2) {
    console.log(forecast2)
    if (forecast2 == "Clear") {
        document.getElementById("weathericon3").src = "./static/img/sunny_icon.png";
    } else if (forecast2 == "Rain") {
        document.getElementById("weathericon3").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Patchy rain possible") {
        document.getElementById("weathericon3").src = "./static/img/light_rain_icon.png";
    } else if (forecast2 == "Partly cloudy") {
        document.getElementById("weathericon3").src = "./static/img/partly_cloudy_icon.png";
    } else if (forecast2 == "Haze") {
        document.getElementById("weathericon3").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Mist") {
        document.getElementById("weathericon3").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Clouds") {
        document.getElementById('weathericon3').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Overcast") {
        document.getElementById('weathericon3').src = './static/img/mostly_cloudy_icon.png';
    } else if (forecast2 == "Smoke") {
        document.getElementById("weathericon3").src = "./static/img/haze_icon.png";
    } else if (forecast2 == "Thunderstorm") {
        document.getElementById("weathericon3").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Moderate rain") {
        document.getElementById("weathericon3").src = "./static/img/thunderstorm_icon.png";
    } else if (forecast2 == "Tornado") {
        document.getElementById("weathericon3").src = "./static/img/tornado_icon.png";
    } else if (forecast2 == "Snow") {
        document.getElementById("weathericon3").src = "./static/img/snow_icon.png";
    } else {
        document.getElementById("weathericon3").src = "./static/img/sunny_icon.png";
    }
    
  }