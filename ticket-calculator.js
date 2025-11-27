// Función global para formatear precios
function formatPrice(price) {
    return '$' + price.toLocaleString('es-AR');
}

document.addEventListener('DOMContentLoaded', function() {
    const entradasSelect = document.getElementById('entradas');
    const lugarSelect = document.getElementById('lugar');
    const totalSpan = document.getElementById('total');
    
    function extractPriceFromSelect(selectEl) {
        if (!selectEl) return 0;
        const raw = selectEl.value || '';
        // Try to parse numeric value from value attribute
        let digits = raw.toString().replace(/[^0-9]/g, '');
        if (digits) {
            return parseInt(digits, 10);
        }

        // Fallback: parse from option text (e.g., "Campo: 32.000$")
        const text = selectEl.options[selectEl.selectedIndex]?.text || '';
        const match = text.match(/[0-9][0-9\.,]*/g);
        if (match && match.length > 0) {
            // take the first match, remove dots and commas used as thousands
            const num = match[0].replace(/[.,]/g, '');
            const parsed = parseInt(num, 10);
            return isNaN(parsed) ? 0 : parsed;
        }

        return 0;
    }

    function calcularPrecioTotal() {
        const cantidad = parseInt(entradasSelect.value) || 0;
        const precioUnitario = extractPriceFromSelect(lugarSelect) || 0;

        if (totalSpan) {
            if (cantidad > 0 && precioUnitario > 0) {
                const total = cantidad * precioUnitario;
                totalSpan.textContent = formatPrice(total);

                totalSpan.parentElement.classList.add('precio-actualizado');
                setTimeout(() => {
                    totalSpan.parentElement.classList.remove('precio-actualizado');
                }, 600);
            } else {
                totalSpan.textContent = '$0';
            }
        }
    }
    
    if (entradasSelect && lugarSelect && totalSpan) {
        entradasSelect.addEventListener('change', calcularPrecioTotal);
        lugarSelect.addEventListener('change', calcularPrecioTotal);
        
        calcularPrecioTotal();
    }
    
    const form = document.querySelector('form');
    if (form) {
        console.log('Formulario encontrado, agregando event listener');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Submit event triggered');
            
            const currentUser = getCurrentUser();
            console.log('Current user:', currentUser);
            if (!currentUser) {
                // Guardar la página actual para redirigir después del login
                try {
                    localStorage.setItem('redirectAfterLogin', window.location.href);
                } catch (err) {
                    console.warn('No se pudo guardar redirectAfterLogin', err);
                }

                alert('Debes iniciar sesión para comprar entradas. Serás redirigido al login.');
                window.location.href = '../../auth/login.html';
                return false;
            }
            
            const cantidad = parseInt(entradasSelect.value);
            const lugarValue = lugarSelect.value;
            const lugarText = lugarSelect.options[lugarSelect.selectedIndex].text;
            
            console.log('Datos de compra:', { cantidad, lugarValue, lugarText });
            
            if (!cantidad || !lugarValue) {
                alert('Por favor selecciona la cantidad de tickets y el lugar antes de comprar.');
                return false;
            }
            
            const precioUnitario = extractPriceFromSelect(lugarSelect);
            const total = cantidad * precioUnitario;
            const confirmacion = confirm(
                `¿Confirmas la compra de ${cantidad} ticket${cantidad > 1 ? 's' : ''} por un total de ${formatPrice(total)}?`
            );
            
            console.log('Confirmación:', confirmacion);
            
            if (confirmacion) {
                // Obtener información del artista desde el DOM
                const artistName = document.title.split(' - ')[0] || document.querySelector('h1')?.textContent || 'Artista';
                
                // Determinar imagen basada en el nombre del artista
                let artistImage = '/imagenes/default-artist.jpg'; // imagen por defecto
                if (artistName.toLowerCase().includes('taylor')) {
                    artistImage = '/imagenes/taylor.webp';
                } else if (artistName.toLowerCase().includes('bad bunny')) {
                    artistImage = '/imagenes/bad_bunny.jpg';
                } else if (artistName.toLowerCase().includes('duki')) {
                    artistImage = '/imagenes/duki.jpg';
                } else if (artistName.toLowerCase().includes('coldplay')) {
                    artistImage = '/imagenes/coldplay.jpg';
                } else if (artistName.toLowerCase().includes('weeknd')) {
                    artistImage = '/imagenes/theweeknd.jpg';
                } else if (artistName.toLowerCase().includes('billie')) {
                    artistImage = '/imagenes/billie.png';
                } else if (artistName.toLowerCase().includes('imagine dragons')) {
                    artistImage = '/imagenes/imagine_dragons.jpg';
                } else if (artistName.toLowerCase().includes('alejandro')) {
                    artistImage = './imagenes/alejandro_sanz.jpg';
                } else if (artistName.toLowerCase().includes('guns')) {
                    artistImage = '/imagenes/Guns-and-Roses-Argentina.jpg';
                } else if (artistName.toLowerCase().includes('lollapalooza')) {
                    artistImage = '/imagenes/lolla.jpg';
                }
                
                console.log('Datos del artista:', { artistName, artistImage });
                
                // Procesar la compra usando el sistema de entradas
                if (typeof processPurchase === 'function') {
                    console.log('processPurchase function found, calling it');
                    const success = processPurchase(artistName, artistImage, cantidad, lugarText, precioUnitario);
                    console.log('processPurchase result:', success);
                    if (success) {
                        // Resetear formulario
                        entradasSelect.value = '';
                        lugarSelect.value = '';
                        calcularPrecioTotal();
                        
                        // Mostrar contador y redirigir
                        console.log('Showing countdown');
                        showPurchaseCountdown(artistName, cantidad, lugarText, total);
                    }
                } else {
                    console.log('processPurchase function NOT found, using fallback');
                    // Fallback si no está cargado el sistema de entradas
                    alert(`¡Compra exitosa! 
                    
Artista: ${artistName}
Cantidad: ${cantidad} ticket${cantidad > 1 ? 's' : ''}
Ubicación: ${lugarText}
Total: ${formatPrice(total)}`);
                    
                    // Mostrar contador y redirigir también en fallback
                    showPurchaseCountdown(artistName, cantidad, lugarText, total);
                }
            }
        });
    } else {
        console.log('Formulario NO encontrado');
    }
});

