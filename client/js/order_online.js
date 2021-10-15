$(document).ready(function () {
    getListProduct((res) => {
        if (res.status == "success") {
            renderListProduct(res.data, res.current_page, res.total_page);
        }
    });

    handleChangeLoginUser(); // check login user
    $(window).scroll(function () {
        handleScrollPage();
    });

    // $(".shop-filterPrice_item span").click(function (e) {
    //     e.preventDefault();
    //     console.log(this);
    // });
    $(".shop-categories_item")
})
function handleScrollPage() {
    let header = $('.header');
    if (window.pageYOffset > 100) {
        header.addClass("scroll");
    } else {
        header.removeClass("scroll")
    }
}


const getListProduct = (callback, currentPage = 1) => {
    let request = {
        event: "getListProduct",
        currentPage,
        limit: 12
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback);
}


const renderListProduct = (data, currentPage, totalPage) => {
    let html = '';
    data.forEach(item => {
        html += `
        <div class="col-lg-3 col-md-4 col-sm-6 col-6">
            <a href="detail_product.html?slug=${item.product_id}" class="listProduct-card">
                <div class="card-thumbnail">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="card-thumbnail_btn">
                        <button>
                            <i class="far fa-heart"></i>
                        </button>
                        <button>
                            <i class="far fa-shopping-cart" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="card-thumbnail_rating">
                        <i class="fas fa-star"></i>
                        5
                    </div>
                </div>
                <div class="card-content">
                    <p class="card-title">${item.name}</p>
                    <p class="card-description">${item.description}</p>
                    <div class="card-countryAndPrice">
                        <p class="country"><i class="fas fa-map-marker-alt"
                                style="color:red"></i> Việt Nam</p>
                        <p class="card-price">${formatNumber(Number(item.price))}</p>
                    </div>
                </div>
            </a>
        </div>
        `;
    });
    $("#listProduct").html(html);
}