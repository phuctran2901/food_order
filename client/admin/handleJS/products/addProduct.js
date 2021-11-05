$(() => {
    checkAdmin();
    getListCategories((res) => {
        if (res.status) {
            renderListCategories(res.data);
        } else toastCustom(ERROR, "Lấy danh sách loại món ăn thật bại", "error");
    })

    $("#form-addProduct").validate({
        rules: {
            name: "required",
            description: "required",
            category: "required",
            price: {
                required: true,
                number: true
            },
            discount: {
                required: true,
                number: true
            }
        },
        messages: {
            name: "Vui lòng nhập tên món ăn",
            description: "Vui lòng nhập mô tả món ăn",
            category: "Vui lòng chọn loại món ăn",
            price: "Vui lòng nhập số",
            discount: "Vui lòng nhập số"
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            let user = JSON.parse(sessionStorage.getItem("user"));
            let formData = new FormData();
            var inputs = $(form).find(':input');
            let name = inputs.filter('[name=name]').val();
            let price = inputs.filter('[name=price]').val();
            let discount = inputs.filter('[name=discount]').val();
            let description = inputs.filter('[name=description]').val();
            let category = inputs.filter('[name=category]').val();
            let display = inputs.filter('[name=display]').val();
            let files = $("#fileInput")[0].files[0];
            if (files) {
                formData.append("event", "addProduct");
                formData.append("image", files);
                formData.append("name", name);
                formData.append("price", price);
                formData.append("description", description);
                formData.append("categoryID", category);
                formData.append("display", display);
                formData.append("discount", discount);
                formData.append("userID", user.id);
                callAPIFormData('POST', `${base_URL}/products/`, formData, 'json', addProductSuccess, beforeSendAddProduct);
            } else {
                toastCustom(WARNING, "Vui lòng thêm ảnh cho món ăn!", "warning");
            }
        }
    });
    $("#fileInput").change((e) => {
        onShowImage(e.target.files[0]);
    })
})

const getListCategories = (callback) => {
    return callAPI(
        "GET",
        `${base_URL}/categories/`,
        { event: "getListCategories" },
        'json',
        callback
    )
}

const resetForm = (form) => {
    var inputs = $(form).find(':input');
    inputs.filter('[name=name]').val("");
    inputs.filter('[name=price]').val("");
    inputs.filter('[name=discount]').val("");
    inputs.filter('[name=description]').val("");
    inputs.filter('[name=category]').prop('selectedIndex', 0);
    inputs.filter('[name=display]').prop('selectedIndex', 0);
    $("#fileInput").val("");
}

const onShowImage = (files) => {
    let image = $(".showImage-reader");
    var reader = new FileReader();
    reader.onload = function (e) {
        image.show();
        $("#image").hide();
        image.attr("src", e.target.result);
    };

    reader.readAsDataURL(files);
}


const addProductSuccess = (res) => {
    $(".loading").hide();
    if (res.status) {
        $(".showImage-reader").hide();
        $("#image").show();
        resetForm("#form-addProduct");
        toastCustom(NOTIFICATION, ADD_SUCCESS, "success");
    } else {
        toastCustom(ERROR, ADD_FAILED, "error");
    }
}

const beforeSendAddProduct = () => {
    $(".loading").show();
}


const renderListCategories = (data) => {
    let html = '';
    data.forEach(item => {
        html += `  <option value="${item.categoryID}">${item.name}</option>`;
    });
    $("#category").html(html);
}

