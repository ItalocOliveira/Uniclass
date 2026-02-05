// Icon do usuário
var iconGPS = L.divIcon({
    className: 'css-icon',
    html: '<div class="gps-ring"></div><div class="gps-marker" style="width:10px;height:10px;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// API java
function drawRoute(ghaphResponse, pontoB){
    // Limpa rota anterior
    routesLayer.clearLayers();

    var paths = ghaphResponse.paths[0];
    var coordinates = paths.points.coordinates;

    // Converter coordenadas do graphhopper para leaflet
    const latLngs = coordinates.map(coord => [coord[1], coord[0]]);

    // Desenha a rota
    var desenhoRota = L.polyline(latLngs, {
        color: '#3553C1', 
        weight: 4,
        opacity: 1,
        lineJoin: 'round'
    }).addTo(routesLayer);

    if (!ultimaPosicaoCalc) {
        map.fitBounds(desenhoRota.getBounds(), {
            padding: [50, 50],
            maxZoom: 20,
            animate: true
        });
    }

    // Adiciona marcador final fixo no final da rota
    if (pontoB) L.marker(pontoB).addTo(routesLayer);
}

function calculateRoute(pontoA, pontoB) {
    // URL da API local do GraphHopper
    let modoAtual = 'pedestrian'
    const baseUrl = "/graphhopper/api"

    var url =   `${baseUrl}?` +
                `point=${pontoA.lat},${pontoA.lng}` +
                `&point=${pontoB.lat},${pontoB.lng}` +
                `&profile=${modoAtual}` +
                `&points_encoded=false` +
                `&locale=pt_BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.paths || data.paths.length === 0) {
                console.error("Nenhuma rota encontrada.");
                return;
            }

            drawRoute(data, pontoB);
            onRoute = true;
            verifyDestination(pontoB);

            var distanciaMetros = data.paths[0].distance;
            dynamicPanel(distanciaMetros);
            console.log(`Distância: ${Math.round(distanciaMetros)} metros`);
        })
        .catch(err => console.error("Erro ao conectar com GraphHopper:", err));
}

function verifyDestination(pontoB) {
    destinationBuilding = null;

    if(!buildingWithInterior) return;

    const pipCoord = [pontoB.lng, pontoB.lat];
    var poligons = leafletPip.pointInLayer(pipCoord, buildingWithInterior);

    if (poligons.length > 0) {
        var props = poligons[0].feature.properties;
        var nomePredioDestino = props.nome;
        
        destinationBuilding = nomePredioDestino;

        if (!lastVisitedPlace) {
            enterPlace(destinationBuilding);
        }
    } else {
        if (focusedBuilding && !lastVisitedPlace) {
            exitPlace(focusedBuilding);
        }
    }
}

function finishNavigation() {
    routesLayer.clearLayers();
    document.getElementById('painel-chegada').style.display = 'none';
    document.getElementById('painel-distancia').style.display = 'none';

    // Reseta variaveis de controle
    posicaoDestino = null;
    ultimaPosicaoCalc = null;
    onRoute = false;
}

// --- MONITORAMENTO GPS ---
// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//         function(pos){
//             var lat = pos.coords.latitude;
//             var lng = pos.coords.longitude;
//             posicaoUsuario = L.latLng(lat, lng);

//             // Cria ou atualiza o ícone do usuário no mapa
//             if (!userMarker) {
//                 userMarker = L.marker(posicaoUsuario, {icon: iconGPS, zIndexOffset: 1000}).addTo(map);
//                 map.setView(posicaoUsuario, 18);
//             } else {
//                 userMarker.setLatLng(posicaoUsuario);
//             }

//             // Se já existe um destino, atualiza a rota automaticamente
//             if (posicaoDestino) {
//                 // Calcula distância desde o último cálculo
//                 var dist = 0;
//                 if (ultimaPosicaoCalc) {
//                     dist = posicaoUsuario.distanceTo(ultimaPosicaoCalc);
//                 }
//                 // Só recalcula se andou mais de 5 metros ou se é a primeira vez
//                 if (!ultimaPosicaoCalc || dist > 5) {
//                     calculateRoute(posicaoUsuario, posicaoDestino);
//                     ultimaPosicaoCalc = posicaoUsuario; // Atualiza a referência
//                 }
//             }1
//         },
//         function(err) {
//             console.error("Erro GPS:", err);
//         },
//         { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
//     );
// }
// else {
//     alert("Seu navegador não suporta GPS.");
// }
