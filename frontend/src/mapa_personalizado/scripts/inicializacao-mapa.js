// --- DADOS E CONFIGURAÇÕES ---
var limitesDoCampus = L.latLngBounds(
    [-7.16353530137493, -34.85958937363623], // Canto Inferior Esquerdo
    [-7.155443330743842, -34.84868800422955]  // Canto Superior Direito
);

// --- INICIALIZAÇÃO DO MAPA ---
var map = L.map('map', {
    center: [-7.159, -34.855],
    zoom: 18,
    minZoom: 17,
    maxZoom: 20,
    maxBounds: limitesDoCampus, 
    maxBoundsViscosity: 1.0
});

// Adiciona imagem base do mapa (Tiles locais)
L.tileLayer('tiles/png/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 20,
    tms: false,
    attribution: 'Mapa UNIPE'
}).addTo(map);

// --- LÓGICA DE ROTEAMENTO (GraphHopper) ---
var camadaRota = L.layerGroup().addTo(map);
var pontos = [];