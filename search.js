document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
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
        },
        { 
            name: 'Ed Sheeran', 
            url: 'artistas/ed_sheeran/ed_sheeran.html', 
            type: 'Pop Acústico',
            venue: 'Campo Argentino de Polo',
            date: '15-16 Sep 2027',
            price: 'Desde $30,000',
            status: 'Pre-venta'
        },
        { 
            name: 'Ariana Grande', 
            url: 'artistas/ariana_grande/ariana_grande.html', 
            type: 'Pop',
            venue: 'Movistar Arena',
            date: '22-23 Oct 2027',
            price: 'Desde $25,000',
            status: 'Disponible'
        },
        { 
            name: 'Bruno Mars', 
            url: 'artistas/bruno_mars/bruno_mars.html', 
            type: 'Pop/R&B',
            venue: 'Estadio River Plate',
            date: '5-6 Nov 2027',
            price: 'Desde $28,000',
            status: 'Disponible'
        },
        { 
            name: 'Dua Lipa', 
            url: 'artistas/dua_lipa/dua_lipa.html', 
            type: 'Pop',
            venue: 'Luna Park',
            date: '12 Dic 2027',
            price: 'Desde $24,000',
            status: 'Disponible'
        },
        { 
            name: 'Harry Styles', 
            url: 'artistas/harry_styles/harry_styles.html', 
            type: 'Pop Rock',
            venue: 'Estadio River Plate',
            date: '18-19 Ene 2028',
            price: 'Desde $32,000',
            status: 'Próximamente'
        },
        { 
            name: 'Rosalía', 
            url: 'artistas/rosalia/rosalia.html', 
            type: 'Flamenco Pop',
            venue: 'Personal Fest - Tecnópolis',
            date: '25 Feb 2028',
            price: 'Desde $26,000',
            status: 'Disponible'
        }
    ];
    
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
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(this.value);
        }, 150);
    });
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(this.value);
        }
    });
    
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
        
        // Primero intentar hacer scroll directo al artista
        const scrollSuccess = scrollToArtist(query);
        
        // Si no se encontró el artista directamente, mostrar sugerencias
        if (!scrollSuccess) {
            const results = performSearch(query);
            displaySuggestions(results);
        } else {
            hideSuggestions();
        }
    }
    
    function scrollToArtist(query) {
        const searchTerm = query.toLowerCase().trim();
        
        // Mapeo de nombres de artistas a sus clases CSS
        const artistMapping = {
            'duki': '.duki',
            'bad bunny': '.BAD_BUNNY',
            'badbunny': '.BAD_BUNNY',
            'lollapalooza': '.lollapalooza',
            'lolla': '.lollapalooza',
            'alejandro sanz': '.alejandro_sanz',
            'sanz': '.alejandro_sanz',
            'guns n roses': '.guns_n_roses',
            'guns n\' roses': '.guns_n_roses',
            'guns': '.guns_n_roses',
            'coldplay': '.coldplay',
            'taylor swift': '.taylor_swift',
            'taylor': '.taylor_swift',
            'the weeknd': '.the_weeknd',
            'weeknd': '.the_weeknd',
            'billie eilish': '.billie_eilish',
            'billie': '.billie_eilish',
            'imagine dragons': '.imagine_dragons',
            'imagine': '.imagine_dragons',
            'ed sheeran': '.ed_sheeran',
            'ed': '.ed_sheeran',
            'ariana grande': '.ariana_grande',
            'ariana': '.ariana_grande',
            'bruno mars': '.bruno_mars',
            'bruno': '.bruno_mars',
            'dua lipa': '.dua_lipa',
            'dua': '.dua_lipa',
            'harry styles': '.harry_styles',
            'harry': '.harry_styles',
            'rosalia': '.rosalia',
            'rosalía': '.rosalia'
        };
        
        // Artistas que están en la sección "Ver más" (ocultos inicialmente)
        const hiddenArtists = [
            '.coldplay', '.taylor_swift', '.the_weeknd', '.billie_eilish', 
            '.imagine_dragons', '.ed_sheeran', '.ariana_grande', '.bruno_mars', 
            '.dua_lipa', '.harry_styles', '.rosalia'
        ];
        
        // Buscar coincidencia exacta o parcial
        let targetClass = null;
        
        // Primero buscar coincidencia exacta
        if (artistMapping[searchTerm]) {
            targetClass = artistMapping[searchTerm];
        } else {
            // Buscar coincidencias parciales
            for (const [key, value] of Object.entries(artistMapping)) {
                if (key.includes(searchTerm) || searchTerm.includes(key)) {
                    targetClass = value;
                    break;
                }
            }
        }
        
        if (targetClass) {
            const artistElement = document.querySelector(targetClass);
            
            if (artistElement) {
                // Verificar si el artista está en la sección "Ver más"
                const isHiddenArtist = hiddenArtists.includes(targetClass);
                
                if (isHiddenArtist) {
                    // Verificar si la sección está oculta
                    const artistSection = artistElement.closest('#shows');
                    
                    if (artistSection && artistSection.style.display === 'none') {
                        // El artista está oculto, necesitamos mostrar la sección "Ver más"
                        const verMasButton = document.querySelector('.btn-ver-mas');
                        
                        if (verMasButton && verMasButton.textContent.includes('Ver más')) {
                            // Hacer click en "Ver más" primero
                            verMasButton.click();
                            
                            // Esperar a que las animaciones terminen, luego hacer scroll al artista
                            setTimeout(() => {
                                scrollToArtistElement(artistElement);
                            }, 800); // Tiempo suficiente para que termine la animación
                            
                            return true;
                        }
                    }
                }
                
                // Si el artista está visible o no está en la sección "Ver más", hacer scroll directamente
                scrollToArtistElement(artistElement);
                return true;
            }
        }
        
        return false;
    }
    
    function scrollToArtistElement(artistElement) {
        // Scroll suave hacia el artista
        artistElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        
        // Añadir efecto visual de highlight
        artistElement.style.transform = 'scale(1.05)';
        artistElement.style.transition = 'transform 0.5s ease';
        artistElement.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        
        // Remover el efecto después de 3 segundos
        setTimeout(() => {
            artistElement.style.transform = '';
            artistElement.style.boxShadow = '';
        }, 3000);
    }

    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        const results = [];
        
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
        
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8);
    }
    
    function calculateRelevance(searchTerm, event) {
        let score = 0;
        const name = event.name.toLowerCase();
        const type = event.type.toLowerCase();
        const venue = event.venue.toLowerCase();
        

        if (name === searchTerm) score += 20;

        else if (name.startsWith(searchTerm)) score += 15;

        else if (name.includes(searchTerm)) score += 10;
        

        if (type.includes(searchTerm)) score += 8;
        

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
            

            searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    const artistName = this.querySelector('.suggestion-name').textContent;
                    
                    // Si es un evento (artista), primero intentar scroll
                    if (this.querySelector('.suggestion-type')) {
                        const scrollSuccess = scrollToArtist(artistName);
                        if (scrollSuccess) {
                            hideSuggestions();
                            searchInput.value = artistName;
                            return;
                        }
                    }
                    
                    // Si no es scroll o no funciona, redirigir
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

    // Exponer funciones globalmente para el sticky header
    window.handleSearch = handleSearch;
    window.scrollToArtist = scrollToArtist;

    searchButton.addEventListener('mouseenter', function() {
        this.style.animation = 'pulseGlow 0.8s ease-in-out';
    });
    
    searchButton.addEventListener('animationend', function() {
        this.style.animation = '';
    });

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