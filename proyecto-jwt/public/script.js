// Obtiene los elementos del HTML
const loginForm = document.getElementById("loginForm");
const btnPerfil = document.getElementById("btnPerfil");
const btnLogout = document.getElementById("btnLogout");
const resultado = document.getElementById("resultado");

// Evento al enviar el formulario de login
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Evita que la página se recargue

  // Obtiene el usuario y contraseña ingresados
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Envía los datos al servidor mediante una petición POST
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Muestra el mensaje enviado por el servidor
    if (response.ok) {
      resultado.innerText = data.message;
    } else {
      resultado.innerText = data.message;
    }
  } catch (error) {
    // Muestra error si falla la conexión
    resultado.innerText = "Error al conectar con el servidor.";
  }
});

// Evento para acceder a la ruta privada
btnPerfil.addEventListener("click", async function () {
  try {
    // Envía petición GET a la ruta protegida
    const response = await fetch("/perfil", {
      method: "GET",
      credentials: "include" // Envía la cookie al servidor
    });

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Muestra el resultado
    resultado.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    // Muestra error si falla la petición
    resultado.innerText = "Error al obtener perfil.";
  }
});

// Evento para cerrar sesión
btnLogout.addEventListener("click", async function () {
  try {
    // Envía petición POST para cerrar sesión
    const response = await fetch("/logout", {
      method: "POST",
      credentials: "include"
    });

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Muestra el mensaje del servidor
    resultado.innerText = data.message;
  } catch (error) {
    // Muestra error si falla la petición
    resultado.innerText = "Error al cerrar sesión.";
  }
});