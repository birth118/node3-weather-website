const path = require('path')
const express = require('express')
const hbs = require('hbs')
const {getGeoCode, getReverseGeoCode}  = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000   // Either to use Heroku to give or locally 3000

// To define paths for Express config
const publicDir= path.join(__dirname, '../public')  // __dirname -> current directory
const viewsPath = path.join(__dirname,'../templates/views')   // Configured '../templates' folder instead of 'views' folder which is default
const partialsPath = path.join(__dirname,'../templates/partials')

// To set up handlebars engine and views location (via Express)
app.set('view engine','hbs')        //hanndlebars setup. It expects a single folder 'view' containing all tmaplates
app.set('views',viewsPath)          //To tell Express to use viewsPath instead of (default) 'views'folder.
hbs.registerPartials(partialsPath)  // Partials are here

// to set up static directory to serve
app.use(express.static(publicDir))  // Still required. This will refer static reosurces such as images, 


//app.com   - 4 routes
//app.com/help
//app.com/about 
//app.com/weather
 
app.get('',(req, res)=>{             // do route for app.com 
     //res.send('<h2>Wanna!</h2>')
     res.render('index', {
         title: 'Weather',
         name: 'Pete_Y'
     })            //This will pick index.hbs and inject the object

 })

 app.get('/about',(req, res)=>{             // do route for app.com /about
    //res.send('<h2>Wanna!</h2>')
    res.render('about', {
        title: 'About',
        name: 'Pete_Y'
    })            //This will pick index.hbs and inject the object

})

app.get('/help',(req, res)=>{  
    res.render('help',{
        title: 'Help (헬프)',
        msg: '찬구가 도움이 될까?',
        name: 'Pete_Y'
        })
})


app.get('/products', (req, res)=>{

    if(!req.query.search){          //Query string  ../product?search=game
        return res.send({
            error: 'Must provide the search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

// This route is to be used API for weather endpoint. 
// API program will call 'http://localhost:3000/weather?address=Sydney
app.get('/weather', (req, res)=>{
    if(!req.query.address){          //Query string  ../weather?address=Sydney
        return res.send({
            error: 'Must provide the address'
        })
    }

    getGeoCode(req.query.address,(error,data)=>{
        if(error){
            return res.send({error})
        }
        forecast(data.center[0], data.center[1], (error,forecastData)=>{
            const location = data.place_name
            if(error){
                return res.send({error})
            }
            res.send({
                address:req.query.address,
                location,
                weather: forecastData
            })

        })
    })


})


// http://localhost:3000/weatherGeocode?longitude=151.0994418&latitude=-33.702873499999995
//longitude = '127', latitude ='37.58333'
// latitude: -33.702873499999995
// longitude: 151.0994418

app.get('/weatherGeocode',(req, res)=>{
    if(!req.query.longitude || !req.query.latitude){
        return res.send({
            error: 'Must provide logitude and latitue'
        })
    }

    const longitude  = req.query.longitude 
    const latitude  = req.query.latitude

    getReverseGeoCode({longitude, latitude},(error, data)=>{
        if(error){
            return res.send({error})
        }else{
            forecast(longitude,latitude, (err, forecastData)=>{
                const location = data
                if(err){
                    return res.send({err})
                }
                res.send({
                    address: 'Where City',
                    location,
                    weather: forecastData
                })
            })
        }

    })

})


app.get('/help/*',(req,res)=>{                  // to catch all under /Help
//    res.send('<h1>Help is not found</h1>')
    res.render('404',{                          // to pcik 404.hbs handlebars file
        title: '404',
        errorMsg: 'Help article not found',
        name: 'Pete_Y'
        })    
})

app.get('*',(req, res)=>{  // To be here for last for 404 page ('*' = everything else)
//    res.send('<h1>404 go back</h1>')
    res.render('404',{
        title: '404',
        errorMsg: 'Page Not found',
        name: 'Pete_Y'
        })
})

app.listen(port, ()=>{
    console.log('Server is up on port', port)
})
