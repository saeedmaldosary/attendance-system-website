 firebase.auth().onAuthStateChanged(function (user) {

     if (user) {
         // User is signed in.
         email = user.email;
         var username = email.substring(0, email.indexOf('@')).toLowerCase();
         var f1 = firebase.database().ref("usersInfo").child(username).child("userType");
         f1.on('value', function (datasnapshot) {

             if (datasnapshot.val() === 'Student' || datasnapshot.val() === 'Teacher') {
                 if (window.location.href.indexOf('homepageStudentTeacher') < 1) {
                     alert("You are not allowed to enter this page!");
                     window.location.replace("homepageStudentTeacher.html");
                 }
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
