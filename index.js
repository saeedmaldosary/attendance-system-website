 firebase.auth().onAuthStateChanged(function (user) {

     if (user) {


         

         // User is signed in.
         email = user.email;
         var username = email.substring(0, email.indexOf('@')).toLowerCase();


         var f1 = firebase.database().ref("usersInfo").child(username).child("userType");
         f1.on('value', function (datasnapshot) {
             localStorage.setItem("userType2", datasnapshot.val());


             if (datasnapshot.val() === 'Student' || datasnapshot.val() === 'Teacher') {
                 if (window.location.href.indexOf('homepageStudentTeacher') < 1) {
                     window.location.replace("homepageStudentTeacher.html");
                 }
             } else if (datasnapshot.val() === 'Admin') {
                 if (window.location.href.indexOf('homepage') < 1) {
                     window.location.replace("homepage.html");
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





 function signIn() {


   

     var email = document.getElementById("email").value.toLowerCase();
     var password = document.getElementById("password").value;
     var connectEmail;

     var f1 = firebase.database().ref("usersInfo").child(email.toLowerCase()).child("userType");
     f1.on('value', function (datasnapshot) {

         if (datasnapshot.val() === 'Student')
             connectEmail = email.toLowerCase() + "@sm.imamu.edu.sa";
         else if (datasnapshot.val() === 'Teacher' || datasnapshot.val() === 'Admin')
             connectEmail = email.toLowerCase() + "@imamu.edu.sa";

         firebase.auth().signInWithEmailAndPassword(connectEmail, password).catch(function (error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             // ...
             window.alert("Error " + errorMessage);

         });
     });

 }
