// Partess del login
const loginForm = document.querySelector('#loginForm');
const loginNameInput = document.querySelector('#loginName');
const loginPasswordInput = document.querySelector('#loginPassword');

// Partes del registro
const registerForm = document.querySelector('#registerForm');
const registerNameInput = document.querySelector('#registerName');
const registerUsernameInput = document.querySelector('#registerUsername');
const registerEmailInput = document.querySelector('#registerEmail');
const registerPasswordInput = document.querySelector('#registerPassword');
const registerRepeatPasswordInput = document.querySelector('#registerRepeatPassword');
const registerCheckInput = document.querySelector('#registerCheck');


if (loginNameInput) {
  loginNameInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('Este campo es obligatorio');
      feedback.textContent = 'Este campo es obligatorio';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}

if (loginPasswordInput) {
  loginPasswordInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('La contraseña es obligatoria');
      feedback.textContent = 'La contraseña es obligatoria';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}


// Validación de Nombre
if (registerNameInput) {
  registerNameInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('El nombre es obligatorio');
      feedback.textContent = 'El nombre es obligatorio';
      input.classList.add('is-invalid');
    } else if (input.value.trim().length < 2) {
      input.setCustomValidity('El nombre debe tener al menos 2 caracteres');
      feedback.textContent = 'El nombre debe tener al menos 2 caracteres';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}

// Validación de Username
if (registerUsernameInput) {
  registerUsernameInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('El nombre de usuario es obligatorio');
      feedback.textContent = 'El nombre de usuario es obligatorio';
      input.classList.add('is-invalid');
    } else if (input.value.trim().length < 3) {
      input.setCustomValidity('El nombre de usuario debe tener al menos 3 caracteres');
      feedback.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}

// Validación de Email
if (registerEmailInput) {
  registerEmailInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('El email es obligatorio');
      feedback.textContent = 'El email es obligatorio';
      input.classList.add('is-invalid');
    } else if (input.validity.typeMismatch) {
      input.setCustomValidity('¡Ups! El formato del correo no es válido');
      feedback.textContent = '¡Ups! El formato del correo no es válido';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}

// Validación de Contraseña
if (registerPasswordInput) {
  registerPasswordInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');

    if (input.validity.valueMissing) {
      input.setCustomValidity('La contraseña es obligatoria');
      feedback.textContent = 'La contraseña es obligatoria';
      input.classList.add('is-invalid');
    } else if (input.validity.tooShort) {
      input.setCustomValidity('La contraseña debe tener al menos 6 caracteres');
      feedback.textContent = 'La contraseña debe tener al menos 6 caracteres';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }

    if (registerRepeatPasswordInput && registerRepeatPasswordInput.value) {
      validatePasswordMatch();
    }
  });
}

// Validación de Repetir Contraseña
if (registerRepeatPasswordInput) {
  registerRepeatPasswordInput.addEventListener('input', validatePasswordMatch);
}

function validatePasswordMatch() {
  const password = registerPasswordInput.value;
  const repeatPassword = registerRepeatPasswordInput.value;
  const feedback = registerRepeatPasswordInput.parentElement.querySelector('.invalid-feedback');

  if (registerRepeatPasswordInput.validity.valueMissing) {
    registerRepeatPasswordInput.setCustomValidity('Debes repetir la contraseña');
    feedback.textContent = 'Debes repetir la contraseña';
    registerRepeatPasswordInput.classList.add('is-invalid');
  } else if (password !== repeatPassword) {
    registerRepeatPasswordInput.setCustomValidity('Las contraseñas no coinciden');
    feedback.textContent = 'Las contraseñas no coinciden';
    registerRepeatPasswordInput.classList.add('is-invalid');
  } else {
    registerRepeatPasswordInput.setCustomValidity('');
    feedback.textContent = '';
    registerRepeatPasswordInput.classList.remove('is-invalid');
  }
}

// lei los terminos
if (registerCheckInput) {
  registerCheckInput.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.checked && input.validity.valueMissing) {
      input.setCustomValidity('Debes aceptar los términos y condiciones');
    } else {
      input.setCustomValidity('');
    }
  });
}



// por ahora de manera local en un json

let usuariosData = [];


