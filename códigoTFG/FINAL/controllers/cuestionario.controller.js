'use strict'

const cuestionarioCtrl = {};
const Cuestionario = require('../models/Cuestionario');

cuestionarioCtrl.borrarCuestionario = (req, res) => {
    Cuestionario.deleteMany({}, (err) => {
        if (err) {
          res.status(500).send({ message: 'Error al vaciar la tabla de cuestionarios' });
        } else {
          res.status(200).send({ message: 'Tabla de cuestionarios vaciada exitosamente' });
        }
      });
}

cuestionarioCtrl.crearCuestionario = (req, res) => {
    let cuestionario = new Cuestionario();

    let params = req.body;
    cuestionario.nombre = params.nombre;

    cuestionario.save((err, cuestionarioCreado) => {
        if (err) {
            res.status(500).send({message: 'Error al crear el cuestionario'});
        } else {
            if (!cuestionarioCreado) {
                res.status(404).send({message: 'Error al guardar el cuestionario'});
            } else {
                res.status(200).send({ cuestionario: cuestionarioCreado});
            }
        }
    });
}

cuestionarioCtrl.obtenerCuestionarioPorNombre = (req, res) => {
    Cuestionario.find({nombre: req.params.nombre}, (err, cuest) => {
        if (err) {
            res.status(200).send({ cuestionario: "vacio"});
        } else {
            if (!cuest) {
                console.log('Error al obtener el cuestionario:', err);
            } else {
                res.status(200).send({ cuestionario: cuest[0]._id});
            }
        }
    });
}

module.exports = cuestionarioCtrl;