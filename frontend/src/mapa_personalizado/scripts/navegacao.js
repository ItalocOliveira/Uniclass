// --- VARIÁVEIS DE CONTROLE ---
var userMarker = null;      // Marcador do usuário
var posicaoUsuario = null;  // {lat, lng} atual
var posicaoDestino = null;  // {lat, lng} do destino
var ultimaPosicaoCalc = null;

// --- ÍCONE DO USUÁRIO ---
var iconGPS = L.divIcon({
    className: 'css-icon',
    html: '<div class="gps-ring"></div><div class="gps-marker" style="width:10px;height:10px;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// --- CHAMADA DA API JAVA ---
function calcularRota(pontoA, pontoB) {
    // URL da API local do GraphHopper
    let modoAtual = 'pedestrian'
    const baseUrl = "/graphhopper/api"

    var url =   `${baseUrl}?` +
                `point=${pontoA.lat},${pontoA.lng}` +
                `&point=${pontoB.lat},${pontoB.lng}` +
                `&profile=${modoAtual}` +
                `&points_encoded=false`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpa rota anterior
            camadaRota.clearLayers();

            if (!data.paths || data.paths.length === 0) {
                console.error("Nenhuma rota encontrada.");
                return;
            }

            var caminho = data.paths[0].points.coordinates;
            var latlngs = caminho.map(coord => [coord[1], coord[0]]);
            var distanciaMetros = data.paths[0].distance;

            // Desenha a rota
            L.polyline(latlngs, {color: 'blue', weight: 4}).addTo(camadaRota);

            // Adiciona marcador final fixo na rota
            L.marker(pontoB).addTo(camadaRota);
            
            painelDinamico(distanciaMetros);
            console.log(`Distância: ${Math.round(distanciaMetros)} metros`);
        })
        .catch(err => console.error("Erro ao conectar com GraphHopper:", err));
}

function painelDinamico(metros) {
    var painelDistancia = document.getElementById('painel-distancia');
    var textoDistancia = document.getElementById('distancia-texto');
    var painelChegada = document.getElementById('painel-chegada');

    // Torna o painel visivel no css
    painelDistancia.style.display = 'block';

    // Verificação de chegada
    if (metros < 15) {
        painelDistancia.style.display = 'none';
        painelChegada.style.display = 'block';
    }
    else {
        if (metros > 15 && metros < 1000) {
            // Converte para Km se for longe
            textoDistancia.innerText = Math.round(metros) + " m";
        }
        else {
            texto.innerText = (metros / 1000).toFixed(1) + " km";
        }
    }
}

function encerrarNavegacao() {
    camadaRota.clearLayers();
    document.getElementById('painel-chegada').style.display = 'none';
    document.getElementById('painel-distancia').style.display = 'none';

    // Reseta variaveis de controle
    posicaoDestino = null;
    ultimaPosicaoCalc = null;
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
//                     calcularRota(posicaoUsuario, posicaoDestino);
//                     ultimaPosicaoCalc = posicaoUsuario; // Atualiza a referência
//                 }
//             }
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

var definindoOrigem = true;

// --- INTERAÇÃO COM USUÁRIO ---
map.on('click', function(e) {
    if(definindoOrigem){
        // Limpa a rota anteriormente feita
        if(typeof camadaRota !== 'undefined'){
            camadaRota.clearLayers();
        }

        posicaoUsuario = e.latlng;

        // Atualiza o marcador do usuário
        if (!userMarker) {
            userMarker = L.marker(posicaoUsuario, {icon: iconGPS, zIndexOffset: 1000}).addTo(map);
        } else {
            userMarker.setLatLng(posicaoUsuario);
        }

        definindoOrigem = false;
    }
    else {
        // Recebe o destino do usuário por meio do click
        posicaoDestino = e.latlng;

        // Confirmação de destino
        var conteudoPopup = `
            <div style="text-align: center;">
                <p style="margin: 5px 0;">Navegar até aqui?</p>
                <button class="btn-ir" onclick="confirmarNavegacao()">IR</button>
            </div>
            <style>
                .btn-ir {
                    background-color: #3553C1; /* Verde */
                    border: none;
                    color: white;
                    padding: 8px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                    font-weight: bold;
                }
            </style>
            
            `;

        L.popup()
            .setLatLng(posicaoDestino)
            .setContent(conteudoPopup)
            .openOn(map);

        // Window para o html do popup
        window.confirmarNavegacao = function() {
            // Fecha o popup
            map.closePopup();

            // Adiciona um marcador no destino
            L.marker(posicaoDestino).addTo(camadaRota);

            calcularRota(posicaoUsuario, posicaoDestino);

            definindoOrigem = true;
        }
    }
});