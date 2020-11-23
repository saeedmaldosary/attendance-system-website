firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        // User is signed in.
        email = user.email;
        var username = email.substring(0, email.indexOf('@')).toLowerCase();
        var f1 = firebase.database().ref("usersInfo").child(username).child("userType");
        f1.on('value', function (datasnapshot) {

            localStorage.setItem("userType2", datasnapshot.val());


            var f2 = firebase.database().ref("usersInfo").child(username).child("userRealName");
            f2.on('value', function (datasnapshot2) {
                localStorage.setItem("userRealname2", datasnapshot2.val());
            });


            if (datasnapshot.val() === 'Admin') {
                if (window.location.href.indexOf('homepagestudentteacher') > 1)
                    window.location.replace("homepage.html");
            }

        });
    } else {
        //User not signed in redirect to login page!
        uid = null;
        if (window.location.href.indexOf('index') < 1)
            window.location.replace("index.html");
    }

});



function signOut() {
    firebase.auth().signOut();
    window.location.replace("index.html");

}