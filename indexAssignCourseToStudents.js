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
         if (childSnapshot.val().userType === "Student") {

             document.getElementById("checkboxesStudentNames").innerHTML += "<label><input type='checkbox' name='vechicle' value='" + childSnapshot.val().userRealName + "'>" + childSnapshot.val().userRealName + "</label>";
         }
     });
 })





 function uploadStudentsCourseInfo() {
     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var sectionNo = document.getElementById("sectionNumber").value;

     var array = [];
     var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

     if (selectedCourse === "Course" || sectionNo == null || sectionNo == "" || checkboxes.length < 1) {
         alert("Please fill all inputs");

     } else {

         var counter = 0;
         var f4 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);
         f4.once("value")
             .then(function (snapshot) {
                 counter = snapshot.numChildren();



                 for (var i = 0; i < checkboxes.length; i++) {

                     //we can use random child to let the studentname same in all database
                     //see 10:10
                     //https://www.youtube.com/watch?v=KITvtG0ZFb8

                     var state = "true";
                     for (var j = 0; j < 100; j++) {
                         if (snapshot.child("StudentName" + j).val() !== checkboxes[i].value) {
                             state = "true";
                         } else {
                             state = "false";
                             break;
                         }
                     }
                     var sum;
                     if (state === "true") {
                         if (snapshot.hasChild("courseTeacher")) {
                             sum = i + counter + 5;
                         } else {
                             sum = i + counter;
                         }
                         firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("StudentName" + sum).set(checkboxes[i].value);
                         //alert("Students assigned done!");
                     } else {
                         alert(checkboxes[i].value + " assigned before!")
                     }


                 }
             });

     }
 }




 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }

 var expanded = false;

 function showCheckboxes() {
     var checkboxes = document.getElementById("checkboxesStudentNames");
     if (!expanded) {
         checkboxes.style.display = "block";
         expanded = true;
     } else {
         checkboxes.style.display = "none";
         expanded = false;
     }
 }
