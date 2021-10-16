$(document).ready(function () {


    getDetailProduct((res) => {
        renderDetailProduct(res.product[0])
    }, getParamsToURL()[0]);


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


const getDetailProduct = (callback, productID) => {
    let request = {
        event: "getOneProduct",
        productID
    };
    callAPI("GET", `${base_URL}/products/`, request, 'json', callback);
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
                <div class="detail-description">${data.description}</div>
                <div class="detail-addCart">
                    <div class="detail-addCart_amount">
                        <button>+</button>
                        <input type="number" name="" id="" value="0">
                        <button>-</button>
                    </div>
                    <div class="detail-addCart_submit">
                        <button>
                            <i class="fa fa-shopping-cart" aria-hidden="true"></i> Thêm giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    $("#detailProduct").html(html);

}