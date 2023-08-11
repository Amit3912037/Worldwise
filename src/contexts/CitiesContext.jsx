import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import supabase, { supabaseUrl } from '../services/supabase';

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
      };
    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        let { data: cities } = await supabase.from('cities').select('*');
        console.log(cities);
        dispatch({ type: 'cities/loaded', payload: cities });
      } catch (error) {
        dispatch({
          type: 'rejected',
          payload: 'There was error while loading the data',
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: 'loading' });
      try {
        let { data: city } = await supabase
          .from('cities')
          .select('*')
          .eq('id', id)
          .single();

        dispatch({ type: 'city/loaded', payload: city });
      } catch (error) {
        dispatch({
          type: 'rejected',
          payload: 'There was error while loading the data',
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: 'loading' });

    try {
      const { data } = await supabase
        .from('cities')
        .insert([newCity])
        .select()
        .single();
      dispatch({ type: 'city/created', payload: data });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: 'There was error while creating city',
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      await supabase.from('cities').delete().eq('id', id);

      dispatch({ type: 'city/deleted', payload: id });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: 'There was error while deleting city',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error('CitiesContext was used outside the CitiesProvider');
  }
  return context;
}
export { useCities, CitiesProvider };
