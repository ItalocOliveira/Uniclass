// --- DADOS E CONFIGURAÇÕES ---
var limitesDoCampus = L.latLngBounds(
    [-7.16353530137493, -34.85958937363623],
    [-7.155443330743842, -34.84868800422955]  
);

var map = L.map('map', {
    center: [-7.159, -34.855],
    zoom: 18,
    minZoom: 17,
    maxZoom: 22, // Aumentei um pouco para aproveitar o vetor
    maxBounds: limitesDoCampus, 
    maxBoundsViscosity: 1.0,
    zoomSnap: 0,
});

// --- ESTILOS E INTERAÇÃO ---

// CORREÇÃO 1: Nome da função ajustado para bater com a chamada
function pegarEstilo(feature) {
    const tipo = feature.properties.layer;
    switch (tipo) {
        case 'predios_academicos': return { color: "#555", weight: 1, fillColor: "#d9d0c9", fillOpacity: 1 };
        case 'predios_comerciais': return { color: "#555", weight: 1, fillColor: "#cfa8a8", fillOpacity: 1 };
        case 'area_verde_interna': return { color: "transparent", fillColor: "#c2e699", fillOpacity: 1 };
        case 'mata_preservada':    return { color: "transparent", fillColor: "#238443", fillOpacity: 1 };
        case 'esportes':           return { color: "#f3f3f3", weight: 2, fillColor: "#41ab5d", fillOpacity: 1 };
        case 'cor_fundo_mapa':     return { stroke: false, fillColor: "#f2f2f2", fillOpacity: 1 };
        default: return { color: "#333", weight: 1, fillColor: "#ccc", fillOpacity: 0.5 };
    }
}

function interacaoFeature(feature, layer) {
    if (feature.properties.nome) {
        layer.bindTooltip(feature.properties.nome, {
            permanent: false, 
            direction: "center",
            className: "label-tooltip"
        });
        layer.bindPopup(`<b>${feature.properties.nome}</b><br>${feature.properties.tipo || ''}`);
    }
    // Efeitos de Hover
    layer.on({
        mouseover: (e) => e.target.setStyle({ fillOpacity: 0.8 }),
        mouseout: (e) => e.target.setStyle({ fillOpacity: 1 })
    });
}

// --- CONFIGURAÇÃO DAS CAMADAS (HÍBRIDO: VETOR + TILES) ---

// CORREÇÃO 2: Definimos o nível 0 como um Grupo vazio por enquanto.
// O fetch vai preencher ele depois.
var camadasIndoor = {
    0: L.layerGroup(), // Vai receber o GeoJSON
    1: L.tileLayer('documents/tiles/level_1/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 22, tms: false, opacity: 1, maxBounds: limitesDoCampus 
    }),
    2: L.tileLayer('documents/tiles/level_2/{z}/{x}/{y}.png', { 
        minZoom: 17, maxZoom: 22, tms: false, opacity: 1, maxBounds: limitesDoCampus 
    }),
};

// --- CARREGAMENTO DO VETOR (TERRÉO) ---
fetch('documents/data/campus_vetor.geojson')
    .then(response => response.json())
    .then(data => {
        // Cria a camada vetorial, mas NÃO adiciona no 'map' direto.
        var camadaVetorial = L.geoJSON(data, {
            style: pegarEstilo, // Agora o nome bate
            onEachFeature: interacaoFeature
        });

        // CORREÇÃO 3: Adiciona o vetor dentro do gerenciador de camadas
        camadasIndoor[0].addLayer(camadaVetorial);

        // Se o mapa já estiver no andar 0, força uma atualização visual
        if (andarAtual === 0) {
            mudarAndar(0);
        }
        
        console.log("Mapa vetorial carregado e integrado ao Nível 0.");
    })
    .catch(err => console.error("Erro ao carregar mapa vetorial:", err));


// --- RESTANTE DO SISTEMA ---
var camadasLabels = {
    0: L.layerGroup(), 
    1: L.layerGroup(),
    2: L.layerGroup()
};

var camadaRota = L.layerGroup().addTo(map);
var andarAtual = 0;

function mudarAndar(andar){
    andarAtual = andar;

    // Remove tudo primeiro
    Object.values(camadasIndoor).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    Object.values(camadasLabels).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    // Validação de Zoom (pode ajustar para 18 se quiser ver o vetor de longe)
    if (map.getZoom() < 18) { 
        // DICA: Para vetores, podemos permitir zoom menor que tiles, 
        // pois vetores são leves. Tente mudar 20 para 18.
        console.log("Zoom insuficiente.");
        return;
    }

    // Adiciona as camadas do andar selecionado
    if (camadasIndoor[andar]) {
        camadasIndoor[andar].addTo(map);
    }
    if (camadasLabels[andar]) {
        camadasLabels[andar].addTo(map);
    }

    console.log(`Visualização: Andar ${andar}`);
}

// Carregamento dos Locais (Labels)
var locais = [];
fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features;
        gerarLabelsNoMapa(locais);
        mudarAndar(andarAtual); // Renderiza inicial
    }).catch(err => console.error("Erro labels:", err));

function gerarLabelsNoMapa(features) {
    features.forEach(local => {
        var coords = local.geometry.coordinates; 
        var latLng = [coords[1], coords[0]];     
        var props = local.properties;
        var andar = props.level || 0;            

        var htmlIcone = `
            <div class="ponto-interesse"></div>
            <div class="label-texto">${props.nome}</div>
        `;

        var labelMarker = L.marker(latLng, {
            icon: L.divIcon({
                className: 'label-sala',
                html: htmlIcone,
                iconSize: [200, 50],   // Ajustado conforme nossa conversa anterior
                iconAnchor: [100, 50]  // Centralizado
            }),
            interactive: false
        });

        if (camadasLabels[andar]) {
            camadasLabels[andar].addLayer(labelMarker);
        }
    });
}

// Monitor de Zoom
map.on('zoomend', function() {
    mudarAndar(andarAtual);
});