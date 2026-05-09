// Traemos los posts guardados o creamos un arreglo vacío
let posts = JSON.parse(localStorage.getItem('postsBlog')) || [];

const formPost = document.getElementById('formPost');
const listaPublicaciones = document.getElementById('listaPublicaciones');

// Función para mostrar los posts (READ)
function renderizarPosts() {
    listaPublicaciones.innerHTML = ''; // Limpiamos la lista antes de dibujar

    if (posts.length === 0) {
        listaPublicaciones.innerHTML = '<p>No hay publicaciones aún. ¡Crea la primera!</p>';
        return;
    }

    // Dibujamos cada post guardado
    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.style = "background: white; padding: 15px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: left;";
        
        postElement.innerHTML = `
            <h4 style="margin: 0 0 5px 0;">${post.titulo}</h4>
            <small style="color: gray;">Fecha: ${post.fecha}</small>
            <p>${post.contenido}</p>
            <button onclick="eliminarPost(${post.id})" style="background-color: #dc3545; width: auto; padding: 5px 10px; margin-right: 5px;">Eliminar</button>
            <button onclick="editarPost(${post.id})" style="background-color: #ffc107; color: black; width: auto; padding: 5px 10px;">Editar</button>
        `;
        listaPublicaciones.appendChild(postElement);
    });
}

// Función para guardar un nuevo post (CREATE)
if (formPost) {
    formPost.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('tituloPost').value;
        const contenido = document.getElementById('contenidoPost').value;
        const fechaActual = new Date().toISOString().split('T')[0]; // Saca la fecha de hoy

        // Creamos el objeto del post
        const nuevoPost = {
            id: Date.now(), // Usamos la hora como ID único para no repetir
            titulo: titulo,
            contenido: contenido,
            fecha: fechaActual
        };

        // Guardamos en el arreglo y luego en LocalStorage
        posts.push(nuevoPost);
        localStorage.setItem('postsBlog', JSON.stringify(posts));

        formPost.reset(); // Limpia el formulario
        renderizarPosts(); // Actualiza la pantalla
    });
}

// Botones vacíos por ahora (los haremos en el siguiente paso)
function eliminarPost(id) {
    alert("Pronto programaremos la eliminación del post ID: " + id);
}

function editarPost(id) {
    alert("Pronto programaremos la edición del post ID: " + id);
}

// Ejecutamos esto al abrir la página para mostrar lo que ya exista
renderizarPosts();