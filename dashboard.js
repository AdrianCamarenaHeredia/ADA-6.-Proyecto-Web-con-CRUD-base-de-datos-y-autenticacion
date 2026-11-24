document.addEventListener("DOMContentLoaded", async function() {
    await checkSession();

    // Fecha Dinámica
    const fecha = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaElemento = document.getElementById('fechaActual');
    if (fechaElemento) fechaElemento.innerText = fecha.toLocaleDateString('es-ES', opciones);

    try {
        const response = await fetch('api_productos.php?action=low_stock');
        const productos = await response.json();
        const tbody = document.getElementById('tablaAlertas');
        
        tbody.innerHTML = '';
        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay productos con stock bajo.</td></tr>';
        } else {
            productos.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.nombre}</td>
                        <td class='text-danger fw-bold'>${p.stock}</td>
                        <td>${p.stock_minimo}</td>
                        <td>
                            <a href='movimientos.html?producto_id=${p.id}' class='btn btn-sm btn-outline-primary'>
                                <i class="fas fa-truck-loading me-1"></i> Surtir
                            </a>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) { console.error('Error al cargar alertas:', error); }

    // Calculadora
    window.calcInput = function(val) {
        let display = document.getElementById('calcDisplay');
        if (display.value === "0" || display.value === "Error") display.value = val; 
        else display.value += val; 
    };
    window.calcClear = function() { document.getElementById('calcDisplay').value = "0"; };
    window.calcCalculate = function() {
        let display = document.getElementById('calcDisplay');
        try { display.value = new Function("return " + display.value)(); } 
        catch (e) { display.value = "Error"; }
    };
});