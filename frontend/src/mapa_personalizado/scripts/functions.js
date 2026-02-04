// Troca de andares
function changeFloor(floor){
    andarAtual = floor;

    Object.values(camadasIndoor).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    Object.values(camadasLabels).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    if (map.hasLayer(camadaComercios)) map.removeLayer(camadaComercios);

    if (map.getZoom() >= 18) {
        camadaComercios.addTo(map);
    }
    if (map.getZoom() < 19) {
        console.log("Zoom insuficiente para detalhes internos, mantendo apenas gerais.");
        return; 
    }

    if (camadasIndoor[floor]) {
        camadasIndoor[floor].addTo(map);
    }
    if (camadasLabels[floor]) {
        camadasLabels[floor].addTo(map);
    }

    console.log(`Andar atualizado: Andar ${floor}`);
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
        if(isComercio){
            var dadosExtras = detalhesComercios[props.nome];

            // Placeholders
            var imageFinal= dadosExtras ? dadosExtras.img : "documents/imgs/no-image.jpg";
            var descFinal = dadosExtras ? dadosExtras.desc : "Sem descrição disponível.";

            var popupContent = `
                <div class="popup-comercio">
                    <h3>${props.nome}</h3>
                    <img src="${imageFinal}" alt="${props.nome}"/>
                    <p>${descFinal}</p>
                </div>
            `;

            labelMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'documents/imgs/assets/comercio-icon.png', 
                    iconSize: [44, 44], 
                    iconAnchor: [24, 38],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            camadaComercios.addLayer(labelMarker);
        }   
        if(isTurismo){
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
                    iconSize: [48, 48], 
                    iconAnchor: [24, 24],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            camadaComercios.addLayer(labelMarker);
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


// Paineis
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
    const andarDestino = localEncontrado.properties.level;

    if(andarDestino !== andarAtual) changeFloor(andarDestino);

    posicaoDestino = latLngDestino;

    L.marker(posicaoDestino)
        .bindPopup(`<b>${localEncontrado.properties.nome}</b><br>Andar: ${andarDestino}`)
        .addTo(camadaRota)
        .openPopup();

    if (posicaoUsuario) {
        calculateRoute(posicaoUsuario, posicaoDestino);
    } else {
        alert("Aguardando localização GPS...");
    }
}

var lastVisitedPlace = null;
function geofencer(position) {
    console.log("GEOFENCER CHAMADO");
    if(!prediosComInterior) return;

    var poligons = leafletPip.pointInLayer(position, prediosComInterior);

    if(poligons.length > 0){
        var standingOnPoligon = poligons[0];
        var props = standingOnPoligon.feature.properties;
        var currentPlace = props.name || "Área sem nome";

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
    }
}

function enterPlace(place) {
    console.log(`>>> TRIGGER: Entrou em ${place}`);
    // if (propriedades.tipo === "comercio") {
    //     console.log("Abrindo cardápio...");
    //     // abrirModalComercio(propriedades.nome);
    // }

    // if (propriedades.layer === "areas_restritas") {
    //     alert("⚠️ ÁREA RESTRITA! APENAS FUNCIONÁRIOS.");
    // }
}

function exitPlace(place) {
    console.log(`<<< TRIGGER: Saiu de ${place}`);
}
