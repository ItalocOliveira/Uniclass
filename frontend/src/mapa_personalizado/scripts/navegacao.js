var userMarker = null;      // Marcador do usuário
var posicaoUsuario = null;  // {lat, lng} atual
var posicaoDestino = null;  // {lat, lng} do destino
var ultimaPosicaoCalc = null;

// Icon do usuário
var iconGPS = L.divIcon({
    className: 'css-icon',
    html: '<div class="gps-ring"></div><div class="gps-marker" style="width:10px;height:10px;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// API java
function desenharRota(ghaphResponse, pontoB){
    // Limpa rota anterior
    camadaRota.clearLayers();

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
    }).addTo(camadaRota);

    if (!ultimaPosicaoCalc) {
        map.fitBounds(desenhoRota.getBounds(), {
            padding: [50, 50],
            maxZoom: 19
        });
    }

    // Adiciona marcador final fixo no final da rota
    if (pontoB) L.marker(pontoB).addTo(camadaRota);
}

function calcularRota(pontoA, pontoB) {
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

            desenharRota(data, pontoB);

            var distanciaMetros = data.paths[0].distance;
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
            textoDistancia.innerText = (metros / 1000).toFixed(1) + " km";
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

// Pontos de destino
function selecionarLocal(termoBusca){
    const localEncontrado = locais.find(feature => 
        feature.properties.nome.toLowerCase() === termoBusca.toLowerCase()
    );

    if (!localEncontrado) {
        alert("Local não encontrado!");
        return;
    }

    const coordenadas = localEncontrado.geometry.coordinates;
    const latLngDestino = L.latLng(coordenadas[1], coordenadas[0]); 
    const andarDestino = localEncontrado.properties.level;

    if(andarDestino !== andarAtual) mudarAndar(andarDestino);

    posicaoDestino = latLngDestino;

    L.marker(posicaoDestino)
        .bindPopup(`<b>${localEncontrado.properties.nome}</b><br>Andar: ${andarDestino}`)
        .addTo(camadaRota)
        .openPopup();

    if (posicaoUsuario) {
        calcularRota(posicaoUsuario, posicaoDestino);
    } else {
        alert("Aguardando localização GPS...");
    }
}




// DEV - TESTES
var definindoOrigem = true;
map.on('click', function(e) {
    if(definindoOrigem){
        // Limpa a rota anteriormente feita
        if(typeof camadaRota !== 'undefined'){
            camadaRota.clearLayers();
            encerrarNavegacao();
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

            calcularRota(posicaoUsuario, posicaoDestino);
            definindoOrigem = true;
        }
    }
});

// --- MEXER COM O TECLADO ---
const passoMovimento = 0.00002; 
const teclasPressionadas = {};

document.addEventListener('keydown', function(event) {
    teclasPressionadas[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    teclasPressionadas[event.key] = false;
});

setInterval(function() {
    if (!posicaoUsuario || !userMarker) return;

    let novaLat = posicaoUsuario.lat;
    let novaLng = posicaoUsuario.lng;
    let moveu = false;
    
    // Cima
    if (teclasPressionadas['ArrowUp'] || teclasPressionadas['w'] || teclasPressionadas['W']) {
        novaLat += passoMovimento;
        moveu = true;
    }
    // Baixo
    if (teclasPressionadas['ArrowDown'] || teclasPressionadas['s'] || teclasPressionadas['S']) {
        novaLat -= passoMovimento;
        moveu = true;
    }
    // Esquerda
    if (teclasPressionadas['ArrowLeft'] || teclasPressionadas['a'] || teclasPressionadas['A']) {
        novaLng -= passoMovimento;
        moveu = true;
    }
    // Direita
    if (teclasPressionadas['ArrowRight'] || teclasPressionadas['d'] || teclasPressionadas['D']) {
        novaLng += passoMovimento;
        moveu = true;
    }

    if (moveu) {
        posicaoUsuario = L.latLng(novaLat, novaLng);
        userMarker.setLatLng(posicaoUsuario);
        
        map.panTo(posicaoUsuario); 

        if (posicaoDestino) {
            var dist = 0;
            if (ultimaPosicaoCalc) {
                dist = posicaoUsuario.distanceTo(ultimaPosicaoCalc);
            }

            if (!ultimaPosicaoCalc || dist > 10) {
                calcularRota(posicaoUsuario, posicaoDestino);
                ultimaPosicaoCalc = posicaoUsuario; 
            }
        }
    }

}, 50);

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
