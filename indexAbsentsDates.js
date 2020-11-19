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

// addStudentsNames();

function addStudentsNames() {
    var studentsNames = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));
    var row = document.getElementById("studentsNames");
    studentsNames.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.key !== "courseTeacher") {
                var x = row.insertCell(0);
                x.innerHTML = childSnapshot.val();
            }
        }); //End studentsNames
    }) //End studentsNames
}


function absentsDates() {

    var table = document.getElementById("tableAbsent");

    var studentsNames = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    studentsNames.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var datePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

            datePath.on("value", function (snapshot2) {
                snapshot2.forEach(function (childSnapshot2) {

                    var attendancePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(childSnapshot2.key).child("namesList");

                    attendancePath.on("value", function (snapshot3) {
                        snapshot3.forEach(function (childSnapshot3) {

                            for (var r = 1, n = table.cells.length; r < n; r++) {
                                if (table.rows[r].cells[0].innerHTML != childSnapshot3.val()) {

                                }

                            }
                        }); //End attendancePath
                    }) //End attendancePath

                }); //End datePath
            }) //End datePath


        }); //End studentsNames
    }) //End studentsNames
}

function readCelss() {


    setTimeout(function () {
        //gets table
        var oTable = document.getElementById('tableAbsent');



        //gets cells of current row
        var oCells = oTable.rows.item(1).cells;

        //gets amount of cells of current row
        var cellLength = oCells.length;

        //loops through each cell in current row
        for (var j = 0; j < cellLength; j++) {
            /* get your cell info here */
            alert(oCells.item(j).innerHTML);
        }


    }, 3000);
}

// readCelss();




retreiveDate();


function retreiveDate() {

    var datePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    datePath.on("value", function (snapshot2) {
        snapshot2.forEach(function (childSnapshot2) {


            document.getElementById("demo").innerHTML += "<h1 style='text-align:center; margin-top:20px'>" + childSnapshot2.key + "</h1>";
            attenanceAndAbsentShow2(childSnapshot2.key);


        });
    })

}



function attenanceAndAbsentShow2(date) {

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
    })

    // End of attendee students

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
    })

} // End of absent students


























// attenanceAndAbsentShow();


function attenanceAndAbsentShow() {


    var arrayAtt = [];
    var arrayAbs = [];

    var counter = 0;

    var studentsNames = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    studentsNames.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var datePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

            datePath.on("value", function (snapshot2) {
                snapshot2.forEach(function (childSnapshot2) {

                    counter++;

                    var tableAttendanceName = "Attendance" + childSnapshot2.key;
                    var tableAbsentName = "Absent" + childSnapshot2.key;


                    if (counter === 1) {
                        document.getElementById("demo").innerHTML += "<h1>" + childSnapshot2.key + "</h1>";
                    }

                    document.getElementById("demo").innerHTML += "<table id=" + tableAttendanceName + "><tr>Attendance students</tr></table>";
                    document.getElementById("demo").innerHTML += "<table id=" + tableAbsentName + "><tr>Absents students</tr></table>";

                    var attendancePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(childSnapshot2.key).child("namesList");

                    attendancePath.on("value", function (snapshot3) {
                        snapshot3.forEach(function (childSnapshot3) {

                            if (childSnapshot.key !== "courseTeacher") {
                                if (childSnapshot3.val() === childSnapshot.val()) {
                                    document.getElementById(tableAttendanceName).innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
                                }

                            }

                        }); //End attendancePath
                    }) //End attendancePath

                }); //End datePath
            }) //End datePath


        }); //End studentsNames
    }) //End studentsNames





} //End of the function





function signOut() {
    firebase.auth().signOut();
    window.location.replace("index.html");
}