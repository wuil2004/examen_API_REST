document.addEventListener("DOMContentLoaded", () => {
    const containerList = document.querySelector(".container-list");
    const searchInput = document.querySelector("#search");
    const formAgregar = document.querySelector("#formAgregar");
    const mensaje = document.querySelector("#mensaje");

    // 🔹 Obtener productos
    const fetchProductos = async () => {
        try {
            const response = await fetch("http://localhost:3000/");
            if (!response.ok) throw new Error("Error al obtener productos");

            const productos = await response.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    // 🔹 Mostrar productos en la lista
    const mostrarProductos = (productos) => {
        containerList.innerHTML = ""; // Limpiar antes de insertar

        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3 class="card-title">${producto.name}</h3>
                <p class="card-stock">Stock: ${producto.stock} pz</p>
                <div>
                    <button class="card-button card-button_delete" data-id="${producto._id}">
                        <i class="bi bi-trash-fill"></i> 
                    </button>
                    <span class="card-precio">$${producto.price}</span>
                </div>
            `;

            // Agregar event listener para eliminar
            const btnEliminar = card.querySelector(".card-button_delete");
            btnEliminar.addEventListener("click", () => eliminarProducto(producto._id));

            containerList.appendChild(card);
        });
    };

    // 🔹 Capturar el input de búsqueda
    if (searchInput) {
        searchInput.addEventListener("input", async (event) => {
            const query = event.target.value.trim();

            if (query === "") {
                fetchProductos(); // Si el input está vacío, mostrar todos los productos
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/search/?name=${query}`);
                if (!response.ok) throw new Error("Error al buscar productos");

                const productos = await response.json();
                mostrarProductos(productos);
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            }
        });
    }

    // 🔹 Agregar producto
    if (formAgregar) {
        formAgregar.addEventListener("submit", async function(event) {
            event.preventDefault();

            const nombre = document.querySelector("#nombre").value.trim();
            const precio = parseFloat(document.querySelector("#precio").value);
            const stock = parseInt(document.querySelector("#stock").value);

            if (!nombre || isNaN(precio) || isNaN(stock) || precio <= 0 || stock < 0) {
                mensaje.textContent = "Por favor, ingresa datos válidos.";
                mensaje.style.color = "red";
                return;
            }

            const nuevoProducto = { name: nombre, price: precio, stock: stock };

            try {
                const response = await fetch("http://localhost:3000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nuevoProducto)
                });

                if (!response.ok) throw new Error("Error en la respuesta del servidor");

                formAgregar.reset();
                mensaje.textContent = "Producto agregado correctamente.";
                mensaje.style.color = "green";

                if (containerList) {
                    fetchProductos(); // Actualizar lista solo si está presente
                }
            } catch (error) {
                mensaje.textContent = "Error al agregar el producto.";
                mensaje.style.color = "red";
                console.error("Error:", error);
            }
        });
    }

    // 🔹 Eliminar producto
    const eliminarProducto = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
            const response = await fetch(`http://localhost:3000/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("No se pudo eliminar el producto");

            fetchProductos(); // Actualizar la lista
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    // 🔹 Cargar productos al iniciar
    if (containerList) {
        fetchProductos();
    }
});
