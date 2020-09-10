$(document).ready(function(){
    console.log(window.devicePixelRatio);
});

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
})
