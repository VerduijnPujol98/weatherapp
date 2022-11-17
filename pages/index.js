import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import styles from '../styles/Home.module.css'
const axios = require("axios");
import {Box, Button, Card, Container, createStyles, Group, Input, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import Lottie from "lottie-react";
import cloudanimation from '../components/102873-clouds-loop.json'
import partlycloudy from '../components/50651-cloudy.json'
import patchyrain from '../components/50653-the-rain-turned-fine.json'
import moderaterain from '../components/50655-moderate-rain.json'
import heavyrain from '../components/50656-heavy-rain.json'
import sunny from '../components/50649-sunny.json'
require('datejs');


const useStyles = createStyles((theme) =>({
  item:{
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: 'box-shadow 150ms ease, transform 150ms ease',
    backgroundColor: 'white',

    '&:hover': {
      boxShadow: theme.shadows.lg,
      transform: 'scale(1.05)'
    }
  },

  outer:{
    position:'relative',
  },

  inner:{
    position:'absolute',
    top: -100,
    zIndex:-2
  }
}))

export default function Home({onSearchChange}) {

  const { classes } = useStyles()

  const [data, setData ] = useState("Thisted")
  const [search, setSearch] = useState("Thisted")
  const [error, setError] = useState(false)
  const [forecast, setForecast ] = useState("")

  const [cityname, setCityname] = useState("")
  const [countryname, setCountryname] = useState("")
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")


  
  
  const inputChange = (search) => {

    const optionsgeo = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3f4f4232d3mshca92a6118a8f3c9p14afccjsn1b3610ddad0b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    };
    
    if (search.length > 0 ) {
      console.log(data)
      fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search}`, optionsgeo)
      .then(response => response.json())
      .then(response => setData(response))
      .catch(err => console.error(err));
      console.log(data)

    }
    setSearch(search)
    
  }

  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {q: `${lat},${long}`,days: '3'},
    headers: {
      'X-RapidAPI-Key': '3f4f4232d3mshca92a6118a8f3c9p14afccjsn1b3610ddad0b',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  
  axios.request(options).then(function (response) {
    setForecast(response.data)
  }).catch(function (error) {
    console.error(error);
  });

  

  return (
    <div className={classes.outer}>
        <Lottie animationData={cloudanimation} loop={true} className={classes.inner}/>
        <Container mt={100} sx={{display:'flex', flexDirection:'column'}}>
          <Input.Wrapper label='Choose your City'>
            <Input placeholder='Begin Typing' value={search} onChange={(e) => inputChange(e.target.value)} />
          </Input.Wrapper>
        {data.data?.map((data, i) => {
          return(
            <>
            <UnstyledButton 
            className={classes.item} 
            withBorder mt={50} 
            shadow='md' 
            p='lg'
            onClick={() => {
              setCountryname(data.country)
              setCityname(data.city)
              setLat(data.latitude)
              setLong(data.longitude)
              setSearch("")
              setData("")
              console.log(data)
            }}
            >
              <Text size='md'>
                {data.city}
              </Text>
              <Text size='sm' color='dimmed'>
                {data.country}
              </Text>
            </UnstyledButton>
            </>
          )
        })}
        <Card mt={100} p={40} shadow='xl' radius='lg'>
          <Text sx={{fontSize:42, fontWeight:900}}>3 Day Forecast</Text>
          <Group mt={30}>
            <Text sx={{fontSize:24, fontWeight:300}}>{cityname}</Text>
            <Text sx={{fontSize:24, fontWeight:600}}>{countryname}</Text>
          </Group>
          <SimpleGrid cols={3}>
            {forecast.forecast?.forecastday.map((data, i) => {
              return(
                <>
                <Card sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Text sx={{fontSize:28, fontWeight:300}}>
                  {new Date(data.date).toString('ddd')}
                 </Text>
                 <Box>
                    {(() => {if(data.day.condition.code == 1003) {
                      return(
                        <Lottie animationData={partlycloudy} style={{width:100}} loop={true}/>
                      ) 
                    } else {
                      if(data.day.condition.code == 1063) {
                        return(
                          <Lottie animationData={patchyrain} style={{width:100}} loop={true}/>
                        )
                    } else {
                      if (data.day.condition.code == 1189) {
                        return(
                          <Lottie animationData={moderaterain} style={{width:100}} loop={true}/>
                          )
                    } else {
                      if (data.day.condition.code == 1195) {
                        return(
                          <Lottie animationData={heavyrain} style={{width:100}} loop={true}/>
                        )
                    } else {
                      if (data.day.condition.code == 1000) {
                        return(
                          <Lottie animationData={sunny} style={{width:100}} loop={true}/>
                        )
                    }

                    }
                    }
                      }
                    }
                    
                    })()}
                  </Box>
                 <Group>
                  <Text sx={{fontWeight:700}}>
                    {data.day.maxtemp_c}
                  </Text>
                  <Text color='dimmed'>
                    {data.day.mintemp_c}
                  </Text>
                 </Group>
                </Card>
                </>
              )
            })}
          </SimpleGrid>
        </Card>
        </Container>
    </div>
  )
}
