let posts = JSON.parse(localStorage.getItem('postsBlog')) || [];
let editandoId = null;

const formPost = document.getElementById('formPost');
const listaPublicaciones = document.getElementById('listaPublicaciones');
const btnPublicar = document.getElementById('btnPublicar');

// --- NUEVO: LÓGICA DEL MODO OSCURO ---
const btnDarkMode = document.getElementById('btnDarkMode');
const body = document.body;
const iconoDarkMode = btnDarkMode.querySelector('i');

// Revisar si el usuario ya tenía el modo oscuro guardado de antes
if (localStorage.getItem('darkMode') === 'activado') {
    body.classList.add('dark-mode');
    iconoDarkMode.classList.replace('fa-moon', 'fa-sun');
}

btnDarkMode.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'activado');
        iconoDarkMode.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('darkMode', 'desactivado');
        iconoDarkMode.classList.replace('fa-sun', 'fa-moon');
    }
});
// -------------------------------------

function renderizarPosts() {
    listaPublicaciones.innerHTML = ''; 

    if (posts.length === 0) {
        listaPublicaciones.innerHTML = '<p style="text-align:center; color: gray;"><i class="fa-regular fa-folder-open"></i> Aún no hay publicaciones. ¡Sé el primero en escribir algo!</p>';
        return;
    }

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card'; // Usamos la nueva clase CSS
        
        postElement.innerHTML = `
            <h4 style="margin: 0 0 5px 0; font-size: 1.2rem;">${post.titulo}</h4>
            <small style="color: gray;"><i class="fa-regular fa-calendar"></i> ${post.fecha}</small>
            <p style="line-height: 1.5; margin-top: 10px;">${post.contenido}</p>
            <div class="post-actions">
                <button onclick="editarPost(${post.id})" class="btn-editar">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="eliminarPost(${post.id})" class="btn-eliminar">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </div>
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
            const postIndex = posts.findIndex(p => p.id === editandoId);
            posts[postIndex].titulo = titulo;
            posts[postIndex].contenido = contenido;
            
            editandoId = null; 
            btnPublicar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar'; 
        } else {
            const nuevoPost = {
                id: Date.now(),
                titulo: titulo,
                contenido: contenido,
                fecha: fechaActual
            };
            posts.push(nuevoPost);
        }

        localStorage.setItem('postsBlog', JSON.stringify(posts));
        formPost.reset();
        renderizarPosts();
    });
}

function eliminarPost(id) {
    if(confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('postsBlog', JSON.stringify(posts));
        renderizarPosts();
    }
}

function editarPost(id) {
    const post = posts.find(p => p.id === id);
    
    document.getElementById('tituloPost').value = post.titulo;
    document.getElementById('contenidoPost').value = post.contenido;
    
    editandoId = id;
    btnPublicar.innerHTML = '<i class="fa-solid fa-check"></i> Actualizar Publicación';
    
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Animación suave al subir
}

renderizarPosts();