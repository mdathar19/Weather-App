// require('dotenv').config();
// import {dotenv} from 'dotenv';
import fs from 'fs';
import http from 'http';
import request from 'requests';


const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempVal%}", parseInt(orgVal.main.temp/10));
    temperature = temperature.replace("{%tempMin%}", parseInt(orgVal.main.temp_min/10));
    temperature = temperature.replace("{%tempMax%}", parseInt(orgVal.main.temp_max/10));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%weather%}", orgVal.weather[0].main);

    return temperature
}

const server = http.createServer((req, res) => {
    if (req.url === "/") {
     request("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=ec9d36c0db1b6ec3a879f22bed48936c")
     .on("data",(chunk)=>{
        const objData = JSON.parse(chunk)
        const arrData = [objData]
        console.log(arrData)
        const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("")
        res.write(realTimeData)
        // console.log(realTimeData)
     })   
     .on("end",(err)=>{
        if(err)return console.log("not Found")
        // console.log("end")
        res.end();
     })
     
    }
    
})

server.listen(8080);
