


$(document).ready(function () {
    getListProduct((res) => {
        console.log(res);
        if (res.status == "success") {
            renderListProduct(res.data, res.current_page, res.total_page);
            setTimeout(() => {
                $("#listCategories li").click(function () {
                    $("#listCategories li").removeClass("active");
                    $(this).addClass("active");
                })
            }, 1000)
        }
    });

    getListCategories((res) => {
        if (res.status === true) {
            renderListCategories(res.data);
        } else {
            toastCustom(ERROR, "Lấy danh sách loại món ăn thất bại", "error");
        }
    })

    handleChangeLoginUser(); // check login user
    $(window).scroll(function () {
        handleScrollPage();
    });

    $(".shop-filterPrice_item span").click(function (e) {
        e.preventDefault();
        $(".shop-filterPrice_item span").removeClass("active");
        $(this).addClass("active");
    });
})
function handleScrollPage() {
    let header = $('.header');
    if (window.pageYOffset > 100) {
        header.addClass("scroll");
    } else {
        header.removeClass("scroll")
    }
}


const getListProduct = (callback, currentPage = 1, categoryID = -1) => {
    let request = {
        event: "getListProduct",
        currentPage,
        limit: 12,
        categoryID
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback, () => $(".load").show());
}


const getListCategories = (callback) => {
    callAPI("GET", `${base_URL}/categories/`, { event: "getListCategories" }, 'json', callback);
}


const handleChangeCategories = (categoryID) => {
    active = categoryID;
    getListProduct(res => {
        if (res.status === 'success') {
            renderListProduct(res.data, res.current_page, res.total_page);
        }
    }, 1, categoryID);
}

const renderListProduct = (data, currentPage, totalPage) => {
    $(".show").hide();
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


const renderListCategories = async (data) => {
    let html = '';
    data.forEach(item => {
        html += `
        <li class="shop-categories_item ${Number(item.categoryID) === 1 ? "active" : ""}" onClick="handleChangeCategories(${item.name === 'Tất cả' ? -1 : item.categoryID})" >
            <img class="shop-categories_image" src="${item.image}" alt="${item.name}">
            ${item.name}
        </li>
        `;
    })
    $("#listCategories").html(html);
}
