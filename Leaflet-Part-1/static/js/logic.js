// Define map tile layers
    let street_map = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
    let topographic_map = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

// Define the tile layer group
    let base_maps = {
        Street: street_map,
        Topography: topographic_map
    };

// Create the map object with the tile layers
    let my_map = L.map("map", {
        center: [0, 0],
        zoom: 3,
        layers: [street_map]
    });

// Create control object for tile layers
    L.control.layers(base_maps, [], {collapsed: false}).addTo(my_map)

// Create a function to define size base on earthquake magnitude
    function get_size(magnitude){
        let size = magnitude * 75000;
        return size;
    };

// Create a function to define color based on earthquake deepth
    function get_color(depth){
        if (depth >= 90) {return "#F54952"}
        if (depth >= 70) {return "#AE2D68"}
        if (depth >= 50) {return "#660F56"}
        if (depth >= 30) {return "#280659"}
        if (depth >= 10) {return "#341671"}
        if (depth < 10) {return "#422680"}
    };

// Fetch the JSON data
    let data_source = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    d3.json(data_source).then(function(data){
        
        // Store data on an array
            let earthquakes = data.features;

        // Loop through the array
            for (let i = 1; i < earthquakes.length; i++){
                
                // Define the single item on the array
                    let earthquake = earthquakes[i];

                // Create a circle with the earthquake coordinates pair
                    let circle = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                        weight: 0.5,
                        color: "black",
                        fillColor: get_color(earthquake.geometry.coordinates[2]),
                        fillOpacity: 1,
                        radius: get_size(earthquake.properties.mag)
                    }).addTo(my_map);

                // Bind information popup to the circle
                    earthquake_information = `<p>
                        Location: ${earthquake.properties.place}<br>
                        Latitude: ${earthquake.geometry.coordinates[1]}<br>
                        Longitude: ${earthquake.geometry.coordinates[0]}<br>
                        Depth: ${earthquake.geometry.coordinates[2]}<br>
                        Magnitude: ${earthquake.properties.mag}<br>
                        Gap: ${earthquake.properties.gap}
                    </p>`;
                    circle.bindPopup(earthquake_information);
            };
    });

// Create color legend for the Earthquake Depth
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Earthquake Depth</h4>";
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #422680;"></i><span> -10 - 10</span><br>';
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #341671;"></i><span>  10 - 30</span><br>';
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #280659;"></i><span>  30 - 50</span><br>';
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #660F56;"></i><span>  50 - 70</span><br>';
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #AE2D68;"></i><span>  70 - 90</span><br>';
      div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background-color: #F54952;"></i><span>  90+</span><br>';
      return div;
    };
    
    legend.addTo(my_map);