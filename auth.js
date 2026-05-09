// Manejo del formulario de Registro
const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue al enviar

        const usuario = document.getElementById('regUsuario').value;
        const password = document.getElementById('regPassword').value;

        // Creamos un objeto con los datos del usuario
        const nuevoUsuario = {
            usuario: usuario,
            password: password
        };

        // Guardamos en LocalStorage. Como solo acepta texto, usamos JSON.stringify
        localStorage.setItem('usuarioBlog', JSON.stringify(nuevoUsuario));
        
        alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        window.location.href = 'login.html'; // Te manda a la página de login
    });
}

// Manejo del formulario de Login
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuarioIngresado = document.getElementById('logUsuario').value;
        const passwordIngresado = document.getElementById('logPassword').value;

        // Traemos el usuario que guardamos en LocalStorage y lo convertimos a objeto con JSON.parse
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioBlog'));

        // Validamos si existe y si las credenciales coinciden
        if (usuarioGuardado && usuarioGuardado.usuario === usuarioIngresado && usuarioGuardado.password === passwordIngresado) {
            
            // Creamos la "sesión activa" para saber que el usuario ya entró
            localStorage.setItem('sesionActiva', 'true');
            alert('¡Bienvenido!');
            
            // Redirigir al blog (Por ahora lo dejo comentado hasta que hagamos esa parte)
            // window.location.href = 'index.html'; 
            console.log("Login exitoso");
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
}