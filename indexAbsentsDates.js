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

retreiveDate();


function retreiveDate() {

    var datePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    datePath.on("value", function (snapshot2) {
        snapshot2.forEach(function (childSnapshot2) {


            document.getElementById("demo").innerHTML += "<h1 style='text-align:center; margin-top:20px'>" + childSnapshot2.key + "</h1>";
            attenanceAndAbsentShow(childSnapshot2.key);


        });
    })

}



function attenanceAndAbsentShow(date) {

    var tableAttendanceName = "Attendance" + date;
    var tableAbsentName = "Absent" + date;

    document.getElementById("demo").innerHTML += "<table id=" + tableAttendanceName + "><th style='color: green; background: #ECF0F1;'>Attendance students</th></table>";
    document.getElementById("demo").innerHTML += "<table id=" + tableAbsentName + "><th th style='color: red; background: #ECF0F1;'>Absents students</th></table>";

    var arrayAtt = [];
    var arrayAbs = [];

    // Attendee Students

    var f2 = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(date).child("namesList");

    f2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            document.getElementById(tableAttendanceName).innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
            arrayAtt.push(childSnapshot.val());
        });
    }) // End of attendee students

    // Absent Students
    var f12 = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    f12.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var studentName = childSnapshot.val();
            if (studentName !== null && !arrayAtt.includes(studentName) && childSnapshot.key !== "courseTeacher") {
                document.getElementById(tableAbsentName).innerHTML += "<tr><td>" + studentName + "</td></tr>";
                arrayAbs.push(studentName);
            }
        });
    }) // End of absent students
}

function signOut() {
    firebase.auth().signOut();
    window.location.replace("index.html");
}