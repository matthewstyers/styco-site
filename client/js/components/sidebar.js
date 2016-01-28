$(document)
  .ready(function() {
    var trigger = $('.hamburger'),
      overlay = $('.overlay'),
      isClosed = true;

    trigger.click(function() {
      hamburgerCross();
    });

    function hamburgerCross() {

      if (isClosed === true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
    }

    $('[data-toggle="offcanvas"]').click(function() {
      $('#wrap').toggleClass('toggled');
    });
    window.setTimeout(
      function() {
        hamburgerCross();
        $('#wrap').toggleClass('toggled');
      },
      2000
    );

  });
