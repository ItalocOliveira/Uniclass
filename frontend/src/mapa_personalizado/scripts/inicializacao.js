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
    maxBoundsViscosity: 1.0,
    zoomSnap: 0,
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

var camadasLabels = {
    0: L.layerGroup(), 
    1: L.layerGroup(),
    2: L.layerGroup()
};

var camadaRota = L.layerGroup().addTo(map);

var andarAtual = 0;
function mudarAndar(andar){
    andarAtual = andar;

    Object.values(camadasIndoor).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    Object.values(camadasLabels).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    if (map.getZoom() < 19) {
        console.log("Zoom insuficiente para mostrar detalhes internos.");
        return;
    }

    if (camadasIndoor[andar]) {
        camadasIndoor[andar].addTo(map);
    }
    if (camadasLabels[andar]) {
        camadasLabels[andar].addTo(map);
    }

    console.log(`Visualização atualizada para Andar ${andar} (Com Zoom Máximo)`);
}

var locais = [];

fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features;
        criarLabelsNoMapa(locais);
        mudarAndar(andarAtual);

        console.log("Sistema de locais inicializado.");

    }).catch(err => console.error("Erro ao carregar destinos:", err));

function criarLabelsNoMapa(features) {
    features.forEach(local => {
        // Retirando informações do geojson
        var coords = local.geometry.coordinates; 
        var latLng = [coords[1], coords[0]];     
        var props = local.properties;
        var andar = props.level || 0;            

        var htmlIcone = `
            <div class="ponto-interesse"></div>
            <div class="label-texto">${props.nome}</div>
        `;

        // Cria o marcador customizado
        var labelMarker = L.marker(latLng, {
            icon: L.divIcon({
                className: 'label-sala',
                html: htmlIcone,
                iconSize: [100, 40],
                iconAnchor: [50, 10] 
            }),
            interactive: false
        });

        // Adiciona o mark na camada devida
        if (camadasLabels[andar]) {
            camadasLabels[andar].addLayer(labelMarker);
        }
    });
}