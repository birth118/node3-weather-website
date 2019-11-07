const request = require('request')
const moment = require('moment')

//const chalk  = require('chalk')

const forecast=(longitude = '127', latitude ='37.58333', fn)=>{      // by default, Seoul
            
    let options = '?lang=ko'

    const url = `https://api.darksky.net/forecast/ca1800ca908f21879d80768a121f7d34/${latitude},${longitude}${options}`
    //https://api.darksky.net/forecast/[key]/[latitude],[longitude]

    request({url, json:true }, (error, {body})=>{

        if(error){
            fn(`App Error: cannot connect weather service`)  // This 'error' captures low level error like OS-related.
                                                     // Doesnot capture the http stauts such as 400 status code
        }else if(body.error){
            const httpStatus = body.code
            const httpError = body.error
            fn(`Http Error: ${httpStatus}: ${chalk.red(httpError)}`)  
        }else{
            const timezone = body.timezone 
            const data = body.currently
            const celcisus = (data.temperature - 32) * 5 / 9
            const celcisusFixed = Number.parseFloat(celcisus).toFixed(1)
            const chanceOfRain = data.precipProbability
            const day0 = body.daily.data[0]
            const summary = day0.summary
            const temperatureHigh = day0.temperatureHigh
            const temperatureHighTime = day0.temperatureHighTime
            const temperatureLow = day0.temperatureLow
            const temperatureLowTime = day0.temperatureLowTime

            // const msg = `${chalk.green(body.daily.data[0].summary)} ${chalk.bgGreen(timezone)}: It is currently ${chalk.green(celcisusFixed)} degrees hot and chance of rain is ${chalk.blue(chanceOfRain)}%`
            const summaryMsg = `${summary} (${timezone})`
            const detailMsg = `It is currently ${celcisusFixed} degrees hot and chance of rain is ${chanceOfRain}%`
            const lowMsg = `Day low: ${convertToCelcius(temperatureLow)} at ${convertUnixtime(temperatureLowTime)}`
            const highMsg = `Day high: ${convertToCelcius(temperatureHigh)} at ${convertUnixtime(temperatureHighTime)}`           

            fn(undefined, {summaryMsg, detailMsg, lowMsg, highMsg})

        }

    })
}

const convertToCelcius = (fahrenheight) =>{
    const celcius = (fahrenheight - 32) * 5 / 9
    return Number.parseFloat(celcius).toFixed(1)
}

const convertUnixtime = (unix) =>{
    const time = moment.unix(unix)
    return time.format('HH:mm MM/DD')
}


module.exports = forecast