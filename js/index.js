$(document).ready(function () {
    $('.yao').hover(function() {
        $('.yao, #back-title').addClass('unhover');
        $(this).removeClass('unhover');
        
        var yao = $('.yao:not(.unhover)');
        $('#yao-detail').css('top', yao.offset().top);
        // display at highest position if height is too large
        var visibleHeight = $(window).innerHeight()
                - parseInt($('#yao-detail').css('top'));
        if ($('#yao-detail').height() > visibleHeight) {
            $('#yao-detail').css('top', $('#yao6').offset().top);
        }
        $('#yao-detail').show();
    }, function() {
        $('.yao, #back-title').removeClass('unhover');
        $('#yao-detail').hide();
    });
});
