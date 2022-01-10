const express = require('express');
const server = express()
const tf = require("@tensorflow/tfjs")
const use = require('@tensorflow-models/universal-sentence-encoder');
const { performance } = require('perf_hooks')
const cors = require('cors')
var toPredict;
var ec;
var sentencetypemodel;
var sentimentmodel;
var embeddings;
var prediciton;
var sortedArray;
var d;
var data;
var sentence;
var output;
var time;
var t1;
var t2;
var type;
var sentiment;
var toxicity;
var tense;
var tensemodel;
var toxicmodel;


require("@tensorflow/tfjs-node")
server.use(express.json())

server.use(cors())

server.get("/", (req,res)=>{
  res.sendfile('index.html')
})


server.post("/sentencetype", async function (req,reply){
  t1 = performance.now()
  toPredict = req.body.sentence;
  console.log(time)
  if (toPredict === undefined){
    reply.status(420).send("Sentence Needed")
    console.log(req.body)
    return;
  }
  console.log(toPredict)
  if (toPredict.split(" ").length<=1){
    reply.status(422).send("Only 1 Word Provided or no word")
    return;
  }
  embeddings = await ec.embed([toPredict])
  prediction = await sentencetypemodel.predict(embeddings)
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  sentence = data.indexOf(sortedArray[0]).toString().replace("0","Declarative").replace("1","Interrogative").replace("2","Exclamatory").replace("3","Imperative")

  t2 = performance.now()
  time = t2-t1;
  output = {yoursentence:toPredict,
  prediction:sentence,
  confidence:sortedArray[0],
  otherconfidences:sortedArray,
  time: time}
  reply.send(output)
});

server.post("/sentiment", async function (req,reply){
  toPredict = req.body.sentence;
  if (toPredict === undefined){
    reply.status(420).send("Sentence Needed")
    console.log(req.body)
    return;
  }
  console.log(toPredict)
  if (toPredict.split(" ").length<=1){
    reply.status(422).send("Only 1 Word Provided or no word")
    return;
  }
  embeddings = await ec.embed([toPredict])
  prediction = await sentimentmodel.predict(embeddings)
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  sentence = data.indexOf(sortedArray[0]).toString().replace("0","Positive").replace("1","Negative").replace("2","Neutral")

  const output = {yoursentence:toPredict,
  prediction:sentence,
  confidence:sortedArray[0],
  otherconfidences:sortedArray,
  time: time}
  reply.send(output)
})

server.get("/test",(req,reply)=>{
  reply.send("success");
})


//
server.post("/all", async function (req,reply){

  t1 = performance.now()
  toPredict = req.body.sentence;
  if (toPredict === undefined){
    reply.status(420).send("Sentence Needed")
    console.log(req.body)
    return;
  }
  console.log(toPredict)
  if (toPredict.split(" ").length<=1){
    reply.status(422).send("Only 1 Word Provided or no word")
    return;
  }

  embeddings = await ec.embed([toPredict])
  prediction = await sentimentmodel.predict(embeddings) //
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  sentiment = data.indexOf(sortedArray[0]).toString().replace("0","Positive").replace("1","Negative").replace("2","Neutral")

  prediction = await sentencetypemodel.predict(embeddings) //
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  type = data.indexOf(sortedArray[0]).toString().replace("0","Declarative").replace("1","Interrogative").replace("2","Exclamatory").replace("3","Imperative")
  
  prediction = await tensemodel.predict(embeddings) //
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  tense = data.indexOf(sortedArray[0]).toString().replace("0","Future").replace("1","Past").replace("2","Present")

  prediction = await toxicmodel.predict(embeddings) //
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a});
  toxicity = data.indexOf(sortedArray[0]).toString().replace("0","Toxic").replace("1","Very Toxic").replace("2","Polite");

  t2 = performance.now()

  output = {
    type: type,
    sentiment: sentiment,
    toxicity: toxicity,
    tense: tense,
    responseTime: t2-t1
  }

  reply.send(output);
  
})


server.post("/tense", async function (req,reply){
  toPredict = req.body.sentence;
  if (toPredict === undefined){
    reply.status(420).send("Sentence Needed")
    console.log(req.body)
    return;
  }
  console.log(toPredict)
  if (toPredict.split(" ").length<=1){
    reply.status(422).send("Only 1 Word Provided or no word")
    return;
  }
  embeddings = await ec.embed([toPredict])
  prediction = await tensemodel.predict(embeddings)
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  sentence = data.indexOf(sortedArray[0]).toString().replace("0","Future").replace("1","Past").replace("2","Present")

  const output = {yoursentence:toPredict,
  prediction:sentence,
  confidence:sortedArray[0],
  otherconfidences:sortedArray,
  time: time}
  reply.send(output)
});


server.post("/toxicity", async function (req,reply){
  toPredict = req.body.sentence;
  if (toPredict === undefined){
    reply.status(420).send("Sentence Needed")
    console.log(req.body)
    return;
  }
  console.log(toPredict)
  if (toPredict.split(" ").length<=1){
    reply.status(422).send("Only 1 Word Provided or no word")
    return;
  }
  embeddings = await ec.embed([toPredict])
  prediction = await toxicmodel.predict(embeddings)
  sortedArray = await prediction.data()
  d = await prediction.data()
  data = [...d]
  sortedArray.sort(function(a,b){return b-a})
  sentence = data.indexOf(sortedArray[0]).toString().replace("0","Toxic").replace("1","Very Toxic").replace("2","Polite");

  const output = {yoursentence:toPredict,
  prediction:sentence,
  confidence:sortedArray[0],
  otherconfidences:sortedArray,
  time: time}
  reply.send(output)
});

server.listen(3000, async function(){
  console.log("Server is ready")
  ec = await use.load();
  sentencetypemodel = await tf.loadLayersModel('file://sentencetype1.json');
  sentimentmodel = await tf.loadLayersModel('file://sentiment1.json')
  tensemodel = await tf.loadLayersModel('file://sc2.json')
  toxicmodel = await tf.loadLayersModel('file://toxicity.json')
  console.log("All Models Loaded")
})
