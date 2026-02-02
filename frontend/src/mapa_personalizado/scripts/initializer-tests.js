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

var camadaComercios = L.layerGroup();
var camadaRota = L.layerGroup().addTo(map);

// Lógica de andar
var andarAtual = 0;
function mudarAndar(andar){
    andarAtual = andar;

    Object.values(camadasIndoor).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    Object.values(camadasLabels).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    if (map.hasLayer(camadaComercios)) map.removeLayer(camadaComercios);

    if (map.getZoom() >= 17) {
        camadaComercios.addTo(map);
    }
    if (map.getZoom() < 19) {
        console.log("Zoom insuficiente para detalhes internos, mantendo apenas gerais.");
        return; 
    }

    if (camadasIndoor[andar]) {
        camadasIndoor[andar].addTo(map);
    }
    if (camadasLabels[andar]) {
        camadasLabels[andar].addTo(map);
    }

    console.log(`Visualização completa: Andar ${andar}`);
}

var locais = [];
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
    "Comercio_Museu": {
        img: "documents/imgs/comercio-museu-icon.jpg",
        desc: "Salgados variados, sucos naturais e café. Aberto das 07h às 22h."
    }
};

fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features; 

        gerarLabelsNoMapa(locais);
        
        mudarAndar(andarAtual); 
        
        console.log(`Carregados ${locais.length} locais.`);
    })
    .catch(err => console.error("Erro ao carregar locais:", err));

function gerarLabelsNoMapa(features) {
    features.forEach(local => {
        // 1. Extração de dados básicos
        var coords = local.geometry.coordinates; 
        var latLng = [coords[1], coords[0]];     
        var props = local.properties;
        var andar = props.level || 0;            

        // 2. Verifica se é comércio
        var isComercio = (props.tipo && props.tipo.toLowerCase() === "comercio") || (props.layer && props.layer === "predios_comerciais");
        
        var labelMarker;

        // --- CENÁRIO A: É COMÉRCIO (Ícone de Imagem + Popup Rico) ---
        if (isComercio) {
            // Busca dados no dicionário
            var dadosExtras = detalhesComercios[props.nome];
            
            // Define padrão se não achar
            var imagemFinal = dadosExtras ? dadosExtras.img : "documents/img/sem_foto.png";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            // Monta o HTML do Popup
            var conteudoPopup = `
                <div class="popup-comercio">
                    <h3>${props.nome}</h3>
                    <img src="${imagemFinal}" alt="${props.nome}" onerror="this.src='documents/img/sem_foto.png'"/>
                    <p>${descFinal}</p>
                </div>
            `;

            // Cria o marcador com ÍCONE DE IMAGEM (PNG)
            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/assets/comercio-icon.png', // Seu ícone de pino/loja
                    iconSize: [32, 32], 
                    iconAnchor: [16, 32], // Ponta do pino
                    popupAnchor: [0, -32] // Popup abre acima do pino
                }),
                interactive: true 
            });

            // Vincula o Popup Rico
            labelMarker.bindPopup(conteudoPopup);

            // Adiciona na camada global
            camadaComercios.addLayer(labelMarker);
        }
        
        // --- CENÁRIO B: SALA DE AULA/OUTROS (Texto Flutuante) ---
        else {
            var htmlIcone = `
                <div class="ponto-interesse"></div>
                <div class="label-texto">${props.nome}</div>
            `;

            // Cria o marcador com ÍCONE HTML (DivIcon)
            labelMarker = L.marker(latLng, {
                icon: L.divIcon({
                    className: 'label-sala',
                    html: htmlIcone,
                    iconSize: [100, 40],
                    iconAnchor: [50, 10] 
                }),
                interactive: false // Geralmente texto não é clicável, mas pode mudar para true se quiser
            });

            // Adiciona na camada do andar
            if (camadasLabels[andar]) {
                camadasLabels[andar].addLayer(labelMarker);
            }
        }
    });
}