
$(() => {
    getDetailProduct(getParamsToURL());

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
            let formData = new FormData();
            var inputs = $(form).find(':input');
            let name = inputs.filter('[name=name]').val();
            let price = inputs.filter('[name=price]').val();
            let discount = inputs.filter('[name=discount]').val();
            let description = inputs.filter('[name=description]').val();
            let category = inputs.filter('[name=category]').val();
            let display = inputs.filter('[name=display]').val();
            let files = $("#fileInput")[0].files[0];
            let image = $(".showImage-reader");
            if (files || image.attr("src") !== "") {
                formData.append("event", "editProduct");
                formData.append("productID", JSON.parse(sessionStorage.getItem("productID")));
                if (files) formData.append("image", files);
                else formData.append("image", image.attr("src"));
                formData.append("name", name);
                formData.append("price", price);
                formData.append("description", description);
                formData.append("categoryID", category);
                formData.append("display", display);
                formData.append("discount", discount);
                callAPIFormData('POST', `${base_URL}/products/`, formData, 'json', updateProductSuccess, () => $(".loading").show());
            } else {
                toastCustom(WARNING, "Vui lòng thêm ảnh cho món ăn!", "warning");
            }
        }
    });
    $("#fileInput").change((e) => {
        onShowImage(e.target.files[0]);
    })
});

const getListCategories = (callback) => {
    return callAPI(
        "GET",
        `${base_URL}/categories/`,
        { event: "getListCategories" },
        'json',
        callback
    )
}

const renderListCategories = (data) => {
    let html = '';
    data.forEach(item => {
        html += `  <option value="${item.categoryID}">${item.name}</option>`;
    });
    $("#category").html(html);
}

const getDetailProduct = (productID) => {
    const request = {
        event: "getOneProduct",
        productID: productID[0]
    };
    callAPI("GET", `${base_URL}/products/`, request, "json",
        (res) => {
            renderDataProduct(res.product[0]);
            sessionStorage.setItem("productID", JSON.stringify(res.product[0].product_id));
        },
        () => {

        });
}


const renderDataProduct = (data) => {
    var inputs = $("#form-addProduct").find(':input');
    inputs.filter('[name=name]').val(data.name);
    inputs.filter('[name=price]').val(data.price);
    inputs.filter('[name=discount]').val(data.discount);
    inputs.filter('[name=description]').val(data.description);
    inputs.filter('[name=category]').val(data.categoryID).change();
    inputs.filter('[name=display]').val(data.display).change();
    let image = $(".showImage-reader");
    image.show();
    $("#image").hide();
    image.attr("src", data.image);
}


const updateProductSuccess = (res) => {
    $(".loading").hide();
    if (res) {
        toastCustom(NOTIFICATION, UPDATE_SUCCESS, "success");
    } else {
        toastCustom(ERROR, UPDATE_FAILED, "error");
    }
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