// Search functionality for PlanetTickets.com - Ticket Sales Platform
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // Enhanced artist and event data for ticket sales
    const events = [
        { 
            name: 'Bad Bunny', 
            url: 'artistas/bad bunny/badbunny.html', 
            type: 'Reggaeton',
            venue: 'Estadio River Plate',
            date: '15 Nov 2025',
            price: 'Desde $15,000',
            status: 'Disponible'
        },
        { 
            name: 'Duki', 
            url: 'artistas/duki/duki.html', 
            type: 'Trap Argentino',
            venue: 'Luna Park',
            date: '22 Nov 2025',
            price: 'Desde $8,500',
            status: 'Últimas entradas'
        },
        { 
            name: 'Lollapalooza Argentina', 
            url: 'artistas/lollapalooza/lollapalooza.html', 
            type: 'Festival',
            venue: 'Hipódromo de San Isidro',
            date: '21-23 Mar 2026',
            price: 'Desde $45,000',
            status: 'Pre-venta'
        },
        { 
            name: 'Alejandro Sanz', 
            url: 'artistas/alejandro_sanz/alejandro_sanz.html', 
            type: 'Pop Latino',
            venue: 'Teatro Colón',
            date: '10 Dic 2025',
            price: 'Desde $12,000',
            status: 'Disponible'
        },
        { 
            name: 'Guns N\' Roses', 
            url: 'artistas/guns_n_roses/guns_n_roses.html', 
            type: 'Hard Rock',
            venue: 'Campo Argentino de Polo',
            date: '5 Feb 2026',
            price: 'Desde $25,000',
            status: 'Próximamente'
        },
        { 
            name: 'Coldplay', 
            url: '#', 
            type: 'Rock Alternativo',
            venue: 'Estadio River Plate',
            date: '18 Mar 2026',
            price: 'Desde $28,000',
            status: 'Agotado'
        },
        { 
            name: 'Taylor Swift', 
            url: '#', 
            type: 'Pop',
            venue: 'Estadio River Plate',
            date: '8 May 2026',
            price: 'Desde $35,000',
            status: 'Pre-venta VIP'
        },
        { 
            name: 'The Weeknd', 
            url: '#', 
            type: 'R&B/Pop',
            venue: 'Movistar Arena',
            date: '14 Jun 2026',
            price: 'Desde $18,000',
            status: 'Disponible'
        },
        { 
            name: 'Billie Eilish', 
            url: '#', 
            type: 'Pop Alternativo',
            venue: 'Luna Park',
            date: '3 Jul 2026',
            price: 'Desde $22,000',
            status: 'Disponible'
        },
        { 
            name: 'Imagine Dragons', 
            url: '#', 
            type: 'Rock Alternativo',
            venue: 'Estadio Único La Plata',
            date: '20 Aug 2026',
            price: 'Desde $20,000',
            status: 'Disponible'
        }
    ];
    
    // Venues for search
    const venues = [
        'Estadio River Plate',
        'Luna Park', 
        'Movistar Arena',
        'Teatro Colón',
        'Hipódromo de San Isidro',
        'Campo Argentino de Polo',
        'Estadio Único La Plata',
        'Palermo',
        'Microestadio Malvinas Argentinas'
    ];
    
    // Cities for search
    const cities = [
        'Buenos Aires',
        'Córdoba', 
        'Rosario',
        'Mendoza',
        'La Plata',
        'Mar del Plata',
        'Tucumán',
        'Salta'
    ];
    
    let searchTimeout;
    
    // Search input event listener with debouncing
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(this.value);
        }, 150);
    });
    
    // Search button click event
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleSearch(searchInput.value);
    });
    
    // Enter key press event
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(this.value);
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
    
    function handleSearch(query) {
        if (query.trim() === '') {
            hideSuggestions();
            return;
        }
        
        const results = performSearch(query);
        displaySuggestions(results);
    }
    
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        const results = [];
        
        // Search in events/artists
        events.forEach(event => {
            const relevanceScore = calculateRelevance(searchTerm, event);
            if (relevanceScore > 0) {
                results.push({
                    ...event,
                    category: 'Evento',
                    relevance: relevanceScore
                });
            }
        });
        
        // Search in venues
        venues.forEach(venue => {
            if (venue.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: venue,
                    url: '#',
                    type: 'venue',
                    category: 'Venue',
                    relevance: venue.toLowerCase().indexOf(searchTerm) === 0 ? 10 : 5
                });
            }
        });
        
        // Search in cities
        cities.forEach(city => {
            if (city.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: city,
                    url: '#',
                    type: 'city',
                    category: 'Ciudad',
                    relevance: city.toLowerCase().indexOf(searchTerm) === 0 ? 8 : 4
                });
            }
        });
        
        // Sort by relevance and limit results
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8);
    }
    
    function calculateRelevance(searchTerm, event) {
        let score = 0;
        const name = event.name.toLowerCase();
        const type = event.type.toLowerCase();
        const venue = event.venue.toLowerCase();
        
        // Exact name match gets highest score
        if (name === searchTerm) score += 20;
        // Name starts with search term
        else if (name.startsWith(searchTerm)) score += 15;
        // Name contains search term
        else if (name.includes(searchTerm)) score += 10;
        
        // Type/genre matches
        if (type.includes(searchTerm)) score += 8;
        
        // Venue matches
        if (venue.includes(searchTerm)) score += 6;
        
        return score;
    }
    
    function displaySuggestions(results) {
        if (results.length === 0) {
            searchSuggestions.innerHTML = `
                <div class="suggestion-item">
                    <div class="suggestion-content">
                        <div class="suggestion-name">No se encontraron resultados</div>
                        <div class="suggestion-category">Intenta con otro término de búsqueda</div>
                    </div>
                </div>
            `;
        } else {
            searchSuggestions.innerHTML = results.map(result => {
                if (result.category === 'Evento') {
                    return `
                        <div class="suggestion-item" data-url="${result.url}">
                            <div class="suggestion-content">
                                <div class="suggestion-name">${result.name}</div>
                                <div class="suggestion-details">
                                    <span class="suggestion-type">${result.type}</span> • 
                                    <span class="suggestion-venue">${result.venue}</span>
                                </div>
                                <div class="suggestion-info">
                                    <span class="suggestion-date">${result.date}</span> • 
                                    <span class="suggestion-price">${result.price}</span> • 
                                    <span class="suggestion-status status-${result.status.toLowerCase().replace(/\s+/g, '-')}">${result.status}</span>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="suggestion-item" data-url="${result.url}">
                            <div class="suggestion-content">
                                <div class="suggestion-name">${result.name}</div>
                                <div class="suggestion-category">${result.category}</div>
                            </div>
                        </div>
                    `;
                }
            }).join('');
            
            // Add click events to suggestions
            searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    if (url && url !== '#') {
                        window.location.href = url;
                    }
                });
            });
        }
        
        showSuggestions();
    }
    
    function showSuggestions() {
        searchSuggestions.classList.add('show');
    }
    
    function hideSuggestions() {
        searchSuggestions.classList.remove('show');
    }
    
    // Enhanced button animations
    searchButton.addEventListener('mouseenter', function() {
        this.style.animation = 'pulseGlow 0.8s ease-in-out';
    });
    
    searchButton.addEventListener('animationend', function() {
        this.style.animation = '';
    });
    
    // Enhanced input focus animations
    searchInput.addEventListener('focus', function() {
        this.closest('.search-wrapper').style.animation = 'borderGlow 2.5s ease-in-out infinite';
        this.closest('.search-wrapper').style.borderColor = 'rgba(255, 215, 0, 0.6)';
    });
    
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            if (!this.closest('.search-container').contains(document.activeElement)) {
                this.closest('.search-wrapper').style.animation = '';
                this.closest('.search-wrapper').style.borderColor = 'rgba(255, 215, 0, 0.4)';
            }
        }, 100);
    });
});