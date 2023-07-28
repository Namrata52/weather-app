// fetch all elements

const userTab = document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector(".weather-container");

const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm =document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-infoContainer");

//initialise variables for starting point
let oldTab =userTab;
oldTab.classList.add("current-tab");
// url 'https://open-weather13.p.rapidapi.com/city/landon';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9488ca79e4msh6909d9d40409f9bp1bb498jsn522584cb9e1d',
		'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
	}
};
getFromSessionStorage();

const errorDisplay =document.querySelector('[data-error]');
errorDisplay.classList.remove("active");

function switchTab(clickedTab){
    if(clickedTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab =clickedTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            // ami pehle search tab me tha, ab your weather pe jana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorDisplay.classList.remove("active");
            getFromSessionStorage();
            //to check loacl storage
        }
    }
   
}


userTab.addEventListener("click", ()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass search tab as input
    switchTab(searchTab);
});
//check if coordinates are already present
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //nhi h to show grant page
        grantAccessContainer.classList.add("active");

    }else{
        //api call krenege for local coordinates
        const coordinates =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//API CALL fi\unction
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try{
    
        const response = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${lat}%2C${lon}`,options);
        // const response =await fetch(`https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`,options);
        const data= await response.json();
        //loading ko hata ke userWeather active
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if(response.status!==200){
            throw new Error(response.status);
          }
    }catch(err){
        console.log("error");

        loadingScreen.classList.remove("active");
        handleerror();
    }
}

function renderWeatherInfo(weatherInfo){
    //fetch
    const cityName =document.querySelector("[data-cityName]");
    const countryIcon =document.querySelector("[data-countryIcon]");
    const desc =document.querySelector("[data-weatherDesc]");
    const weatherIcon =document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]");
    const windspeed =document.querySelector("[data-windspeed]");
    const humidity =document.querySelector("[data-humidity]");
    const cloudiness =document.querySelector("[data-cloudiness]");



    cityName.innerText =weatherInfo?.location?.name;
    //countryIcon.src =`https://flagcdn.com/144x108/${weatherInfo?.location?.country.toLowerCase()}.png`;
    countryIcon.src =`https://flagcdn.com/144x108/in.png`;
    desc.innerText =weatherInfo?.current?.condition?.text;
    //weatherIcon.src =`https://openweathermap.org/img/wn/${weatherInfo?.current?.condition?.code}.png`;
    weatherIcon.src =`https:${weatherInfo?.current?.condition?.icon}`;
    // temp.innerText =`${((weatherInfo?.main?.temp)-273.15).toFixed(2)}°C`;
    temp.innerText =  `${weatherInfo?.current?.temp_c}°C`;
    windspeed.innerText =`${weatherInfo?.current?.wind_mph}m/h`;
    humidity.innerText =`${weatherInfo?.current?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.current?.cloud}%`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        console.log("no data available");
    }
}


function showPosition(position){
    const userCoordinates ={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    };
    sessionStorage.setItem("user-Coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

let searchInput =document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName =searchInput.value;
    if(cityName===""){
        return;

    }else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        // const response =await fetch(`https://open-weather13.p.rapidapi.com/city/${city}`,options);
        const response =await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=1`,options);
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if(response.status!==200){
          throw new Error(response.status);
        }
        
    }catch(err){
        
        console.log("nodta");
        handleerror();
    }
}




// 'https://open-weather13.p.rapidapi.com/city/fivedaysforcast/30.438/-89.1028';



function handleerror(){
    loadingScreen.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorDisplay.classList.add("active");
}