// Función para mostrar contador de 5 segundos y redirigir
function showPurchaseCountdown(artistName, cantidad, ubicacion, total) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'purchase-countdown-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Crear contenido del modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgba(0, 46, 54, 0.95);
        border: 2px solid rgba(0, 255, 255, 0.5);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        backdrop-filter: blur(20px);
        box-shadow: 0 20px 60px rgba(0, 255, 255, 0.3);
    `;
    
    modal.innerHTML = `
        <div style="margin-bottom: 20px;">
            <svg width="80" height="80" fill="#00ffff" viewBox="0 0 24 24" style="margin-bottom: 20px;">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </div>
        <h2 style="color: #00ffff; margin-bottom: 15px; font-size: 1.8em; text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);">
            ¡Compra Exitosa!
        </h2>
        <div style="color: white; margin-bottom: 25px; line-height: 1.6;">
            <p style="margin: 8px 0;"><strong>Artista:</strong> ${artistName}</p>
            <p style="margin: 8px 0;"><strong>Cantidad:</strong> ${cantidad} ticket${cantidad > 1 ? 's' : ''}</p>
            <p style="margin: 8px 0;"><strong>Ubicación:</strong> ${ubicacion}</p>
            <p style="margin: 8px 0;"><strong>Total:</strong> ${formatPrice(total)}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 10px;">
                Redirigiendo a Mis Entradas en:
            </p>
            <div id="countdown-number" style="
                font-size: 3em; 
                color: #00ffff; 
                font-weight: bold; 
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
                margin: 10px 0;
            ">5</div>
        </div>
        <button onclick="redirectToMyTickets()" style="
            background: linear-gradient(135deg, #00ffff, #0099cc);
            color: #001a1a;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1em;
        ">
            Ir Ahora a Mis Entradas
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Iniciar countdown
    let countdown = 5;
    const countdownElement = document.getElementById('countdown-number');
    
    const timer = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(timer);
            redirectToMyTickets();
        }
    }, 1000);
}

// Función para redirigir a Mis Entradas
function redirectToMyTickets() {
    const overlay = document.getElementById('purchase-countdown-overlay');
    if (overlay) {
        overlay.remove();
    }
    window.location.href = '../../mis-entradas.html?new=true';
}