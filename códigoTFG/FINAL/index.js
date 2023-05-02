'use strict'

const path = require('path')
var mongoose = require('mongoose');
//var app = require('./app');
var port = process.env.PORT | 3000;
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const {WebhookClient} = require('dialogflow-fulfillment');

var aciertos = 0;
var errores = 0;
var preguntasTotales = 0;
var cuestionario = "";
var numPregunta = 1;


// Cargar rutas
const cuestionario_routes = require('./routes/cuestionario.routes');
const enunciado_routes = require('./routes/enunciado.routes');
const respuestaCorrecta_routes = require('./routes/respuestaCorrecta.routes');
const TodasPreguntas_routes = require('./routes/todasPreguntas.routes');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar cabeceras http

// Rutas base

app.use('/api/cuestionario', cuestionario_routes);
app.use('/api/enunciado', enunciado_routes);
app.use('/api/respuestaCorrecta', respuestaCorrecta_routes); 
app.use('/api/todasPreguntas', TodasPreguntas_routes); 

//var publicPath = path.resolve(__dirname, 'public');
app.use(express.static('public'));


//mongoose.set('strictQuery', true);

const Cuestionarios = require('./models/Cuestionario');
const Enunciados = require('./models/Enunciado');
const Respuestas = require('./models/RespuestaCorrecta');
const TodasPreguntas = require('./models/TodasPreguntas');

mongoose.connect('mongodb+srv://jfb:.Atlas@cluster0.yhazick.mongodb.net/Chatbot?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
},(err,res) => {
    if(err) return console.log("Error en la cadena de conexion a la bd ",err);
    console.log("BASE DE DATOS ONLINE");
} 
);

app.get("/", (req, res) => {
    return res.sendFile(path.resolve(__dirname, '/public/index.html'));
  
});
  
app.listen(port, () => {
    console.log(`Escuchando peticiones en el puerto ${port}`);
	
});

