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

    const url = 'http://localhost:3000/weather?address='+location
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
const msg2El  = document.querySelector('#msg-2')

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location = search.value.trim()
    msg1El.textContent='Searching...'
    msg2El.textContent=''
//    console.log(location)
    getWeather(location,(error, data)=>{
        if(error){
           // console.log(error)
            msg1El.textContent=error
        }else{
            msg1El.textContent=data.location
            msg2El.textContent=data.weather
        }
    })

})


