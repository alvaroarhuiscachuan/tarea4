// Traemos los posts o creamos arreglo vacío
let posts = JSON.parse(localStorage.getItem('postsBlog')) || [];
let editandoId = null; // Variable nueva para saber si estamos editando o creando

const formPost = document.getElementById('formPost');
const listaPublicaciones = document.getElementById('listaPublicaciones');

function renderizarPosts() {
    listaPublicaciones.innerHTML = ''; 

    if (posts.length === 0) {
        listaPublicaciones.innerHTML = '<p>No hay publicaciones aún. ¡Crea la primera!</p>';
        return;
    }

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.style = "background: white; padding: 15px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: left;";
        
        postElement.innerHTML = `
            <h4 style="margin: 0 0 5px 0;">${post.titulo}</h4>
            <small style="color: gray;">Fecha: ${post.fecha}</small>
            <p>${post.contenido}</p>
            <button onclick="eliminarPost(${post.id})" style="background-color: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-right: 5px;">Eliminar</button>
            <button onclick="editarPost(${post.id})" style="background-color: #ffc107; color: black; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Editar</button>
        `;
        listaPublicaciones.appendChild(postElement);
    });
}

if (formPost) {
    formPost.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('tituloPost').value;
        const contenido = document.getElementById('contenidoPost').value;
        const fechaActual = new Date().toISOString().split('T')[0];

        if (editandoId) {
            // Si hay un ID en edición, ACTUALIZAMOS el post existente
            const postIndex = posts.findIndex(p => p.id === editandoId);
            posts[postIndex].titulo = titulo;
            posts[postIndex].contenido = contenido;
            
            editandoId = null; // Soltamos el ID
            document.querySelector('#formPost button').innerText = 'Publicar'; // Botón a la normalidad
        } else {
            // Si no hay ID, CREAMOS uno nuevo
            const nuevoPost = {
                id: Date.now(),
                titulo: titulo,
                contenido: contenido,
                fecha: fechaActual
            };
            posts.push(nuevoPost);
        }

        // Guardamos y actualizamos pantalla
        localStorage.setItem('postsBlog', JSON.stringify(posts));
        formPost.reset();
        renderizarPosts();
    });
}

// Función para ELIMINAR (DELETE)
function eliminarPost(id) {
    if(confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
        // Filtramos para quedarnos con todos menos el eliminado
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('postsBlog', JSON.stringify(posts));
        renderizarPosts();
    }
}

// Función para EDITAR (UPDATE)
function editarPost(id) {
    // Buscamos el post exacto
    const post = posts.find(p => p.id === id);
    
    // Pasamos sus datos al formulario
    document.getElementById('tituloPost').value = post.titulo;
    document.getElementById('contenidoPost').value = post.contenido;
    
    // Guardamos el ID que estamos editando y cambiamos el texto del botón
    editandoId = id;
    document.querySelector('#formPost button').innerText = 'Actualizar Publicación';
    
    // Subimos la pantalla hacia el formulario
    window.scrollTo(0, 0);
}

// Ejecutamos al iniciar
renderizarPosts();