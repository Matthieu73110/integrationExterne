function createMarker(lat, lng, type=null, name_station=null) {
    var marker = L.marker([lat, lng], { draggable: 'true' });
    if(type!== null){
        marker.on('dragend', function(e) {
            updateInputFields(marker.getLatLng(), type);
        });
    }else if (name_station !== null){
        marker.on('dragend', function(e) {
            // updateInputFields(marker.getLatLng(), type);
        });
        marker.bindPopup(name_station);
    }   
    return marker.addTo(map);
}

function searchAddress(type) {
    var query = document.getElementById(type + 'AddressSearch').value;
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.features, type);
        });
}

function displaySearchResults(results, type) {
    var resultsList = document.getElementById(type + 'SearchResults');
    resultsList.innerHTML = '';
    results.forEach(function(result) {
        var li = document.createElement('li');
        li.textContent = result.properties.label;
        li.onclick = function() {
            var selectedAddress = result.properties.label;
            document.getElementById(type + 'AddressSearch').value = selectedAddress; // Mise à jour du champ de saisie

            var lat = result.geometry.coordinates[1];
            var lng = result.geometry.coordinates[0];
            map.setView([lat, lng], 13);

            if (type === 'start') {
                if (startMarker) map.removeLayer(startMarker);
                startMarker = createMarker(lat, lng, 'start');
            } else {
                if (endMarker) map.removeLayer(endMarker);
                endMarker = createMarker(lat, lng, 'end');
            }

            resultsList.innerHTML = ''; // Nettoyer les résultats après la sélection
        };
        resultsList.appendChild(li);
    });
}

function resetStartMarker() {
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
        document.getElementById('startAddressSearch').value = '';
        document.getElementById('startSearchResults').innerHTML = '';
    }
}

function resetEndMarker() {
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
        document.getElementById('endAddressSearch').value = '';
        document.getElementById('endSearchResults').innerHTML = '';
    }
}

function setActiveMarker(type) {
    activeMarkerType = type;
}

function updateInputFields(latlng, type) {
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${latlng.lng}&lat=${latlng.lat}`)
        .then(response => response.json())
        .then(data => {
            if (data.features.length > 0) {
                var address = data.features[0].properties.label;
                document.getElementById(type + 'AddressSearch').value = address;
            }
        });
}