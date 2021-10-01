$(document).ready(function () {
    $(window).scroll(function () {
        handleScrollPage();
    });
    // $(".shop-filterPrice_item span").click(function (e) {
    //     e.preventDefault();
    //     console.log(this);
    // });
})
function handleScrollPage() {
    let header = $('.header');
    if (window.pageYOffset > 100) {
        header.addClass("scroll");
    } else {
        header.removeClass("scroll")
    }
}


function hello(data) {
    console.log(data);
}