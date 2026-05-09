let posts = [];
let editandoId = null;

const formPost = document.getElementById('formPost');
const listaPublicaciones = document.getElementById('listaPublicaciones');
const btnPublicar = document.getElementById('btnPublicar');

// --- 0. MODO OSCURO PARA EL INDEX (SOLUCIÓN DEL BUG) ---
const btnDarkMode = document.getElementById('btnDarkMode');
if (btnDarkMode) {
    const body = document.body;
    const iconoDarkMode = btnDarkMode.querySelector('i');

    // Revisar estado guardado
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
}

// --- 1. CARGA INICIAL (JSON SIMULADO Y LOCALSTORAGE) ---
function inicializarDatos() {
    const datosGuardados = localStorage.getItem('postsBlog');
    
    if (datosGuardados) {
        posts = JSON.parse(datosGuardados);
        renderizarPosts();
    } else {
        fetch('data.json')
            .then(respuesta => respuesta.json())
            .then(datosJSON => {
                posts = datosJSON;
                localStorage.setItem('postsBlog', JSON.stringify(posts));
                renderizarPosts();
            })
            .catch(error => {
                console.error("Error al cargar el JSON:", error);
                renderizarPosts();
            });
    }
}

// --- 2. RENDERIZAR LAS PUBLICACIONES ---
function renderizarPosts() {
    listaPublicaciones.innerHTML = ''; 

    if (posts.length === 0) {
        listaPublicaciones.innerHTML = '<p style="text-align:center; color: var(--text-muted);"><i class="fa-regular fa-folder-open"></i> Aún no hay publicaciones.</p>';
        return;
    }

    const postsOrdenados = [...posts].sort((a, b) => b.id - a.id);

    postsOrdenados.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        
        postElement.innerHTML = `
            <h4 style="margin: 0 0 5px 0; font-size: 1.3rem; color: var(--primary);">${post.titulo}</h4>
            <small style="color: var(--text-muted);"><i class="fa-regular fa-calendar"></i> ${post.fecha}</small>
            <p style="line-height: 1.6; margin-top: 10px;">${post.contenido}</p>
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

// --- 3. CREAR O EDITAR CON VISTA PREVIA (SWEETALERT) ---
if (formPost) {
    formPost.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('tituloPost').value;
        const contenido = document.getElementById('contenidoPost').value;
        const fechaActual = new Date().toISOString().split('T')[0];

        Swal.fire({
            title: 'Vista Previa',
            html: `
                <div style="text-align: left; background: var(--input-bg); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); color: var(--text-color);">
                    <h3 style="margin: 0 0 10px 0; color: var(--primary);">${titulo}</h3>
                    <p style="margin: 0; font-size: 0.95rem;">${contenido}</p>
                </div>
                <br><p>¿Deseas publicar esto ahora?</p>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#636e72',
            confirmButtonText: '<i class="fa-solid fa-paper-plane"></i> Sí, publicar',
            cancelButtonText: 'Seguir editando'
        }).then((result) => {
            if (result.isConfirmed) {
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

                Swal.fire({
                    icon: 'success',
                    title: '¡Publicado con éxito!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
}

// --- 4. ELIMINAR ---
function eliminarPost(id) {
    Swal.fire({
        title: '¿Eliminar publicación?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff7675',
        cancelButtonColor: '#636e72',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            posts = posts.filter(post => post.id !== id);
            localStorage.setItem('postsBlog', JSON.stringify(posts));
            renderizarPosts();
            
            Swal.fire({
                title: '¡Eliminado!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// --- 5. EDITAR ---
function editarPost(id) {
    const post = posts.find(p => p.id === id);
    
    document.getElementById('tituloPost').value = post.titulo;
    document.getElementById('contenidoPost').value = post.contenido;
    
    editandoId = id;
    btnPublicar.innerHTML = '<i class="fa-solid fa-check"></i> Actualizar Publicación';
    
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

inicializarDatos();