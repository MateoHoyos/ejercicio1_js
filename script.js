async function boton() {
  console.log('---------boton buscar-----------------');
  document.getElementById('nombre').innerText = "";
  document.getElementById('tipo').innerText = null;
  document.getElementById('habilidades').innerText = null;
  document.getElementById('imagenPokemon').innerHTML = null;
  document.getElementById('descripcion').innerText = null;

  // Obtener el valor del cuadro de texto
  var nombrePokemon = document.getElementById("miInput").value;
  // Concatenar el nombre del Pokémon a la URL
  const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
  const url1 = `https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon}`;

  let siguienteEvolucion = null;

  try {
      // Realizar la solicitud GET utilizando fetch
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      // Convertir la respuesta a formato JSON
      const data = await response.json();

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
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      // Modificar el DOM en caso de error
      document.getElementById('nombre').innerText = 'Error al obtener datos';
      document.getElementById('tipo').innerText = 'Error al obtener datos';
      document.getElementById('habilidades').innerText = 'Error al obtener datos';
  }

  try {
      // Realizar la solicitud GET utilizando fetch
      const response = await fetch(url1);
      if (!response.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      // Convertir la respuesta a formato JSON
      const data = await response.json();

      // Obtener la descripción del array de descripciones
      const descripcion = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;

      // Modificar el DOM con la descripción
      document.getElementById('descripcion').innerText = `Descripción: ${descripcion}`;

      //------------------------------------------------------------
      //obtener el url de del campo evolution_chain    
      const evolutionChainUrl = data.evolution_chain.url;
      console.log('URL de la cadena de evolución (buscar):', evolutionChainUrl);

      //------------------------------------------------------------
      
      try {

        
        const result = await obtenerSiguientesEvoluciones(nombrePokemon, evolutionChainUrl);
        const botonEvolucion = document.getElementById('miBoton');

        
        

        if (result.length > 0 && result[0] !== 'no') {

         

          let indiceEvolucionActual = 1;
      
          // Agregar un evento al botón para mostrar la siguiente evolución
          botonEvolucion.addEventListener('click', () => {
            // Verificar si hay más evoluciones para mostrar
            if (indiceEvolucionActual < result.length) {
              // Mostrar la siguiente evolución
              mostrarEvolucion(result[indiceEvolucionActual]);
              indiceEvolucionActual++;
            } else {
              console.log('No hay más evoluciones para mostrar.');
              //botonEvolucion.style.display = 'none';
            }
          });
      
          botonEvolucion.style.display = 'flex';
        } else {
          console.log('No hay evoluciones para mostrar.');
          //botonEvolucion.style.display = 'none';
        }

          
      } catch (error) {
          console.error('Error al obtener la siguiente evolución:', error);
      }
      
      //-------------------------------------------------------
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      // Modificar el DOM en caso de error
      document.getElementById('descripcion').innerText = 'Error al obtener datos';
  }

}

//-------------------------------------------------------------


async function mostrarEvolucion(siguienteEvolucion) {
  console.log('---------siguienteEvolucion-----------------');
  document.getElementById('nombre').innerText = '';
  document.getElementById('tipo').innerText = '';
  document.getElementById('habilidades').innerText = '';
  document.getElementById('imagenPokemon').innerHTML = '';
  document.getElementById('descripcion').innerText = '';
  var url2 = `https://pokeapi.co/api/v2/pokemon/${siguienteEvolucion}`;
  var url3 = `https://pokeapi.co/api/v2/pokemon-species/${siguienteEvolucion}`;
  console.log(url2);
  console.log(url3);

  try {
      const response2 = await fetch(url2);
      if (!response2.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      const data2 = await response2.json();
      document.getElementById('nombre').innerText = `${data2.name}`;
      document.getElementById('tipo').innerText = `Tipo: ${data2.types[0].type.name}`;
      document.getElementById('habilidades').innerText = `Habilidades: ${data2.abilities.map(ability => ability.ability.name).join(', ')}`;
      const imageUrl = data2.sprites.other['official-artwork'].front_default;
      const imagenElemento = document.createElement('img');
      reemplazarImagen(imageUrl);
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      document.getElementById('nombre').innerText = 'Error al obtener datos';
      document.getElementById('tipo').innerText = 'Error al obtener datos';
      document.getElementById('habilidades').innerText = 'Error al obtener datos';
  }

  try {
      const response3 = await fetch(url3);
      if (!response3.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      const data3 = await response3.json();
      const descripcion = data3.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
      document.getElementById('descripcion').innerText = `Descripción: ${descripcion}`;
  
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      // Modificar el DOM en caso de error
      document.getElementById('descripcion').innerText = 'Error al obtener datos';
  }
}












//------------------------------------------------


async function obtenerSiguientesEvoluciones(pokemonName, evolutionChainUrl) {
  try {
    // Realizar la solicitud GET utilizando fetch
    const response = await fetch(evolutionChainUrl);

    if (!response.ok) {
      throw new Error('Error en la solicitud de la cadena de evolución');
    }

    const data = await response.json();

    // Buscar la evolución correspondiente al Pokémon dado
    const evolutionDetails = buscarEvolucion(data.chain, pokemonName);

    if (evolutionDetails && evolutionDetails.evolves_to && evolutionDetails.evolves_to.length > 0) {
      // Obtener todas las evoluciones
      const evoluciones = obtenerTodasEvoluciones(evolutionDetails);
      return evoluciones;
    } else {
      // Si no hay siguiente evolución, indicarlo
      return ['no'];
    }
  } catch (error) {
    console.error('Hubo un error en la solicitud:', error);
    throw error;
  }
}

function obtenerTodasEvoluciones(evolucion) {
  // Función recursiva para obtener todas las evoluciones
  let evoluciones = [evolucion.species.name];

  for (const evolucionDeEvolucion of evolucion.evolves_to) {
    const evolucionesDeEvolucion = obtenerTodasEvoluciones(evolucionDeEvolucion);
    evoluciones = evoluciones.concat(evolucionesDeEvolucion);
  }

  return evoluciones;
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

  return null;
}











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







