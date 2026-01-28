// --- DADOS E CONFIGURAÇÕES ---
var limitesDoCampus = L.latLngBounds(
    // Canto Inferior Esquerdo
    [-7.16353530137493, -34.85958937363623],
    // Canto Superior Direito
    [-7.155443330743842, -34.84868800422955]  
);

// Inicialização do mapa
var map = L.map('map', {
    center: [-7.159, -34.855],
    zoom: 18,
    minZoom: 17,
    maxZoom: 20,
    maxBounds: limitesDoCampus, 
    maxBoundsViscosity: 1.0
});

// Renderização do mapa
L.tileLayer('documents/tiles/level_0/base/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 20,
    tms: false,
    attribution: '© Unitech - Mapa UNIPÊ'
}).addTo(map);

// Camadas
var camadasIndoor = {
    0: L.tileLayer('documents/tiles/level_0/classes/{z}/{x}/{y}.png', { 
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

var camadaRota = L.layerGroup().addTo(map);

var andarAtual = 0;
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

var locais = [];

fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features;
        console.log("Destinos carregados:", locais.length);
    }).catch(err => console.error("Erro ao carregar destinos:", err));
