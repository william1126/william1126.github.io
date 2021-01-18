function updateSize(){
  $("#container").css("height", $(window).height() - $("nav").height());
  $("#accordion").accordion({
    heightStyle: "fill",
  });
  map.updateSize();
  $("#accordion").accordion("refresh");
}

$(function(){
  $("#nav_layerlist").click(function(){
    $("#sidebar").toggle();
    $("#accordion").accordion("option", {active: 0});
    updateSize();
  });
  $("#btn-hide").click(function(){
    $("#sidebar").hide();
    updateSize();
  });
  $(window).resize(function(){
    updateSize();
  });
});

updateSize();
