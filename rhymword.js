const axios = require('axios');
const express = require('express');
const app=express();
const path = require('path');
const df = require('dialogflow-fulfillment');
const PORT = process.env.PORT || 5115

app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});




app.post('/', express.json(), (req,res)=>{
  const agent = new df.WebhookClient({
    request: req,
    response : res
  });

  //console.log('[****]');
  function rhymData(result){
    let count = 0;
    let str = "";
    console.log("Im in rhymData...../... ");
    return new Promise(resolve=>{
            result.data.map(wordObj => {
              console.log("[*]",wordObj.word);
              str = str + `${wordObj.word}, `;
              console.log("[+]",count === result.data.length-1);
              if(count === result.data.length-1){
                resolve(str);
              }
              count++;
              // agent.end(`${wordObj.word}`);
            });
          });
    // });
  }
  
    function rhymHandler(agent){
      const word = agent.parameters.word;
      console.log("its is rhym handler .... ",word);
      return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
      .then((result) => {
        return rhymData(result).then(res=>{
          agent.add(`Here are the rhyming words for ${word}`);
          agent.add(res);
          console.log("res",res);
        });
      }).catch(err=>{
        console.log(err);
        agent.add("Something went wrong");
      });
    }


    var intentMap = new Map();
    intentMap.set('UserProvidesWord',rhymHandler)
    agent.handleRequest(intentMap);
    agent.add("sorry for inconvinience of time.");
    //console.log('[++++]');
    


});


app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`));
