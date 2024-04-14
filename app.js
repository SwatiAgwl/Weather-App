/* initially grant location ya your weather render hoga
*/
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

const container= document.querySelector(".container");
const searchWeather = document.querySelector(".search-form");
const grantLoc= document.querySelector(".grant-loc");
const weather= document.querySelector(".weather-details");
const grantAccessBtn= document.querySelector(".grant-btn");
const loadingPage= document.querySelector(".loading-container");
const tab= document.querySelectorAll(".tab");

const yourTab= document.querySelector(".your");
const searchTab= document.querySelector(".search");

const searchButton= document.querySelector(".search-btn");
const searchInput= document.querySelector(".search-input");

const errorContainer= document.querySelector(".error-container")
const errorImg= document.querySelector(".error-img");

// initially
getFromSessionStorage();
console.log("hello")

let oldTab= yourTab;

function switchTabs(newTab){
    if( newTab == oldTab){
        return;
    }
    else{
        oldTab= newTab;
        if( !searchWeather.classList.contains("active")){
            // render search weather page
            grantLoc.classList.remove("active");
            weather.classList.remove("active");
            loadingPage.classList.remove("active")
            errorContainer.classList.remove("active");
            searchWeather.classList.add("active");
        }
        else{
            // reder grant loc and your loc page
            searchWeather.classList.remove("active");
            weather.classList.remove("active");
            loadingPage.classList.remove("active");
            errorContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage(){
    // agr loc hai to weather details dikhaega nhi to grant loc
    console.log(Object.keys(sessionStorage));
    const localCord= sessionStorage.getItem("userCoordinates")
    if( localCord){
        searchWeather.classList.remove("active");
        grantLoc.classList.remove("active");
        weather.classList.add("active");
        // fetchWeatherDetails(localCord);
        const coordinates = JSON.parse(localCord);
        fetchWeatherDetails(coordinates);
    }
    else{
        searchWeather.classList.remove("active");
        weather.classList.remove("active");
        grantLoc.classList.add("active");
    }
}


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition,function(err){
        console.log("error getting your pos",err)
      });
    } else {
       console.log("Geolocation is not supported by this browser.");
    }
  }
  
function showPosition(position) {
    console.log("inside show pos")
    const userCoordinates={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
   };
   console.log("before setting sess stor")
   sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates));
   console.log("sess storage added")
   fetchWeatherDetails(userCoordinates);
}

grantAccessBtn.addEventListener("click",getLocation)


function renderWeatherDetails(data){
    console.log("Rendering weather details...");
    const city= document.querySelector(".city-name");
    const country= document.querySelector(".country-flag");
    const description= document.querySelector(".description");
    const visual= document.querySelector(".visual");
    const temp= document.querySelector('.temp');
    const windspeed= document.querySelector(".windspeed");
    const humidity= document.querySelector(".humidity");
    const clouds= document.querySelector(".clouds");

    city.textContent= data?.name;
    country.src=  `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    description.textContent= data?.weather?.[0].description;
    visual.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.textContent= `${data?.main?.temp}°C`;
    windspeed.textContent= `${data?.wind?.speed} m/s`;
    humidity.textContent= `${data?.main?.humidity}%`;
    clouds.textContent= `${data?.clouds?.all}%`;

}

async function fetchWeatherDetails(coordinates){
    // api call with lat and long
    const{lat, lon}= coordinates;


    console.log("fetching ...")
    grantLoc.classList.remove("active"); 
    loadingPage.classList.add("active");
    

    try{
        console.log("api called")
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if( !response.ok){
            throw new Error ("location not listed");
        }
        const data= await response.json();
        console.log(data);
        loadingPage.classList.remove("active");
        weather.classList.add("active");
        renderWeatherDetails(data);
    }
    catch(error){
        loadingPage.classList.remove("active");
        weather.classList.remove("active");
        errorImg.src= "./assets/400-error.jpeg";
        errorImg.style.height ="400px";
        errorImg.style.width= "500px";
        errorContainer.classList.add("active");
        console.log(error);
        // errorImg.classList.remove("active");
    }
}


yourTab.addEventListener("click",()=>{
    switchTabs(yourTab);
});
searchTab.addEventListener("click",()=>{
    switchTabs(searchTab);
})


 searchButton.addEventListener("click",(e)=>{
    // api call
    e.preventDefault();
    const cityname= searchInput.value;
    console.log(cityname);
    if( cityname== "") return;
    else{
        fetchWeatherDetailsByCity(cityname);
    }
    searchInput.value="";
})

async function fetchWeatherDetailsByCity(city){
 let cityName= city;
 grantLoc.classList.remove("active");
 weather.classList.remove("active");
 errorContainer.classList.remove("active");
 loadingPage.classList.add("active");

 try{
 const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
 if( !response.ok){
    loadingPage.classList.remove("active");
    throw new Error("city not found");
 }
 const data= await response.json();

 loadingPage.classList.remove("active");
 weather.classList.add("active");
 renderWeatherDetails(data);
 }
 catch(err){
    loadingPage.classList.remove("active");
    errorImg.src= "./assets/Error-404.png";
    errorContainer.classList.add("active");
    errorImg.style.height ="400px";
    errorImg.style.width= "500px";
    console.log(err);
    // image.classList.remove("active");
 }

}


