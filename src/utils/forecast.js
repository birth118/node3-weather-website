const request = require('request')
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
            // const msg = `${chalk.green(body.daily.data[0].summary)} ${chalk.bgGreen(timezone)}: It is currently ${chalk.green(celcisusFixed)} degrees hot and chance of rain is ${chalk.blue(chanceOfRain)}%`
            const msg = `${body.daily.data[0].summary} ${timezone}: It is currently ${celcisusFixed} degrees hot and chance of rain is ${chanceOfRain}%`

            fn(undefined, msg)

        }

    })
}

module.exports = forecast