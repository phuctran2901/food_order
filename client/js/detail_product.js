var productID, starRating = 0;
moment.locale('vi');
$(document).ready(function () {

    getDetailProduct((res) => {
        productID = res.product[0].product_id;
        // get list related product
        getRelatedProducts(resRelated => renderRelatedProduct(resRelated.data), res.product[0].categoryID);
        // get list review and avg star
        getTotalReviewAndAvgStar(resReview => {
            const product = {
                ...res.product[0],
                totalReview: resReview.total,
                avgStar: resReview.avgStar
            }
            renderDetailProduct(product);
        }, productID);
    }, getParamsToURL()[0]);


    getReview(res => {
        if (res.status === true) {
            renderListReview(res.data)
        }
    }, getParamsToURL()[0]);
    $("#rateYo").rateYo({
        rating: 0,
        starWidth: '20px',
        ratedFill: 'yellow',
        halfStar: true,
        fullStar: true,
        onSet: (rating) => {
            starRating = rating;
        }
    });

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


    // change image form
    handleChangeImageForm();
    // handle review
    $("#detail-review_form").submit(e => {
        e.preventDefault();
        let userID = JSON.parse(sessionStorage.getItem("user")) || null;
        if (userID) {
            let content = $("#detail-review_form").find(':input').filter('[name=content]').val();
            if (content !== '' && starRating > 0) {
                let request = {
                    event: "insertReview",
                    content,
                    productID,
                    userID: userID.id,
                    starRating
                }
                callAPI("POST", `${base_URL}/review/`, request, 'json', (res) => {
                    $(".submit-form").html('Gửi');
                    if (res === true) {
                        $("#detail-review_form").find(':input').filter('[name=content]').val("");
                        starRating = 0;
                        $("#rateYo").rateYo("option", "rating", "0");
                        toastCustom(NOTIFICATION, ADD_SUCCESS, 'success');
                        getReview(res => {
                            if (res.status === true) {
                                renderListReview(res.data)
                            }
                        }, getParamsToURL()[0]);
                        getTotalReviewAndAvgStar(res => {
                            if (res.status === true) {
                                let html = `
                                                ${showStar(Number(Math.floor(res.avgStar)))}
                               <span class="detail-totalReview">( ${res.total ? res.total : 0} người reviews )</span>
                               `;
                                $(".detail-rating").html(html);
                            }
                        }, productID);
                    } else {
                        toastCustom(ERROR, ADD_FAILED, 'error');
                    }
                }, () => $(".submit-form").html('<div class="spinner-border" style="width:15px;height:15px;" ></div>'));
            } else toastCustom(WARNING, 'Nhập nội dung và bình chọn sao để thêm bình luận', 'warning');
        } else {
            toastCustom(WARNING, "Vui lòng đăng nhập để thêm bình luận", 'warning');
        }
    })

})


const getReview = (callback, productID) => {
    let request = {
        event: "getReviewByProduct",
        productID
    };
    callAPI("GET", `${base_URL}/review/`, request, 'json', callback)
}


const handleChangeImageForm = () => {
    let user = JSON.parse(sessionStorage.getItem("user")) || null;
    if (user) $("#imageForm").attr("src", user.image);
}

const handleAddCart = () => {
    let amount = Number($("#amountProduct").val());
    let userID = JSON.parse(sessionStorage.getItem("user")).id;
    if (amount <= 0) {
        toastCustom(WARNING, 'Vui lòng chọn số lượng món ăn!', 'warning');
    } else {
        let request = {
            event: "addCart",
            amount,
            productID,
            userID
        };
        callAPI("POST", `${base_URL}/cart/`, request, 'json', (res) => {
            if (res.status === true) {
                $("#amountProduct").val(0);
                toastCustom(NOTIFICATION, 'Thêm giỏ hàng thành công!', 'success');
                getTotalCart(userID);
            }
        });
    }
}

const getTotalReviewAndAvgStar = (callback, productID) => {
    let request = {
        event: 'getTotalReviewAndAvgStar',
        productID
    };
    callAPI("GET", `${base_URL}/review/`, request, 'json', callback);
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


const handleDeleteReview = (reviewID) => {
    let request = {
        event: "deleteReview",
        reviewID
    };
    callAPI("POST", `${base_URL}/review/`, request, 'json', (res) => {
        // sau khi xóa thì cập nhật lại số lượng review và số sao đánh giá
        if (res === true) {
            getReview(res => {
                if (res.status === true) {
                    renderListReview(res.data)
                }
            }, productID);
            getTotalReviewAndAvgStar(res => {
                if (res.status === true) {
                    let html = `
                                    ${showStar(Number(Math.floor(res.avgStar)))}
                   <span class="detail-totalReview">( ${res.total ? res.total : 0} người reviews )</span>
                   `;
                    console.log(html);
                    $(".detail-rating").html(html);
                }
            }, productID);
            toastCustom(NOTIFICATION, 'Xóa bình luận thành công', 'success');
        } else {
            toastCustom(ERROR, 'Xóa bình luận thất bại', 'error');
        }
    });
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
                <h2 class="detail-title">${data.name}</h2>
                <div class="detail-rating">
                    ${showStar(Number(Math.floor(data.avgStar)))}
                    <span class="detail-totalReview">( ${data.totalReview ? data.totalReview : 0} người reviews )</span>
                </div>
                ${Number(data.discount) > 0 ? `<p class="detail-discount">Giảm giá ${Number(data.discount * 100)}%</p>` : ""}
                <p class="detail-price">
                   ${Number(data.discount) > 0 ? `<span class="priceReal">${formatNumber(data.price)}</span>` : ""}
                    ${formatNumber(Number(handleDiscountCalculation(data.price, data.discount)))}
                </p>
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

const handleDiscountCalculation = (realPrice, discount) => {
    return realPrice * (1 - discount);
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

const renderListReview = (data) => {
    let html = '';
    let userID = JSON.parse(sessionStorage.getItem("user")).id;
    data.forEach(item => {
        html += `
        <li class="detail-review_item">
        <img src="${item.userImage.includes(imageFb) ? item.image + imageKey : item.userImage}"
            alt="${item.userName}">
        <div class="detail-review_content">
            <div class="detail-review_box">
                <p class="detail-review_name">${item.userName}</p>
                <p class="detail-review_date">${timeSince(new Date(item.createdAt).getTime())}</p>
                ${Number(userID) === Number(item.userID) ? `<p class="detail-review_remove" onClick="handleDeleteReview(${Number(item.id)})">
                <span><i class="fas fa-times-circle"></i></span>
            </p>` : ""}
            </div>
            <div class="detail-review_rating">
                ${showStar(item.stars)}
            </div>
            <div class="detail-review_des">
               ${item.content}
            </div>
        </div>
    </li>
        `;
    });
    $(".detail-review_list").html(html);
}


