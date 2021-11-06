$(document).ready(function () {
    getProductDisplay(res => {
        if (res.status === true) {
            renderListProductPopular(res.data);
        }
    }, 2)
    getProductDisplay(res => {
        renderListNewProduct(res.data);
    }, 1)
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
    $("#popularList").html(html);
}
const redirect = (id) => {
    window.location.href = 'detail_product.html?slug=' + id;
}
const renderListNewProduct = (data) => {
    let html = '';
    data.forEach(item => {
        html += `
            <div class="col-lg-4">
                <div class="new-item" >
                    <div class="new-item_thumbnail">
                        <div class="overlay"></div>
                        <div class="categories-item_icons">
                            <span onClick="handleAddCartOne(${item.product_id});"><i class="fa fa-cart-plus" aria-hidden="true"></i>
                            </span>
                            <span onClick="redirect(${item.product_id});"><i class="fa fa-link" aria-hidden="true"></i></span>
                        </div>
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="new-item_content">
                        <p class="new-item_name">${item.name}</p>
                        <p class="new-item_price">${formatNumber(Number(item.price))}</p>
                        <button onClick="handleAddCartOne(${item.product_id});"  class="new-item_btn">
                            <span>
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                            Giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    $("#listNewProduct").html(html);
}