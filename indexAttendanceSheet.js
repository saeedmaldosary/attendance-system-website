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


attenanceAndAbsentShow();
countAttendanceAndAbsent();



function attenanceAndAbsentShow() {

    var arrayAtt = [];
    var arrayAbs = [];

    // Attendee Students

    var f2 = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList");

    f2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (localStorage.getItem("userRealname2") === childSnapshot.val() || localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
                document.getElementById("tableAttendee").innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
                arrayAtt.push(childSnapshot.val());
                localStorage.setItem("attStudents", JSON.stringify(arrayAtt));
            }
        });
    })

    // End of attendee students

    // Absent Students
    var f12 = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    f12.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var studentName = childSnapshot.val();
            if (studentName !== null && !arrayAtt.includes(studentName) && childSnapshot.key !== "courseTeacher") {
                if (localStorage.getItem("userRealname2") === childSnapshot.val() || localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
                    document.getElementById("tableAbsent").innerHTML += "<tr><td>" + studentName + "</td></tr>";
                    arrayAbs.push(studentName);
                    localStorage.setItem("absentStudents", JSON.stringify(arrayAbs));
                }
            }
        });
    })

} // End of absent students



function countAttendanceAndAbsent() {

    var counterAttend = 0;
    var counterAbsent = 0;

    var studentsNames = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));
    var attendancePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    studentsNames.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {


            attendancePath.on("value", function (snapshot2) {
                counterAttend = 0;
                counterAbsent = 0;
                snapshot2.forEach(function (childSnapshot2) {
                    var countt = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(childSnapshot2.key).child("namesList");

                    countt.on("value", function (snapshot3) {
                        snapshot3.forEach(function (childSnapshot3) {

                            if (childSnapshot.val() === childSnapshot3.val()) {

                                counterAttend++;
                            }

                            if (childSnapshot.key !== "courseTeacher") {
                                if (localStorage.getItem("userRealname2") === childSnapshot.val() || localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
                                    document.getElementById("tableAttendanceAbsent").innerHTML += "<tr><td>" + childSnapshot.val() + "</td><td style='text-align:center'>" + counterAttend + "</td><td style='text-align:center'>" + (snapshot2.numChildren() - counterAttend) + "</td></tr>";
                                    removeDublicateFromTable();
                                }
                            }


                        }); //End of childsnapshot 3
                    }) //End of childsnapshot 3

                }); //End of childsnapshot 2
            }) //End of childsnapshot 2



        }); //End of childsnapshot 1
    }) //End of childsnapshot 1
}

function removeDublicateFromTable() {
    var table = document.getElementById('tableAttendanceAbsent');
    for (var r = 1, n = table.rows.length; r < n; r++) {
        if (table.rows[r].cells[0].innerHTML === table.rows[r + 1].cells[0].innerHTML) {
            document.getElementById("tableAttendanceAbsent").deleteRow(r);

        }

    }
}

function displayAttendanceAbsentCounter() {
    document.getElementById('tableAttendanceAbsent').style.visibility = 'visible';
    document.getElementById('tableAttendanceAbsent').style.display = 'table';
}



function signOut() {


    firebase.auth().signOut();
    window.location.replace("index.html");

}