var productID;
$(document).ready(function () {

    getDetailProduct((res) => {
        renderDetailProduct(res.product[0]);
        productID = res.product[0].product_id;
        // lấy danh sách sản phẩm liên quan
        getRelatedProducts(resRelated => renderRelatedProduct(resRelated.data), res.product[0].categoryID);

    }, getParamsToURL()[0]);
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


const handleAddCart = () => {
    let amount = Number($("#amountProduct").val());
    let produtID = productID;
    let userID = JSON.parse(sessionStorage.getItem("user")).id;
    if (amount <= 0) {
        toastCustom(NOTIFICATION, 'Vui lòng chọn số lượng món ăn!', 'success');
    } else {
        let request = {
            event: "addCart",
            amount,
            productID,
            userID
        };
        callAPI("POST", `${base_URL}/cart/`, request, 'json', (res) => {
            console.log(res);
        });
    }
}


const getDetailProduct = (callback, productID) => {
    let request = {
        event: "getOneProduct",
        productID
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback);
}

const getRelatedProducts = (callback, categoryID) => {
    let request = {
        event: "getRelatedProduct",
        categoryID
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback);
}

const handleOnchangeCart = (element) => $(element).val() < 0 ? $(element).val(0) : $(element).val(); // hàm check số lượng sp phải > 0


const addNumber = (element) => { // custom nút cộng
    const value = $(element).prev().val();
    $(element).prev().val(Number(value) + 1);
}

const minusNumber = (element) => { // custom nút trừ
    const value = $(element).next().val();
    if (value < 1) $(element).next().val(0);
    else $(element).next().val(Number(value) - 1);
}

const renderDetailProduct = (data) => {
    let html = `
            <div class="col-lg-6">
            <div class="detail-thumbnaill">
                <img src="${data.image}" alt="${data.name}">
            </div>
        </div>
        <div class="col-lg-6">
            <div class="detail-content">
                <h2 class="detail-title">Hamburger Thịt</h2>
                <div class="detail-rating">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <span>0 người reviews</span>
                </div>
                <p class="detail-price">${formatNumber(data.price)}</p>
                <div class="detail-categories">
                    <span>Loại: </span>
                    <span>${data.category}</span>
                </div>
                <div class="detail-addCart">
                    <div class="detail-addCart_amount">
                        <button onClick="minusNumber(this);">-</button>
                        <input type="number" id="amountProduct" value="0" onchange="handleOnchangeCart(this);">
                        <button onClick="addNumber(this);">+</button>
                    </div>
                    <div class="detail-addCart_submit">
                        <button onClick="handleAddCart();">
                            <i class="fa fa-shopping-cart" aria-hidden="true"></i> Thêm giỏ hàng
                        </button>
                    </div>
                </div>
                <div class="detail-commits">
                            <div class="detail-commit">
                                <span>
                                    <i class="fa fa-truck" aria-hidden="true"></i>
                                </span>
                                <span>Miễn phí vận chuyển cho tất cả đơn hàng</span>
                            </div>
                            <div class="detail-commit">
                                <span>
                                    <i class="fas fa-clipboard-check"></i>
                                </span>
                                <span>Hoàn tiền lại khi món ăn không đạt yêu cầu</span>
                            </div>
                            <div class="detail-commit">
                                <span>
                                    <i class="fas fa-concierge-bell"></i>
                                </span>
                                <span>Đặt hàng sớm trước 30 phút để cửa hàng có thể giao đúng bữa ăn</span>
                            </div>
                        </div>
            </div>
        </div>`;
    $("#detailProduct").html(html);
    $(".detail-description").text(data.description);
}



const renderRelatedProduct = (data) => {
    let html = '';

    data.forEach(item => {
        html += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-6">
            <a href="detail_product.html?slug=${item.product_id}" class="listProduct-card">
                <div class="card-thumbnail">
                    <img src="${item.image}"
                        alt="Item card">
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
                        <p class="country"><i class="fas fa-map-marker-alt" style="color:red"></i>
                            Việt
                            Nam</p>
                        <p class="card-price">${formatNumber(Number(item.price))}</p>
                    </div>
                </div>
            </a>
        </div>
        `;
    });
    $("#relatedProduct").html(html);
}