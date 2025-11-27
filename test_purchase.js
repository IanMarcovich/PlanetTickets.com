// Test script to simulate a purchase and verify mis-entradas storage
global.localStorage = (function() {
    let store = {};
    return {
        getItem: function(k) { return store[k] || null; },
        setItem: function(k, v) { store[k] = v; },
        removeItem: function(k) { delete store[k]; },
        clear: function() { store = {}; },
        _dump: function() { return store; }
    };
})();

// Provide a fake current user function expected by the scripts
global.getCurrentUser = function() {
    return { id: 'test-1', name: 'Test User', email: 'test@example.com' };
};

console.log('Starting test: processPurchase simulation');

try {
    require('./mis-entradas.js');
    // processPurchase should now be defined globally
    if (typeof processPurchase !== 'function') {
        console.error('processPurchase not found');
        process.exit(1);
    }

    const result = processPurchase('UnitTest Artist', '../../imagenes/default-artist.jpg', 2, 'Campo VIP', 75000);
    console.log('processPurchase returned:', result);

    const stored = localStorage.getItem('planettickets_entradas');
    console.log('Stored planettickets_entradas:', stored);

    const parsed = JSON.parse(stored || '[]');
    console.log('Parsed tickets length:', parsed.length);
    console.log('Last ticket:', parsed[parsed.length-1]);

    if (parsed.length > 0) {
        console.log('Test passed: ticket saved.');
        process.exit(0);
    } else {
        console.error('Test failed: no tickets saved.');
        process.exit(2);
    }
} catch (err) {
    console.error('Error during test execution:', err);
    process.exit(3);
}
