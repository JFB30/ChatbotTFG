'use strict'

const enunciadoCtrl = {};
const Enunciado = require('../models/Enunciado');
const Cuestionairo = require('../models/Cuestionario');

enunciadoCtrl.borrarEnunciado = (req, res) => {
    Enunciado.deleteMany({}, (err) => {
        if (err) {
          res.status(500).send({ message: 'Error al vaciar la tabla de cuestionarios' });
        } else {
          res.status(200).send({ message: 'Tabla de cuestionarios vaciada exitosamente' });
        }
      });
}

enunciadoCtrl.crearEnunciado = async (req, res) => {
    const enunciado = new Enunciado({
        titulo: req.body.titulo,
        cuestionario: req.body.cuestionario,
        numPregunta: req.body.numPregunta
    });

    Cuestionairo.findById(req.body.cuestionario, async (err, cuestionari) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'There is an error with the DB' });
        }
        if (cuestionari) {
            try {
                const result = await enunciado.save();
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
}

enunciadoCtrl.obtenerEnunciadoPorPregunta = (req, res) => {
    Enunciado.find({numPregunta: req.params.numPregunta, cuestionario:req.params.Cuestionairo}, (err, cuest) => {
        if (err) {
            res.status(500).send({message: 'Error al obtener el eneunciado'});
        } else {
            if (!cuest) {
                res.status(404).send({message: 'Error al guardar el enunciado'});
            } else {
                res.status(200).send({ cuestionario: cuest});
            }
        }
    });
}

module.exports = enunciadoCtrl;