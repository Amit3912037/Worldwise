import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

export default function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countryMap = {};

  for (const obj of cities) {
    if (!countryMap[obj.country]) {
      countryMap[obj.country] = obj;
    }
  }

  const uniqueCountriesArray = Object.values(countryMap);
  return (
    <ul className={styles.countryList}>
      {uniqueCountriesArray.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}
