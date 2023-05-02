'use strict'

var mongoose =  require('mongoose');

var Schema = mongoose.Schema;

var TodasPreguntasSchema = Schema({
    titulo: String,
    cuestionario: mongoose.Types.ObjectId,
    numPregunta: Number
});

module.exports = mongoose.model('TodasPreguntas', TodasPreguntasSchema);