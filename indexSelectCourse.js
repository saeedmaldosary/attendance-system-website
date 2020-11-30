 firebase.auth().onAuthStateChanged(function (user) {

     if (user) {
         // User is signed in.
      
     } else {
         //User not signed in redirect to login page!
         uid = null;
         if (window.location.href.indexOf('index') < 1)
             window.location.replace("index.html");
     }

 });

 if (localStorage.getItem("userType2") === 'Student' || localStorage.getItem("userType2") === 'Teacher') {
     document.getElementById("homepageBut").setAttribute("href", "homepageStudentTeacher.html");
 }

 document.getElementById("sections").disabled = true;
 document.getElementById("attendanceDates").disabled = true;

 document.getElementById("submit").style.pointerEvents = "none";
 document.getElementById("submit").style.cursor = "default";



 var userType = localStorage.getItem("userType2");

 if (userType === "Teacher" || userType === "Student") {

     firebase.auth().onAuthStateChanged(function (user) {

         email = user.email;
         var username = email.substring(0, email.indexOf('@')).toLowerCase();

         var f22 = firebase.database().ref("usersInfo").child(username).child("userRealName");
         f22.once("value")
             .then(function (snapshot) {
                 var userRealName = snapshot.val();


                 var CoursesO = ["IS395", "IS203", "IS441", "IS391"];
                 var coursesNot = [];
                 for (var i = 0; i < CoursesO.length; i++) {

                     var f25 = firebase.database().ref("coursesInfo").child(CoursesO[i]);



                     f25.on("value", function (snapshot) {
                         snapshot.forEach(function (childSnapshot) {


                             if (userType === "Teacher") {
                                 if (snapshot.child(childSnapshot.key).hasChild("courseTeacher")) {
                                     if (snapshot.child(childSnapshot.key).child("courseTeacher").val() === userRealName && !coursesNot.includes(snapshot.key)) {
                                         document.getElementById("courses").innerHTML += "<option>" + snapshot.key + "</option>";
                                         coursesNot.push(snapshot.key);
                                     } // For check courseTeacher is same
                                 } // For Check courseTeacher

                             } // For if condtion usertype teacher


                             if (userType === "Student") {

                                 var f2979 = firebase.database().ref("coursesInfo").child(snapshot.key).child(childSnapshot.key);
                                 f2979.on("value", function (snapshot2) {
                                     snapshot2.forEach(function (childSnapshot2) {

                                         if (snapshot2.child(childSnapshot2.key).val() === userRealName) {

                                             document.getElementById("courses").innerHTML += "<option>" + snapshot.key + "</option>";
                                         }

                                     }); // For loop in database and find students keys
                                 }) // For start retreive
                             } // For if condtion usertype Student


                         }); // For loop in database and find section
                     }) // For start retreive

                 } // For loop coursesLength
             }); // For retreive user Real name
     }); // For firebase.auth
 } // For if condtion student or teacher
 if (userType === "Admin") {
     var CoursesO = ["IS395", "IS203", "IS441", "IS391"];
     for (var i = 0; i < CoursesO.length; i++) {
         document.getElementById("courses").innerHTML += "<option>" + CoursesO[i] + "</option>";
     }
 } // For if condtion admin




 function retrieveSection() {

     var c2 = document.getElementById("courses");
     var selectedCourse2 = c2.options[c2.selectedIndex].text;

     if (selectedCourse2 !== "Course") {

         document.getElementById("submit").style.pointerEvents = "none";
         document.getElementById("submit").style.cursor = "default";
         var select = document.getElementById("sections");
         var length = select.options.length;
         for (i = length - 1; i > 0; i--) {
             select.options[i] = null;
         }
         document.getElementById("sections").disabled = false;

         closeSelectOption();

         var select2 = document.getElementById("attendanceDates");
         var length2 = select2.options.length;
         for (i = length2 - 1; i > 0; i--) {
             select2.options[i] = null;
         }

         var c = document.getElementById("courses");
         var selectedCourse = c.options[c.selectedIndex].text;




         var f2 = firebase.database().ref("studentsAttendee").child(selectedCourse);
         f2.on("value", function (snapshot) {

             snapshot.forEach(function (childSnapshot) {
                 document.getElementById("sections").innerHTML += "<option>" + childSnapshot.key + "</option>";

                 if (localStorage.getItem("userType2") === 'Student') {
                     select.options[0] = null;
                     document.getElementById("attendanceDates").disabled = false;
                     retrieveDates();
                 }
             });
         })

     } else {
         var select25 = document.getElementById("sections");
         var length25 = select25.options.length;
         for (i = length25 - 1; i >= 0; i--) {
             select25.options[i] = null;
         }
            document.getElementById("sections").innerHTML += "<option>Section</option>";
         document.getElementById("sections").disabled = true;
          document.getElementById("attendanceDates").disabled = true;
     }

 }




 function retrieveDates() {

     var select = document.getElementById("sections");
     var length = select.options.length;

     if (length === 1 && localStorage.getItem("userType2") === 'Teacher' || length === 1 && localStorage.getItem("userType2") === 'Admin') {
         alert("There is no section to select");
     } else {
         document.getElementById("attendanceDates").disabled = false;

         var select = document.getElementById("attendanceDates");
         var length = select.options.length;
         for (i = length - 1; i > 0; i--) {
             select.options[i] = null;
         }

         var c = document.getElementById("courses");
         var selectedCourse = c.options[c.selectedIndex].text;
         var s = document.getElementById("sections");
         var selectedSection = s.options[s.selectedIndex].text;


         var f2 = firebase.database().ref("studentsAttendee").child(selectedCourse).child(selectedSection);
         f2.on("value", function (snapshot) {
             snapshot.forEach(function (childSnapshot) {
                 document.getElementById("attendanceDates").innerHTML += "<option>" + childSnapshot.key + "</option>";
             });
         })


     }


 }

 function alertDatesSelect() {

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;


     var s = document.getElementById("sections");
     var length2 = s.options.length;
     var selectedSection = s.options[s.selectedIndex].text;

     var select = document.getElementById("attendanceDates");
     var length = select.options.length;
     var selectedDate = select.options[select.selectedIndex].text;



     if (length2 > 1 && selectedSection === "Section" && length === 1) {
         alert("Please select a section");
     } else if (length === 1) {
         alert("There is no date to select");
     } else if (selectedCourse != "Course" && selectedSection != "Section" && selectedDate != "Date") {
         enableSubmit();
     } else if (selectedCourse === "Course" || selectedSection === "Section" || selectedDate === "Date") {
         document.getElementById("submit").style.pointerEvents = "none";
         document.getElementById("submit").style.cursor = "default";
     }
 }




 function enableSubmit() {

     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;

     var s = document.getElementById("sections");
     var selectedSection = s.options[s.selectedIndex].text;

     var a = document.getElementById("attendanceDates");
     var selectedDate = a.options[a.selectedIndex].text;

     localStorage.setItem("selectedCourse", selectedCourse);
     localStorage.setItem("selectedSection", selectedSection);
     localStorage.setItem("selectedDate", selectedDate);

     document.getElementById("submit").style.pointerEvents = "auto";
     document.getElementById("submit").style.cursor = "pointer";

 }

 function closeSelectOption() {
     var c = document.getElementById("courses");
     var selectedCourse = c.options[c.selectedIndex].text;
     var lengthCourses = c.options.length;

     var s = document.getElementById("sections");
     var selectedSection = s.options[s.selectedIndex].text;
     var lengthSecetions = s.options.length;


     var a = document.getElementById("attendanceDates");
     var selectedDate = a.options[a.selectedIndex].text;
     var lengthDate = a.options.length;


     if (selectedCourse === "Course") {
         document.getElementById("sections").disabled = true;
         document.getElementById("attendanceDates").disabled = true;
     }
     if (selectedSection === "Section") {
         document.getElementById("attendanceDates").disabled = true;
     }
 }




 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }
