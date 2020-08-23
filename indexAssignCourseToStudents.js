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

     var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

     if (selectedCourse === "Course" || sectionNo == null || sectionNo == "" || checkboxes.length < 1) {
         alert("Please fill all inputs");

     } else {

         var f4 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);
         f4.once("value")
             .then(function (snapshot) {
                 var counter1 = snapshot.numChildren();
                 var counter2 = 0;
                 for (var i = 0; i < checkboxes.length; i++) {
                     var state = "true";
                     for (var j = 0; j < snapshot.numChildren() + 1; j++) {
                         if (snapshot.child("StudentName" + j).val() !== checkboxes[i].value) {
                             state = "true";
                         } else {
                             state = "false";
                             break;
                         }
                     }
                     if (state === "true") {
                         counter2++;
                         var sum = counter1 + counter2;
                         firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("StudentName" + sum).set(checkboxes[i].value);
                     } else {
                         alert(checkboxes[i].value + " assigned before!")
                     }
                 }
                 if (counter2 > 0) {
                    alert("Students assigned done!");
                 }
             });

     }
 }

 function removeDub() {

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var sectionNo = document.getElementById("sectionNumber").value;

     var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

     var f4 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);
     f4.on("value", function (snapshot) {
         snapshot.forEach(function (childSnapshot) {

             for (var i = 0; i < checkboxes.length; i++) {

                 if (childSnapshot.val() === checkboxes[i].value) {
                     alert(childSnapshot.val() + " Dub!");
                     firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child(childSnapshot.key).set(null);
                 }
             }

         });
     })
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