app.post("/webhook", express.json(), function (req, res) {
    const agent = new WebhookClient({ request:req, response:res });
    //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    //console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

    

    function Cuestionario(agent) {
        agent.add(`De acuerdo.`);
        agent.add(`¿Sobre que cuestionario quieres que te preguntemos? ¿Cuestionario 1, Cuestionario 2 o Cuestionario 3?`);
    }

    
    async function Cuestionario1(agent){
        preguntasTotales = 0;
        aciertos = 0;
        errores = 0;
        numPregunta = 1;

        agent.add(`De acuerdo. Para contestar las preguntas indica la letra de la pregunta. Por ejemplo: a o b. Si quieres terminar el cuestionario en cualquier momento hazmelo saber. Por ejemplo: "quiero terminar el cuestionario" o "terminar cuestionario"`);
        agent.add(`Mucha suerte!!!`);
        cuestionario = "Cuestionario 1";
        var id = await ObtenerIdCuestionario("Cuestionario 1");
        var pregunta = await ObtenerPregunta(id,numPregunta);
        //var respuestaCorrecta = await ObtenerRespuestaCorrecta(id,numPregunta);
        var respuestas = await ObtenerRespuestasPregunta(id,numPregunta);


        mostrarInfo(agent,pregunta,respuestas);
    }
    

    function mostrarInfo(agent,info,respuestasPregunta){
        
        agent.add("Pregunta " + numPregunta + ": " + info);
        var respuestaUsuario = [];

        if(respuestasPregunta.length == 4){
            respuestaUsuario = ["a","b","c","d"];
        }
        else{
            respuestaUsuario = ["a","b"];
        }

        for(var i = 0; i < respuestasPregunta.length;i++){
            agent.add(respuestaUsuario[i] + ") " + respuestasPregunta[i]);
        }

        numPregunta = numPregunta + 1;
    }
    
    async function ObtenerRespuestas(agent){
        var letra = agent.parameters.letra;
        var respuestaasociadaUsuario = -1;
        
        var id = await ObtenerIdCuestionario(cuestionario);
        var respuestas = await ObtenerRespuestasPregunta(id,numPregunta - 1);
        var respuestaCorrecta = await ObtenerRespuestaCorrecta(id,numPregunta - 1);

        switch(letra){
            case "a": 
                respuestaasociadaUsuario = 0;
                break;
            case "b": 
                respuestaasociadaUsuario = 1;
                break;
            case "c": 
                respuestaasociadaUsuario = 2;
                break;
            case "d": 
                respuestaasociadaUsuario = 3;
                break;
            default: respuestaasociadaUsuario = -1;
        }

        if(respuestas[respuestaasociadaUsuario] == respuestaCorrecta){
            agent.add("Correcto");
            aciertos = aciertos + 1;
            preguntasTotales = preguntasTotales + 1;

            var pregunta = await ObtenerPregunta(id,numPregunta);
            if(pregunta == "vacio"){
                var nota = (aciertos * 10)/preguntasTotales;
                if(Number.isInteger(nota)){
                    agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota);
                }
                else{
                    agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota.toFixed(2));
                }
            }else{
                var respuestas = await ObtenerRespuestasPregunta(id,numPregunta);
                mostrarInfo(agent,pregunta,respuestas);
            }

        }
        else{
            agent.add("Inorrecto. La respuesta correcta era " + respuestaCorrecta);
            errores = errores + 1;
            preguntasTotales = preguntasTotales + 1;
            
            var pregunta = await ObtenerPregunta(id,numPregunta);
            if(pregunta == "vacio"){
                var nota = (aciertos * 10)/preguntasTotales;
                if(Number.isInteger(nota)){
                    agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota);
                }
                else{
                    agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota.toFixed(2));
                }
            }else{
                var respuestas = await ObtenerRespuestasPregunta(id,numPregunta);
                mostrarInfo(agent,pregunta,respuestas);
            }
        }
  
      }

    function TerminarCuestionario(agent){
        agent.add("De acuerdo");
        var nota = (aciertos * 10)/preguntasTotales;
        if(Number.isInteger(nota)){
            agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota);
        }
        else{
            agent.add("El cuestionario ha terminado. Has obtenido una puntuación de: " + nota.toFixed(2));
        }
    }

    async function Cuestionario2(agent){
        preguntasTotales = 0;
        aciertos = 0;
        errores = 0;
        numPregunta = 1;

        agent.add(`De acuerdo. Para contestar las preguntas indica la letra de la pregunta. Por ejemplo: a o b. Si quieres terminar el cuestionario en cualquier momento hazmelo saber. Por ejemplo: "quiero terminar el cuestionario" o "terminar cuestionario"`);
        agent.add(`Mucha suerte!!!`);
        cuestionario = "Cuestionario 2";
        var id = await ObtenerIdCuestionario("Cuestionario 2");
        var pregunta = await ObtenerPregunta(id,numPregunta);
        //var respuestaCorrecta = await ObtenerRespuestaCorrecta(id,numPregunta);
        var respuestas = await ObtenerRespuestasPregunta(id,numPregunta);


        mostrarInfo(agent,pregunta,respuestas);
    }

    async function Cuestionario3(agent){
        preguntasTotales = 0;
        aciertos = 0;
        errores = 0;
        numPregunta = 1;

        agent.add(`De acuerdo. Para contestar las preguntas indica la letra de la pregunta. Por ejemplo: a o b. Si quieres terminar el cuestionario en cualquier momento hazmelo saber. Por ejemplo: "quiero terminar el cuestionario" o "terminar cuestionario"`);
        agent.add(`Mucha suerte!!!`);
        cuestionario = "Cuestionario 3";
        var id = await ObtenerIdCuestionario("Cuestionario 3");
        var pregunta = await ObtenerPregunta(id,numPregunta);
        //var respuestaCorrecta = await ObtenerRespuestaCorrecta(id,numPregunta);
        var respuestas = await ObtenerRespuestasPregunta(id,numPregunta);


        mostrarInfo(agent,pregunta,respuestas);
    }
    

    function ObtenerIdCuestionario(cuestionario){

        return new Promise((resolve, reject) => {
            Cuestionarios.find({ nombre: cuestionario }, (err, cuest) => {
                if (err) {
                    console.log('Error al obtener usuarios:', err);
                    reject(err);
                } else {
                    const id = cuest[0]._id.toString();
                    resolve(id);

                }
            });
        });
    }

    async function ObtenerPregunta(id, npregunta){

        return new Promise((resolve, reject) => {
            Enunciados.find({cuestionario: id, numPregunta: npregunta}, (err, cuest) => {
                if (err) {
                    console.log('Error al obtener el enunciado de la pregunta:', err);
                    reject(err);
                } else {
                    if(cuest.length != 0){
                        const id = cuest[0].titulo.toString();
                        resolve(id);
                    }
                    else{
                        resolve("vacio");
                    }

                }
            });
        });
        
    }

    async function ObtenerRespuestaCorrecta(id, npregunta){

        return new Promise((resolve, reject) => {
            Respuestas.find({ cuestionario: id, numPregunta: npregunta}, (err, cuest) => {
                if (err) {
                    console.log('Error al obtener la respuesta de la pregunta:', err);
                    reject(err);
                } else {
                    const id = cuest[0].texto.toString();
                    resolve(id);

                }
            });
        });
        
    }

    async function ObtenerRespuestasPregunta(id, npregunta){
        
        return new Promise((resolve, reject) => {
            TodasPreguntas.find({ numPregunta: npregunta}, (err, cuest) => {
                if (err) {
                    console.log('Error al obtener la respuesta de la pregunta:', err);
                    reject(err);
                } else {
                    var respuestasTotales = [];
                    for(var i = 0; i < cuest.length; i++){
                        if(cuest[i].cuestionario.toString() == id){
                            respuestasTotales.push(cuest[i].titulo.toString());
                        }
                    }
                    const respuestas = respuestasTotales;
                    resolve(respuestas);

                }
            });
        });
        
    }

    let intentMap = new Map();
    intentMap.set("Cuestionario", Cuestionario);
    intentMap.set("Cuestionario1", Cuestionario1);
    intentMap.set("Cuestionario2", Cuestionario2);
    intentMap.set("Cuestionario3", Cuestionario3);
    intentMap.set("ObtenerRespuestas", ObtenerRespuestas);
    intentMap.set("TerminarCuestionario", TerminarCuestionario);



    agent.handleRequest(intentMap);
});

module.exports = app;