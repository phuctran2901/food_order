
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