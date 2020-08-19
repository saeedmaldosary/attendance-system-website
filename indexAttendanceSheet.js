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

 if (localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
     document.getElementById('editBut1').style.visibility = 'visible';
     document.getElementById('editBut2').style.visibility = 'visible';
 }





 // Attendee Students
 var arrayAtt = [];
 var arrayAbs = [];


 var f2 = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList");

 f2.on("value", function (snapshot) {
     snapshot.forEach(function (childSnapshot) {
         document.getElementById("tableAttendee").innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
         arrayAtt.push(childSnapshot.val());
         localStorage.setItem("attStudents", JSON.stringify(arrayAtt));
     });
 })

 // Absent Students
 for (var j = 0; j < 500; j++) {
     var f3 = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child("StudentName" + j);

     f3.once("value").then(function (snapshot) {
         if (snapshot.val() !== null && !arrayAtt.includes(snapshot.val())) {
             document.getElementById("tableAbsent").innerHTML += "<tr><td>" + snapshot.val() + "</td></tr>";
             arrayAbs.push(snapshot.val());
             localStorage.setItem("absentStudents", JSON.stringify(arrayAbs));
         }
     });
 }









 function signOut() {
     firebase.auth().signOut();
     window.location.replace("index.html");

 }
