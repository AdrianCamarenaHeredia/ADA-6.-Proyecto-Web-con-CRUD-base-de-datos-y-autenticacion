document.addEventListener("DOMContentLoaded", async function() {
    await checkSession();

    const formProducto = document.getElementById('formProducto');
    const formEditProducto = document.getElementById('formEditProducto');
    const tablaProductos = document.getElementById('tablaProductos');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    // Cargar tabla
    async function cargarProductos() {
        const res = await fetch('api_productos.php?action=list');
        const productos = await res.json();
        tablaProductos.innerHTML = '';
        productos.forEach(p => {
            tablaProductos.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td>$${p.precio_venta}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button class='btn btn-sm btn-outline-primary btn-edit' 
                                data-id='${p.id}' data-nombre='${p.nombre}' 
                                data-precio='${p.precio_venta}' data-stock='${p.stock}'>
                            <i class='fas fa-edit'></i>
                        </button>
                        <button class='btn btn-sm btn-outline-danger btn-delete' data-id='${p.id}'>
                            <i class='fas fa-trash'></i>
                        </button>
                    </td>
                </tr>`;
        });

        //botones de editar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('edit-id').value = this.dataset.id;
                document.getElementById('edit-nombre').value = this.dataset.nombre;
                document.getElementById('edit-precio').value = this.dataset.precio;
                document.getElementById('edit-stock').value = this.dataset.stock;
                editModal.show();
            });
        });

        //botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (confirm('¿Seguro que deseas eliminar este producto?')) {
                    await fetch('api_productos.php?action=delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: this.dataset.id })
                    });
                    cargarProductos();
                }
            });
        });
    }

    //Crear Producto
    formProducto.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!formProducto.checkValidity()) {
            event.stopPropagation();
            formProducto.classList.add('was-validated');
            return;
        }
        const formData = new FormData(formProducto);
        const data = Object.fromEntries(formData.entries());
        
        await fetch('api_productos.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        formProducto.reset();
        formProducto.classList.remove('was-validated');
        cargarProductos();
    });

    //Editar Producto
    formEditProducto.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(formEditProducto);
        const data = Object.fromEntries(formData.entries());

        await fetch('api_productos.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        editModal.hide();
        cargarProductos();
    });

    cargarProductos();
});