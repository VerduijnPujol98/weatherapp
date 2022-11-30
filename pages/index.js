const axios = require("axios");
import {
  Box,
  Button,
  Card,
  createStyles,
  Grid,
  Group,
  Input,
  Paper,
  Select,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { LottiePlayer } from "lottie-react";
import { useState } from "react";
import Lottie from "lottie-react";
import overcast from "../components/50652-overcast.json";
import lightdrizzle from "../components/50654-light-rain.json";
import cloudy from "../components/50651-cloudy.json";

import { AnimatePresence, motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { IconCloudRain, IconDropCircle, IconDroplet, IconSunHigh, IconTemperatureMinus, IconTemperaturePlus, IconWind } from "@tabler/icons";

require("datejs");

const useStyles = createStyles((theme) => ({
  gridthing: {
    height: "100vh",
  },

  item: {
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: "box-shadow 150ms ease, transform 150ms ease",
    backgroundColor: "white",
    width: "100%",

    "&:hover": {
      boxShadow: theme.shadows.lg,
      transform: "scale(1.05)",
    },
  },

  switch: {
    width: "100%",
    height: "100px",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "flex-start",
    padding: "10px",
    cursor: "pointer",
  },

  handle: {
    backgroundColor: "white",
    borderRadius: "40px",
  },

  active: {
    width: 180,
    height: 280,
  },
}));

export default function Home() {
  const { classes, cx } = useStyles();

  const [search, setSearch] = useState("Thisted");
  const [city, setCity] = useState([]);
  const [citylatitude, setLatitude] = useState("");
  const [citylongitude, setLongitude] = useState("");
  const [weather, setWeather] = useState("");
  const [hourly, setHourly] = useState([0])
  const [forecast, setForecast ] = useState([])

  const [isShown, setIsShown] = useState(true);

  const [isActive, setActive] = useState(false);

  const toggleClass = (event) => {
    setActive(event.target.id);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.5,
      },
    },
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const listItem = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const inputChange = (search) => {
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: { namePrefix: `${search}` },
      headers: {
        "X-RapidAPI-Key": "3f4f4232d3mshca92a6118a8f3c9p14afccjsn1b3610ddad0b",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    if (search.length > 0) {
      console.log("works");

      fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search}`,
        options
      )
        .then((response) => response.json())
        .then((response) => setCity(response))
        .catch((err) => console.error(err));
      console.log(city);
    }

    setSearch(search);
  };

  const labels = hourly?.map((data, i) => {
    return(
      new Date(data.time).toString('HH')
    )
  });

  const datasets = {
    labels: labels,
    datasets: [
      {
        label: "Precipitation",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: hourly?.map((data, i ) => {
          return(         
            data.precip_mm
          )
        }),
      },
    ],
  };

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3f4f4232d3mshca92a6118a8f3c9p14afccjsn1b3610ddad0b",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  fetch(
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${citylatitude},${citylongitude}&days=3`,
    options
  )
    .then((response) => response.json())
    .then((response) => setWeather(response))
    .catch((err) => console.error(err));

  return (
    <div>
      <Grid>
        <Grid.Col className={classes.gridthing} span={4} m={30}>
          <Input
            placeholder="Search City"
            onClick={() => {
              setIsShown(false);
            }}
            value={search}
            onChange={(e) => {
              inputChange(e.target.value);
            }}
          />
          {city.data?.map((data) => {
            return (
              <>
                <UnstyledButton
                  className={classes.item}
                  withBorder
                  mt={10}
                  shadow="md"
                  p="lg"
                  onClick={() => {
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                    setCity("");
                    setSearch("");
                    setIsShown(true);
                  }}
                >
                  <Text size="md">{data.city}</Text>
                  <Text size="sm" color="dimmed">
                    {data.country}
                  </Text>
                </UnstyledButton>
              </>
            );
          })}
          {isShown && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ease: "easeOut", duration: 0.4 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Card shadow="sm" p="lg" radius="md" withBorder mt={30}>
                  <Text fw={700} sx={{ fontSize: 38 }}>
                    {weather.location?.name}
                  </Text>
                  <Text fw={400} sx={{ fontSize: 18 }}>
                    {weather.location?.country}
                  </Text>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    {(() => {
                      if (weather.current?.condition.code === 1009) {
                        return (
                          <Lottie
                            animationData={overcast}
                            style={{ width: 150 }}
                            loop={true}
                          />
                        );
                      } else {
                        if (weather.current?.condition.code === 1183) {
                          return (
                            <Lottie
                              animationData={lightdrizzle}
                              style={{ width: 150 }}
                              loop={true}
                            />
                          );
                        } else {
                          if (weather.current?.condition.code === 1153) {
                            return (
                              <Lottie
                                animationData={lightdrizzle}
                                style={{ width: 150 }}
                                loop={true}
                              />
                            );
                          } else {
                            if (weather.current?.condition.code === 1240) {
                              return (
                                <Lottie
                                  animationData={lightdrizzle}
                                  style={{ width: 150 }}
                                  loop={true}
                                />
                              );
                            } else {
                              if (weather.current?.condition.code === 1063) {
                                return (
                                  <Lottie
                                    animationData={overcast}
                                    style={{ width: 150 }}
                                    loop={true}
                                  />
                                );
                              } else { 
                                if (weather.current?.condition.code === 1003) {
                                  return (
                                    <Lottie
                                      animationData={cloudy}
                                      style={{ width: 150 }}
                                      loop={true}
                                    />
                                  );
                                } 
                              }
                            }
                          }
                        }
                      }
                    })()}
                    <Text>{weather.current?.condition.text}</Text>
                    <Group mt={10}>
                      <Text fw={500}>Today</Text>
                      <Text fw={300}>
                        {new Date(Date.parse("t")).toString("dddd, MMMM dd")}
                      </Text>
                    </Group>
                    <Text mt={10} fw={700} sx={{ fontSize: 64 }}>
                      {weather.current?.temp_c}
                    </Text>
                  </Box>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </Grid.Col>

        <Grid.Col
          className={classes.gridthing}
          sx={{ backgroundColor: "whitesmoke" }}
          span="auto"
          p={35}
        >
          <Text fw={500}>3 Day Forecast</Text>
          {isShown && (
            <AnimatePresence>
              <motion.div variants={container} initial="hidden" animate="show">
                <Group mt={20}>
                  {weather.forecast?.forecastday.map((data, i) => {
                    return (
                      
                      <motion.div
                        key={i}
                        variants={listItem}
                        whileHover={{ scale: [null, 1.2, 1.1] }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className={classes.handle}
                          layout
                          transition={spring}
                        >
                          <Card
                            sx={{
                              borderRadius: 50,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            key={i}
                            id={i}
                            className={isActive == i ? classes.active : null}
                            onClick={(e) => toggleClass(e) + setForecast(data.day) + setHourly(data.hour) + console.log(hourly)}
                          >
                            <Text fw={500} sx={{ fontSize: 22 }}>
                              {new Date(data.date).toString("ddd")}
                            </Text>
                            <Text fw={300} sx={{ fontSize: 14 }}>
                              {new Date(data.date).toString("MMM dd")}
                            </Text>
                            {(() => {
                              if (data.day.condition.code == 1189) {
                                return (
                                  <Lottie
                                    animationData={lightdrizzle}
                                    style={{ width: 80 }}
                                    loop={true}
                                  />
                                );
                              } else {
                                if (data.day.condition.code == 1009) {
                                  return (
                                    <Lottie
                                      animationData={overcast}
                                      style={{ width: 80 }}
                                      loop={true}
                                    />
                                  );
                                } else {
                                  if (data.day.condition.code == 1063) {
                                    return (
                                      <Lottie
                                        animationData={overcast}
                                        style={{ width: 80 }}
                                        loop={true}
                                      />
                                    );
                                  }
                                }
                              }
                            })()}
                            <Text fw={500} sx={{ fontSize: 22 }}>
                              {data.day.maxtemp_c}
                            </Text>
                            <Text fw={300} sx={{ fontSize: 15 }}>
                              {data.day.mintemp_c}
                            </Text>
                          </Card>
                        </motion.div>                
                        

                      </motion.div>
                    );
                  })}
                </Group>
                <Text fw={500} mt={30}>Day's forecast</Text>
                <Line height={50} data={datasets} />
                
                <Group spacing={20} mt={20}>
                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconWind/>
                      <Text>Wind</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.maxwind_kph}</Text>
                  </Card>

                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconCloudRain/>
                      <Text>Rain</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.daily_chance_of_rain}%</Text>
                  </Card>

                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconSunHigh/>
                      <Text>UV</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.uv}</Text>
                  </Card>

                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconDroplet/>
                      <Text>Humid</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.avghumidity}%</Text>
                  </Card>

                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconTemperaturePlus/>
                      <Text>Temp</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.maxtemp_c}</Text>
                  </Card>

                  <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius: 25}}>
                    <Group >
                      <IconTemperatureMinus/>
                      <Text>Temp</Text>
                    </Group>
                    <Text sx={{fontSize:40, fontWeight:600}}>{forecast.mintemp_c}</Text>
                  </Card>

                  
                </Group>
              </motion.div>
            </AnimatePresence>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
