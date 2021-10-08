
$(() => {
    getDetailProduct(getParamsToURL());
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
                formData.append("productID", JSON.parse(sessionStorage.getItem("productID")));
                formData.append("image", files);
                formData.append("name", name);
                formData.append("price", price);
                formData.append("description", description);
                formData.append("categoryID", category);
                formData.append("display", display);
                formData.append("discount", discount);
                callAPIFormData('POST', `${base_URL}/products/`, formData, 'json', addProductSuccess, beforeSendAddProduct);
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
});


const getDetailProduct = (productID) => {
    const request = {
        event: "getOneProduct",
        productID: productID[0]
    };
    callAPI("GET", `${base_URL}/products/`, request, "json",
        (res) => {
            renderDataProduct(res.product[0]);
            // set ID product to session
            console.log(data)
            sessionStorage.setItem("productID", JSON.stringify(res.product[0].product_id));
        },
        () => {

        });
}


const renderDataProduct = (data) => {
    var inputs = $("#form-addProduct").find(':input');
    inputs.filter('[name=name]').val(`${data.name}`);
    inputs.filter('[name=price]').val(`${data.price}`);
    inputs.filter('[name=discount]').val(`${data.discount}`);
    inputs.filter('[name=description]').val(`${data.description}`);
    // inputs.filter('[name=category]').val(`${data.category}`);
    inputs.filter('[name=display]').val(`${data.display}`);
    console.log(data.display);
    let image = $(".showImage-reader");
    image.show();
    $("#image").hide();
    image.attr("src", data.image);
}