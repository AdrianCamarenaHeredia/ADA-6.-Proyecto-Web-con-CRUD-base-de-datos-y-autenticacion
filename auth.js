document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const btnLogout = document.getElementById('btnLogout');

    //Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            if (!loginForm.checkValidity()) {
                event.stopPropagation();
                loginForm.classList.add('was-validated');
                return;
            }

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');

            try {
                const response = await fetch('api_auth.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (data.status === 'success') {
                    window.location.href = 'dashboard.html';
                } else {
                    errorDiv.textContent = data.message;
                    errorDiv.classList.remove('d-none');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    //Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', async function(e) {
            e.preventDefault();
            await fetch('api_auth.php?action=logout');
            window.location.href = 'index.html';
        });
    }
});

// Funcion proteger la pagina
async function checkSession() {
    try {
        const response = await fetch('api_auth.php?action=check');
        const data = await response.json();
        if (!data.logged_in) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error de sesión:', error);
    }
}