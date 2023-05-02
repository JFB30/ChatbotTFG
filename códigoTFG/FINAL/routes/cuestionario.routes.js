'use strict'

var express = require('express');
var CuestionarioController = require('../controllers/cuestionario.controller');
const Cuestionario = require('../models/Cuestionario');
var api = express.Router();

api.post('/borrar-cuestionario', CuestionarioController.borrarCuestionario);
api.post('/crear-cuestionario', CuestionarioController.crearCuestionario);
api.get('/obtener-cuestionario/:nombre', CuestionarioController.obtenerCuestionarioPorNombre);


module.exports = api;