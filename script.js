
// Función para guardar el texto
function boton() {

    document.getElementById('nombre').innerText = '';
    document.getElementById('tipo').innerText = '';
    document.getElementById('habilidades').innerText = '';
    document.getElementById('imagenPokemon').innerHTML = '';
    document.getElementById('descripcion').innerText = '';
    var nuevoBoton = '';



    // Obtener el valor del cuadro de texto
    var nombrePokemon = document.getElementById("miInput").value;
    // Concatenar el nombre del Pokémon a la URL
    const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`; 
    const url1 =`https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon}` 

    console.log(url);
    console.log(url1);



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
         })
    .catch(error => {
        console.error('Hubo un error en la solicitud:', error);
        // Modificar el DOM en caso de error
        document.getElementById('descripcion').innerText = 'Error al obtener datos';
    });

}







  
