"use strict";

const respuestaCorrectaCtrl = {};
const RespuestaCorrecta = require("../models/RespuestaCorrecta");
const Cuestionairo = require("../models/Cuestionario");

respuestaCorrectaCtrl.borrarRespuestas = (req, res) => {
  RespuestaCorrecta.deleteMany({}, (err) => {
      if (err) {
        res.status(500).send({ message: 'Error al vaciar la tabla de cuestionarios' });
      } else {
        res.status(200).send({ message: 'Tabla de cuestionarios vaciada exitosamente' });
      }
    });
}

respuestaCorrectaCtrl.crearRespuestaCorrecta = async (req, res) => {
  const respuestaCorrecta = new RespuestaCorrecta({
    texto: req.body.texto,
    cuestionario: req.body.cuestionario,
    numPregunta: req.body.numPregunta,
  });

  Cuestionairo.findById(req.body.cuestionario, async (err, cuestionari) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "There is an error with the DB" });
    }
    if (cuestionari) {
      try {
        const result = await respuestaCorrecta.save();
        //console.log(result);
        res.status(200).send(result);
      } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      }
    } else {
      res.status(404).send("Cuestionario not found");
    }
  });
};

respuestaCorrectaCtrl.obtenerRespuestaPorPregunta = (req, res) => {
  RespuestaCorrecta.find({numPregunta: req.params.numPregunta, cuestionario:req.params.Cuestionair}, (err, cuest) => {
      if (err) {
          res.status(500).send({message: 'Error al obtener la respuesta'});
      } else {
          if (!cuest) {
              res.status(404).send({message: 'Error al guardar la respuesta'});
          } else {
              res.status(200).send({ cuestionario: cuest});
          }
      }
  });
}

module.exports = respuestaCorrectaCtrl;
