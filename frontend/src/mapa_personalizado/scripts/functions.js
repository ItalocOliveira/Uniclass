// Troca de andares (inutilizado por enquanto)
// function changeFloor(floor){
//     currentFloor = floor;

//     Object.values(indoorLayers).forEach(layer => {
//         if (map.hasLayer(layer)) map.removeLayer(layer);
//     });
//     Object.values(labelsLayer).forEach(layer => {
//         if (map.hasLayer(layer)) map.removeLayer(layer);
//     });

//     // if (indoorLayers[floor]) {
//     //     indoorLayers[floor].addTo(map);
//     // }
//     // if (camadasLabels[floor]) {
//     //     camadasLabels[floor].addTo(map);
//     // }
//     console.log(`Andar atualizado: Andar ${floor}`);
// }

// Pontos de destino
function selectLocation(searchTerm){
    const localEncontrado = locais.find(feature => 
        feature.properties.nome.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!localEncontrado) {
        alert("Local não encontrado!");
        return;
    }

    const coordenadas = localEncontrado.geometry.coordinates;
    const latLngDestino = L.latLng(coordenadas[1], coordenadas[0]); 
    const andarDestino = localEncontrado.properties.level || 0;;
    
    currentFloor = andarDestino;
    console.log(`Andar do destino definido para: ${currentFloor}`);

    posicaoDestino = latLngDestino;

    L.marker(posicaoDestino)
        .bindPopup(`<b>${localEncontrado.properties.nome}</b><br>Andar: ${andarDestino}`)
        .addTo(routesLayer)
        .openPopup();

    if (posicaoUsuario) {
        calculateRoute(posicaoUsuario, posicaoDestino);
    } else {
        alert("Aguardando localização GPS...");
    }
    Object.values(camadasIndoor).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    Object.values(camadasLabels).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    if (map.hasLayer(markers)) map.removeLayer(markers);

    markers.addTo(map);

    // if (camadasIndoor[floor]) {
    //     camadasIndoor[floor].addTo(map);
    // }
    // if (camadasLabels[floor]) {
    //     camadasLabels[floor].addTo(map);
    // }

    console.log(`Andar atualizado: Andar ${floor}`);
}
function togglePopupContent(nomeLoja, destino) {
    if (window.popupTemplates && window.popupTemplates[nomeLoja]) {
        const novoConteudo = window.popupTemplates[nomeLoja][destino];
        const popup = map._popup;

        if (popup) {
            const oldAutoPan = popup.options.autoPan;
            popup.options.autoPan = false;

            popup.setContent(novoConteudo);
            popup.update();

            // ⬇️ ESSENCIAL: reaplicar após trocar conteúdo
            setTimeout(() => {
                if (popup._container) {
                    L.DomEvent.disableClickPropagation(popup._container);
                    L.DomEvent.disableScrollPropagation(popup._container);
                }
                popup.options.autoPan = oldAutoPan;
            }, 0);
        }
    }
}



