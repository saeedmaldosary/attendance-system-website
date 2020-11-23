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


countAttendanceAndAbsent();

firebase.auth().onAuthStateChanged(function (user) {
    email = user.email;
    var username = email.substring(0, email.indexOf('@')).toLowerCase();

    var f22 = firebase.database().ref("usersInfo").child(username).child("userRealName");
    f22.once("value")
        .then(function (snapshot) {
            if (localStorage.getItem("userType2") === "Student") {
                attenanceAndAbsentShow(snapshot.val());
            } else {
                attenanceAndAbsentShowtttt();
            }

        }); // For retreive user Real name
}); // For firebase.auth

function attenanceAndAbsentShowtttt() {

    var arrayAtt = [];
    var arrayAtt2 = [];

    // Attendee Students

    var f2 = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList");

    f2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
                document.getElementById("tableAttendee").innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
                arrayAtt.push(childSnapshot.val());
                localStorage.setItem("attStudents", JSON.stringify(arrayAtt));
            }
        });
    })


    // Absent Students
    setTimeout(function () {

        var table = document.getElementById('tableAttendee');
        for (var r = 1, n = table.rows.length; r < n; r++) {
                arrayAtt2.push(table.rows[r].cells[0].innerHTML);
    
        }
        
        var f12 = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

        f12.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                if(!arrayAtt2.includes(childSnapshot.val()) && childSnapshot.key !== "courseTeacher")
                document.getElementById("tableAbsent").innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
            });
        })



    }, 3000);
  


}


function attenanceAndAbsentShow(userRealName) {

    var f2 = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(localStorage.getItem("selectedDate")).child("namesList");

    f2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val() === userRealName) {
                document.getElementById("tableAttendee").innerHTML += "<tr><td>" + childSnapshot.val() + "</td></tr>";
            }
        });
    })
    setTimeout(function () {

        if (document.getElementById("tableAttendee").rows.length === 1) {
            document.getElementById("tableAbsent").innerHTML += "<tr><td>" + userRealName + "</td></tr>";
        }
    }, 3000);

}






function countAttendanceAndAbsent() {

    var counterAttend = 0;
    var counterAbsent = 0;

    var studentsNames = firebase.database().ref("coursesInfo").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));
    var attendancePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));

    studentsNames.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {


            attendancePath.on("value", function (snapshot2) {
                counterAttend = 0;
                snapshot2.forEach(function (childSnapshot2) {
                    var countt = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(childSnapshot2.key).child("namesList");

                    countt.on("value", function (snapshot3) {
                        snapshot3.forEach(function (childSnapshot3) {

                            if (childSnapshot.val() === childSnapshot3.val()) {

                                counterAttend++;
                            }

                            if (childSnapshot.key !== "courseTeacher") {
                                if (localStorage.getItem("userRealname2") === childSnapshot.val() || localStorage.getItem("userType2") === 'Admin' || localStorage.getItem("userType2") === 'Teacher') {
                                    var absentsCounter = (snapshot2.numChildren() - counterAttend);


                                    if (absentsCounter > 8) {
                                        document.getElementById("tableAttendanceAbsent").innerHTML += "<tr><td>" + childSnapshot.val() + "</td><td style='text-align:center'>" + counterAttend + "</td><td style='text-align:center; background:red; color:white; font-weight:bolder;'>" + absentsCounter + "</tr>";
                                    } else if (absentsCounter > 6 && absentsCounter <= 8) {
                                        document.getElementById("tableAttendanceAbsent").innerHTML += "<tr><td>" + childSnapshot.val() + "</td><td style='text-align:center'>" + counterAttend + "</td><td style='text-align:center; background:orange; color:white; font-weight:bolder;'>" + absentsCounter + "</tr>";
                                    } else {
                                        document.getElementById("tableAttendanceAbsent").innerHTML += "<tr><td>" + childSnapshot.val() + "</td><td style='text-align:center'>" + counterAttend + "</td><td style='text-align:center'>" + absentsCounter + "</td></tr>";

                                    }


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
            r++;
        }

    }
}

function addStudentsEmail() {
    var table = document.getElementById('tableAttendanceAbsent');

    var useresInfo = firebase.database().ref("usersInfo");

    useresInfo.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var email = firebase.database().ref("usersInfo").child(childSnapshot.key);


            email.on("value", function (snapshot2) {
                snapshot2.forEach(function (childSnapshot2) {

                    for (var r = 1, n = table.rows.length; r < n; r++) {

                        if (table.rows[r].cells[0].innerHTML === childSnapshot2.val()) {
                            var tbl = document.getElementById('tableAttendanceAbsent'), // table reference
                                r;
                            // open loop for each row and append cell
                            createCell(tbl.rows[r].insertCell(tbl.rows[r].cells.length), childSnapshot.key + "@sm.imamu.edu.sa");


                        }

                    }


                }); //End email
            }) //End email


        }); //End usersInfo
    }) //End usersInfo

}

function addAbsentsDates() {
    var table = document.getElementById('tableAttendanceAbsent');
    for (var r = 1, n = table.rows.length; r < n; r++) {
        var datePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection"));
        datePath.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                var attendancePath = firebase.database().ref("studentsAttendee").child(localStorage.getItem("selectedCourse")).child(localStorage.getItem("selectedSection")).child(childSnapshot.key).child("namesList");

                attendancePath.on("value", function (snapshot2) {
                    snapshot2.forEach(function (childSnapshot2) {

                        if (table.rows[r].cells[0].innerHTML != childSnapshot2.val()) {
                            // alert("true");
                            // createCell(tbl.rows[r].insertCell(tbl.rows[r].cells.length), childSnapshot.key + "date");
                        }

                    }); //End attendancePath
                }) //End attendancePath

            }); //End datePath
        }) //End datePath

    } // End loop in table
}


function createCell(cell, text) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    div.appendChild(txt); // append text node to the DIV
    cell.appendChild(div); // append DIV to the table cell
}


function displayAttendanceAbsentCounter() {
    addStudentsEmail();
    // addAbsentsDates();
    document.getElementById('tableAttendanceAbsent').style.visibility = 'visible';
    document.getElementById('tableAttendanceAbsent').style.display = 'table';
}



function signOut() {
    firebase.auth().signOut();
    window.location.replace("index.html");
}