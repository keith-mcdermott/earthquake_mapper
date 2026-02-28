window.onload = init;

async function init() {

    // // Get a reference to the form element
    // const myForm = document.getElementById('myForm');
    // // Get a reference to the area where we'll display the output
    // const outputArea = document.getElementById('outputArea');

    // // Add an event listener for the 'submit' event on the form
    // myForm.addEventListener('submit', function (event) {
    //     // Prevent the default form submission behavior (which reloads the page)
    //     event.preventDefault();

    //     // Get the values from each input field
    //     const inputValue1 = document.getElementById('input1').value;
    //     const inputValue2 = document.getElementById('input2').value;
    //     const inputValue3 = document.getElementById('input3').value;

    //     // Log the captured values to the browser console (useful for debugging)
    //     console.log('Input 1:', inputValue1);
    //     console.log('Input 2:', inputValue2);
    //     console.log('Input 3:', inputValue3);

    //     // Display the captured values on the webpage
    //     outputArea.innerHTML = `
    //         <p><strong>Captured Values:</strong></p>
    //         <ul>
    //             <li>Input 1: ${inputValue1}</li>
    //             <li>Input 2: ${inputValue2}</li>
    //             <li>Input 3: ${inputValue3}</li>
    //         </ul>
    //     `;

    //     myForm.reset();
    // });

    const mapElement = document.getElementById("map");
    const Esri_WorldStreetMap = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles &copy; Esri; Source: Esri",
        }
    );

    const Esri_NatGeoWorldMap = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles &copy;  National Geographic, Esri",
            maxZoom: 20,
        }
    );

    const Stadia_AlidadeSmooth = L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
        {
            minZoom: 0,
            maxZoom: 20,
            attribution:
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: "png",
            //   Authorization: Stadia-Auth1ed2785b-b9af-4404-a70d-bc0e277ffcc6
        }
    );

    const map = L.map(mapElement, {
        center: [0, 0],
        zoom: 2,
        noWrap: true,
        layers: [Stadia_AlidadeSmooth],
    });

}