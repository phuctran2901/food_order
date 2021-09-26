$(document).ready(function () {
    let header = $('.header');
    function handleScrollPage() {
        if (window.pageYOffset > 100) {
            header.addClass("scroll");
        } else {
            header.removeClass("scroll")
        }
    }
    $(document.body).on('touchmove', handleScrollPage());
    $(window).scroll(function () {
        handleScrollPage();
    });
    var a = $(".shop-filterPrice_item");
    $(".shop-filterPrice_item span").click(function (e) {
        e.preventDefault();
        console.log(this);
    });
})