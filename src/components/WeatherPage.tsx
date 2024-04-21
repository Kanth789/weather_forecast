import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Container, Typography } from "@mui/material";

import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import NearMeIcon from "@mui/icons-material/NearMe";
import HorizontalBars from "./BarChart";
import { forecastData, weatherData } from "../constant";

interface dailyWeatherData {
  dt: number;
  temp: {
    day: number;
    eve: number;
    morn: number;
    night: number;
  };
  feels_like: {
    day: number;
    eve: number;
    morn: number;
    night: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
  rain: number;
}

interface WeatherData {
  dt: number;
  temp: number;
  feels_like: {
    day: number;
    eve: number;
    morn: number;
    night: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
  rain: number;
}
const WeatherPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [weather, setWeather] = useState<any>(weatherData);
  const [data, setData] = useState<any>(forecastData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(
          `https://openweathermap.org/data/2.5/weather?id=${id}&appid=439d4b804bc8187953eb36d2a8c26a02`
        )
        .then((response) => {
          setWeather(response.data);
          return axios.get(
            `https://openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=439d4b804bc8187953eb36d2a8c26a02`
          );
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [id]);

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  const formatWeatherDataForChart = (
    data: WeatherData[]
  ): { month: string | number | Date; time: string; seoul: number }[] => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    return data.map((each, index) => {
      let hour = (currentHour + index) % 12 || 12;
      return {
        month: each.weather[0].description,
        time: `${hour}`,
        seoul: each.temp,
      };
    });
  };

  const getNext8Days = (): { date: string; forecast: dailyWeatherData }[] => {
    const dates = [];
    for (let i = 0; i < data?.daily?.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
      dates.push({ date: formattedDate, forecast: data.daily[i] });
    }

    return dates;
  };

  const next8Days = getNext8Days();
  console.log(next8Days);

  return (
    <div className="bg-slate-100">
      <Container>
        {/* Display weather information */}
        <div className="p-4">
          <Typography
            component="div"
            className="shadow-md bg-white rounded-md p-4 mt-4"
          >
            <Typography
              variant="subtitle1"
              component="div"
              style={{ color: "tomato" }}
            >
              {formattedDate} &nbsp; <span>{formattedTime}</span>
            </Typography>
            <Typography className="bg-neutral-100 rounded-md p-3">
              <Typography variant="h4" component="div">
                {weather?.name}, &nbsp;{weather?.sys?.country}
              </Typography>
              <Typography component="div">
                <Typography component="div" sx={{ display: "flex" }}>
                  <CloudIcon />
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ marginLeft: 4 }}
                  >
                    {Math.floor(weather?.main?.temp)}°C
                  </Typography>
                </Typography>
                <Typography>
                  Feels Like {Math.floor(weather?.main?.feels_like)}°C.{" "}
                  {weather?.weather?.[0]?.description &&
                    weather.weather[0].description.charAt(0).toUpperCase() +
                      weather.weather[0].description.slice(1)}
                </Typography>
                <Typography component="div">
                  <Typography
                    component="div"
                    sx={{ display: "flex", marginTop: 2 }}
                  >
                    <ThunderstormIcon />
                    <Typography variant="subtitle1" sx={{ marginLeft: 3 }}>
                      {weather?.rain?.["1h"]}mm
                    </Typography>
                  </Typography>
                  <Typography component="div" sx={{ display: "flex" }}>
                    <NearMeIcon />
                    <Typography variant="subtitle1" sx={{ marginLeft: 3 }}>
                      {weather?.wind?.speed}m/s S
                    </Typography>
                  </Typography>
                  <Typography component="div" style={{ marginTop: 2 }}>
                    <Typography variant="subtitle1">
                      Humidity: <span>{data?.current?.humidity}</span>%
                    </Typography>
                  </Typography>
                  <Typography component="div">
                    <Typography variant="subtitle1">
                      Dew point: {Math.floor(data?.current?.dew_point)}°C
                    </Typography>
                  </Typography>
                  <Typography component="div">
                    <Typography variant="subtitle1">
                      Pressure: {data?.current?.pressure}Pa
                    </Typography>
                  </Typography>
                  <Typography component="div">
                    <Typography variant="subtitle1">
                      UV: {Math.floor(data?.current?.uvi)}
                    </Typography>
                  </Typography>
                  <Typography component="div">
                    <Typography variant="subtitle1">
                      Visibility: {data?.current?.visibility / 1000}km
                    </Typography>
                  </Typography>
                </Typography>
              </Typography>
            </Typography>
            <Typography variant="h5" style={{ marginTop: 20, marginBottom: 4 }}>
              Hourly forecast
            </Typography>
            <Typography
              component="div"
              className="bg-neutral-100 rounded-md p-3 mt-2"
              style={{ overflowX: "scroll" }}
            >
              <HorizontalBars
                dataset={formatWeatherDataForChart(
                  data?.hourly.slice(0, 8) || []
                )}
              />
            </Typography>
            <Typography component="div">
              <Typography
                variant="h5"
                style={{ marginTop: 30, marginBottom: 10 }}
              >
                8-day forecast
              </Typography>
              {next8Days.map((eachItem, index) => (
                <>
                  <Typography
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: 25,
                      marginTop: 15,
                      cursor: "pointer",
                    }}
                    component="div"
                    className={
                      expandedIndex === index
                        ? "bg-neutral-100 p-3 rounded-md"
                        : `border-4 border-neutral-300 hover:bg-neutral-100 rounded-md p-3`
                    }
                    onClick={() => setExpandedIndex(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {eachItem.date}
                    <div style={{ display: "flex" }}>
                      <CloudIcon />
                      <p style={{ marginLeft: 10 }}>
                        {Math.floor(eachItem.forecast.feels_like.eve)} /{" "}
                        {Math.floor(eachItem.forecast.feels_like.morn)}°C{" "}
                      </p>
                    </div>
                    <div>
                      <p>
                        {eachItem.forecast?.weather?.[0]?.description &&
                          eachItem.forecast.weather[0].description
                            .charAt(0)
                            .toUpperCase() +
                            eachItem.forecast.weather[0].description.slice(1)}
                      </p>
                    </div>
                  </Typography>
                  {expandedIndex === index && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 5,
                      }}
                    >
                      <Typography
                        component="div"
                        className={`border-4 border-neutral-300 border-t-neutral-100 rounded-md p-3 `}
                      >
                        <Typography component="div">
                          <Typography component="div" sx={{ display: "flex" }}>
                            <CloudIcon />
                            <Typography
                              variant="subtitle1"
                              component="div"
                              style={{ marginLeft: 4 }}
                            >
                              {Math.floor(eachItem.forecast?.temp?.day)}°C
                            </Typography>
                          </Typography>
                          <Typography>
                            Feels Like{" "}
                            {Math.floor(eachItem.forecast.feels_like.day)}°C.{" "}
                            {eachItem.forecast.weather?.[0]?.description &&
                              eachItem.forecast.weather[0].description
                                .charAt(0)
                                .toUpperCase() +
                                eachItem.forecast.weather[0].description.slice(
                                  1
                                )}
                          </Typography>
                          <Typography
                            component="div"
                            sx={{ display: "flex", marginTop: 2 }}
                          >
                            <ThunderstormIcon />
                            <Typography
                              variant="subtitle1"
                              sx={{ marginLeft: 3 }}
                            >
                              {eachItem.forecast.rain}mm
                            </Typography>
                          </Typography>
                          <Typography
                            component="div"
                            sx={{ display: "flex", marginTop: 2 }}
                          >
                            <NearMeIcon />
                            <Typography
                              variant="subtitle1"
                              sx={{ marginLeft: 3 }}
                            >
                              {eachItem.forecast.wind_speed}m/s S
                            </Typography>
                          </Typography>
                          <Typography component="div" style={{ marginTop: 2 }}>
                            <Typography variant="subtitle1">
                              Humidity:{" "}
                              <span>{eachItem.forecast.humidity}</span>%
                            </Typography>
                          </Typography>
                          <Typography component="div">
                            <Typography variant="subtitle1">
                              Dew point:{" "}
                              {Math.floor(eachItem.forecast.dew_point)}°C
                            </Typography>
                          </Typography>
                          <Typography component="div">
                            <Typography variant="subtitle1">
                              Pressure: {eachItem.forecast.pressure}Pa
                            </Typography>
                          </Typography>
                          <Typography component="div">
                            <Typography variant="subtitle1">
                              UV: {eachItem.forecast.uvi}
                            </Typography>
                          </Typography>
                          <Typography
                            component="div"
                            style={{
                              display: "flex",
                              alignItems:
                                window.innerWidth < 520 ? "start" : "center",
                              marginTop: 10,
                              flexWrap: "wrap",
                              flexDirection:
                                window.innerWidth < 520 ? "column" : "row",
                            }}
                          >
                            <h6>TEMPERATURE</h6>
                            <div
                              style={{
                                display: "flex",
                                gap: window.innerWidth < 520 ? 10 : 50,
                                flexDirection:
                                  window.innerWidth < 520 ? "column" : "row",
                              }}
                            >
                              {[
                                "empty",
                                "Morning",
                                "Afternoon",
                                "Evening",
                                "Night",
                              ].map((item) => (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <p>{item === "empty" ? "" : item}</p>
                                  <p>
                                    {item === "empty"
                                      ? ""
                                      : item === "Morning"
                                      ? eachItem.forecast.temp.morn
                                      : item === "Afternoon"
                                      ? eachItem.forecast.temp.day
                                      : item === "Evening"
                                      ? eachItem.forecast.temp.eve
                                      : eachItem.forecast.temp.night}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </Typography>
                        </Typography>
                      </Typography>
                    </div>
                  )}
                </>
              ))}
            </Typography>
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default WeatherPage;
