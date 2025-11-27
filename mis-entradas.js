// Sistema de gestión de entradas compradas
class TicketManager {
    constructor() {
        this.storageKey = 'planettickets_entradas';
    }

    // Guardar una nueva entrada
    saveTicket(ticketData) {
        const tickets = this.getTickets();
        const ticket = {
            id: Date.now() + Math.random(),
            artistName: ticketData.artistName,
            artistImage: ticketData.artistImage,
            quantity: parseInt(ticketData.quantity) || 0,
            location: ticketData.location,
            unitPrice: parseInt(ticketData.unitPrice) || 0,
            totalPrice: (parseInt(ticketData.quantity) || 0) * (parseInt(ticketData.unitPrice) || 0),
            purchaseDate: new Date().toISOString(),
            userName: ticketData.userName
        };
        
        tickets.push(ticket);
        localStorage.setItem(this.storageKey, JSON.stringify(tickets));
        return ticket;
    }

    // Obtener todas las entradas del usuario actual
    getTickets() {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];
        
        const allTickets = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return allTickets.filter(ticket => ticket.userName === currentUser.name);
    }

    // Devolver una entrada (eliminarla)
    returnTicket(ticketId) {
        console.log('returnTicket llamado con ID:', ticketId);
        
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.error('No hay usuario logueado');
            return false;
        }
        
        console.log('Usuario actual:', currentUser.name);
        
        const allTickets = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        console.log('Todos los tickets:', allTickets);
        
        // Convertir ticketId a número para comparación correcta
        const numericTicketId = parseFloat(ticketId);
        console.log('ID numérico a buscar:', numericTicketId);
        
        const ticketIndex = allTickets.findIndex(ticket => {
            console.log('Comparando:', { ticketId: ticket.id, userName: ticket.userName, targetId: numericTicketId, targetUser: currentUser.name });
            return ticket.id === numericTicketId && ticket.userName === currentUser.name;
        });
        
        console.log('Índice encontrado:', ticketIndex);
        
        if (ticketIndex === -1) {
            console.error('Ticket no encontrado o no pertenece al usuario');
            return false;
        }
        
        const returnedTicket = allTickets[ticketIndex];
        console.log('Ticket a devolver:', returnedTicket);
        
        allTickets.splice(ticketIndex, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(allTickets));
        
        console.log('Ticket devuelto exitosamente');
        return returnedTicket;
    }

    // Obtener estadísticas del usuario
    getStats() {
        const tickets = this.getTickets();
        return {
            totalTickets: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
            totalSpent: tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0),
            eventsAttended: tickets.length,
            favoriteArtist: this.getMostFrequentArtist(tickets)
        };
    }

    getMostFrequentArtist(tickets) {
        if (tickets.length === 0) return 'Ninguno';
        
        const artistCount = {};
        tickets.forEach(ticket => {
            artistCount[ticket.artistName] = (artistCount[ticket.artistName] || 0) + ticket.quantity;
        });

        return Object.keys(artistCount).reduce((a, b) => 
            artistCount[a] > artistCount[b] ? a : b
        );
    }

    // Formatear precio
    formatPrice(price) {
        return '$' + price.toLocaleString('es-AR');
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Instancia global del gestor de tickets
const ticketManager = new TicketManager();

// Función para procesar compra desde los formularios de artistas
function processPurchase(artistName, artistImage, quantity, location, unitPrice) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('Debes iniciar sesión para comprar entradas.');
        window.location.href = '../../auth/login.html';
        return false;
    }

    const ticketData = {
        artistName: artistName,
        artistImage: artistImage,
        quantity: quantity,
        location: location,
        unitPrice: unitPrice,
        userName: currentUser.name
    };

    const ticket = ticketManager.saveTicket(ticketData);
    
    // Solo retornar true sin mostrar alert, el ticket-calculator se encarga del contador
    return true;
}

