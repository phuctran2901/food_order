$(() => {
    $("#inputFileCategory").change((e) => {
        onShowImage(e.target.files[0]);
    })
    renderUser();
    $("#submit").click(e => {
        let formData = new FormData();
        let name = $("#fullName").val();
        let phone = $("#phone").val();
        let address = $("#address").val();
        let age = $("#year").val();
        let role = Number(JSON.parse(sessionStorage.getItem("user")).role);
        let files = $("#inputFileCategory")[0].files[0];
        let image = $(".showImage-reader");
        if (files) formData.append("image", files);
        else formData.append("image", image.attr("src"));
        if (name !== "" && phone !== "" && address !== "" && age !== "") {
            formData.append("event", "updateUser");
            formData.append("id", Number(JSON.parse(sessionStorage.getItem("user")).id));
            formData.append("name", name);
            formData.append("age", age);
            formData.append("address", address);
            formData.append("phone", phone);
            formData.append("role", role);
            callAPIFormData('POST', `${base_URL}/users/`, formData, 'json', updateUserSuccess, () => $(".loading").show());
        }
    })
    $("#changePassword").click(e => {
        let password = $("#password").val();
        let confirmPassword = $("#confirmPassword").val();
        if (password !== "" && password === confirmPassword) {
            let request = {
                event: "changePassword",
                password,
                id: JSON.parse(sessionStorage.getItem("user")).id
            }
            callAPI('POST', `${base_URL}/auth/`, request, 'json', res => {
                if (res === true) {
                    toastCustom("Thành công", "Bạn đã đổi mật khẩu thành công", "success");
                    $("#password").val("");
                    $("#confirmPassword").val("");
                } else {
                    toastCustom(ERROR, "Đổi mật khẩu thật bại", "error");
                }
            })
        }
    });
});


const onShowImage = (files) => {
    let image = $(".showImage-reader");
    var reader = new FileReader();
    reader.onload = function (e) {
        image.attr("src", e.target.result);
    };

    reader.readAsDataURL(files);
}

const renderUser = () => {
    let user = JSON.parse(sessionStorage.getItem("user")) || null;
    if (user) {
        if (user.idSocical !== null) {
            $("#password").prop("disabled", true);
            $("#confirmPassword").prop("disabled", true);
            $("#changePassword").prop("disabled", true);
        }
        $("#fullName").val(user.name);
        $("#phone").val(user.phone || user.Phone);
        $("#email").val(user.email || user.Email);
        $("#address").val(user.address || user.Address);
        $("#year").val(user.age || user.Age);
        $("#age").val(Number(new Date().getFullYear() - (user.age || user.Age)) || 0);
        $(".showImage-reader").attr("src", user.image || user.Image);
        $(".user-name").text(user.name || user.Name);
        $(".user-email").text(user.email || user.Email);
    } else {
        window.location.href = 'login.html';
    }
}



const updateUserSuccess = (res) => {
    $(".loading").hide();
    let userID = JSON.parse(sessionStorage.getItem("user")).id;
    if (res.status == true) {
        toastCustom(NOTIFICATION, UPDATE_SUCCESS, "success");
        getUser((res) => {
            sessionStorage.setItem("user", JSON.stringify(res.data[0]));
        }, Number(userID));
    } else {
        toastCustom(ERROR, UPDATE_FAILED, "error");
    }
}

const getUser = (callback, id) => {
    callAPI("GET", `${base_URL}/users/`, { event: "getOneUser", id }, 'JSON', callback);
}
