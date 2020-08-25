 firebase.auth().onAuthStateChanged(function (user) {

     if (user) {
         // User is signed in.
         email = user.email;
         var username = email.substring(0, email.indexOf('@'));
         var f1 = firebase.database().ref("usersInfo").child(username).child("userType");
         f1.on('value', function (datasnapshot) {

             if (datasnapshot.val() === 'Student') {
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

 if (localStorage.getItem("userType2") === 'Teacher') {
     document.getElementById("homepageBut").setAttribute("href", "homepageStudentTeacher.html");
 }

 var attendeeStudents = JSON.parse(localStorage.getItem("attStudents"));
 var absentStudents = JSON.parse(localStorage.getItem("absentStudents"));


 for (var i = 0; i < attendeeStudents.length; i++) {

     document.getElementById("tableAttendee").innerHTML += "<tr onclick = 'makeAbsent(this)'><td>" + attendeeStudents[i] + "</td></tr>";

 }


 for (var i = 0; i < absentStudents.length; i++) {
     if (!attendeeStudents.includes(absentStudents[i])) {
         document.getElementById("tableAbsent").innerHTML += "<tr onclick = 'makeAttendee(this)'><td>" + absentStudents[i] + "</td></tr>";
     }
 }
 // End of retreive information


 function makeAbsent(r) {
     var i = r.rowIndex;

     var studentName = r.textContent;
     document.getElementById("tableAttendee").deleteRow(i);
     document.getElementById("tableAbsent").innerHTML += "<tr onclick = 'makeAttendee(this)'><td>" + studentName + "</td></tr>";
     absentStudents.push(studentName);

     for (var i = 0; i < attendeeStudents.length; i++) {

        firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList").child(i).set(null);

    }

     remove(attendeeStudents, studentName);


    

     for (var i = 0; i < attendeeStudents.length; i++) {

         firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList").child(i).set(attendeeStudents[i]);

     }




 }

 // End of make students absent



 function makeAttendee(r) {
     var i = r.rowIndex;

     var studentName = r.textContent;
     document.getElementById("tableAbsent").deleteRow(i);

     document.getElementById("tableAttendee").innerHTML += "<tr onclick = 'makeAbsent(this)'><td>" + studentName + "</td></tr>";
     for (var i = 0; i < attendeeStudents.length; i++) {

        firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList").child(i).set(null);

    }

     attendeeStudents.push(studentName);
     remove(absentStudents, studentName);


     for (var i = 0; i < attendeeStudents.length; i++) {

         firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList").child(i).set(attendeeStudents[i]);

     }

 }



 function remove(arr, item) {
     for (var i = arr.length; i--;) {
         if (arr[i] === item) {
             arr.splice(i, 1);
         }
     }
 }




 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }