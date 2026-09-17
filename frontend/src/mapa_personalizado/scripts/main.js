// Variáveis de estado global
var currentFloor = 0;
var locais = [];

var buildingsWithInterior = null;
var userMarker = null; 

// Nome do Predio em foco
var focusedBuilding = null; // Talvez descarte
// Nome do Predio de destino(se o destino for realmente prédio)
var destinationBuilding = null;
// Nome do último prédio visitado
var lastVisitedBuilding = null;

var userPosition = null;
var destinationPosition = null;
var lastCalculatedPosition = null;


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
        buildingsWithInterior= L.geoJSON(data);
        console.log(`Camada de Geofencing criada com sucesso.`);
    })
    .catch(err => console.error("Erro ao carregar predios:", err));