async function cargarUsuarios() {
  try {
    const response = await fetch('data/usuarios.json');
    if (response.ok) {
      const usuariosIniciales = await response.json();
      usuariosData = usuariosIniciales;
    }

    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      const usuariosLS = JSON.parse(usuariosGuardados);
      usuariosLS.forEach(usuarioLS => {
        if (!usuariosData.find(u => u.email === usuarioLS.email || u.username === usuarioLS.username)) {
          usuariosData.push(usuarioLS);
        }
      });
    }

    // Guardar la lista combinada en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuariosData));
    
    console.log('Usuarios cargados:', usuariosData);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    // Si falla, intentar cargar solo de localStorage
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      usuariosData = JSON.parse(usuariosGuardados);
    }
  }
}


function guardarUsuario(usuarioData) {
  const nuevoId = usuariosData.length > 0 
    ? Math.max(...usuariosData.map(u => u.id)) + 1 
    : 1;

  const nuevoUsuario = {
    id: nuevoId,
    nombre: usuarioData.registerName,
    username: usuarioData.registerUsername,
    email: usuarioData.registerEmail,
    password: usuarioData.registerPassword 
  };

  // Verificar que no exista el email o username
  const existeEmail = usuariosData.find(u => u.email === nuevoUsuario.email);
  const existeUsername = usuariosData.find(u => u.username === nuevoUsuario.username);

  if (existeEmail) {
    throw new Error('Este email ya está registrado');
  }
  if (existeUsername) {
    throw new Error('Este nombre de usuario ya está en uso');
  }

  // Agregar usuario
  usuariosData.push(nuevoUsuario);
  
  // Guardar en localStorage
  localStorage.setItem('usuarios', JSON.stringify(usuariosData));
  
  console.log('Usuario registrado:', nuevoUsuario);
  return nuevoUsuario;
}

function validarLogin(loginName, password) {
  const usuario = usuariosData.find(u => 
    (u.email === loginName || u.username === loginName) && 
    u.password === password
  );

  if (!usuario) {
    throw new Error('Credenciales incorrectas. Verifica tu email/username y contraseña.');
  }

  return usuario;
}

// Cargar usuarios al iniciar
cargarUsuarios();


if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión...';

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      const usuario = validarLogin(data.loginName, data.loginPassword);

      localStorage.setItem('usuarioActual', JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        username: usuario.username,
        email: usuario.email
      }));

      await Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido, ' + usuario.nombre,
        timer: 2000,
        showConfirmButton: false
      });
      
      window.location.href = 'index.html';

    } catch (error) {
      console.error('Error en login:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.message
      });
    } finally {
      // Siempre reactivamos el botón
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Envío del formulario de Registro
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (registerPasswordInput.value !== registerRepeatPasswordInput.value) {
      registerRepeatPasswordInput.setCustomValidity('Las contraseñas no coinciden');
      registerRepeatPasswordInput.classList.add('is-invalid');
      registerForm.reportValidity();
      return;
    }

    if (!registerForm.checkValidity()) {
      registerForm.reportValidity();
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';

      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData.entries());

      delete data.registerRepeatPassword;

      const nuevoUsuario = guardarUsuario(data);

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Bienvenido a PetZone, ' + nuevoUsuario.nombre,
        timer: 2000,
        showConfirmButton: false
      });
      
      registerForm.reset();
      
      const loginTab = document.querySelector('#tab-login');
      if (loginTab) {
        const loginTabInstance = new bootstrap.Tab(loginTab);
        loginTabInstance.show();
      }

    } catch (error) {
      console.error('Error en registro:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: error.message
      });
    } finally {
      // Siempre reactivamos el botón
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Cambiar entre pestañas desde los enlaces
document.querySelectorAll('.switch-tab').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetTab = link.getAttribute('data-tab');
    const tabButton = document.querySelector(`#tab-${targetTab}`);
    if (tabButton) {
      const tabInstance = new bootstrap.Tab(tabButton);
      tabInstance.show();
    }
  });
});

// Limpiar validaciones al cambiar de pestaña
document.querySelectorAll('[data-bs-toggle="pill"]').forEach(button => {
  button.addEventListener('shown.bs.tab', () => {
    const activeForm = document.querySelector('.tab-pane.active form');
    if (activeForm) {
      activeForm.classList.remove('was-validated');
      activeForm.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
      });
    }
  });
});
