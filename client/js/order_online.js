
var currentPageSort = 1, category = -1, filterPrice = -1, filterRating = -1, eventGetListProduct = "getListProduct";

const sortValue = [
    {
        typeSort: 1,
        nameSort: 'Price'
    },
    {
        typeSort: 0,
        nameSort: 'Price'
    },
    {
        typeSort: 1,
        nameSort: 'Star'
    },
    {
        typeSort: 0,
        nameSort: 'Star'
    }
]

$(document).ready(function () {
    getListProduct((res) => {
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
    $("#sortProduct").change(function (e) {
        eventGetListProduct = "sortListProduct";
        $(".shop-filterPrice_item span").removeClass("active");
        $(".shop-filterRating_item").removeClass("active");
        if (Number(e.target.value) >= 0) {
            let request = {
                ...sortValue[e.target.value],
                currentPage: currentPageSort,
                limit: 12,
                categoryID: category,
                event: eventGetListProduct
            };
            callAPI("GET", `${base_URL}/products/`, request, 'json', (res) => {
                if (res.status === true) {
                    renderListProduct(res.data, res.current_page, res.total_page);
                }
            })
        } else {
            getListProduct((res) => {
                if (res.status == "success") {
                    eventGetListProduct = "getListProduct";
                    renderListProduct(res.data, res.current_page, res.total_page);
                }
            });
        }
    })

    $(".shop-filterPrice_item span").click(function (e) { // filter price
        e.preventDefault();
        $(".shop-filterPrice_item span").removeClass("active");
        $(this).addClass("active");
        filterPrice = $(this).parent().attr("data-price");
        let request = {
            event: "filterProduct",
            filterPrice,
            filterRating
        };
        callAPI('GET', `${base_URL}/products/`, request, 'json', res => {
            if (res.data && res.data.length > 0) {
                renderListProduct(res.data)
            } else renderNotfoundProduct();
        }, () => loadingProduct());
    });

    $(".shop-filterRating_item").click(function (e) { // filter rating
        $(".shop-filterRating_item").removeClass("active");
        $(this).addClass("active");
        filterRating = $(this).attr("data-rating");
        let request = {
            event: "filterProduct",
            filterPrice,
            filterRating
        };
        callAPI('GET', `${base_URL}/products/`, request, 'json', res => {
            if (res.data && res.data.length > 0) {
                renderListProduct(res.data)
            } else renderNotfoundProduct();
        }, () => loadingProduct());
    })

    $(".btn-resetFilter").click(() => {
        $(".shop-filterPrice_item span").removeClass("active");
        $(".shop-filterRating_item").removeClass("active");
        getListProduct((res) => {
            if (res.status == "success") {
                renderListProduct(res.data, res.current_page, res.total_page);
            }
        });
    })
    $(".searchBar-wrap").on('submit', e => {
        e.preventDefault();
        let keyword = $("#valueSearch").val();
        let request = {
            event: "searchByKeyword",
            keyword
        };
        callAPI('GET', `${base_URL}/products/`, request, 'json', res => {
            if (res.data && res.data.length > 0) {
                renderListProduct(res.data)
            } else renderNotfoundProduct();
        }, () => loadingProduct());
    })
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
        event: eventGetListProduct,
        currentPage,
        limit: 12,
        categoryID
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback, () => loadingProduct());
}


const changePagination = (page) => {
    eventGetListProduct = "getListProduct";
    getListProduct((res) => {
        renderListProduct(res.data, res.current_page, res.total_page);

    }, page, category);
}

const getListCategories = (callback) => {
    callAPI("GET", `${base_URL}/categories/`, { event: "getListCategories" }, 'json', callback, () => loadingProduct());
}

const loadingProduct = () => {
    $(".show").show();
}
const handleChangeCategories = (categoryID, name) => {
    $(".shop-filterPrice_item span").removeClass("active");
    $(".shop-filterRating_item").removeClass("active");
    category = categoryID;
    active = categoryID;
    $("#orderType").text(name);
    eventGetListProduct = "getListProduct";
    getListProduct(res => {
        if (res.status === 'success') {
            renderListProduct(res.data, res.current_page, res.total_page);
        }
    }, 1, categoryID);
}

const renderNotfoundProduct = () => {
    $("#listProduct").html('<img src="./image/notfound.png" class="notfound-product" />');
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
                        ${Math.floor(item.stars) || 0}
                    </div>
                </div>
                <div class="card-content">
                    <p class="card-title">${item.name}</p>
                    <p class="card-description">${item.description}</p>
                    <div class="card-countryAndPrice">
                        <p class="country"><i class="fas fa-map-marker-alt"
                                style="color:red"></i> Việt Nam</p>
                        <p class="card-price">${formatNumber(Number(handleDiscountCalculation(item.price, item.discount)))}</p>
                    </div>
                </div>
            </a>
        </div>
        `;
    });
    $("#listProduct").html(html);
    $("#pagination").html(renderPagination(currentPage, totalPage));
}


const renderListCategories = async (data) => {
    let html = '';
    data.forEach(item => {
        html += `
        <li class="shop-categories_item ${Number(item.categoryID) === 1 ? "active" : ""}" onClick="handleChangeCategories(${item.name === 'Tất cả' ? -1 : item.categoryID},'${item.name}');" >
            <img class="shop-categories_image" src="${item.image}" alt="${item.name}">
            ${item.name}
        </li>
        `;
    })
    $("#listCategories").html(html);
}

const handleDiscountCalculation = (realPrice, discount) => {
    return realPrice * (1 - discount);
}