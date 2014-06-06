var hideSubMenus = function(){
  $('.inner-navigation ul ul').hide()
}

var revealCurrentMenuItem = function(){
  $('.inner-navigation a').each(function(){
    var $a = $(this)
    if ($a.attr('href') == window.location.pathname) {
      $a.parent().addClass('active')
      $a.parents('ul').show()
      $a.siblings('ul').show()
    }
  })
}

$(function(){
  var $sidebars = $('.inner-navigation')
  if ($sidebars.length) {
    hideSubMenus()
    revealCurrentMenuItem()
  }
})
