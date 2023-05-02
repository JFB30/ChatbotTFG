'use strict'

var mongoose =  require('mongoose');

var Schema = mongoose.Schema;

var CuestionarioSchema = Schema({
    nombre: String,
});

module.exports = mongoose.model('Cuestionario', CuestionarioSchema);