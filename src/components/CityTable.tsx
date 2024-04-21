/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import EnhancedTable from "./Table";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { citiesData} from "../reudx/actions";
import { useSelector } from "react-redux";

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

const CityTable: React.FC = () => {
  const [cities, setCities] = useState<CitiesData>({
    total_count: 0,
    results: [],
  });

  const dispatch = useDispatch()
  const data = useSelector((state:any)=>state.selectedRows.citiesData)

  useEffect(() => {
    if(data.results.length === 0){
    axios
      .get(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&refine=timezone%3A%22Indian%22"
      )
      .then((response) => {
        const responseData: CitiesData = response.data;
        setCities(responseData);
        dispatch(citiesData(responseData))
      })
      .catch((error) => {
        console.error("Error fetching cities data:", error);
      });
    }else{
      setCities(data)
    }
  }, [data]);

  return (
    <>
      <div className="bg-slate-100 p-4" style={{paddingBottom:60}} >
        <Typography variant="h3" align="center" style={{paddingBottom:10}}>Weather Forecast</Typography>
        <EnhancedTable cities={cities} />
      </div>
    </>
  );
};

export default CityTable;
