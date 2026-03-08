window.onload = init;

async function init() {

    let earthquake_layer

    const mapElement = document.getElementById("map");

    const OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap contributors'
    })

    const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 3,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });

    const Stadia_AlidadeSmooth = L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
        {
            minZoom: 3,
            maxZoom: 20,
            attribution:
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: "png",
            // noWrap: true,
        }
    );

    const baseMaps = {
        "<b>Gray Scale</b>": Stadia_AlidadeSmooth,
        "Dark": Stadia_AlidadeSmoothDark,
        "Street Map": OSM,
    };



    var southWest = L.latLng(-90, -180),
        northEast = L.latLng(90, 180),
        bounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapElement, {
        center: [0, 0],
        zoom: 3,
        layers: [Stadia_AlidadeSmooth],
        zoomControl: false,
        maxBounds: bounds, // Restricts panning outside these bounds

    });

    const overlayLayers = {};

    const layerControl = L.control.layers(baseMaps, overlayLayers, {
        collapsed: false,
        position: 'bottomright',
    }).addTo(map);

    const scaleBar = L.control.scale().addTo(map);

    const zoomHome = L.Control.zoomHome({ position: 'topright' });
    zoomHome.addTo(map);

        var sidebar = L.control.sidebar('sidebar', {
        position: 'left'
    });

    map.addControl(sidebar);
    setTimeout(function () {
        sidebar.show();
    }, 500);

    function getMonthDateRange(year, month) {
        // Ensure numbers
        year = Number(year);
        month = Number(month);

        // Pad month to 2 digits
        const monthStr = String(month).padStart(2, '0');

        // Start date is always the first of the month
        const start_date = `${year}-${monthStr}-01`;

        // Last day of month: create first day of next month, subtract 1 day
        const lastDay = new Date(year, month, 0).getDate();
        const end_date = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

        return { start_date, end_date };
    }

    // Example usage:
    // const year_input = '2024';
    // const month_input = '4';
    // const magnitude_input = '0';
    function loadData(year_input, month_input, magnitude_input) {
        const { start_date, end_date } = getMonthDateRange(year_input, month_input);
        const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start_date}&endtime=${end_date}&minmagnitude=${magnitude_input}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                // Remove old layer if it exists
                if (earthquake_layer) {
                    map.removeLayer(earthquake_layer);
                }

                earthquake_layer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, stylePoints(feature));
                    },
                    onEachFeature: function (feature, layer) {

                        layer.bindPopup(`<b>Magnitude ${feature.properties.mag}</b><br>${feature.properties.place}`);

                        layer.on('mouseover', () => layer.setStyle(hoverStyle));
                        layer.on('mouseout', () => layer.setStyle(stylePoints(feature)));
                    }
                }).addTo(map);

            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
            });


    }


    const stylePoints = (feature) => {
        const mag = feature.properties?.mag;

        // Handle missing or invalid magnitude
        if (mag == null || isNaN(mag)) {
            return {
                radius: 4,
                weight: 0.5,
                fillOpacity: 1,
                color: 'black',
                fillColor: 'black',
            };
        }

        // Dynamically scale radius
        // Example: radius = 2 * magnitude + 2
        const radius = 1.5 * mag + 1;

        // Color gradient based on magnitude
        let fillColor;
        if (mag <= 2.5) {
            fillColor = '#FF8A8A';
        } else if (mag <= 5) {
            fillColor = '#FF2E2E';
        } else if (mag <= 7) {
            fillColor = '#A30000';
        } else {
            fillColor = '#470000';
        }

        return {
            radius: radius,
            weight: 0.5,
            fillOpacity: 1,
            color: '#1A0000',
            fillColor: fillColor,
        };
    };

    const hoverStyle = {
        color: "yellow",
        weight: 2,
        fillColor: "yellow",
    };

    document.getElementById("data_form").addEventListener("submit", function (e) {

        e.preventDefault();

        const year_input = document.getElementById("year").value;
        const month_input = document.getElementById("month").value;
        const magnitude_input = document.getElementById("magnitude").value;

        loadData(year_input, month_input, magnitude_input);
    });

}