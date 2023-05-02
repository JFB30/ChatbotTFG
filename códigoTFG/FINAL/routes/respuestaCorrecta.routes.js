'use strict'

var express = require('express');
var RespuestaCorrectaController = require('../controllers/respuestaCorrecta.controller');

var api = express.Router();

api.post('/crear-respuesta-correcta', RespuestaCorrectaController.crearRespuestaCorrecta);
api.post('/borrar-respuestas', RespuestaCorrectaController.borrarRespuestas);
api.get('/obtener-respuesta-correcta/:cuestionario/:numPregunta', RespuestaCorrectaController.obtenerRespuestaPorPregunta);

module.exports = api;