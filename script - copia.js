
var contador = 0;
var enProceso = false;
var siguienteEvolucion1 = null;






/*if(siguienteEvolucion == "no"){
  var segundoBoton = document.getElementById('miBoton');
  segundoBoton.style.display = 'none';
  siguienteEvolucion = null;

}
else if(contador == 0){

  var segundoBoton = document.getElementById('miBoton');
  segundoBoton.style.display = 'flex';

  var boton = document.getElementById('miBoton');
  boton.addEventListener('click', function() {
    boton2(siguienteEvolucion);
  });

  contador++; 
        
} 

//-------------------------------------------------------


if(contador==1){

  var segundoBoton = document.getElementById('miBoton');
  segundoBoton.style.display = 'flex';
  
  var boton = document.getElementById('miBoton');
  boton.addEventListener('click', function() {
    boton2(siguienteEvolucion);
  });

} 
else{
  var segundoBoton = document.getElementById('miBoton');
  segundoBoton.style.display = 'none';
  siguienteEvolucion = null;
  contador = 0;    
}*/

//-------------------------------------------------------

// Función para guardar el texto
function boton() {
    
    console.log('---------boton buscar-----------------');
    document.getElementById('nombre').innerText = "";
    document.getElementById('tipo').innerText = null;
    document.getElementById('habilidades').innerText =null;
    document.getElementById('imagenPokemon').innerHTML = null;
    document.getElementById('descripcion').innerText = null;

    
    var contador = 0;
    var url = null;
    var url1 = null;
    var siguienteEvolucion1 = '';

    // Obtener el valor del cuadro de texto
    var nombrePokemon = document.getElementById("miInput").value;
    // Concatenar el nombre del Pokémon a la URL
     url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`; 
     url1 =`https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon}` 
    


    // URL de la API de Pokémon con el nombre "pikachu"
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/pikachu';

   


    // Realizar la solicitud GET utilizando fetch
    fetch(url)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta 200-299)
        if (!response.ok) {
        throw new Error('Error en la solicitud de la API');
    }
    // Convertir la respuesta a formato JSON
        return response.json();
    })
    .then(data => {
        // Modificar el DOM con los datos obtenidos
        document.getElementById('nombre').innerText = `${data.name}`;
        document.getElementById('tipo').innerText = `Tipo: ${data.types[0].type.name}`;
        document.getElementById('habilidades').innerText = `Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
       
        // Obtener la URL de la imagen "official-artwork"
        const imageUrl = data.sprites.other['official-artwork'].front_default;

        // Crear un elemento de imagen en el DOM
        const imagenElemento = document.createElement('img');

        // Establecer la fuente de la imagen
        imagenElemento.src = imageUrl;

        // Agregar la imagen al elemento del DOM
        document.getElementById('imagenPokemon').appendChild(imagenElemento);
    
    
    
    })
    .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        // Modificar el DOM en caso de error
        document.getElementById('nombre').innerText = 'Error al obtener datos';
        document.getElementById('tipo').innerText = 'Error al obtener datos';
        document.getElementById('habilidades').innerText = 'Error al obtener datos';
    });





    // Realizar la solicitud GET utilizando fetch
    fetch(url1)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta 200-299)
        if (!response.ok) {
        throw new Error('Error en la solicitud de la API');
    }
    // Convertir la respuesta a formato JSON
        return response.json();
    })
    .then(data => {
        // Obtener la descripción del array de descripciones
        const descripcion = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;

        // Modificar el DOM con la descripción
        document.getElementById('descripcion').innerText = `Descripción: ${descripcion}`;


        //------------------------------------------------------------
        //obtener el url de del campo evolution_chain    
        const evolutionChainUrl = data.evolution_chain.url;
        console.log('URL de la cadena de evolución (buscar):', evolutionChainUrl);

        //------------------------------------------------------------
        
        obtenerSiguienteEvolucion(nombrePokemon, evolutionChainUrl)
                    .then(siguienteEvolucion => {
                        console.log('La siguiente evolución (buscar):', siguienteEvolucion);

                        // Mostrar el siguiente botón si hay más evoluciones
                        if (siguienteEvolucion !== "no") {

                              var segundoBoton = document.getElementById('miBoton');
                              segundoBoton.style.display = 'flex';

                              var boton = document.getElementById('miBoton');
                              boton.addEventListener('click', function() {
                                boton2(siguienteEvolucion);
                              });

                        } else {
                          var segundoBoton = document.getElementById('miBoton');
                          segundoBoton.style.display = 'none';
                        }
                    })
                    .catch(error => {
                        console.error('Error al obtener la siguiente evolución:', error);
                    });




        //-------------------------------------------------------
        
         })
    .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        // Modificar el DOM en caso de error
        document.getElementById('descripcion').innerText = 'Error al obtener datos';
    });      
}







