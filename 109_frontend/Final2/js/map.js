var init_lat = 25.015412;
var init_lng = 121.537810;
var zoom = 15;
var user_location = null;
var view = new ol.View({
  center: ol.proj.transform([init_lng, init_lat], 'EPSG:4326', 'EPSG:3857'),
  zoom: zoom
});

var map = new ol.Map({
  layers: [],
  target: 'map',
  view: view,
});

var geolocation = new ol.Geolocation({
  tracking: true,
  projection: map.getView().getProjection()
});

geolocation.on('change:position', function(){
  if(user_location == null){
    user_location = geolocation.getPosition();
    map.getView().setCenter(user_location);
    map.getView().setZoom(14);
    var q = ol.proj.transform([parseFloat(user_location[0]), parseFloat(user_location[1])], 'EPSG:3857', 'EPSG:4326');
    console.log(user_location, q);
    iconFeature.getGeometry().setCoordinates(q);
  }
});

//setting for tile services
var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z){
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
};

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([init_lng, init_lat]))
});

var layers = {
  'Google Maps': {
    'title': 'Google Maps',
    'type': 'base',
    'layer': new ol.layer.Tile({
      visible: false,
      source: new ol.source.XYZ({
        crossOrigin: 'anonymous',
        url: 'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      })
    })
  },
  'breakfast': {
    'title': '早餐店',
    'type': 'overlay',
    'layer': new ol.layer.Vector({
      visible: false,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: './data/breakfast.geojson'
      })
    })
  },/**/
  'lunch': {
    'title': '午餐/晚餐',
    'type': 'overlay',
    'layer': new ol.layer.Vector({
      visible: false,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: './data/lunch.geojson'
      })
    })
  }/**/
};

var setLayer = function(key){
  for (i = 0;i < Object.keys(layers).length; i++){
    var tlayer = layers[Object.keys(layers)[i]];
    if(tlayer.type == 'base')
      layers[Object.keys(layers)[i]].layer.setVisible(Object.keys(layers)[i] == key);
  }
};

var styles = {
  'breakfast': [new ol.style.Style({
    image: new ol.style.Icon({
      crossOrigin:'anonymous',
      src:'./img/breakfast.png',
      size: [512,512],
      scale: 0.10
    })
  })],/**/
  'lunch': [new ol.style.Style({
    image: new ol.style.Icon({
      crossOrigin: 'anonymous',
      src:'./img/food.png',
      size: [512,512],
      scale: 0.05
    })
  })]/**/
};

function initLayers(){
  console.log("layers:", layers[Object.keys(layers)[0]].layer);
  console.log("layers:", Object.keys(layers)[0].layer);
  for(i = 0; i < Object.keys(layers).length; i++){
    var tlayer = layers[Object.keys(layers)[i]];
    if(tlayer.type == 'base'){
      map.addLayer(tlayer.layer);
    }else if(tlayer.type == 'overlay'){
      /*添加checkbox在 套疊點資料那邊*/
      $('<div class="checkbox"><label><input type="checkbox" class="overlaycontrol" name="overlayer" value="' + Object.keys(layers)[i] + '">' + tlayer.title + '</label></div>').appendTo("#Mylist");
      map.addLayer(tlayer.layer);
      tlayer.layer.setZIndex(10000-i);
      tlayer.layer.setStyle(styleFunction(Object.keys(layers)[i]));
    }
  }
};

function styleFunction(stylename){
  return styles[stylename];
};

initLayers();

$(function(){
  // baselayer
  setLayer('Google Maps');
  $("input.basecontrol").change(function(){
    if($(this).is(':checked')){
      setLayer($(this).attr('value'));
    }
  });

  // overlay
  $("input.overlaycontrol").change(function(){
    if($(this).is(':checked')){
      layers[$(this).val()].layer.setVisible(true);
    }else{
      layers[$(this).val()].layer.setVisible(false);
    }
  });
});

// pop-up
var popup = undefined;  // for breakfast
var popup2 = undefined; // for others

map.on('singleclick', function(evt){
  // triger singleclick, get event
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
    // get feature and layer by evt.pixel
    return feature;
  });

  if(typeof(popup) != undefined){
    map.removeOverlay(popup);
  }
  if(typeof(popup2) != undefined){
    map.removeOverlay(popup2)
  }/**/
  // if feature 存在
  // breakfast
  if(feature){
    // geojson裡的 name 標籤
    if(feature.get('name') != undefined){
      popup = new ol.Overlay({
        element: $("<div />").addClass('info').append(
          // table
          $("<table />").attr("bgcolor","black").addClass('table').append(
            $("<thead />").attr("bgcolor","#EBD6D6").append(
              $("<tr />").attr("bgcolor","#D1E9E9").append(
                $("<th />").attr("bgcolor","#EBD6D6").html("名稱")
              ).append(
                $("<th />").attr("bgcolor","#D1E9E9").html("內容")
              )
            )
          ).append(
            $("<tbody />").attr("bgcolor","white").append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","#EBD6D6").html("店名")
              ).append(
                $("<td />").attr("bgcolor","#D1E9E9").attr('id', 'breakfast').html(feature.get('name'))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","#EBD6D6").html("類別")
              ).append(
                $("<td />").attr("bgcolor","#D1E9E9").html(feature.get("Type"))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","#EBD6D6").html("價位")
              ).append(
                $("<td />").attr("bgcolor","#D1E9E9").html(feature.get('Price'))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","#EBD6D6").html("距離宿舍")
              ).append(
                $("<td />").attr("bgcolor","#D1E9E9").html(feature.get("Distance"))
              )
            )
          )
        )[0]
      });
      popup.setPosition(evt.coordinate);
      map.addOverlay(popup);
    }

    // geojson裡的 Stantion 標籤
    if(feature.get('Station') != undefined){
      popup2 = new ol.Overlay({
        element: $("<div />").addClass('info').append(
          $("<table />").addClass('table').append(
            $("<thead />").attr("bgcolor","white").append(
              $("<tr />").attr("bgcolor","white").append(
                $("<th />").attr("bgcolor","white").html("名稱")
              ).append(
                $("<th />").attr("bgcolor","white").html("內容")
              )
            )
          ).append(
            $("<tbody />").attr("bgcolor","white").append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","white").html("站點")
              ).append(
                $("<td />").attr("bgcolor","white").attr('id', 'bike').html(feature.get("Station"))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","white").html("可借車輛")
              ).append(
                $("<td />").attr("bgcolor","white").html(feature.get("Available"))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","white").html("可停空位")
              ).append(
                $("<td />").attr("bgcolor","white").html(feature.get("Vacancy"))
              )
            ).append(
              $("<tr />").attr("bgcolor","white").append(
                $("<td />").attr("bgcolor","white").html("站點狀況")
              ).append(
                $("<td />").attr("bgcolor","white").html(feature.get("Condition"))
              )
            )
          )

        ).append(
          $("<button />").attr("bgcolor","white").addClass("btn btn-info float-left").attr('id', 'addBtn').attr("onClick", "$('#dialog2').modal('show')").html("查看任務")
        )[0]
      });
      popup2.setPosition(evt.coordinate);
      map.addOverlay(popup2);
    }/**/
  }
});
