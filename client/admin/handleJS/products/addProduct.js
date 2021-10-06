$(() => {
    // window.onbeforeunload = function () {
    //     return "Dude, are you sure you want to leave? Think of the kittens!";
    // }
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
            let display = inputs.filter('[name=display]');
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
                callAPIFormData('POST', 'http://localhost:8080/foodorder/server/api/products/', formData, 'json', addProductSuccess, beforeSendAddProduct);
            } else {
                $.toast({
                    heading: 'Nhắc nhở',
                    text: 'Vui lòng thêm ảnh!',
                    position: 'top-center',
                    stack: false,
                    icon: "warning"
                })
            }
        }
    });
    $("#fileInput").change((e) => {
        onShowImage(e.target.files[0]);
    })
})



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
        console.log("hello");
        $(".showImage-reader").hide();
        $("#image").show();
        resetForm("#form-addProduct");
        $.toast({
            heading: 'success',
            text: 'Thêm sản phẩm thành công!',
            position: 'top-center',
            stack: false,
            icon: "success"
        })
    } else {
        $.toast({
            heading: 'Lỗi',
            text: 'Thêm sản phẩm thất bại!',
            position: 'top-center',
            stack: false,
            icon: "error"
        })
    }
}

const beforeSendAddProduct = () => {
    $(".loading").show();
}