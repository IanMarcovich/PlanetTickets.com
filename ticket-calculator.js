// Calculadora de Precio Total para Tickets - PlanetTickets.com
document.addEventListener('DOMContentLoaded', function() {
    const entradasSelect = document.getElementById('entradas');
    const lugarSelect = document.getElementById('lugar');
    const totalSpan = document.getElementById('total');
    
    // Función para formatear números con separadores de miles
    function formatPrice(price) {
        return '$' + price.toLocaleString('es-AR');
    }
    
    // Función para calcular el precio total
    function calcularPrecioTotal() {
        const cantidad = parseInt(entradasSelect.value) || 0;
        const precioUnitario = parseInt(lugarSelect.value) || 0;
        
        if (cantidad > 0 && precioUnitario > 0) {
            const total = cantidad * precioUnitario;
            totalSpan.textContent = formatPrice(total);
            
            // Añadir animación al precio total
            totalSpan.parentElement.classList.add('precio-actualizado');
            setTimeout(() => {
                totalSpan.parentElement.classList.remove('precio-actualizado');
            }, 600);
        } else {
            totalSpan.textContent = '$0';
        }
    }
    
    // Event listeners para cuando cambien las selecciones
    if (entradasSelect && lugarSelect && totalSpan) {
        entradasSelect.addEventListener('change', calcularPrecioTotal);
        lugarSelect.addEventListener('change', calcularPrecioTotal);
        
        // Calcular precio inicial si ya hay valores seleccionados
        calcularPrecioTotal();
    }
    
    // Validación del formulario
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const cantidad = parseInt(entradasSelect.value);
            const lugar = lugarSelect.value;
            
            if (!cantidad || !lugar) {
                e.preventDefault();
                alert('Por favor selecciona la cantidad de tickets y el lugar antes de comprar.');
                return false;
            }
            
            // Mostrar confirmación con el precio total
            const precioUnitario = parseInt(lugar);
            const total = cantidad * precioUnitario;
            const confirmacion = confirm(
                `¿Confirmas la compra de ${cantidad} ticket${cantidad > 1 ? 's' : ''} por un total de ${formatPrice(total)}?`
            );
            
            if (!confirmacion) {
                e.preventDefault();
                return false;
            }
        });
    }
});