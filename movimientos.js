document.addEventListener("DOMContentLoaded", async function() {
    await checkSession();

    const formMovimiento = document.getElementById('formMovimiento');
    const selectProductos = document.getElementById('selectProductos');
    const tablaMovimientos = document.getElementById('tablaMovimientos');
    const selectTipo = document.querySelector('select[name="tipo"]');

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function cargarSelectProductos() {
        const res = await fetch('api_productos.php?action=list');
        const productos = await res.json();
        
        selectProductos.innerHTML = '<option value="">Seleccione el producto...</option>';
        productos.forEach(p => {
            selectProductos.innerHTML += `<option value='${p.id}'>${p.nombre}</option>`;
        });

        const prodId = getQueryParam('producto_id');
        if (prodId) {
            selectProductos.value = prodId;
            if (selectTipo) {
                selectTipo.value = 'entrada';
                selectTipo.focus();
            }
        }
    }

    // Cargar Historial
    async function cargarMovimientos() {
        const res = await fetch('api_movimientos.php?action=list');
        const movimientos = await res.json();
        tablaMovimientos.innerHTML = '';
        
        if (movimientos.length === 0) {
            tablaMovimientos.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay movimientos registrados.</td></tr>';
        } else {
            movimientos.forEach(m => {
                const badge = m.tipo === 'entrada' ? 'bg-success' : 'bg-danger';
                const signo = m.tipo === 'entrada' ? '+' : '-';
                tablaMovimientos.innerHTML += `
                    <tr>
                        <td>${m.fecha}</td>
                        <td><span class='badge ${badge}'>${m.tipo}</span></td>
                        <td>${m.producto}</td>
                        <td class="${m.tipo === 'entrada' ? 'text-success' : 'text-danger'} fw-bold">${signo}${m.cantidad}</td>
                        <td>${m.email}</td>
                    </tr>`;
            });
        }
    }

    // Registrar Movimiento
    formMovimiento.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!formMovimiento.checkValidity()) {
            event.stopPropagation();
            formMovimiento.classList.add('was-validated');
            return;
        }
        const formData = new FormData(formMovimiento);
        const data = Object.fromEntries(formData.entries());

        await fetch('api_movimientos.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        formMovimiento.reset();
        formMovimiento.classList.remove('was-validated');
        
        window.history.replaceState({}, document.title, "movimientos.html"); 
        
        cargarMovimientos();
        cargarSelectProductos(); 
    });

    cargarSelectProductos();
    cargarMovimientos();
});