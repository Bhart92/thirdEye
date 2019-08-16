$(window).ready(function(){
  const fadeUp = {
    transition: 'opacity .75s ease-in, top .8s ease-in',
    opacity: 1,
    top: '0px'
  };
$('h3').css(fadeUp);
function navToggle(){
  $(this).toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
}

//mobile nav menu
$('.hamburger--squeeze').on('click', function(){
  $('.hamburger').toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
});
const css = {
  'opacity': '1',
  'transform': 'translate(0, 0)',
  'transitionDelay': '.35s'
}
$('.iconSection')
.visibility({
  once       : false,
  continuous : true,
  onPassing  : function(calculations) {
      $('.iconDivider')
      .css(css);
    ;
  }
})
;
//smooth scroling
$('a[href*="#"]').on('click', function(e) {
e.preventDefault()

$('html, body').animate(
  {
    scrollTop: $($(this).attr('href')).offset().top,
  },
  500,
  'linear'
)
})
//login button

$('#adminLogin').on('click', function(){
$('.modal.login')
  .modal('show')
  ;
});

$('#mobileNav ul li a').on('click', function(){
  $('.hamburger').toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
});




$('.addNew').on('click', function(){
  $('.modal.createItem')
    .modal('show')
    ;
  });
$('.editAbout').on('click', function(){
  $('.modal.aboutModal')
    .modal('show')
    ;
  });
$('.passwordResetLink').on('click', function(){
  $('.modal.passwordReset')
    .modal('show')
    ;
  });
$('.logout').on('click', function(){
  window.location.href= '/logout';
});
});
