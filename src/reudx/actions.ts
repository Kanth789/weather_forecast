interface Data {
    id: number;
    name: string;
    cou_name_en: string;
    timezone: string;
    population: number;
    geoname_id:string
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

export const selectRow = (row: Data) => ({
    type: 'SELECT_ROW',
    payload: row,
  });
  
export const fetchedRows = (row:Data[]) =>({
    type:'FETECHED_ROW',
    payload:row
})

export const citiesData = (data:CitiesData)=>({
  type:'CITIES_DATA',
  payload:data
})
 