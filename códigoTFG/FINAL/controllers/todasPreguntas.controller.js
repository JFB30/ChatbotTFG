'use strict'

const TodasPreguntasCtrl = {};
const TodasPreguntas = require('../models/TodasPreguntas');
const Cuestionairo = require('../models/Cuestionario');

TodasPreguntasCtrl.borrarPreguntas = (req, res) => {
    TodasPreguntas.deleteMany({}, (err) => {
        if (err) {
          res.status(500).send({ message: 'Error al vaciar la tabla de cuestionarios' });
        } else {
          res.status(200).send({ message: 'Tabla de cuestionarios vaciada exitosamente' });
        }
      });
  }

TodasPreguntasCtrl.crearPregunta = async (req, res) => {
    let pregunta = new TodasPreguntas();

    let params = req.body;
    pregunta.titulo = params.titulo;
    pregunta.cuestionario = params.cuestionario;
    pregunta.numPregunta = params.numPregunta;

    pregunta.save((err, cuestionarioCreado) => {
        if (err) {
            res.status(500).send({message: 'Error al crear el cuestionario'});
        } else {
            if (!cuestionarioCreado) {
                res.status(404).send({message: 'Error al guardar el cuestionario'});
            } else {
                res.status(200).send({ pregunta: cuestionarioCreado});
            }
        }
    });
}


module.exports = TodasPreguntasCtrl;