'use strict'

var express = require('express');
var EnunciadoController = require('../controllers/enunciado.controller');

var api = express.Router();

api.post('/crear-enunciado', EnunciadoController.crearEnunciado);
api.post('/borrar-enunciado', EnunciadoController.borrarEnunciado);
api.get('/obtener-enunciado/:cuestionario/:numPregunta', EnunciadoController.obtenerEnunciadoPorPregunta);

module.exports = api;