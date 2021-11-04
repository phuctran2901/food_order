var totalCart = 0, totalMoney = 0;
var listProduct = [];
var user = JSON.parse(sessionStorage.getItem("user")) || null;
$(() => {
    handleRenderUser();
    $("#formCheckout").validate({
        rules: {
            name: "required",
            phone: {
                required: true,
                number: true
            },
            address: "required"
        },
        messages: {
            name: "Vui lòng nhập tên của bạn",
            phone: "Trường này phải là số và bắt buộc",
            address: "Vui lòng nhập địa chỉ"
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var inputs = $(form).find(':input');
            let name = inputs.filter('[name=name]').val();
            let phone = inputs.filter('[name=phone]').val();
            let address = inputs.filter('[name=address]').val();
            let note = inputs.filter('[name=note]').val();
            if (totalCart > 0) {
                let request = {
                    event: "addOrder",
                    name,
                    phone,
                    address,
                    note,
                    listProduct,
                    userID: user.id,
                    totalMoney
                };
                callAPI("POST", `${base_URL}/orders/`, request, 'json', (res) => {
                    if (!res) {
                        toastCustom(ERROR, "Đặt hàng thất bại", "error");
                    }
                });
            } else {
                toastCustom(WARNING, "Không có sản phẩm để thanh toán", 'warning');
            }
        }
    })
    getListCart(res => {
        totalCart = res.data.length;
        renderListCart(res.data);
    })
});

const handleRenderUser = () => {
    let html = `
    <img src="https://www.misa.com.vn/images/Recruitment/default-user.png">
    <div class="contact-title">
        <p class="contact-name">Lỗi<span>( Lỗi )</span></p>
        <p>Đăng xuất</p>
    </div>
    `;
    if (user) {
        html = `
            <img src="${user.image}" alt="${user.name}">
            <div class="contact-title">
                <p class="contact-name">${user.name} <span>( ${user.email || user.Email || 'Chưa cập nhật'} )</span></p>
                <p>Đăng xuất</p>
            </div>
        `;
    }
    $(".contact-main").html(html);
}

const handleDeleteCart = (id) => {
    let request = {
        event: "deleteCart",
        cartID: id
    };
    callAPI("POST", `${base_URL}/cart/`, request, 'json', (res) => {
        if (res.status === true) {
            getListCart(res => {
                totalCart = res.data.length;
                renderListCart(res.data);
            })
        }
    })
}


const getListCart = (callback) => {
    if (user) {
        let request = {
            event: "getListCartByUser",
            userID: user.id
        };
        callAPI("GET", `${base_URL}/cart/`, request, 'json', callback);
    }
}

const renderListCart = (data) => {
    listProduct = [];
    let html = '';
    let totalCart = data.reduce((totalPrice, cart) => totalPrice + Number(cart.price) * Number(cart.quantity), 0);
    totalMoney = totalCart;
    data.forEach(item => {
        listProduct.push({
            productID: item.productID,
            quantity: item.quantity,
            totalPrice: Number(item.price) * Number(item.quantity)
        });
        html += `
        <li class="item-product">
            <div class="thumbnail">
                <div class="amount">${item.quantity}</div>
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-detail">
                <div class="title">
                    <p>${item.name}</p>
                    <p onClick="handleDeleteCart(${item.cartID});">
                        <i class="fa fa-window-close" aria-hidden="true"></i>
                    </p>
                </div>
                <div class="price">
                    <p>${item.categoryName}</p>
                    <p>${formatNumber(Number(item.price))}</p>
                </div>
            </div>
        </li>
        `;
    });
    $(".list-product").html(html);
    $(".totalCart").text(formatNumber(totalCart));
}