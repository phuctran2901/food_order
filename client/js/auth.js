$(() => {
    $("#form-login").validate({ // handle login
        rules: {
            email: {
                required: true,
                email: true
            },
            password: "required"
        },
        messages: {
            email: "Trường này phải là email",
            password: "Vui lòng nhập password"
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var inputs = $(form).find(':input');
            let email = inputs.filter('[name=email]').val();
            let password = inputs.filter('[name=password]').val();
            let request = {
                event: "login",
                email,
                password
            };
            callAPI("POST", `${base_URL}/auth/`, request, 'json', (res) => {
                if (res.status) {

                } else {
                    toastCustom("Lỗi", res.messenger, "error");
                }
            });
        }
    });
    $("#form-register").validate({ // handle register
        rules: {
            email: {
                required: true,
                email: true
            },
            password: "required",
            age: {
                required: true,
                number: true
            },
            address: "required",
            phone: {
                required: true,
                number: true
            }
        },
        messages: {
            email: "Trường này phải là email",
            password: "Vui lòng nhập password"
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var inputs = $(form).find(':input');
            let email = inputs.filter('[name=email]').val();
            let password = inputs.filter('[name=password]').val();
            let request = {
                event: "login",
                email,
                password
            };
            callAPI("POST", `${base_URL}/auth/`, request, 'json', (res) => {
                if (res.status) {

                } else {
                    toastCustom("Lỗi", res.messenger, "error");
                }
            });
        }
    });
    window.onLoadCallback = function () {
        startSignInGoogle(); // auth google
    }
    startSignInFaceBook(); // auth facebook

    $(".header-menu li").click(function () {
        $($(this).attr("data-off")).hide();
        $($(this).attr("data-on")).show();
        $(".header-menu li").removeClass("active");
        $(this).addClass("active");
    })
});



function startSignInFaceBook() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '2891367197779167',
            cookie: true,
            xfbml: true,
            version: 'v12.0'
        });

        FB.AppEvents.logPageView();

    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function startSignInGoogle() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '386328534498-rlu5u661cmtdsidvu7lj5r7ne0grlu1j.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
        });
        attachSignin(document.getElementById('customBtnGoogle'));
    });
}
function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            let userID = googleUser.getId();
            let profile = googleUser.getBasicProfile();
            let fullName = profile.getName();
            let email = profile.getEmail();
            let image = profile.getImageUrl();
            let request = {
                event: "loginWithSocical",
                userID,
                fullName,
                email,
                image
            }
            callAPI("POST", `${base_URL}/auth/`, request, 'json', (res) => {
                console.log(res);
            });
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}



const onSignOutGoogle = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log("signout success");
    })
}

function getUserDataAndCallAPI() {
    FB.api('/me?fields=id,name,picture,email',
        function (response) {
            let userID = response.id;
            let email = response.email;
            let image = response.picture.data.url;
            let fullName = response.name;
            let request = {
                event: "loginWithSocical",
                userID,
                email,
                image,
                fullName
            };
            callAPI("POST", `${base_URL}/auth/`, request, 'json', (res) => {
                console.log(res);
            });
        });
}

const handleLoginFB = () => {
    FB.login(function (response) {
        if (response.authResponse) {
            getUserDataAndCallAPI();
        }
    }, { scope: 'public_profile,email' });
}


function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}
