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



 function retreiveSections() {

     var select = document.getElementById("sectionSelect");
     var length = select.options.length;
     for (i = length - 1; i > 0; i--) {
         select.options[i] = null;
     }

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;


     var f25 = firebase.database().ref("coursesInfo").child(selectedCourse);

     f25.on("value", function (snapshot) {
         snapshot.forEach(function (childSnapshot) {
             document.getElementById("sectionSelect").innerHTML += "<option>" + childSnapshot.key + "</option>";
         }); // For loop in database and find section
     }) // For start retreive

 }






 function deleteSection() {



     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var s = document.getElementById("sectionSelect");
     var sectionNo = s.options[s.selectedIndex].text;



     if (selectedCourse === "Course" || sectionNo == "Section") {
         alert("Please fill all inputs");
     } else {
         firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).remove();
         alert("Section remove done");
     }
 }




 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }
