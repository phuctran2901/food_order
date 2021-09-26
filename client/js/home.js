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

    // Slick carousel
    $(".slick").slick({
        speed: 300,
        slidesToShow: 8,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1000,
        prevArrow: '<div class="slick-pre"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
        nextArrow: '<div class="slick-nex"><i class="fa fa-angle-right" aria-hidden="true"></i></div>',
    })
})