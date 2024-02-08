const API_KEY = prompt('Enter API key:');

const form = document.querySelector('.form');
const cityInput = document.querySelector('.input_new');
const citiesList = document.querySelector('.cities_list');

const cacheTime = 5 * 60 * 1000;
const maxCities = 10;
const localStorageItemName = 'cachedCities';

let cityIndex = Math.floor(Math.random() * 100000);

const addCityItem = (cityData) => {
  const { name, temp, humidity, icon, created } = cityData;

  const city = document.createElement('div');
  city.classList.add('city');

  const cityName = document.createElement('p');
  cityName.textContent = name;

  const cityTemp = document.createElement('p');
  cityTemp.textContent = temp;

  const cityHumidity = document.createElement('p');
  cityHumidity.textContent = humidity;

  const weatherIcon = document.createElement('img');
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;

  const cityCreated = document.createElement('p');
  cityCreated.textContent =
    'Created: ' + new Date(created).toLocaleTimeString();

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function () {
    removeCity(cityData.id);
  });

  city.appendChild(cityName);
  city.appendChild(cityTemp);
  city.appendChild(cityHumidity);
  city.appendChild(weatherIcon);
  city.appendChild(cityCreated);
  city.appendChild(removeButton);

  citiesList.appendChild(city);
};

const fetchWeatherData = async (cityName) => {
  const {
    name,
    main: { humidity, temp },
    weather,
  } = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  ).then((res) => res.json());

  cityIndex++;

  return {
    id: cityIndex,
    created: Date.now(),
    name,
    humidity,
    temp,
    icon: weather[0].icon,
  };
};

const getCachedCity = async (cityName) => {
  const cachedData = await getCachedData();

  return cachedData.find(
    ({ name }) => name.toLowerCase() === cityName.toLowerCase()
  );
};

const generateWeatherData = async () => {
  citiesList.innerHTML = '';

  const cachedData = getCachedData();

  if (!cachedData) {
    return;
  }

  for (const city of cachedData) {
    if (Date.now() - city.created > cacheTime) {
      removeCity(city.id, true);

      const newCity = await fetchWeatherData(city.name);

      setCachedData(newCity);
      addCityItem(newCity);
    } else {
      addCityItem(city);
    }
  }
};

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (citiesList.children.length >= maxCities) {
    alert(`You can't add more cities!`);
    return;
  }

  const cityName = cityInput.value;
  const cachedCity = await getCachedCity(cityName);

  if (cachedCity) {
    alert('City already exists');
    return;
  }

  const newCity = await fetchWeatherData(cityName);

  setCachedData(newCity);
  addCityItem(newCity);
});

const getCachedData = () => {
  return JSON.parse(localStorage.getItem(localStorageItemName)) || [];
};

const setCachedData = (newData, replace = false) => {
  const prevCache = getCachedData() || [];

  const data = replace ? [...newData] : [...prevCache, newData];

  localStorage.setItem(localStorageItemName, JSON.stringify(data));
};

const removeCity = async (cityId, preventReload = false) => {
  const cache = getCachedData();
  setCachedData(
    cache.filter(({ id }) => id !== cityId),
    true
  );

  if (!preventReload) {
    await generateWeatherData();
  }
};

generateWeatherData();