// Labels customizadas
function renderLabels(features) {
    features.forEach(local => {
        // Retirando informações do geojson
        var coords = local.geometry.coordinates; 
        var latLng = [coords[1], coords[0]];     
        var props = local.properties;
        var andar = props.level || 0;            

        // Verificação de pontos
        var isComercio = (props.tipo && props.tipo.toLowerCase() === "comercio");
        var isTurismo = (props.tipo && props.tipo.toLowerCase() === "turismo");
        var isReitoria = (props.tipo && props.tipo.toLowerCase() === "reitoria")
        var isBloco = (props.tipo && props.tipo.toLowerCase() === "bloco")
        var isBiblioteca = (props.tipo && props.tipo.toLowerCase() === "biblioteca")
        var isEstacionamento = (props.tipo && props.tipo.toLowerCase() === "estacionamento")
        var isMuseu = (props.tipo && props.tipo.toLowerCase() === "museu")
        var isAuditorio = (props.tipo && props.tipo.toLowerCase() === "auditorio")
        var isEva = (props.tipo && props.tipo.toLowerCase() === "eva")
        var isGinasio = (props.tipo && props.tipo.toLowerCase() === "ginasio")

if(isComercio){
    var dadosExtras = detalhesComercios[props.nome];

    // Placeholders
    var imageFinal = dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
    var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";
    // Pegamos o HTML do cardápio que está no seu initializer
    var cardapioFinal = dadosExtras ? dadosExtras.cardapioHTML : "<p>Cardápio indisponível.</p>";

    // O seu popupContent agora é a "Home"
    var popupContent = `
        <div class="popup-comercio">
            <h3>${props.nome}</h3>
            <img src="${imageFinal}" alt="${props.nome}"/>
            ${descFinal}
        </div>
    `;

    // --- LOGICA DE TROCA ---
// --- LOGICA DE TROCA ---
window.popupTemplates = window.popupTemplates || {};
window.popupTemplates[props.nome] = {
    home: popupContent,
    menu: cardapioFinal
};
// -----------------------

labelMarker = L.marker(latLng, {
    icon: L.icon({
        iconUrl: 'documents/imgs/assets/comercio-icon.png', 
        iconSize: [60, 60], 
        iconAnchor: [31, 43],
        popupAnchor: [0, -32]
    }),
    interactive: true 
});

labelMarker.bindPopup(popupContent, {
    maxWidth: 250,
    minWidth: 250,
    closeOnClick: false,
    autoPan: true
});

markers.addLayer(labelMarker);

// 🔒 BLINDAGEM TOTAL DO POPUP
labelMarker.on('popupopen', function (e) {
    const container = e.popup._container;

    if (!container) return;

    // Impede clique vazar pro mapa
    L.DomEvent.disableClickPropagation(container);

    // Impede scroll arrastar o mapa
    L.DomEvent.disableScrollPropagation(container);

    // Opcional: garante que cliques internos não fechem nada
    container.addEventListener('click', function (ev) {
        ev.stopPropagation();
    });
});

}
        if(isTurismo && props.nome.toLowerCase() === "praça das pedras"){
            var dadosExtras = detalhesTurismo[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-turismo">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/parque-das-pedras.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [28, 42],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isTurismo && props.nome.toLowerCase() === "museu"){
            var dadosExtras = detalhesTurismo[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-turismo">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/museu-icon.png', 
                    iconSize: [48, 48], 
                    iconAnchor: [24, 24],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isReitoria){
            var dadosExtras = detalhesReitoria[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-reitoria">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/reitoria-icon.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [34, 42],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isBiblioteca){
            var dadosExtras = detalhesBiblioteca[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-biblioteca">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/biblioteca-icon.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [34, 42],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isMuseu){
            var dadosExtras = detalhesMuseu[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-museu">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/museu-icon.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [32, 42],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isEstacionamento){
            var dadosExtras = detalhesEstacionamento[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-estacionamento">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/estacionamento-icon.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [30, 41],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isAuditorio){
            var dadosExtras = detalhesAuditorio[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-auditorio">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/auditorio-icon.png', 
                    iconSize: [66, 66], 
                    iconAnchor: [31,41],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isEva){
            var dadosExtras = detalhesEva[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-eva">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/eva-icon.png', 
                    iconSize: [66, 66],
                    iconAnchor: [34, 43],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        if(isGinasio){
            var dadosExtras = detalhesGinasio[props.nome];
            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-ginasio">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/ginasio.png', 
                                        iconSize: [66, 66], 
                    iconAnchor: [33, 40],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
        }
        else{
            var htmlIcon = `
                <div class="ponto-interesse"></div>
                <div class="label-texto">${props.nome}</div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.divIcon({
                    className: 'label-sala',
                    html: htmlIcon,
                    iconSize: [100, 40],
                    iconAnchor: [50, 10] 
                }),
                interactive: false
            });

            if (camadasLabels[andar]) {
                camadasLabels[andar].addLayer(labelMarker);
            }
        }
    });
}

// PAINEIS
function dynamicPanel(meters) {
    var painelDistancia = document.getElementById('painel-distancia');
    var textoDistancia = document.getElementById('distancia-texto');
    var painelChegada = document.getElementById('painel-chegada');

    // Torna o painel visivel no css
    painelDistancia.style.display = 'block';

    // Verificação de chegada
    if (meters < 15) {
        painelDistancia.style.display = 'none';
        painelChegada.style.display = 'block';
    }
    else {
        if (meters > 15 && meters < 1000) {
            // Converte para Km se for longe
            textoDistancia.innerText = Math.round(meters) + " m";
        }
        else {
            textoDistancia.innerText = (meters / 1000).toFixed(1) + " km";
        }
    }
}

// LÓGICA DE INTERIORES
function geofencer(position) {
    if(!buildingWithInterior) return;

    var poligons = leafletPip.pointInLayer(position, buildingWithInterior);

    if(poligons.length > 0){
        var props = poligons[0].feature.properties;
        var currentPlace = props.nome || "Área sem nome";

        if (lastVisitedPlace !== currentPlace) {
            enterPlace(currentPlace);
            lastVisitedPlace = currentPlace;
        }
    }
    else {
        if (lastVisitedPlace !== null) {
            exitPlace(lastVisitedPlace);
            lastVisitedPlace = null;
        }
        
        if (onRoute && destinationBuilding && focusedBuilding !== destinationBuilding) {
            enterPlace(destinationBuilding);
        }
    }
}

function enterPlace(place){
    console.log(`>>> TRIGGER: Entrou em ${place}`);

    if(focusedBuilding === place) return;

    console.log(`ATIVANDO INTERIOR: ${place}`);

    if (focusedBuilding && focusedBuilding !== place) {
        exitPlace(focusedBuilding); 
    }

    focusedBuilding = place;

    if (indoorLayers[currentFloor]) {
        indoorLayers[currentFloor].addTo(map);
    };
    
    // if (propriedades.tipo === "comercio") {
    //     console.log("Abrindo cardápio...");
    //     // abrirModalComercio(propriedades.nome);
    // }

    // if (propriedades.layer === "areas_restritas") {
    //     alert("⚠️ ÁREA RESTRITA! APENAS FUNCIONÁRIOS.");
    // }
}

function exitPlace(place) {

    // O modo interior só deve ser desativado quando:
    // - O usuário não está em rota 
    // - OU
    // - O usuário está em rota, mas o prédio o qual ele sai não é o  mesmo prédio do destino.
    console.log(`<<< TRIGGER: Saiu de ${place}`);
    
    focusedBuilding = null;

    Object.values(indoorLayers).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
}

// RENDERS
// function renderMarkers(){
//     if (map.hasLayer(markers)) map.removeLayer(markers);
//     markers.addTo(map);
// }

function renderMarkers(features) {
    markers.clearLayers();
    features.forEach(local => {
        // Retirando informações do geojson
        var coords = local.geometry.coordinates; 
        var latLng = [coords[1], coords[0]];     
        var props = local.properties;
        var andar = props.level || 0;            

        const tipo = props.tipo ? props.tipo.toLowerCase() : '';
        const nome = props.nome ? props.nome.toLowerCase() : '';


        const config = markerConfig[nome] || markerConfig[tipo];

        let labelMarker;

        if(config) {
            const dadosExtras = (config.dataSource && config.dataSource[props.nome]) ? config.dataSource[props.nome] : {};
            
            const imageFinal = dadosExtras.img || "documents/imgs/no-image.jpg";
            const descFinal = dadosExtras.desc || "Sem descrição disponível.";

            const popupContent = `
                <div class="popup">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}" onerror="this.src='documents/imgs/no-image.jpg'"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: `documents/imgs/assets/${config.icon}`,
                    iconSize: config.size,
                    iconAnchor: config.anchor,
                    popupAnchor: [0, -32]
                }),
                interactive: true
            });

            labelMarker.bindPopup(popupContent);
            markers.addLayer(labelMarker);
        }
        else {
            const htmlIcon = `
                <div class="ponto-interesse"></div>
                <div class="label-texto">${props.nome}</div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.divIcon({
                    className: 'label-sala',
                    html: htmlIcon,
                    iconSize: [100, 40],
                    iconAnchor: [50, 10]
                }),
                interactive: false
            });

            if (labelsLayer[andar]) {
                labelsLayer[andar].addLayer(labelMarker);
            }
        }

        if (!map.hasLayer(markers)) {
            markers.addTo(map);
        }
    });
}