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
     } else if (sectionNo === "Section") {
         alert("Please select a section");
     }

 }


 function deleteStudent() {



     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var s = document.getElementById("sectionSelect");
     var sectionNo = s.options[s.selectedIndex].text;


     var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');


     if (selectedCourse === "Course" || sectionNo == "Section" || checkboxes.length < 1) {
         alert("Please fill all inputs");

     } else {


         var arrayCS = [];
         var f4 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);
         f4.once("value")
             .then(function (snapshot) {

                 for (var i = 0; i < snapshot.numChildren() + 1; i++) {
                     var sum = i + 1;
                     for (var j = 0; j < checkboxes.length; j++) {
                         if (snapshot.child("StudentName" + sum).val() !== checkboxes[j].value) {
                             arrayCS.push(snapshot.child("StudentName" + sum).val());
                         }
                     }
                 }

                 for (var i = 0; i < arrayCS.length; i++) {
                     var sum55 = i + 1;
                     firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("StudentName" + sum55).set(arrayCS[i]);
                 }

                 for (var i = arrayCS.length; i <= snapshot.numChildren(); i++) {
                     firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo).child("StudentName" + i).set(null);
                 }



                 alert("Students deleted done");
                 document.getElementById("checkboxesStudentNames").innerHTML = "";
                 var f25 = firebase.database().ref("coursesInfo").child(selectedCourse).child(sectionNo);

                 f25.on("value", function (snapshot) {
                     snapshot.forEach(function (childSnapshot) {
                         if (childSnapshot.key !== "courseTeacher") {
                             document.getElementById("checkboxesStudentNames").innerHTML += "<label><input type='checkbox' name='vechicle' value='" + childSnapshot.val() + "'>" + childSnapshot.val() + "</label>";
                         }
                     }); // For loop in database and find section
                 }) // For start retreive


                 var select = document.getElementById("sectionSelect");
                 var length = select.options.length;
                 for (i = length - 1; i > 0; i--) {
                     select.options[i] = null;
                 }
                 var f26 = firebase.database().ref("coursesInfo").child(selectedCourse);

                 f26.on("value", function (snapshot) {
                     snapshot.forEach(function (childSnapshot) {
                         document.getElementById("sectionSelect").innerHTML += "<option>" + childSnapshot.key + "</option>";
                     }); // For loop in database and find section
                 }) // For start retreive

                 document.getElementById("sectionSelect").value = sectionNo;



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