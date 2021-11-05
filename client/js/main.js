
const base_URL = "http://localhost:8080/foodorder/server/api";
// const base_URL = 'https://phuctran2901.000webhostapp.com/server/api';

const ADD_SUCCESS = 'Thêm thành công!';
const ADD_FAILED = "Thêm thất bại!";
const UPDATE_SUCCESS = "Cập nhật thành công!";
const UPDATE_FAILED = "Cập nhật thật bại";
const NOTIFICATION = "Thông báo";
const ERROR = "Lỗi";
const WARNING = "Nhắc nhở";
const SUCCESS = 'Thành công';

const keyFB = 'https://scontent';
const imageFb = 'https://scontent.fsgn6-1.fna.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg';
const imageKey = '?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=D4Dyd0kg59MAX9p6tUP&_nc_ht=scontent.fsgn6-1.fna&edm=AP4hL3IEAAAA&oh=3afce9872e9cb33e0145cac186873036&oe=61933338';
$(() => {
    handleChangeLoginUser();
    $(".navbar-account_cart").click(() => {
        let user = JSON.parse(sessionStorage.getItem("user")) || null;
        if (user && Number(sessionStorage.getItem("totalCart")) > 0) window.location.href = 'checkout.html';
        else toastCustom(WARNING, 'Đăng nhập để xem giỏ hàng', 'warning');
    })
}); // check login user
const callAPIFormData = (method, url, data, dataType, callbackSuccess, callbackBefore) => {
    $.ajax({
        type: method,
        url: url,
        data: data,
        async: true,
        processData: false,
        contentType: false,
        dataType: dataType,
        beforeSend: callbackBefore,
        success: callbackSuccess,
    });
}

const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(num));
}
const findKey = (string) => {
    let index = -1;
    imageFb.forEach((item, i) => {
        if (string.includes(item)) index = i;
    })
    return index;
}


const callAPI = (method, url, data, dataType, callbackSuccess, callbackBefore) => {
    $.ajax({
        type: method,
        url: url,
        data: data,
        async: true,
        dataType: dataType,
        beforeSend: callbackBefore,
        success: callbackSuccess,
    });
}

const getParamsToURL = () => {
    var url = window.location.href;
    var params = url.split('?')[1].split('=');
    params.shift();
    return params;
}

const toastCustom = (header, text, icon) => {
    $.toast({
        heading: header,
        text: text,
        position: 'top-center',
        stack: false,
        icon: icon
    })
}


const handleChangeLoginUser = () => {
    let user = JSON.parse(sessionStorage.getItem("user")) || null;
    let html = '';
    if (user) {
        html += `<img src="${user.image.includes(imageFb) ? user.image + imageKey : user.image}" class="account-image" />
        <span class="account-name">${user.name}</span>
        <ul class="account-controls">
            <li><a href="">Thông tin cá nhân</a></li>
            <li><a href="">Đơn hàng</a></li>
            <li><a href="./admin/">Dashboard</a></li>
            <li><a  onClick="handleSignOutUser();">Đăng xuất</a></li>
        </ul>`;
        $("#account").html(html);
        getTotalCart();
    } else {
        html += `  <a href="login.html" class="navbar-account_signUp">Đăng nhập/Đăng ký</a>`;
        $("#account").html(html);
    }
}

const checkAdmin = () => {
    let user = JSON.parse(sessionStorage.getItem("user")) || null;
    if (user) {
        if (Number(user.role ? user.role : user.Role) !== 0) window.location.href = '../index.html';
        $("#signOut").text(`${user.name}, Đăng xuất`)
        $("#signOut").click(e => {
            e.preventDefault();
            handleSignOutUser();
            window.location.href = '../index.html';
        })
    } else window.location.href = '../index.html';
}

const getTotalCart = () => {
    let userID = JSON.parse(sessionStorage.getItem("user")).id;
    let request = {
        event: "getTotal",
        userID: Number(userID)
    }
    if (userID) {
        callAPI("GET", `${base_URL}/cart/`, request, 'json', (res) => {
            sessionStorage.setItem("totalCart", res.total);
            $(".navbar-account_cart-amount").text(sessionStorage.getItem("totalCart"));
        })
    } else {
        sessionStorage.setItem("totalCart", 0);
        $(".navbar-account_cart-amount").text(0);
    }
}

const handleSignOutUser = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("totalCart");
    handleChangeLoginUser();
    $(".navbar-account_cart-amount").text(0);
}


const showStar = (numStar) => {
    let html = '';
    for (let index = 0; index < numStar; index++) {
        html += '<i class="fa fa-star" aria-hidden="true"></i>';
    }
    for (let index = 0; index < 5 - numStar; index++) {
        html += '<i class="far fa-star"></i>';
    }
    return html;
}


const renderPagination = (currentPage, totalPage) => {
    let html = `
    <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" onClick="changePagination(${currentPage > 1 ? currentPage - 1 : currentPage});">
        <a class="page-link"  aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
    `;
    for (let index = 1; index <= totalPage; index++) {
        html += `
        <li class="page-item ${index === currentPage ? "active" : ""}" onClick="changePagination(${index});" ><a class="page-link">${index}</a></li>
            `;
    }
    html += ` <li class="page-item" onClick="changePagination(${currentPage < totalPage ? currentPage + 1 : currentPage});">
    <a class="page-link"  aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
      <span class="sr-only">Next</span>
    </a>
  </li>
</ul>
</nav>`;
    return html;
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm trước";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng trước";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày trước";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " giờ trước";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút trước";
    }
    if (interval == 0) return "vừa xong";
    return Math.floor(seconds) + " giây trước";
}

