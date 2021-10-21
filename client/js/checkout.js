var totalCart = 0;
var user = JSON.parse(sessionStorage.getItem("user")) || null;
$(() => {
    handleRenderUser();

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
                <p class="contact-name">${user.name} <span>( ${user.email} )</span></p>
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
    let html = '';
    let totalCart = data.reduce((totalPrice, cart) => totalPrice + Number(cart.price) * Number(cart.quantity), 0);
    data.forEach(item => {
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