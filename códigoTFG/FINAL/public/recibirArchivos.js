'use strict'

var infoFichero = "";
var subido = false;


async function abrirArchivo(evento){
    let archivo = evento.target.files[0];

    if(archivo){
        let reader = new FileReader();

        reader.onload = function(e) {
            let contenido = e.target.result;

            var fileContentArray = contenido.split(/\r\n|\n/);
            infoFichero = fileContentArray;
        };

        reader.readAsText(archivo);
    }
}

async function crearBot(){
    var respuestaCorrecta = "";
    var eneunciado = "";
    var cuestionario = "";
    var id = "";
    var numpreguntas = 0;
    var pregunta = "";
    var respuestaIncorrecta = "";
    
    for(var line = 0; line <= infoFichero.length-1; line++){
        if(infoFichero[line].includes("Cuestionario")){
            cuestionario = infoFichero[line];

            /*
            var options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
            };
        
        
            try{
                let response = await fetch ('http://localhost:3000/api/cuestionario/obtener-cuestionario/' + cuestionario, options);
                let result = await response.json(); 
                console.log(result);
            }
            catch(err){
                var existe = false;
                console.log("No existe");
            }
            */
                    
            var params = {
                'nombre': cuestionario
            };
            
            var options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(params)
            };

            fetch('http://localhost:3000/api/cuestionario/crear-cuestionario', options )
                .then( respuesta => { 
                    if(respuesta.ok){
                        respuesta.json().then((datos)=>{
                            sessionStorage.setItem('Token', JSON.stringify(datos));
                        })
                    }else{
                        console.log(respuesta.status);
                    }
                })
                .catch(error=>{console.log(error)})
                
        }
        

        if(infoFichero[line].includes("Pregunta")){
            pregunta = infoFichero[line].slice(-1);
            numpreguntas = parseInt(pregunta);
            
        }
            
        

        
        if(infoFichero[line].includes("Enunciado")){
            eneunciado = infoFichero[line].slice(11,infoFichero[line].length);
            
            var options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
            };
        
            let response = await fetch ('http://localhost:3000/api/cuestionario/obtener-cuestionario/' + cuestionario, options);
            let result = await response.json(); 
            console.log(result);
            id = result.cuestionario;
            console.log(id);
            
            
            
            var params = {
                'titulo': eneunciado,
                'cuestionario': id,
                'numPregunta': numpreguntas
            };
    
            var options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(params)
            };

            fetch('http://localhost:3000/api/enunciado/crear-enunciado', options )
                .then( respuesta => { 
                    if(respuesta.ok){
                        respuesta.json().then((datos)=>{
                            sessionStorage.setItem('Token', JSON.stringify(datos));
                        })
                    }else{
                        console.log(respuesta.status);
                    }
                })
                .catch(error=>{console.log(error)})
                
        }
        

        if(infoFichero[line].includes("=")){
            respuestaCorrecta = infoFichero[line].slice(1,infoFichero[line].length);
            
            var params = {
                'texto': respuestaCorrecta,
                'cuestionario': id,
                'numPregunta': numpreguntas
            };
    
            var options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(params)
            };

            fetch('http://localhost:3000/api/respuestaCorrecta/crear-respuesta-correcta', options )
                .then( respuesta => { 
                    if(respuesta.ok){
                        respuesta.json().then((datos)=>{
                            sessionStorage.setItem('Token', JSON.stringify(datos));
                        })
                    }else{
                        console.log(respuesta.status);
                    }
                })
                .catch(error=>{console.log(error)})
                
        }

        if(infoFichero[line].includes("~") || infoFichero[line].includes("=")){
            pregunta = infoFichero[line].slice(1,infoFichero[line].length);
            

            var params = {
                'titulo': pregunta,
                'cuestionario': id,
                'numPregunta': numpreguntas
            };
    
            var options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(params)
            };

            fetch('http://localhost:3000/api/todasPreguntas/crear-pregunta', options )
                .then( respuesta => { 
                    if(respuesta.ok){
                        respuesta.json().then((datos)=>{
                            sessionStorage.setItem('Token', JSON.stringify(datos));
                        })
                    }else{
                        console.log(respuesta.status);
                    }
                })
                .catch(error=>{console.log(error)})
        }
        
        
        
        
        
    }
        
    subido = false;
    alert("Chatbot creado correctamente");
    
}

window.addEventListener('load', () => {
    document.getElementById('archivo').addEventListener('change', abrirArchivo);
});

function limpiarFichero(){
    if(document.getElementById ("archivo").files.length == 0){
        alert("Primero debe seleccionar un archivo");
        return false;
    }
    else{
        document.querySelector('#archivo').value = '';
        alert("Archivo subido correctamente");
        subido = true;
    }
}

function borraPreguntas(){

    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
    };


    fetch('http://localhost:3000/api/cuestionario/borrar-cuestionario', options)
        .then( respuesta => { 
            if(respuesta.ok){
                respuesta.json().then((datos)=>{
                    sessionStorage.setItem('Token', JSON.stringify(datos));
                })
            }else{
                console.log(respuesta.status);
            }
        })
        .catch(error=>{console.log(error)})

    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
    };


    fetch('http://localhost:3000/api/enunciado/borrar-enunciado', options)
        .then( respuesta => { 
            if(respuesta.ok){
                respuesta.json().then((datos)=>{
                    sessionStorage.setItem('Token', JSON.stringify(datos));
                })
            }else{
                console.log(respuesta.status);
            }
        })
        .catch(error=>{console.log(error)})
    
    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
    };


    fetch('http://localhost:3000/api/todasPreguntas/borrar-preguntas', options)
        .then( respuesta => { 
            if(respuesta.ok){
                respuesta.json().then((datos)=>{
                    sessionStorage.setItem('Token', JSON.stringify(datos));
                })
            }else{
                console.log(respuesta.status);
            }
        })
        .catch(error=>{console.log(error)})
    
    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
    };


    fetch('http://localhost:3000/api/respuestaCorrecta/borrar-respuestas', options)
        .then( respuesta => { 
            if(respuesta.ok){
                respuesta.json().then((datos)=>{
                    sessionStorage.setItem('Token', JSON.stringify(datos));
                })
            }else{
                console.log(respuesta.status);
            }
        })
        .catch(error=>{console.log(error)})
    
    alert("Se han borrado todas las preguntas de la base de datos");
        
}




function init() {
    let subirArchivo = document.querySelector('#subir');
	subirArchivo.addEventListener('click', limpiarFichero, false);

    let crearChat = document.querySelector('#crearChatbot');
	crearChat.addEventListener('click', crearBot, false);

    let borrarPreguntas = document.querySelector('#borrarPreguntas');
	borrarPreguntas.addEventListener('click', borraPreguntas, false);
  }
  
document.addEventListener('DOMContentLoaded',init,false);