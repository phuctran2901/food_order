$(() => {
    checkAdmin();
    getUser(res => {
        if (res.status === true) {
            renderUser(res.data[0]);
            sessionStorage.setItem("userID", res.data[0].id);
        } else {
            toastCustom(ERROR, res.messenger, "error");
        }
    }, getParamsToURL()[0]);
    $("#fileInput").change((e) => {
        onShowImage(e.target.files[0]);
    })
    $("#editUser").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            name: "required",
            age: {
                required: true,
                number: true,
                maxlength: 4
            },
            address: "required",
            phone: {
                required: true,
                number: true
            }
        },
        messages: {
            email: "Trường này phải là email",
            name: "Vui lòng nhập họ tên của bạn",
            age: "Trường này phải là số và độ dài bằng 4",
            phone: "Trường này phải là số",
            address: "Vui lòng nhập địa chỉ"
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            let formData = new FormData();
            var inputs = $(form).find(':input');
            let name = inputs.filter('[name=name]').val();
            let age = inputs.filter('[name=age]').val();
            let address = inputs.filter('[name=address]').val();
            let phone = inputs.filter('[name=phone]').val();
            let role = Number(inputs.filter('[name=role]').val());
            let files = $("#fileInput")[0].files[0];
            let image = $(".showImage-reader");
            formData.append("event", "updateUser");
            formData.append("id", Number(sessionStorage.getItem("userID")));
            if (files) formData.append("image", files);
            else formData.append("image", image.attr("src"));
            formData.append("name", name);
            formData.append("age", age);
            formData.append("address", address);
            formData.append("phone", phone);
            formData.append("role", role);
            callAPIFormData('POST', `${base_URL}/users/`, formData, 'json', updateUserSuccess, () => $(".loading").show());
        }
    });
});


const getUser = (callback, id) => {
    callAPI("GET", `${base_URL}/users/`, { event: "getOneUser", id }, 'JSON', callback);
}


const renderUser = (data) => {
    console.log(data);
    let form = $("#editUser");
    let inputs = form.find(':input');
    inputs.filter('[name=name]').val(data.name);
    inputs.filter('[name=email]').val(data.email);
    inputs.filter('[name=age]').val(data.age);
    inputs.filter('[name=phone]').val(data.phone);
    inputs.filter('[name=address]').val(data.address);
    inputs.filter('[name=role]').val(data.role).change();
    let image = $(".showImage-reader");
    image.show();
    $("#image").hide();
    image.attr("src", data.image);
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

const updateUserSuccess = (res) => {
    $(".loading").hide();
    if (res.status == true) {
        toastCustom(NOTIFICATION, UPDATE_SUCCESS, "success");
    } else {
        toastCustom(ERROR, UPDATE_FAILED, "error");

    }
}