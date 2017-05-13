// Copyright © 2016 - Drew Silcock

'use strict';

function scrollToTop() {
  $('html,body').animate({
    scrollTop: 0,
  }, 'slow', 'swing');
}

function initialiseCountdown() {
  var $countdown = $('.ds-countdown');
  var weddingDate = new Date($countdown.data("date"));
  var now = new Date();
  var secondsToWedding = (weddingDate - now) * 0.001;

  $countdown.FlipClock(secondsToWedding, {
    clockFace: 'DailyCounter',
    countdown: true,
    showSeconds: false,
    minimumDigits: 7,
  });
}

function initialiseScrollers() {
  var $scrollers = $('.hp-scroller');

  $scrollers.each(function (index, element) {
    var $element = $(element);
    var scrollToSelector = $element.data('scroll-to');
    var $scrollToElement = $(scrollToSelector);

    $element.on('click', function setupClickEvent() {
      $('html,body').animate({
        scrollTop: $scrollToElement.offset().top,
      }, 'slow', 'easeInOutSine');
    });
  });
}

function initialisePaginators() {
  var $prevPaginators = $('.ds-prev-section');
  var $nextPaginators = $('.ds-next-section');

  var $sections = $('.hp-section');

  $prevPaginators.each(function setupClickEvent(index, element) {
    var $element = $(element);
    var $currentSection = $element.parents('.hp-section');
    var sectionIndex = $sections.index($currentSection);

    if (sectionIndex === -1 || sectionIndex === 0) {
      console.error("Unable to find previous section for element:", $element);
    } else {
      var $target = $sections.eq(sectionIndex - 1);

      $element.on('click', function animateToNextSection() {
        $('html,body').animate({
          scrollTop: $target.offset().top,
        }, 'slow', 'easeInOutSine');
      });
    }
  });

  $nextPaginators.each(function setupClickEvent(index, element) {
    var $element = $(element);
    var $currentSection = $element.parents('.hp-section');
    var sectionIndex = $sections.index($currentSection);

    if (sectionIndex === -1 || sectionIndex === $sections.length - 1) {
      console.error("Unable to find next section for element:", $element);
    } else {
      var $target = $sections.eq(sectionIndex + 1);

      $element.on('click', function animateToPrevSection() {
        $('html,body').animate({
          scrollTop: $target.offset().top,
        }, 'slow', 'easeInOutSine');
      });
    }
  });
}

function initialiseScrollToTopButton() {
  var $mainContent = $('main');
  var mainContentScrollPosition = $mainContent.offset().top;

  var triggerFadeInOut = function () {
    var currentScrollPosition = $(this).scrollTop();

    if (currentScrollPosition > mainContentScrollPosition) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  };

  $(window).on('scroll', triggerFadeInOut);
  triggerFadeInOut();

  // scroll body to 0px on click
  var $backToTop = $('#back-to-top');
  $backToTop.on('click', function scrollToTopWithEvent(evt) {
    scrollToTop();
    evt.preventDefault();
  });

  $backToTop.tooltip('show');
}

// Reveal sections only when you scroll to them with ScrollReveal.js.
function initialiseReveal() {
  window.sr = ScrollReveal();

  sr.reveal('.hp-layout__image', { duration: 1000 });
  sr.reveal('.gm-style');
  sr.reveal('.hp-timeline .timeline li', { duration: 2000, delay: 50 });
  sr.reveal('.hp-course', { duration: 1000 });
  sr.reveal('.hp-thumbnail', { duration: 2000 }, 200);

  return sr;
}

