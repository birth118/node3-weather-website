const request = require('request')

// place_name -> Geocode 
const getGeoCode = (location, fn)  =>{

    const actionToken = 'pk.eyJ1IjoiYmlydGgxMTgiLCJhIjoiY2syNDB6bmVyMXoyZzNwdWdtOXliemV0biJ9.mk-R_Lrfdym_xokLzRRvAA'
    const cityToFind =  encodeURIComponent(location)   // will stop the crash in the case 'location' includes specical character like ?.   
                                                       //? becomes $3F

    options='&limit=1'
    
    const url =`http://api.mapbox.com/geocoding/v5/mapbox.places/${cityToFind}.json?access_token=${actionToken}${options}`
 
    request({url, json:true},(error, response)=>{


        if(error){      // low level
            fn('Error: Unable to use geocode service')
        }else if(response.body.features.length < 1 ){     //Http Error
            fn('Http Error: Unable to find the location: ' + cityToFind)
        }else{
            const feature = response.body.features[0]
            const place_name = feature.place_name
            const center = feature.center
                        
            fn(undefined, {place_name, center})

        }


    })
}

// Geocode -> place_name
const getReverseGeoCode = (coords, fn)  =>{

    const actionToken = 'pk.eyJ1IjoiYmlydGgxMTgiLCJhIjoiY2syNDB6bmVyMXoyZzNwdWdtOXliemV0biJ9.mk-R_Lrfdym_xokLzRRvAA'
   // const cityToFind =  encodeURIComponent(location)   // will stop the crash in the case 'location' includes specical character like ?.   
                                                       //? becomes $3F

   // options='&limit=1'
    
    // https://api.mapbox.com/geocoding/v5/mapbox.places/151.099441,-33.702873499999.json?access_token=actionToken

    const url =`http://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${actionToken}`
 
    request({url, json:true},(error, response)=>{


        if(error){      // low level
            fn('Error: Unable to use geocode service')
        }else if(response.body.features.length < 1 ){     //Http Error
            fn('Http Error: Unable to find the location: ' + cityToFind)
        }else{
            const numberOfplaces = response.body.features.length
            const feature = numberOfplaces>=2? response.body.features[1]:response.body.features[0]
            const place_name = feature.place_name
            const center = feature.center
                        
            fn(undefined, place_name)

        }


    })
}

module.exports = {getGeoCode, getReverseGeoCode}