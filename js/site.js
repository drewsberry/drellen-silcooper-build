// Copyright © 2016 - Drew Silcock

'use strict';

function scrollToTop() {
  $('html,body').animate({
    scrollTop: 0,
  }, 'slow', 'swing');
}

function initialiseCountdown() {
  const $countdown = $('.ds-countdown');
  const weddingDate = new Date($countdown.data("date"));
  const now = new Date();
  const secondsToWedding = (weddingDate - now) * 0.001;

  $countdown.FlipClock(secondsToWedding, {
    clockFace: 'DailyCounter',
    countdown: true,
    showSeconds: false,
    minimumDigits: 7,
  });
}

function initialiseScrollers() {
  const $scrollers = $('.hp-scroller');

  $scrollers.each(function (index, element) {
    const $element = $(element);
    const scrollToSelector = $element.data('scroll-to');
    const $scrollToElement = $(scrollToSelector);

    $element.on('click', function setupClickEvent() {
      $('html,body').animate({
        scrollTop: $scrollToElement.offset().top,
      }, 'slow', 'easeInOutSine');
    });
  });
}

function initialisePaginators() {
  const $prevPaginators = $('.ds-prev-section');
  const $nextPaginators = $('.ds-next-section');

  const $sections = $('.hp-section');

  $prevPaginators.each(function setupClickEvent(index, element) {
    const $element = $(element);
    const $currentSection = $element.parents('.hp-section');
    const sectionIndex = $sections.index($currentSection);

    if (sectionIndex === -1 || sectionIndex === 0) {
      console.error("Unable to find previous section for element:", $element);
    } else {
      const $target = $sections.eq(sectionIndex - 1);

      $element.on('click', function animateToNextSection() {
        $('html,body').animate({
          scrollTop: $target.offset().top,
        }, 'slow', 'easeInOutSine');
      });
    }
  });

  $nextPaginators.each(function setupClickEvent(index, element) {
    const $element = $(element);
    const $currentSection = $element.parents('.hp-section');
    const sectionIndex = $sections.index($currentSection);

    if (sectionIndex === -1 || sectionIndex === $sections.length - 1) {
      console.error("Unable to find next section for element:", $element);
    } else {
      const $target = $sections.eq(sectionIndex + 1);

      $element.on('click', function animateToPrevSection() {
        $('html,body').animate({
          scrollTop: $target.offset().top,
        }, 'slow', 'easeInOutSine');
      });
    }
  });
}

function initialiseScrollToTopButton() {
  const $mainContent = $('main');
  const mainContentScrollPosition = $mainContent.offset().top;

  const triggerFadeInOut = function () {
    const currentScrollPosition = $(this).scrollTop();

    if (currentScrollPosition > mainContentScrollPosition) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  };

  $(window).on('scroll', triggerFadeInOut);
  triggerFadeInOut();

  // scroll body to 0px on click
  const $backToTop = $('#back-to-top');
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
  const controller = new ScrollMagic.Controller();

  const navbarSelector = '.navbar.hp-navbar';
  const navbarLinkSelector = '.hp-navbar.navbar .navbar-nav>li>.hp-navlink';
  const navbarLogoSelector = '.hp-navbar.navbar .hp-brand.ds-logo';
  const navbarLogoPseudoSelector = navbarLogoSelector + '::before,' +
                                   navbarLogoSelector + '::after';
  const navbarTextSelector = navbarLinkSelector + ',' + navbarLogoSelector;

  const $navbar = $(navbarSelector);
  const navbarHeight = $navbar.height();

  const navbarBackgroundTween = new TimelineMax()
    .to(navbarSelector, 1, {
      css: {
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
      },
      ease: Circ.easeOutExpo,
    });

  const navbarBackgroundScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarBackgroundTween)
    .addTo(controller);

  const navbarBorderTween = new TimelineMax()
    .to(navbarSelector, 1, {
      css: {
        borderColor: 'rgba(230, 230, 230, 1)',
      },
      ease: Circ.easeOutExpo,
    });

  const navbarBorderScene = new ScrollMagic
    .Scene({
      triggerElement: '#ds-about',
      duration: 50,
      triggerHook: 0,
      offset: -navbarHeight,
    })
    .setTween(navbarBorderTween)
    .addTo(controller);

  const navbarTextTween = new TimelineMax()
    .to(navbarTextSelector, 1, {
      css: {
        color: '#3c3c3c',
      },
      ease: Circ.easeOutExpo,
    });

  const navbarTextScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarTextTween)
    .addTo(controller);

  const navbarLogoSizeTween = new TimelineMax()
    .to(navbarLogoSelector, 1, {
      css: {
        width: '100px',
        height: '50px',
        fontSize: '20pt',
        paddingTop: '14px',
      },
      ease: Circ.easeOutExpo,
    });

  const navbarLogoSizeScene = new ScrollMagic
    .Scene({
      triggerElement: 0,
      duration: 400,
      triggerHook: 1,
      offset: 0,
    })
    .setTween(navbarLogoSizeTween)
    .addTo(controller);
}

function initialiseMap(scrollReveal) {
  const $mapElement = $('.hp-map');

  const locationData = $mapElement.data('location').split(',');
  const locationTitle = $mapElement.data('title');
  const locationDescription = $mapElement.data('description');

  const weddingLocation = {
    lat: +locationData[0],
    lng: +locationData[1],
  };

  const mapElement = $mapElement.get(0);
  const map = new google.maps.Map(mapElement, {
    center: weddingLocation,
    zoom: 15,
  });

  const marker = new google.maps.Marker({
    'title': locationTitle,
    position: weddingLocation,
    map: map,
    animation: google.maps.Animation.DROP,
  });

  const infoWindow = new google.maps.InfoWindow({
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

    const $map = $('.hp-map');

    $map.addClass('fade-in');
    scrollReveal.reveal('.hp-map');
  });
}

$(function() {
  initialiseCountdown();
  initialiseScrollers();
  initialisePaginators();
  initialiseScrollToTopButton();
  initialiseScrollMagic();
  const scrollReveal = initialiseReveal();
  initialiseMap(scrollReveal);
});
