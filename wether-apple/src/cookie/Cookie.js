import Cookies from 'js-cookie';

const setCityCookie = (city) => {
  if (!city || city.trim() === '') return; // چک کردن شهر خالی
  const cities = getCityCookies();
  if (!cities.includes(city.trim())) {
    cities.push(city.trim());
    Cookies.set('searchedCities', JSON.stringify(cities), { expires: 3 });
  }
};

const getCityCookies = () => {
  const cities = Cookies.get('searchedCities');
  return cities ? JSON.parse(cities) : [];
};

const removeCityCookie = (city) => {
  const cities = getCityCookies().filter((c) => c !== city);
  Cookies.set('searchedCities', JSON.stringify(cities), { expires: 3 });
};

export { setCityCookie, getCityCookies, removeCityCookie };