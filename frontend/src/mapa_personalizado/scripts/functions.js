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
function getBuildingAtPosition(pos){
    if(!buildingsWithInterior) return null;

    var coordsArray = [pos.lng, pos.lat];
    const results = leafletPip.pointInLayer(coordsArray, buildingWithInterior);

    if (results.length > 0) {
        return results[0].feature.properties; 
    }

    return null;
}

function geofencer(pos) {
    // Verificar se a posição está em um prédio
    const currentBuilding = getBuildingAtPosition(pos);
    const currentBuildingName = currentBuilding? currentBuilding.nome : null;

    var buildingToRender = null;
    // Se um o usuário estiver em um prédio, renderizar o inteiror do prédio.
    if(currentBuildingName){
        buildingToRender = currentBuildingName;
    }
    // Se um o usuário estiver na rua mas o destino for um prédio, 
    // renderizar o inteiror do prédio de destino.
    else if(onRoute && destinationBuilding) {
        destinationBuilding = currentBuildingName;
    }

    if(buildingToRender){
        if (focusedBuilding !== buildingToRender) {
            enterPlace(buildingToRender);
        }
        else {
            if (focusedBuilding !== null) {
                exitPlace(focusedBuilding);
            }
        }
    }
}

function enterPlace(placeName){
    console.log(`>>> TRIGGER: Entrou em ${placeName}`);

    if(focusedBuilding === placeName) return;

    console.log(`ATIVANDO INTERIOR: ${placeName}`);

    if (focusedBuilding) {
        clearIndoorLayers();
    }
    focusedBuilding = placeName;

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

function exitPlace(placeName) {
    // O modo interior só deve ser desativado quando:
    // - O usuário não está em rota 
    // - OU
    // - O usuário está em rota, mas o prédio o qual ele sai não é o  mesmo prédio do destino.
    console.log(`<<< SAINDO PARA EXTERIOR: Saiu de ${placeName}`);
    
    focusedBuilding = null;
    limparCamadasIndoor();
}

function clearIndoorLayers() {
    Object.values(indoorLayers).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
}

// RENDERS
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

            if (markers[andar]) {
                markers[andar].addLayer(labelMarker);
            }
        }

        if (!map.hasLayer(markers)) {
            markers.addTo(map);
        }
    });
}

function renderSpecificBuilding(){
    Object.values(indoorLayers).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });


}