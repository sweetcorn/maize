var $ = require('jQuery');
var FastClick = require('fastclick');



/**

  IBM EM UI
--------------------------------------------------------
-----------------------------------------------------  */


/*
In this app, all measurements are in rem units when possible
and relate to the HTML element.  The HTML element has a
minimum font-size of 62.5% at 768px viewport width.  The
font-size value will respond as the viewport's width
resizes. In effect, it resizes everything that uses rem units,
and since the images are set to be 100% width, the result is a
nice responsive experience where it almost appears that the site
zooms in and out, as opposed to flexing content to the viewport.
*/

function zoomBaseFontSize(){
  // 768 / 62.5 = 12.2888 this is our zoom coeficient
  var $win = $(window),
      maxWidth = 768;
      minWidth = 320,
      fontSizeAtMinWidth = 100,
      zoomCoefficient = minWidth / fontSizeAtMinWidth,
      newFontSize = $(window).width() / zoomCoefficient;
  // Zoom of larger than minWidth
  if($win.width() > minWidth && $win.width() < maxWidth + 1){
    $("html").css("font-size", newFontSize+"%");
  }
  else {
    $("html").css("font-size", fontSizeAtMinWidth+"%");
  }
  if($win.width() > maxWidth) {
    $("html").css("font-size", "100%");
  }
}
zoomBaseFontSize();

module.exports = function(){

  // Resizing
  $(window).resize(function(){
    zoomBaseFontSize();
  });

  /* @paging
  ----------------------------------------------------- */

  // First is always active
  $(".t").eq(0).addClass("is-active");

  // Pagers
  $(".t__pager").on("click", function(){
    $(this).parent(".t").removeClass("is-active").next(".t").not(".modal").addClass("is-active");
    console.log (
      $(this).parent(".t").next(".t").not(".modal"),
      $(this).parent(".t").next(".t"),
      $(this).parent(".t")
    );
  });

  // Buttons in A2 open next modal
  $(".a2 .btn").on("click", function(){
    $(this).parents(".t").next(".modal").addClass("is-active");
  });


  // Modal close
  $(".modal__close").on("click", function(){
    $(this).parent(".modal").removeClass("is-active");
  });



  /* @fast-click
  ----------------------------------------------------- */
  FastClick.attach(document.body);





  /* @accordians
  ----------------------------------------------------- */

  $(".js-accordian-toggle").on("click", function(e){
    // prevent default event
    e.preventDefault();
    // define vars
    var toggle =  $(this),
        target = toggle.attr("data-toggle"),
        targets = $(".accordian-menu__link[data-toggle='"+target+"']");
    // toggle active classes for this and other accordian menu links
    $(".accordian-menu__link").removeClass("is-active");
    targets.addClass("is-active");

  });




  /* @toggle-nav
  ---------------------------------------------------- */

  $(".js-toggle-nav ").on("click", function(e){
    // prevent default event
    e.preventDefault();
    // toggle active nav classes for site header and main
    $(".site-header, .site-main").toggleClass("is-active-nav");
  });


  $(".site-nav__links a").on("click", function(e){
    // update active state
    $(".site-nav__links a").removeClass("is-active");
    $(this).addClass("is-active");
    // update nav title
    $(".site-nav__title").text($(this).find("b").text());
    // update nav
    $(".site-header, .site-main").toggleClass("is-active-nav");
  });


};