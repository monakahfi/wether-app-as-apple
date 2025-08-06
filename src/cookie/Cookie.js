import Cookies from 'js-cookie';

const setCityCookie = ({name, tz_id}) => {
  if (!name || !tz_id) return;

  const cities = getCityCookies();
  const exists = cities.some((c) => c.name === name && c.tz_id === tz_id);

  if (!exists) {
    cities.push([ name, tz_id ]);
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

const removeCityCookie = (tz_id) => {
  const cities = getCityCookies().filter((c) => c.tz_id !== tz_id);
  Cookies.set('searchedCities', JSON.stringify(cities), { expires: 7 });
};

export { setCityCookie, getCityCookies, removeCityCookie };
