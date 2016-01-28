$(document)
  .ready(function() {
    $('#downloadPdf').click(function() {
      $.post('', function(data) {
        console.log(data);
        // location.reload();
      });
    });
  });
