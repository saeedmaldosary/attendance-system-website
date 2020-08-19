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



 var f2 = firebase.database().ref("usersInfo");
 f2.on("value", function (snapshot) {
     snapshot.forEach(function (childSnapshot) {
         if (childSnapshot.val().userType === "Teacher")
             document.getElementById("teachersNames").innerHTML += "<option>" + childSnapshot.val().userRealName + "</option>";
     });
 })




 function uploadCourseInfo2() {


     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var sectionNo = document.getElementById("sectionNumber").value;

     var t = document.getElementById("teachersNames");
     var selectedTeacher = t.options[t.selectedIndex].text;

     if (selectedCourse === "Course" || sectionNo == null || sectionNo == "" || selectedTeacher === "Teacher") {
         alert("Please fill all inputs");
     } else {


         firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("courseTeacher").set(selectedTeacher);


         alert("Teacher assigned done!");
     }
 }


 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }
