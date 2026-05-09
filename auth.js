// --- LÓGICA DE MODO OSCURO PARA LOGIN Y REGISTRO ---
const btnDarkModeAuth = document.getElementById('btnDarkModeAuth');
const body = document.body;

if (btnDarkModeAuth) {
    const iconoDarkModeAuth = btnDarkModeAuth.querySelector('i');

    // Revisar si ya estaba activo
    if (localStorage.getItem('darkMode') === 'activado') {
        body.classList.add('dark-mode');
        iconoDarkModeAuth.classList.replace('fa-moon', 'fa-sun');
    }

    btnDarkModeAuth.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'activado');
            iconoDarkModeAuth.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('darkMode', 'desactivado');
            iconoDarkModeAuth.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// --- MANEJO DE REGISTRO ---
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        const usuario = document.getElementById('regUsuario').value;
        const password = document.getElementById('regPassword').value;

        const nuevoUsuario = { usuario: usuario, password: password };
        localStorage.setItem('usuarioBlog', JSON.stringify(nuevoUsuario));
        
        // SweetAlert2 en lugar de alert()
        Swal.fire({
            icon: 'success',
            title: '¡Cuenta creada!',
            text: 'Registro exitoso. Ahora puedes iniciar sesión.',
            confirmButtonColor: '#6c5ce7'
        }).then(() => {
            window.location.href = 'login.html';
        });
    });
}

// --- MANEJO DE LOGIN ---
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        const usuarioIngresado = document.getElementById('logUsuario').value;
        const passwordIngresado = document.getElementById('logPassword').value;
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioBlog'));

        if (usuarioGuardado && usuarioGuardado.usuario === usuarioIngresado && usuarioGuardado.password === passwordIngresado) {
            localStorage.setItem('sesionActiva', 'true');
            
            // SweetAlert2 con redirección automática
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Iniciando sesión...',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = 'index.html'; 
            });
            
        } else {
            // SweetAlert2 de error
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Usuario o contraseña incorrectos.',
                confirmButtonColor: '#ff7675'
            });
        }
    });
}

// --- PROTECCIÓN DE RUTAS ---
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    const sesionActiva = localStorage.getItem('sesionActiva');
    if (!sesionActiva) {
        window.location.href = 'login.html';
    }
}

// --- BOTÓN DE CERRAR SESIÓN ---
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', function() {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Tendrás que volver a ingresar tus credenciales.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('sesionActiva');
                window.location.href = 'login.html';
            }
        });
    });
}