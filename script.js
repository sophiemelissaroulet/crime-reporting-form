require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
], function (Map, MapView, Graphic, GraphicsLayer) {

    // Create a new map with a GraphicsLayer for the marker
    const map = new Map({
        basemap: "streets-navigation-vector"
    });

    const view = new MapView({
        container: "mapDiv",
        map: map,
        center: [-64.4906, -30.9819], // Initial center point (La Cumbre)
        zoom: 12
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Function to create a marker on the map
    function createMarker(lat, lon) {
        graphicsLayer.removeAll();

        const point = {
            type: "point",
            longitude: lon,
            latitude: lat
        };

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: "red",
            outline: {
                color: [255, 255, 255],
                width: 1
            }
        };

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
        });

        graphicsLayer.add(pointGraphic);
    }

    // Add a click event on the map view to get coordinates
    view.on("click", (event) => {
        const lat = event.mapPoint.latitude.toFixed(6);
        const lon = event.mapPoint.longitude.toFixed(6);

        // Set the hidden form inputs to these coordinates
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;

        // Create a marker at the selected location
        createMarker(lat, lon);
    });
});


document.getElementById("crimeReportForm").addEventListener("submit", function(event) {
    event.preventDefault();
    handleFormSubmit();
});

function handleFormSubmit() {
    const formData = {
        crimeType: document.getElementById("crimeType").value,
        crimeDate: document.getElementById("crimeDate").value,
        crimeTime: document.getElementById("crimeTime").value,
        crimeDescription: document.getElementById("crimeDescription").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value
    };

    sendDataToGoogleSheets(formData);
}
async function sendDataToGoogleSheets(data) {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwHvsPNhyoEXvyX2AML8eWDdXy9W8Xta7XMVRUL63SkGJTW6egiyY4wgsNqeYYEyIbIPQ/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "no-cors",
            body: JSON.stringify(data)
        });

        window.location.href = "thankyou.html";
    } catch (error) {
        console.error("An error occurred: ", error);

        window.location.href = "thankyou.html";
    }
}
