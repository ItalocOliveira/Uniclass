// Troca de andares
function changeFloor(floor){
    andarAtual = floor;

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
                    iconSize: [60, 60], 
                    iconAnchor: [31, 43],
                    popupAnchor: [0, -32]
                }),
                interactive: true 
            });

            labelMarker.bindPopup(popupContent);

            markers.addLayer(labelMarker);
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