function boton2(siguienteEvolucion) {
  console.log('---------siguienteEvolucion-----------------');
  document.getElementById('nombre').innerText = '';
  document.getElementById('tipo').innerText = '';
  document.getElementById('habilidades').innerText = '';
  document.getElementById('imagenPokemon').innerHTML = '';
  document.getElementById('descripcion').innerText = '';
  var url2 = `https://pokeapi.co/api/v2/pokemon/${siguienteEvolucion}`; 
  var url3 =`https://pokeapi.co/api/v2/pokemon-species/${siguienteEvolucion}` 
  console.log(url2);
   console.log(url3);


  fetch(url2)
  .then(response => {
      if (!response.ok) {
      throw new Error('Error en la solicitud de la API');
  }
      return response.json();
  })
    .then(data => {
        document.getElementById('nombre').innerText = `${data.name}`;
        document.getElementById('tipo').innerText = `Tipo: ${data.types[0].type.name}`;
        document.getElementById('habilidades').innerText = `Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
        const imageUrl = data.sprites.other['official-artwork'].front_default;
        const imagenElemento = document.createElement('img');
        reemplazarImagen(imageUrl);
    })
    .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        document.getElementById('nombre').innerText = 'Error al obtener datos';
        document.getElementById('tipo').innerText = 'Error al obtener datos';
        document.getElementById('habilidades').innerText = 'Error al obtener datos';
    });


    fetch(url3)
    .then(response => {
        if (!response.ok) {
        throw new Error('Error en la solicitud de la API');
    }
        return response.json();
    })
    .then(data => {
        const descripcion = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
        document.getElementById('descripcion').innerText = `Descripción: ${descripcion}`;
        const evolutionChainUrl = data.evolution_chain.url;
        console.log('URL de la cadena de evolución (evolucion):', evolutionChainUrl);

        obtenerSiguienteEvolucion(siguienteEvolucion, evolutionChainUrl)
        .then(siguienteEvolucion => {
          console.log('La siguiente evolución (buscar):', siguienteEvolucion);

          // Mostrar el siguiente botón si hay más evoluciones
          if (siguienteEvolucion !== "no") {

                var segundoBoton = document.getElementById('miBoton');
                segundoBoton.style.display = 'flex';

                var boton = document.getElementById('miBoton');
                boton.addEventListener('click', function() {
                  boton2(siguienteEvolucion);
                });

          } else {
            var segundoBoton = document.getElementById('miBoton');
            segundoBoton.style.display = 'none';
          }
      })
      .catch(error => {
          console.error('Error al obtener la siguiente evolución:', error);
      });

      })
    .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        // Modificar el DOM en caso de error
        document.getElementById('descripcion').innerText = 'Error al obtener datos';
    });

    
}





/*while(contador==1){

  var segundoBoton = document.getElementById('miBoton');
  segundoBoton.style.display = 'flex';

  console.log(siguienteEvolucion1);

  var boton = document.getElementById('miBoton');
  boton.addEventListener('click', function() {
    boton2(siguienteEvolucion1);
  });

}*/


  


//var siguienteEvolucion = 'ivysaur';










//console.log(siguienteEvolucion);






//-----------------------------------------------------------
function reemplazarImagen(src) {
  var contenedor = document.getElementById('imagenPokemon');
  
  // Verificar si hay una imagen en el contenedor
  if (contenedor.firstChild) {
      // Obtener la primera imagen (en este caso, asumimos que solo hay una imagen)
      var imagen = contenedor.firstChild;

      // Reemplazar la fuente (src) de la imagen
      imagen.src = src;
  } else {
      // Si no hay una imagen, puedes agregar una nueva
      var contenedor = document.getElementById('imagenPokemon');

      // Crear un elemento de imagen
      var imagen = document.createElement('img');
      imagen.src = src;  // Ruta de la imagen

      // Agregar la imagen al contenedor
      contenedor.appendChild(imagen);
  }
}







//-----------------------------------------------------------
function obtenerSiguienteEvolucion(pokemonName, evolutionChainUrl) {
  return new Promise((resolve, reject) => {
    // Inicializar con un valor predeterminado
    let siguienteEvolucion = 'no';

    // Realizar la solicitud GET utilizando fetch
    fetch(evolutionChainUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud de la cadena de evolución');
        }
        return response.json();
      })
      .then(data => {
        // Buscar la evolución correspondiente al Pokémon dado
        const evolutionDetails = buscarEvolucion(data.chain, pokemonName);

        if (evolutionDetails && evolutionDetails.evolves_to && evolutionDetails.evolves_to.length > 0) {
          // Verificar que haya evoluciones adicionales
          siguienteEvolucion = evolutionDetails.evolves_to[0].species.name;
          resolve(siguienteEvolucion);
        } else {
          // Si no hay siguiente evolución, indicarlo
          siguienteEvolucion = 'no';
          resolve(siguienteEvolucion);
        }
      })
      .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        reject(error);
      });
  });
}

function buscarEvolucion(chain, pokemonName) {
  // Función recursiva para buscar la evolución correspondiente al Pokémon dado
  if (chain.species.name === pokemonName) {
    return chain;
  }

  for (const evolucion of chain.evolves_to) {
    const resultado = buscarEvolucion(evolucion, pokemonName);
    if (resultado) {
      return resultado;
    }
  }
}
