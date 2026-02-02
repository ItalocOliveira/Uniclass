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
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    1: L.tileLayer('documents/tiles/level_1/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 20, tms: false, 
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
    2: L.tileLayer('documents/tiles/level_2/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 20, tms: false, 
        opacity: 0.75, maxBounds: limitesDoCampus, maxBoundsViscosity: 1.0
    }),
};
var camadasLabels = {
    0: L.layerGroup(), 
    1: L.layerGroup(),
    2: L.layerGroup()
};
const detalhesComercios = {
    "Cantina_CT": {
        img: "documents/imgs/cantina-ct-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    },
    "Tapiocabana": {
        img: "documents/imgs/tapiocabana-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    },
    "Restaurante - Piscina": {
        img: "documents/imgs/restaurante-piscina-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    },
    "Minaçaí": {
        img: "documents/imgs/minacai-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    },
    "Pizzaria": {
        img: "documents/imgs/pizzaria-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    },
    "Comércio - Museu": {
        img: "documents/imgs/comercio-museu-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    }
};

var camadaComercios = L.layerGroup();
var camadaRota = L.layerGroup().addTo(map);

// Variáveis de controle
var andarAtual = 0;
var locais = [];

fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features; 

        renderLabels(locais);
        changeFloor(andarAtual); 
        
        console.log(`${locais.length} locais carregados.`);
    })
    .catch(err => console.error("Erro ao carregar locais:", err));





