$('document').ready(function (){
    AOS.init({duration: 600});
    window.setTimeout(reloadPage, 8000)
})

function reloadPage(){
    window.location.replace("https://crearbor.be");
}