function initialiseScrollMagic() {
  var controller = new ScrollMagic.Controller();

  var navbarSelector = '.navbar.hp-navbar';
  var navbarLinkSelector = '.hp-navbar.navbar .navbar-nav>li>.hp-navlink';
  var navbarLogoSelector = '.hp-navbar.navbar .hp-brand.ds-logo';
  var navbarLogoPseudoSelector = navbarLogoSelector + '::before,' +
                                   navbarLogoSelector + '::after';
  var navbarTextSelector = navbarLinkSelector + ',' + navbarLogoSelector;
  var navbarCollapseSelector = navbarSelector + ' .navbar-collapse';
  var navbarToggleSelector = navbarSelector + ' .navbar-toggle';
  var navbarToggleBarsSelector = navbarToggleSelector + ' .icon-bar';
  var headerTitleSelector = '#ds-header .hp-header__title';

  var $navbar = $(navbarSelector);
  var navbarHeight = $navbar.height();

  var navbarBackgroundTween = new TimelineMax()
    .to(navbarSelector, 1, {
      css: {
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarBackgroundScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarBackgroundTween)
    .addTo(controller);

  var navbarBorderTween = new TimelineMax()
    .to(navbarSelector, 1, {
      css: {
        borderColor: 'rgba(230, 230, 230, 1)',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarBorderScene = new ScrollMagic
    .Scene({
      triggerElement: '#ds-about',
      duration: 50,
      triggerHook: 0,
      offset: -navbarHeight,
    })
    .setTween(navbarBorderTween)
    .addTo(controller);

  var navbarTextTween = new TimelineMax()
    .to(navbarTextSelector, 1, {
      css: {
        color: '#3c3c3c',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarTextScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarTextTween)
    .addTo(controller);

  var navbarLogoSizeTween = new TimelineMax()
    .to(navbarLogoSelector, 1, {
      css: {
        width: '100px',
        height: '50px',
        fontSize: '20pt',
        paddingTop: '14px',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarLogoSizeScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarLogoSizeTween)
    .addTo(controller);

  var navbarCollapseTween = new TimelineMax()
    .to(navbarCollapseSelector, 1, {
      css: {
        background: 'none',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarCollapseScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarCollapseTween)
    .addTo(controller);

  var navbarToggleOutlineTween = new TimelineMax()
    .to(navbarToggleSelector, 1, {
      css: {
        borderColor: '#3c3c3c',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarToggleOutlineScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarToggleOutlineTween)
    .addTo(controller);

  var navbarToggleOutlineBarsTween = new TimelineMax()
    .to(navbarToggleBarsSelector, 1, {
      css: {
        backgroundColor: '#3c3c3c',
      },
      ease: Circ.easeOutExpo,
    });

  var navbarToggleOutlineBarsScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarToggleOutlineBarsTween)
    .addTo(controller);

  var headingTitleParallaxTween = new TimelineMax()
    .add([
      TweenMax.fromTo(headerTitleSelector, 1, {
        top: 150,
      }, {
        top: -150,
        ease: Linear.easeNone
      }),
    ]);

  var headingTitleParallaxScene = new ScrollMagic
    .Scene({
      triggerElement: "#ds-header", duration: $(window).height()})
    .setTween(headingTitleParallaxTween)
    .addTo(controller);
}

function initialiseMap(scrollReveal) {
  var $mapElement = $('.hp-map');

  var locationData = $mapElement.data('location').split(',');
  var locationTitle = $mapElement.data('title');
  var locationDescription = $mapElement.data('description');

  var weddingLocation = {
    lat: +locationData[0],
    lng: +locationData[1],
  };

  var mapElement = $mapElement.get(0);
  var map = new google.maps.Map(mapElement, {
    center: weddingLocation,
    zoom: 15,
  });

  var marker = new google.maps.Marker({
    'title': locationTitle,
    position: weddingLocation,
    map: map,
    animation: google.maps.Animation.DROP,
  });

  var infoWindow = new google.maps.InfoWindow({
    'title': locationTitle,
    content: '<div class="hp-map__info-title">' + locationTitle + '</div>' +
             '<div class="hp-map__info">' + locationDescription + '</div>',
  });

  infoWindow.open(map, marker);

  marker.addListener('click', function () {
    if (infoWindow.map === null) {
      infoWindow.open(map, marker);
    }
  });

  // Initialise with scroll reveal only after map has loaded.
  google.maps.event.addListener(map, 'bounds_changed', function () {
    // Event fires after load; only want this to run once on load.
    google.maps.event.clearListeners(map, 'bounds_changed');

    var $map = $('.hp-map');

    $map.addClass('fade-in');
    scrollReveal.reveal('.hp-map');
  });
}

function initialiseMainPage() {
  initialiseCountdown();
  initialiseScrollers();
  initialisePaginators();
  initialiseScrollToTopButton();
  initialiseScrollMagic();
  var scrollReveal = initialiseReveal();
  initialiseMap(scrollReveal);
}
