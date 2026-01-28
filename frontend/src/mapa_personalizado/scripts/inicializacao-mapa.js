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

// Camadas
L.tileLayer('documents/tiles/level_0/base/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 20,
    tms: false,
    attribution: 'Mapa UNIPE'
}).addTo(map);

var camadasIndoor = {
    0: L.tileLayer('documents/tiles/level_0/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 20, tms: false, 
        opacity: 1, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    1: L.tileLayer('documents/tiles/level_1/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 20, tms: false, 
        opacity: 1, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    2: L.tileLayer('documents/tiles/level_2/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 20, tms: false, 
        opacity: 1, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
};

// Roteamento
var camadaRota = L.layerGroup().addTo(map);
var pontos = [];

function mudarAndar(andar){

    if(!camadasIndoor[andar]) return;
    console.log(`Mudando visualização para o andar: ${andar}`);

    Object.values(camadasIndoor).forEach(camada => {
        if (map.hasLayer(camada)) {
            map.removeLayer(camada);
        }
    });

    camadasIndoor[andar].addTo(map);

    andarAtual = andar;
}