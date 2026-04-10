const API_URL = 'http://localhost:3000/api';

async function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
}

document.addEventListener('DOMContentLoaded', initAuth);

const loginForm = document.querySelector('#loginForm');
const loginNameInput = document.querySelector('#loginName');
const loginPasswordInput = document.querySelector('#loginPassword');

const registerForm = document.querySelector('#registerForm');
const registerNameInput = document.querySelector('#registerName');
const registerIdInput = document.querySelector('#registerId');
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

if (registerIdInput) {
  registerIdInput.addEventListener('input', (event) => {
    const input = event.target;
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (input.validity.valueMissing) {
      input.setCustomValidity('El ID es obligatorio');
      feedback.textContent = 'El ID es obligatorio';
      input.classList.add('is-invalid');
    } else {
      input.setCustomValidity('');
      feedback.textContent = '';
      input.classList.remove('is-invalid');
    }
  });
}

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

function initAuth() {
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
                const response = await fetchWithToken(`${API_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        login: data.loginName,
                        id: data.loginId,
                        password: data.loginPassword
                    })
                });
                const result = await handleResponse(response);
                localStorage.setItem('token', result.token);
                localStorage.setItem('usuarioActual', JSON.stringify(result.usuario));
                await Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido, ' + result.usuario.nombre,
                    timer: 2000,
                    showConfirmButton: false
                });
                window.location.href = 'index.html';
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: error.message
                });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

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
                const response = await fetchWithToken(`${API_URL}/auth/registro`, {
                    method: 'POST',
                    body: JSON.stringify({
                        nombre: data.registerName,
                        id: data.registerId,
                        username: data.registerUsername,
                        email: data.registerEmail,
                        password: data.registerPassword
                    })
                });
                const result = await handleResponse(response);
                localStorage.setItem('token', result.token);
                localStorage.setItem('usuarioActual', JSON.stringify(result.usuario));
                await Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Bienvenido, ' + result.usuario.nombre,
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrarse',
                    text: error.message
                });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

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
// 