'use strict'

var mongoose =  require('mongoose');

var Schema = mongoose.Schema;

var EnunciadoSchema = Schema({
    titulo: String,
    cuestionario: mongoose.Types.ObjectId,
    numPregunta: Number
});

module.exports = mongoose.model('Enunciado', EnunciadoSchema);