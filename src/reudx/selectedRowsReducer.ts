import { AnyAction } from 'redux';

interface Data {
  id: number;
  name: string;
  cou_name_en: string;
  timezone: string;
  population: number;
  geoname_id: string;
}
interface Coordinates {
  lon: number;
  lat: number;
}

interface City {
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names: string[] | null;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cou_name_en: string | null;
  country_code_2: string | null;
  admin1_code: string;
  admin2_code: string | null;
  admin3_code: string | null;
  admin4_code: string | null;
  population: number;
  elevation: number | null;
  dem: number;
  timezone: string;
  modification_date: string;
  label_en: string | null;
  coordinates: Coordinates;
}

interface CitiesData {
  total_count: number;
  results: City[];
}

interface State {
  savedRows: Data[];
  fetchedRows: Data[];
  citiesData: CitiesData; 
}

const initialState: State = {
  savedRows: [],
  fetchedRows: [],
  citiesData: { total_count: 0, results: [] }, 
};
const selectedRowsReducer = (state = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SELECT_ROW':
      const index = state.savedRows.findIndex(row => row.id === action.payload.id);
      if (index === -1) {
        return {
          ...state,
          savedRows: [...state.savedRows, action.payload],
        };
      } else {
        const updatedRows = [...state.savedRows];
        updatedRows.splice(index, 1);
        return {
          ...state,
          savedRows: updatedRows,
        };
      }
    case 'FETECHED_ROW':
      return {
        ...state,
        fetchedRows:action.payload
      }
    case 'CITIES_DATA':
      return{
        ...state,
        citiesData:action.payload
      }
    default:
      return state;
  }
};

export default selectedRowsReducer;
