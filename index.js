// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 const axios = require('axios');

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
	function weatherHandler(agent) {
  
    const city = agent.parameters["geo-city"];
       console.log(city);
 return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=36e9c613f1ddedc9c671b70527a3e339`)
    .then((result) =>{
   console.log("minm temp data:",result.data.main.temp_min);
       	console.log("maxm temp data:",result.data.main.temp_max);
        var confirmed=result.data.main.temp_min;
        var recovered=result.data.main.temp_max;
        var bot_response=`The data for ${city} is temp max:${recovered} and temp min:${confirmed} `;
        agent.add(bot_response);
    });
    }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('weather', weatherHandler);
  intentMap.set('finding names',employeeHandler);
  
  agent.handleRequest(intentMap);
});
