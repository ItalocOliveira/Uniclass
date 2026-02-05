// Variáveis de estado global
var currentFloor = 0;
var locais = [];

var buildingWithInterior = null;
var focusedBuilding = null;
var lastVisitedPlace = null;
var destinationBuilding = null;
var posicaoUsuario = null;
var posicaoDestino = null;
var ultimaPosicaoCalc = null;
var userMarker = null; 

var onRoute = false;

// Fecth para obter locais;
fetch('documents/data/pontos_unipe.geojson')
    .then(response => response.json())
    .then(data => {
        locais = data.features; 

        renderMarkers(locais);
        
        console.log(`${locais.length} locais carregados.`);
    })
    .catch(err => console.error("Erro ao carregar locais:", err));

// Fetch para obter geofencing
fetch('documents/data/predios_com_interior.geojson')
    .then(response => response.json())
    .then(data => {
        buildingWithInterior= L.geoJSON(data);
        console.log(`Camada de Geofencing criada com sucesso.`);
    })
    .catch(err => console.error("Erro ao carregar predios:", err));