document.addEventListener("DOMContentLoaded", () => {
    const formAgregar = document.querySelector("#formAgregar");
    const mensaje = document.querySelector("#mensaje");

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
                mensaje.textContent = "Producto agregado exitosamente.";
                mensaje.style.color = "green";

                if (typeof fetchProductos === "function") {
                    fetchProductos(); 
                }

                
                setTimeout(() => {
                    mensaje.textContent = "";
                }, 3000);

            } catch (error) {
                mensaje.textContent = "Error al agregar el producto.";
                mensaje.style.color = "red";
                console.error("Error:", error);
            }
        });
    }
});
