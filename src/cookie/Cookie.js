import Cookies from 'js-cookie';


const setCityCookie = ({ name, id , lat , lon}) => {
  if (!name || !id) return;

  const cities = getCityCookies();
  const exists = cities.some((c) => c.name === name && c.id === id);

  if (!exists) {
    cities.push({ name, id  , lat , lon}); 
    Cookies.set('searchedCities', JSON.stringify(cities), { expires: 7 });
  }
};


const getCityCookies = () => {
  const cities = Cookies.get('searchedCities');
  try {
    return cities ? JSON.parse(cities) : [];
  } catch (error) {
    return [];
  }
};

const removeCityCookie = (id) => {
  const cities = getCityCookies().filter((c) => c.id !== id);
  Cookies.set('searchedCities', JSON.stringify(cities), { expires: 7 });
};

export { setCityCookie, getCityCookies, removeCityCookie };
