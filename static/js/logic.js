var myMap = L.map("map", {
  center: [0, -40],
  zoom: 3,
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY,
  }
).addTo(myMap);

var jsonData;
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson",
  (data) => {
    jsonData = data.features[100];
    // console.log(jsonData);

    data.features.forEach((obj) => {
      var lat = obj.geometry.coordinates[1];
      var lng = obj.geometry.coordinates[0];
      var mag = obj.properties.mag;
      var place = obj.properties.place;

      L.circle([lat, lng], {
        stroke: true,
        fillOpacity: 1,
        color: "black",
        fillColor: getColor(mag),
        radius: mag * 45000,
      })
        .bindPopup(
          "<h3>" + place + "</h3> <hr> <h3>Magnitude: " + mag + "</h3>"
        )
        .addTo(myMap);
    });

    function getColor(magnitude) {
      switch (true) {
        case magnitude > 4:
          return "blue";
        case magnitude > 3:
          return "purple";
        case magnitude > 2:
          return "red";
        case magnitude > 1:
          return "orange";
        case magnitude > 0:
          return "yellow";
        default:
          return "white";
      }
    }

    var legend = L.control({
      position: "bottomright",
    });

    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, 1, 2, 3, 4, '5+'];
      var colors = ["white", "yellow", "orange", "red", "purple", "blue"];

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += `<i style="background:${colors[i]}">${grades[i]}</i>`;
      }

      return div;
    };

    legend.addTo(myMap);
  }
);
