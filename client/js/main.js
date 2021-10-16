
const base_URL = "http://localhost:8080/foodorder/server/api/";

const ADD_SUCCESS = 'Thêm thành công!';
const ADD_FAILED = "Thêm thất bại!";
const UPDATE_SUCCESS = "Cập nhật thành công!";
const UPDATE_FAILED = "Cập nhật thật bại";
const NOTIFICATION = "Thông báo";
const ERROR = "Lỗi";
const WARNING = "Nhắc nhở";


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
        html += `<img src="${user.image}" class="account-image" />
        <span class="account-name">${user.name}</span>
        <ul class="account-controls">
            <li><a href="">Thông tin cá nhân</a></li>
            <li><a href="">Đơn hàng</a></li>
            <li><a href="./admin/">Dashboard</a></li>
            <li><a  onClick="handleSignOutUser();">Đăng xuất</a></li>
        </ul>`;
        $("#account").html(html);
    } else {
        html += `  <a href="login.html" class="navbar-account_signUp">Đăng nhập/Đăng ký</a>`;
        $("#account").html(html);
    }
}