// client side JS that runs in the browser

console.log('client side js loaded')

// fetch('http://puzzle.mead.io/puzzle',{}).then((response)=>{
//     response.json().then((data)=>{
//         console.log(data)
//     })
// })

// fetch('http://localhost:3000/weather?address=New York',{}).then((response)=>{
//     response.json().then((data)=>{
//         if(data.error){
//             console.log(data.error)    
//         }else{
//             console.log(data.location)
//             console.log(data.weather )
//         }

//     })
// })

const getWeather=(location, fn)=>{

    //const url = 'http://localhost:3000/weather?address='+location
    const url = '/weather?address='+location    //To be used in PROD environment
    fetch(url).then((reponse)=>{
        reponse.json().then((data)=>{
            if(data.error){
                fn(data.error)
            }else{
                fn(undefined, data)
            }
        })
    })
}

const getWeatherGeo=(coords, fn)=>{

    // http://localhost:3000/weatherGeocode?longitude=151.0994418&latitude=-33.702873499999
    const url = `/weatherGeocode?longitude=${coords.longitude}&latitude=${coords.latitude}`
    fetch(url).then((reponse)=>{
        reponse.json().then((data)=>{
            if(data.error){
                fn(data.error)
            }else{
                fn(undefined, data)
            }
        })
    })
}

const weatherForm = document.querySelector('form')
const search  = document.querySelector('input')
const msg1El  = document.querySelector('#msg-1')
const $sendButton = document.querySelector('#sendMocation')

const divEl  = document.querySelector('#msg-2345')
const msg2El = document.createElement('p')
const msg3El = document.createElement('p')
const msg4El = document.createElement('p')
const msg5El = document.createElement('p')

$sendButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Browser does not suopprt geolocation')
    }
    msg1El.textContent='Searching...'
    divEl.innerHTML =''

    navigator.geolocation.getCurrentPosition((postion, err)=>{
        if(err){
            return alert('Error: getCurrentPosition():', err)
        }
        getWeatherGeo(postion.coords,(error, data)=>{
            if(error){
                msg1El.textContent = error
            }else{
                console.log(data)
                msg1El.textContent=data.location
                msg2El.textContent=data.weather.summaryMsg
                msg3El.textContent=data.weather.detailMsg
                msg4El.textContent=data.weather.lowMsg
                msg5El.textContent=data.weather.highMsg
                divEl.appendChild(msg2El)
                divEl.appendChild(msg3El)
                divEl.appendChild(msg4El)
                divEl.appendChild(msg5El)
  
            }
        })
    })


 
})

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location = search.value.trim()
    msg1El.textContent='Searching...'
    divEl.innerHTML =''

//    console.log(location)
    getWeather(location,(error, data)=>{
        if(error){
           // console.log(error)
            msg1El.textContent=error
        }else{
            console.log(data)
            msg1El.textContent=data.location
            msg2El.textContent=data.weather.summaryMsg
            msg3El.textContent=data.weather.detailMsg
            msg4El.textContent=data.weather.lowMsg
            msg5El.textContent=data.weather.highMsg
            divEl.appendChild(msg2El)
            divEl.appendChild(msg3El)
            divEl.appendChild(msg4El)
            divEl.appendChild(msg5El)

        }
    })

})


