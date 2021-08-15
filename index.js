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
  function employeeHandler(agent){
    const first = agent.parameters.first_name;
     const last = agent.parameters.last_name;
     //agent.add(first);
      return axios.get(`https://api10.successfactors.com/odata/v2/EmpEmployment?$format=json&custompagesize=1000&paging=cursor&$select=personIdExternal,userId,userNav/empId,userNav/defaultFullName,userNav/businessPhone,jobInfoNav/managerId,jobInfoNav/managerUserNav/defaultFullName,jobInfoNav/jobTitle,jobInfoNav/departmentNav/description&$expand=userNav,jobInfoNav/jobCodeNav,jobInfoNav/managerUserNav,jobInfoNav/departmentNav&$filter=jobInfoNav/emplStatus eq '1821' and (userNav/firstName like 'Rishabh%' and userNav/lastName like 'Goyal%')')`,{
  auth: {
    username: '80174@C0017935023T1',
    password: 'Flipkart@123'
  }
}).then((result) => {
        
        const fullName=result.data.d.results[0].jobInfoNav.results.jobTitle;
        console.log("job titleeeeeee",fullName);
         var response=`job title of ${first} is ${fullName}`;
  		agent.add(response);
    });
   }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('weather', weatherHandler);
  intentMap.set('finding names',employeeHandler);
  
  agent.handleRequest(intentMap);
});
