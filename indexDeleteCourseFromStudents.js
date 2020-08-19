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
     document.getElementById("checkboxesStudentNames").innerHTML = "";

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;


     var f25 = firebase.database().ref("coursesInfo").child(selectedCourse);

     f25.on("value", function (snapshot) {
         snapshot.forEach(function (childSnapshot) {
             document.getElementById("sectionSelect").innerHTML += "<option>" + childSnapshot.key + "</option>";
         }); // For loop in database and find section
     }) // For start retreive

 }

 function retreiveStudentsName() {

     document.getElementById("checkboxesStudentNames").innerHTML = "";

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var s = document.getElementById("sectionSelect");
     var sectionNo = s.options[s.selectedIndex].text;

     if (selectedCourse === "Course") {
         alert("Please select a course");
     } else {

         var f25 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);

         f25.on("value", function (snapshot) {
             snapshot.forEach(function (childSnapshot) {
                 if (childSnapshot.key !== "courseTeacher") {
                     document.getElementById("checkboxesStudentNames").innerHTML += "<label><input type='checkbox' name='vechicle' value='" + childSnapshot.val() + "'>" + childSnapshot.val() + "</label>";
                 }
             }); // For loop in database and find section
         }) // For start retreive

     }
 }

 function checkSelect() {

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;


     var s = document.getElementById("sectionSelect");
     var sectionNo = s.options[s.selectedIndex].text;



     if (sectionNo === "Section" && selectedCourse === "Course") {
         alert("Please select a course and section");
     }
     
      else if (sectionNo === "Section") {
         alert("Please select a section");
     }

 }


 function deleteStudent() {



     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var s = document.getElementById("sectionSelect");
     var sectionNo = s.options[s.selectedIndex].text;


     var sectionNo = document.getElementById("sectionNumber").value;

     var array = [];
     var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');


     if (selectedCourse === "Course" || sectionNo == "Section" || checkboxes.length < 1) {
         alert("Please fill all inputs");

     } else {

         var counter = 0;
         var f4 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);
         f4.once("value")
             .then(function (snapshot) {
                 counter = snapshot.numChildren();



                 for (var i = 0; i < checkboxes.length; i++) {


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
                         alert(checkboxes[i].value + " not exist in this section or course!");
                     } else {
                         firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("StudentName" + j).remove();
                         alert(checkboxes[i].value + " delete done.");
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
     checkSelect();

     var checkboxes = document.getElementById("checkboxesStudentNames");
     if (!expanded) {
         checkboxes.style.display = "block";
         expanded = true;
     } else {
         checkboxes.style.display = "none";
         expanded = false;
     }
 }
