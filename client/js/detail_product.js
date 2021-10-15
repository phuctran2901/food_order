$(document).ready(function () {
    handleChangeLoginUser(); // check login user
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
    $(".tab-controls_item").click(function (e) {
        e.preventDefault();
        $(".tab-controls_item").removeClass("active");
        $(this).addClass("active");
        $(".tab-item").hide();
        $(this.getAttribute("data-tabs")).show();
    });
})