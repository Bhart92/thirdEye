$(window).ready(function(){
  //header intro
  const fadeUp = {
    transition: 'opacity .75s ease-in, top .8s ease-in',
    opacity: 1,
    top: '0px'
  };
  const css = {
    'opacity': '1',
    'transform': 'translate(0, 0)',
    'transitionDelay': '.35s'
  };
$('h3').css(fadeUp);
//
//login button
$('#adminLogin').on('click', function(){
$('.modal.login')
  .modal('show')
  ;
});
//
//Nav buttons
$('#mobileNav ul li a').on('click', function(){
  $('.hamburger').toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
});
$('.mySlides img').on('click', function(){
  $('body').addClass('bodyOverflow');
});
$('#lightboxOverlay').on('click', function(){
  $('body').removeClass('bodyOverflow');
});
$('#lightbox').on('click', function(){
  $('body').removeClass('bodyOverflow');
});
$('.lb-close').on('click', function(){
  $('body').removeClass('bodyOverflow');
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
$('.infinite.example .demo.segment')
  .visibility({
    once: false,
    // update size when new content loads
    observeChanges: true,
    // load content on bottom edge visible
    onBottomVisible: function() {
      // loads a max of 5 times
      window.loadFakeContent();
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
});
//mobile nav buttons
$('.hamburger--squeeze').on('click', function(){
  $('.hamburger').toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
});
function navToggle(){
  $(this).toggleClass('is-active');
  $('#mobileNav').toggleClass('active');
  $('body').toggleClass('bodyOverflow');
}
//
//Error/success message fade
$('.ui.positive.message').delay(2000).fadeOut();
$('.ui.negative.message').delay(2000).fadeOut();
//
// Gallery slideshow
$('.next').click(function(){
  plusSlides(1);
});
$('.prev').click(function(){
  plusSlides(-1);
});
$('.demoItem').on('click', function() {
    var n = $('.demoItem').index(this);
    currentSlide(n + 1);
});
var slideIndex = 1;
showSlides(slideIndex);
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}
// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = $(".mySlides");
  var dots = $(".demo");
  var dotsArr = [].slice.call('dots');

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
});
