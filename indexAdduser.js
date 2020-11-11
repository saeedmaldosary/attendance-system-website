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

 function signUp() {

     var u = document.getElementById("userType");
     var userType = u.options[u.selectedIndex].text;
     var email = document.getElementById("email").value.toLowerCase();
     var password = document.getElementById("password").value;
     var userRealName = document.getElementById("userRealName").value;
     if (userType === "User type" || email == null || email == "" || password == null || password == "" || userRealName == null || userRealName == "") {
         alert("Please fill all inputs");
     } else {



         if (userType === "Student") {
             email += "@sm.imamu.edu.sa";
         } else {
             email += "@imamu.edu.sa";
         }

         const promise = secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(function (firebaseUser) {

             console.log("User " + firebaseUser.uid + " created successfully!");
             //I don't know if the next statement is necessary 
             secondaryApp.auth().signOut();
         });
         promise.catch(e => alert(e.message));

         firebase.database().ref("usersInfo").child(document.getElementById("email").value).child("userType").set(userType);
         firebase.database().ref("usersInfo").child(document.getElementById("email").value).child("userRealName").set(userRealName);


         alert("User registered!");
     }

 }






 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }
