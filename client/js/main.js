
const base_URL = "http://localhost:8080/foodorder/server/api/";
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