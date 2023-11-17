
let map;

(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
            ({key: "<YOUR GOOGLE MAPS API>", v: "weekly"});

async function initMap() {

  const position = { lat:38.889, lng: -77.0352 };

const { Map } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 11,
    center: position,
  });
}

initMap();

let markers = [];
let timer;

async function run() {
  const locations = await getBusLocations();

  markers.forEach(marker => {
    marker.setMap(null);
  });


  markers = [];

    locations.forEach(location => {
      const marker = new google.maps.Marker({
        map: map,
        position: { lat: location.latitude, lng: location.longitude },
        title: location.id,
      });
      markers.push(marker);
    });

  timer = setTimeout(run, 15000);
}

async function getBusLocations() {
  let route = document.getElementById("RouteNumber").value;

  try {
    var params = {
                "api_key": "<YOUR MATA API>",
                "RouteID": route
            };
          

    const response = await fetch("https://api.wmata.com/Bus.svc/json/jBusPositions?" + $.param(params), {
      method: "GET",
      headers: {
        "api_key": "<YOUR MATA API>",
      },
    });

    if (!response.ok) {
      throw new Error("Error: Bus locations not found");
    }

    const data = await response.json();
    const locations = data.BusPositions.map(bus => ({
      id: bus.vehicleId,
      latitude: bus.Lat,
      longitude: bus.Lon,
    }));

    return locations;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function waitForLoad() {
var textfield = document.getElementById("RouteNumber");
textfield.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    run();
  }
});
}

window.addEventListener("load", waitForLoad);
