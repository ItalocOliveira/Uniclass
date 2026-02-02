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
        desc: `
            <ul class="popup-lista">
                <li>🥐 Salgados variados</li>
                <li>🧃 Sucos naturais</li>
                <li>☕ Café</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
    },

    "Tapiocabana": {
        img: "documents/imgs/tapiocabana-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li>🌮 Tapiocas doces e salgadas</li>
                <li>🧀 Recheios variados</li>
                <li>🥤 Bebidas naturais</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
    },

    "Restaurante - Piscina": {
        img: "documents/imgs/restaurante-piscina-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li>🍽️ Pratos executivos</li>
                <li>🥗 Refeições completas</li>
                <li>🥤 Bebidas geladas</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
    },

    "Minaçaí": {
        img: "documents/imgs/minacai-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li>🍧 Açaí e cremes gelados</li>
                <li>🍓 Acompanhamentos variados</li>
                <li>🥤 Bebidas naturais</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
    },

    "Pizzaria": {
        img: "documents/imgs/pizzaria-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li>🍕 Pizzas artesanais</li>
                <li>🍔 Lanches rápidos</li>
                <li>🥤 Bebidas</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
    },

    "Comércio - Museu": {
        img: "documents/imgs/comercio-museu-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li>🥪 Lanches rápidos</li>
                <li>🥤 Bebidas</li>
                <li>🛍️ Souvenirs</li>
            </ul>

            <div class="popup-status aberto">
                🕒 Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">📍 Como chegar</button>
                <button class="btn-secundario">📞 Ligar</button>
                <button class="btn-secundario">⭐ Ver detalhes</button>
            </div>
        `
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





