$(document).ready(function () {
    getProductDisplay(res => {
        console.log(res);
        if (res.status === true) {
            renderListProductPopular(res.data);
        }
    }, 2)
    handleChangeLoginUser();
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



const getProductDisplay = (callback, display) => {
    let request = {
        event: "getProductByDisplay",
        display
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback);
}

const renderListProductPopular = (data) => {
    let html = '';
    data.forEach(item => {
        console.log(showStar(Number(Math.floor(item.avgStar))))
        html += `
            <div class="col-lg-3">
                <a href="detail_product.html?slug=${item.product_id}" class="popular-item">
                    <div class="popular-item_thumbnail">
                        <div class="overlay"></div>
                        <img src="${item.image}" alt="${item.name}">
                        <div class="categories-item_icons">
                            <span><i class="fa fa-cart-plus" aria-hidden="true"></i>
                            </span>
                            <span><i class="fa fa-link" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    <div class="popular-item_content">
                        <p class="popular-item_tags">${item.category}</p>
                        <p class="popular-item_name">${item.name}</p>
                        <p class="popular-item_stars">
                        ${showStar(Number(Math.floor(item.avgStar)))}
                        </p>
                        <p class="popular-item_des">${item.description}</p>
                    </div>
                </a>
            </div>
        `;
    })
    console.log(html);
    $("#popularList").html(html);
}