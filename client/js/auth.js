$(() => {
    startSignInGoogle();
});


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
            let profile = googleUser.getBasicProfile();
            let fullName = profile.getName();
            let email = profile.getEmail();
            let image = profile.getImageUrl();
            let request = {
                event: "loginWithGoogle",
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
