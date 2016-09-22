$(function () {
    $('#vedio-button').on('click',function () {
        $('#media').show();
        $('#colourWhite').hide();
        var t = document.getElementById('media');
        t.src = 'video/xunyi.mp4';
        t.play();
        $('#vedio-button-close').show();
        $(this).hide();
    });
    $('#vedio-button-close').on('click',function () {
        document.getElementById('media').pause();
        $('#media').hide();
        $('#colourWhite').show();
        $('#vedio-button').show();
        $(this).hide();
    });
    var orientationValue = "horizontal";
    if(window.innerWidth<=768){
        orientationValue = "vertical";
    }
    $('#timeline').timelinr({
        orientation:orientationValue,
        startAt:'4',
        autoPlay:'true',
        autoPlayPause:7000
    });
})