// Función para mostrar las entradas en la página de Mis Entradas
function displayMyTickets() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        document.body.innerHTML = `
            <div class="auth-redirect">
                <h2>Debes iniciar sesión</h2>
                <p>Para ver tus entradas necesitas estar logueado.</p>
                <a href="auth/login.html" class="login-btn">Iniciar Sesión</a>
            </div>
        `;
        return;
    }

    const tickets = ticketManager.getTickets();
    const container = document.getElementById('tickets-container');

    // Mostrar entradas
    if (container) {
        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="no-tickets">
                    <h3>No tienes entradas compradas</h3>
                    <p>¡Compra tu primera entrada y aparecerá aquí!</p>
                    <a href="index.html" class="buy-tickets-btn">Explorar Artistas</a>
                </div>
            `;
        } else {
            container.innerHTML = tickets.map((ticket, index) => {
                // Marcar la primera entrada (más reciente) si viene desde una compra
                const isNewPurchase = index === 0 && window.location.search.includes('new=true');
                const cardClass = isNewPurchase ? 'ticket-card new-purchase' : 'ticket-card';
                
                console.log('Generando HTML para ticket:', ticket); // Debug
                
                return `
                <div class="${cardClass}" ${isNewPurchase ? 'id="new-ticket"' : ''}>
                    <div class="ticket-header">
                        <img src="${ticket.artistImage}" alt="${ticket.artistName}" class="ticket-artist-img">
                        <div class="ticket-info">
                            <h3>${ticket.artistName}</h3>
                            <p class="ticket-date">${ticketManager.formatDate(ticket.purchaseDate)}</p>
                        </div>
                        ${isNewPurchase ? '<div class="new-badge">¡Nueva!</div>' : ''}
                    </div>
                    <div class="ticket-details">
                        <div class="detail-row">
                            <span>Cantidad:</span>
                            <strong>${ticket.quantity} ticket${ticket.quantity > 1 ? 's' : ''}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Ubicación:</span>
                            <strong>${ticket.location}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Precio unitario:</span>
                            <strong>${ticketManager.formatPrice(ticket.unitPrice)}</strong>
                        </div>
                        <div class="detail-row total">
                            <span>Total pagado:</span>
                            <strong>${ticketManager.formatPrice(ticket.totalPrice)}</strong>
                        </div>
                        <div class="ticket-actions">
                            <button class="download-pdf-btn" onclick="downloadTicketPDF('${ticket.id}', '${ticket.artistName}', '${ticket.quantity}', '${ticket.location}', '${ticket.unitPrice}', '${ticket.totalPrice}', '${ticket.purchaseDate}')">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                </svg>
                                Descargar PDF
                            </button>
                            <button class="return-ticket-btn" onclick="returnTicket('${ticket.id}', '${ticket.artistName}', ${ticket.quantity})">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17 13H7v-2h10v2z"/>
                                </svg>
                                Devolver Entrada
                            </button>
                        </div>
                    </div>
                </div>
            `}).join('');
            
            // Si hay una nueva compra, hacer scroll hacia ella después de un momento
            if (window.location.search.includes('new=true')) {
                setTimeout(() => {
                    const newTicket = document.getElementById('new-ticket');
                    if (newTicket) {
                        newTicket.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }
    }
}

// Función para devolver una entrada
function returnTicket(ticketId, artistName, quantity) {
    console.log('Intentando devolver ticket:', { ticketId, artistName, quantity });
    
    const confirmation = confirm(
        `¿Estás seguro de que quieres devolver ${quantity} ticket${quantity > 1 ? 's' : ''} de ${artistName}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmation) {
        console.log('Confirmación aceptada, llamando a ticketManager.returnTicket');
        const returnedTicket = ticketManager.returnTicket(ticketId);
        console.log('Resultado de returnTicket:', returnedTicket);
        
        if (returnedTicket) {
            // Mostrar mensaje de éxito
            showReturnSuccessMessage(returnedTicket);
            
            // Recargar la lista de entradas
            displayMyTickets();
        } else {
            console.error('Error: No se pudo devolver la entrada');
            alert('Error al devolver la entrada. Por favor intenta de nuevo.');
        }
    }
}

