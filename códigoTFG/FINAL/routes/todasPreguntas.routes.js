'use strict'

var express = require('express');
var TodasPreguntasController = require('../controllers/todasPreguntas.controller');
var api = express.Router();

api.post('/crear-pregunta', TodasPreguntasController.crearPregunta);
api.post('/borrar-preguntas', TodasPreguntasController.borrarPreguntas);
//api.get('/obtener-cuestionario/:nombre', PreguntasIncorrectasController.obtenerCuestionarioPorNombre);

module.exports = api;