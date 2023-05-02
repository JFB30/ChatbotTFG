'use strict'

var mongoose =  require('mongoose');

var Schema = mongoose.Schema;

var RespuestaCorrectaSchema = Schema({
    texto: String,
    cuestionario: mongoose.Types.ObjectId,
    numPregunta: Number
});

module.exports = mongoose.model('RespuestaCorrecta', RespuestaCorrectaSchema);