// Función para descargar entrada como PDF
function downloadTicketPDF(ticketId, artistName, quantity, location, unitPrice, totalPrice, purchaseDate) {
    // Verificar si jsPDF está disponible
    if (typeof window.jspdf === 'undefined') {
        alert('Error: Biblioteca PDF no disponible. Recargue la página.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Configurar fondo azul de toda la página
    pdf.setFillColor(0, 46, 50); // RGB del fondo de la página
    pdf.rect(0, 0, 210, 297, 'F'); // A4 dimensions in mm

    // Header con título principal
    pdf.setFontSize(28);
    pdf.setTextColor(0, 255, 255); // Color cian del logo
    pdf.text('PlanetTickets', 105, 35, { align: 'center' });

    // Subtítulo
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text('ENTRADA DIGITAL', 105, 50, { align: 'center' });

    // Línea separadora cian brillante
    pdf.setDrawColor(0, 255, 255);
    pdf.setLineWidth(1);
    pdf.line(30, 60, 180, 60);

    // Información del evento con fondo semitransparente
    pdf.setFillColor(0, 89, 95); // Color más claro para la sección de información
    pdf.roundedRect(25, 70, 160, 90, 8, 8, 'F');

    // Título de la sección
    pdf.setFontSize(14);
    pdf.setTextColor(0, 255, 255);
    pdf.text('DETALLES DEL EVENTO', 105, 85, { align: 'center' });

    // Información del evento
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Artista: ${artistName}`, 35, 100);
    pdf.text(`Ubicación: ${location}`, 35, 110);
    pdf.text(`Cantidad: ${quantity} entrada(s)`, 35, 120);
    pdf.text(`Precio unitario: $${unitPrice}`, 35, 130);
    pdf.text(`Precio total: $${totalPrice}`, 35, 140);
    pdf.text(`Fecha de compra: ${purchaseDate}`, 35, 150);

    // Código de entrada con fondo destacado
    pdf.setFillColor(0, 255, 255);
    pdf.roundedRect(25, 170, 160, 20, 5, 5, 'F');
    pdf.setTextColor(0, 46, 50);
    pdf.setFontSize(11);
    pdf.text(`Código de entrada: ${ticketId}`, 105, 182, { align: 'center' });

    // QR Code placeholder con mejor diseño
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(30, 200, 50, 50, 5, 5, 'F');
    pdf.setTextColor(0, 46, 50);
    pdf.setFontSize(10);
    pdf.text('QR CODE', 55, 230, { align: 'center' });

    // Información adicional al lado del QR
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('Presente este código al', 90, 215);
    pdf.text('ingresar al evento junto', 90, 225);
    pdf.text('con su documento de identidad', 90, 235);

    // Términos y condiciones con fondo
    pdf.setFillColor(0, 30, 35);
    pdf.roundedRect(25, 260, 160, 25, 5, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.text('• Esta entrada es válida solo para el evento especificado', 30, 270);
    pdf.text('• No reembolsable después de 24 horas antes del evento', 30, 277);
    pdf.text('• Debe presentarse junto con documento de identidad válido', 30, 284);

    // Footer
    pdf.setTextColor(0, 255, 255);
    pdf.setFontSize(8);
    pdf.text('www.planettickets.com', 105, 292, { align: 'center' });

    // Descargar el PDF
    pdf.save(`entrada-${artistName.replace(/\s+/g, '-')}-${ticketId}.pdf`);
}

// Función para mostrar mensaje de devolución exitosa
function showReturnSuccessMessage(ticket) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'return-success-overlay';
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
        border: 2px solid rgba(255, 165, 0, 0.6);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        max-width: 450px;
        width: 90%;
        backdrop-filter: blur(20px);
        box-shadow: 0 20px 60px rgba(255, 165, 0, 0.3);
    `;
    
    modal.innerHTML = `
        <div style="margin-bottom: 20px;">
            <svg width="80" height="80" fill="#FFA500" viewBox="0 0 24 24" style="margin-bottom: 20px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17 13H7v-2h10v2z"/>
            </svg>
        </div>
        <h2 style="color: #FFA500; margin-bottom: 15px; font-size: 1.8em; text-shadow: 0 0 15px rgba(255, 165, 0, 0.5);">
            ¡Entrada Devuelta!
        </h2>
        <div style="color: white; margin-bottom: 25px; line-height: 1.6;">
            <p style="margin: 8px 0;"><strong>Artista:</strong> ${ticket.artistName}</p>
            <p style="margin: 8px 0;"><strong>Cantidad:</strong> ${ticket.quantity} ticket${ticket.quantity > 1 ? 's' : ''}</p>
            <p style="margin: 8px 0;"><strong>Reembolso:</strong> ${ticketManager.formatPrice(ticket.totalPrice)}</p>
        </div>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px; font-size: 0.9em;">
            El reembolso será procesado en 3-5 días hábiles.
        </p>
        <button onclick="closeReturnMessage()" style="
            background: linear-gradient(135deg, #FFA500, #FF8C00);
            color: #001a1a;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1em;
        ">
            Entendido
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// Función para cerrar el mensaje de devolución
function closeReturnMessage() {
    const overlay = document.getElementById('return-success-overlay');
    if (overlay) {
        overlay.remove();
    }
}