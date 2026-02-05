var limitesDoCampus = L.latLngBounds(
    // Canto Inferior Esquerdo
    [-7.16353530137493, -34.85958937363623],
    // Canto Superior Direito
    [-7.155443330743842, -34.84868800422955]  
);

// Inicialização do mapa
var map = L.map('map', {
    center: [-7.159, -34.855],
    zoom: 17,
    minZoom: 18,
    maxZoom: 21,
    maxBounds: limitesDoCampus, 
    maxBoundsViscosity: 1.0,
    zoomSnap: 0,
});

// Renderização do mapa
L.tileLayer('documents/tiles/level_0/base/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 21,
    tms: false,
    attribution: '© Unitech - Mapa UNIPÊ'
}).addTo(map);

// Camadas
const indoorLayers = {
    0: L.tileLayer('documents/tiles/level_0/classes/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 21, tms: false, 
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    1: L.tileLayer('documents/tiles/level_1/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 21, tms: false, 
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    2: L.tileLayer('documents/tiles/level_2/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 21, tms: false, 
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
};

// Grupo de camadas para controle
var labelsLayer = L.layerGroup();
var markers = L.layerGroup();
var routesLayer = L.layerGroup().addTo(map);