import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Data {
  id: number;
  name: string;
  cou_name_en: string;
  timezone: string;
  population: number;
  geoname_id: string;
}

const FavouriteList: React.FC = () => {
  const savedRows: Data[] = useSelector(
    (state: any) => state.selectedRows?.savedRows
  );
  const fetchedRows = useSelector(
    (state: any) => state.selectedRows?.fetchedRows
  );
  const [filteredRows, setFilteredRows] = useState<Data[]>([]);
  useEffect(() => {
    if (savedRows && savedRows.length === 0 && fetchedRows) {
      const localStorageData = localStorage.getItem("selectedRows");
      if (localStorageData) {
        const parsedData: number[] = JSON.parse(localStorageData);
        setFilteredRows(parsedData.map((eachItem) => fetchedRows[eachItem]));
      }
    } else {
      setFilteredRows(savedRows);
    }
  }, [savedRows, fetchedRows]);

  return (
    <div className="bg-slate-100" >
      <Container >
      <Typography variant="h4" align="center">Favourite Locations</Typography>
      <Typography variant="subtitle2" align="right" style={{paddingTop:10,color:'red'}}>*Right on the card to see more details</Typography>
        <div className="p-3">
          {filteredRows.map((eachItem: Data, index: number) => (
            <Typography
              key={index}
              component="div"
              style={{
                backgroundColor: "white",
                marginTop: 20,
                padding: 4,
                borderRadius: 6,
                paddingLeft:20
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                window.open(`/weather?id=${eachItem.geoname_id}`, "_blank");
              }}
            >
              <Typography
                component="th"
                id={index.toString()}
                scope="row"
                padding="none"
               
              >
                Name: {eachItem.name}
              </Typography>
              <Typography>Country: {eachItem.cou_name_en}</Typography>
              <Typography>TimeZone: {eachItem.timezone}</Typography>
              <Typography>Population: {eachItem.population}</Typography>
            </Typography>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default FavouriteList;
