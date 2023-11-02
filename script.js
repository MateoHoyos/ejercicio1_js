async function boton() {
  console.log('---------boton buscar-----------------');
  document.getElementById('nombre').innerText = "";
  document.getElementById('tipo').innerText = null;
  document.getElementById('habilidades').innerText = null;
  document.getElementById('imagenPokemon').innerHTML = null;
  document.getElementById('descripcion').innerText = null;

  var nombrePokemon = document.getElementById("miInput").value;
  const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
  const url1 = `https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon}`;

  let siguienteEvolucion = null;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      const data = await response.json();
      document.getElementById('nombre').innerText = `${data.name}`;
      document.getElementById('tipo').innerText = `Tipo: ${data.types[0].type.name}`;
      document.getElementById('habilidades').innerText = `Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
      const imageUrl = data.sprites.other['official-artwork'].front_default;
      const imagenElemento = document.createElement('img');
      imagenElemento.src = imageUrl;
      document.getElementById('imagenPokemon').appendChild(imagenElemento);
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      document.getElementById('nombre').innerText = 'Error al buscar pokémon';
      //document.getElementById('tipo').innerText = 'Error al buscar pokémon';
      //document.getElementById('habilidades').innerText = 'Error al buscar pokémon';
  }

  try {
      const response = await fetch(url1);
      if (!response.ok) {
          throw new Error('Error en la solicitud de la API');
      }
      const data = await response.json();
      const descripcion = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
      document.getElementById('descripcion').innerText = `Descripción: ${descripcion}`;

      //------------------------------------------------------------

      const evolutionChainUrl = data.evolution_chain.url;
      //console.log('URL de la cadena de evolución (buscar):', evolutionChainUrl);

      //------------------------------------------------------------
      
      try {
        const result = await obtenerSiguientesEvoluciones(nombrePokemon, evolutionChainUrl);
        const botonEvolucion = document.getElementById('miBoton');

        if (result.length > 0 && result[0] !== 'no') {

          let indiceEvolucionActual = 1;

          console.log(result[indiceEvolucionActual]);
          document.getElementById('evolucion').innerText = `Evolucion: ${result[indiceEvolucionActual]}`;
          var elementoEvolucion = document.getElementById('evolucion');


          botonEvolucion.addEventListener('click', () => {
            if (indiceEvolucionActual < result.length) {
              mostrarEvolucion(result[indiceEvolucionActual]);
              indiceEvolucionActual++;
              
              console.log(result[indiceEvolucionActual]);
              
              if(result[indiceEvolucionActual] === undefined){
                elementoEvolucion.innerText = '';
                botonEvolucion.style.display = 'none';
              }
              else{
                document.getElementById('evolucion').innerText = `Evolucion: ${result[indiceEvolucionActual]}`;
              }



            } else {
              //console.log('No hay más evoluciones para mostrar.');
              //elementoEvolucion.innerText = '';
              
            }
          });
      
          botonEvolucion.style.display = 'flex';
        } else {
          //console.log('No hay evoluciones para mostrar.');
          //elementoEvolucion.innerText = '';
        }

          
      } catch (error) {
          console.error('Error al obtener la siguiente evolución:', error);
      }
      
      //-------------------------------------------------------
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      //document.getElementById('descripcion').innerText = 'Error al buscar pokémon';
  }

}

//-------------------------------------------------------------


async function mostrarEvolucion(siguienteEvolucion) {
  //console.log('---------siguienteEvolucion-----------------');
  document.getElementById('nombre').innerText = '';
  document.getElementById('tipo').innerText = '';
  document.getElementById('habilidades').innerText = '';
  document.getElementById('imagenPokemon').innerHTML = '';
  document.getElementById('descripcion').innerText = '';
  var url2 = `https://pokeapi.co/api/v2/pokemon/${siguienteEvolucion}`;
  var url3 = `https://pokeapi.co/api/v2/pokemon-species/${siguienteEvolucion}`;
  //console.log(url2);
  //console.log(url3);

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
      //document.getElementById('nombre').innerText = 'Error al buscar pokémon';
      //document.getElementById('tipo').innerText = 'Error al buscar pokémon';
      //document.getElementById('habilidades').innerText = 'Error al buscar pokémon';
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
      //document.getElementById('descripcion').innerText = 'Error al buscar pokémon';
  }
}












//------------------------------------------------


async function obtenerSiguientesEvoluciones(pokemonName, evolutionChainUrl) {
  try {
    
    const response = await fetch(evolutionChainUrl);

    if (!response.ok) {
      throw new Error('Error en la solicitud de la cadena de evolución');
    }

    const data = await response.json();
    const evolutionDetails = buscarEvolucion(data.chain, pokemonName);

    if (evolutionDetails && evolutionDetails.evolves_to && evolutionDetails.evolves_to.length > 0) {
      const evoluciones = obtenerTodasEvoluciones(evolutionDetails);
      return evoluciones;
    } else {
      
      return ['no'];
    }
  } catch (error) {
    console.error('Hubo un error en la solicitud:', error);
    throw error;
  }
}

function obtenerTodasEvoluciones(evolucion) {
  let evoluciones = [evolucion.species.name];

  for (const evolucionDeEvolucion of evolucion.evolves_to) {
    const evolucionesDeEvolucion = obtenerTodasEvoluciones(evolucionDeEvolucion);
    evoluciones = evoluciones.concat(evolucionesDeEvolucion);
  }

  return evoluciones;
}

function buscarEvolucion(chain, pokemonName) {
  
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
  

  if (contenedor.firstChild) {
      var imagen = contenedor.firstChild;
      imagen.src = src;
  } else {
      var contenedor = document.getElementById('imagenPokemon');
      var imagen = document.createElement('img');
      imagen.src = src;  

      
      contenedor.appendChild(imagen);
  }
}







