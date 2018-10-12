// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("electron");

window.onload = function () {
    //以下为自定义右击菜单
    document.onclick = function (e) {
        if (document.getElementById("menu-friend")) {
            var menu1 = document.getElementById("menu-friend");
            menu1.style.visibility = "hidden";
        }
    }
};

//
var iconList = [
    {classname: 'ion ion-md-heart', color: '#ff3406'},
    {classname: 'ion ion ion-md-paw', color: '#ff8803'},
    {classname: 'ion ion-md-snow', color: '#46fff0'},
    {classname: 'ion ion-md-sunny', color: '#ffc522'},
    {classname: 'ion ion-md-notifications-outline', color: '#ff337d'},
    {classname: 'ion ion-md-gift', color: '#e66dff'},
    {classname: 'ion ion-md-flower', color: '#ffa1c9'},
    {classname: 'ion ion-md-thumbs-up', color: '#ffda81'},
    {classname: 'ion ion-logo-octocat', color: '#ff3d9c'},
    {classname: 'ion ion-md-moon', color: '#4398ff'},
];

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

var kanMessage = true;
//与主进程进行通信
// In renderer process (web page).
const {ipcRenderer} = require('electron');

var DATA = [];
var STUDENT = [];
var DATELIST = [];
var CLASSNAME = '';
var INDEX = -1;
var DATEINDEX = -1;
var DELETE = {kind: '', index: 0};
var STUDENTNAME = '';
var DATEVALUE = '';
var DATENAME = '';
var BlackBoxListDate = [];

if (ipcRenderer.sendSync('synchronous-message', 'ping-ipcRenderer-sendSync') === 'pong') {
    kanMessage = true;
} else {
    kanMessage = false;
}

ipcRenderer.send('asynchronous-message', 1);

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    if (arg === 'pong') {
        console.log('pong====', arg) // prints "pong"
    } else {
        if (arg) {
            DATA = JSON.parse(arg);
            refreshCLASSLIST();
        }
    }
});
window.addNewClass = function () {
    if (document.getElementsByClassName('addClassBox')) {
        document.getElementsByClassName('addClassBox')[0].style.display = 'block';
    }
};
window.addClassCancel = function () {
    document.getElementById('className').value = '';
    document.getElementsByClassName('addClassBox')[0].style.display = 'none';
};
window.changeClassNameValue = function (aaa) {
    CLASSNAME = document.getElementById('className').value;
};
window.addClassCheck = function () {
    if (CLASSNAME && CLASSNAME.length > 0 && CLASSNAME.trim().length > 0) {
        DATA.push({classname: '' + CLASSNAME, student: [], dateList: []});
        CLASSNAME = '';
        document.getElementById('className').value = '';
        updateDATA();
        refreshCLASSLIST();
        addClassCancel();
    }
};

window.addNewStudent = function () {
    if (document.getElementsByClassName('addStudentBox') && INDEX > -1) {
        document.getElementsByClassName('addStudentBox')[0].style.display = 'block';
    }
};
window.addStudentCancel = function () {
    document.getElementsByClassName('addStudentBox')[0].style.display = 'none';
    document.getElementById('studentName').value = '';
};
window.changeStudentNameValue = function (aaa) {
    STUDENTNAME = document.getElementById('studentName').value;
};
window.addStudentCheck = function () {
    if (STUDENTNAME && STUDENTNAME.length > 0 && STUDENTNAME.trim().length > 0) {
        STUDENT.push({studentname: '' + STUDENTNAME, show: 1});
        DATA[INDEX].student = deepCopy(STUDENT).filter((x) => {
            x.show = 1;
            return x
        });
        STUDENTNAME = '';
        document.getElementById('studentName').value = '';
        updateDATA();
        refreshSTUDENT();
        addStudentCancel();
    }
};

window.addNewDate = function () {
    if (document.getElementsByClassName('addDateBox') && INDEX > -1) {
        document.getElementsByClassName('addDateBox')[0].style.display = 'block';
    }
};
window.addDateCancel = function () {
    document.getElementById('dateInputValue').value = '';
    document.getElementById('dateInputName').value = '';
    document.getElementsByClassName('addDateBox')[0].style.display = 'none';
};
window.changeDateValue = function (aaa) {
    DATEVALUE = document.getElementById('dateInputValue').value;
};
window.changeDateName = function (aaa) {
    DATENAME = document.getElementById('dateInputName').value;
};
window.addDateCheck = function () {
    console.log(DATEVALUE, DATENAME);
    if (DATEVALUE && DATEVALUE.length > 0 && DATEVALUE.trim().length > 0 && DATENAME && DATENAME.length > 0 && DATENAME.trim().length) {
        DATELIST.push({
            datename: '' + DATEVALUE + '_' + DATENAME, datedata: deepCopy(STUDENT).filter((x) => {
                x.value = 0;
                return x && x.show > 0
            })
        });
        DATA[INDEX].dateList = DATELIST;
        DATENAME = '';
        DATEVALUE = '';
        document.getElementById('dateInputValue').value = '';
        document.getElementById('dateInputName').value = '';
        updateDATA();
        refreshDATELIST();
        addDateCancel();
    }
};

//--------
function refreshCLASSLIST() {
    if (document.getElementById('Ul_class')) {
        document.getElementById('Ul_class').innerHTML = '';
        DATA.forEach((x, index) => {
            var _li = document.createElement('li');
            if (INDEX > -1 && index === INDEX) {
                _li.className = 'theClass chooseClass';
            } else {
                _li.className = 'theClass';
            }
            _li.onclick = function () {
                INDEX = index;
                STUDENT = x.student;
                DATELIST = x.dateList;
                document.getElementById('Class_Student_Date_add_btn').disabled = false;
                document.getElementById('Student_add_btn').disabled = false;
                if (document.getElementsByClassName('chooseClass').length > 0) {
                    document.getElementsByClassName('chooseClass')[0].className = 'theClass';
                }
                this.className = 'theClass chooseClass';
                refreshSTUDENT();
                refreshDATELIST();
            };
            _li.oncontextmenu = function (e) {
                if (document.getElementById("menu-friend")) {
                    var menu1 = document.getElementById("menu-friend");
                    menu1.style.display = "block";
                    menu1.style.left = e.clientX + "px";
                    menu1.style.top = document.documentElement.scrollTop + e.clientY + "px";
                    DELETE.kind = 'CLASS';
                    DELETE.index = index;
                    if (e.button == 2) {
                        menu1.style.visibility = "visible";
                    } else {
                        menu1.style.visibility = "hidden";
                    }
                }
                e.preventDefault();
            };
            _li.innerHTML = x.classname;
            document.getElementById('Ul_class').append(_li);
        });
    }
}

function refreshSTUDENT() {
    if (document.getElementById('Student_class')) {
        document.getElementById('Student_class').innerHTML = '';
        STUDENT.forEach((x, index) => {
            var _li = document.createElement('li');
            if (x.show === 1) {
                _li.className = 'theStudent';
            } else if (x.show === 0) {
                _li.className = 'theStudent nochooseStudent';
            }
            _li.onclick = function () {
                STUDENT[index].show = (STUDENT[index].show + 1) % 2;
                refreshSTUDENT();
            };
            _li.oncontextmenu = function (e) {
                if (document.getElementById("menu-friend")) {
                    var menu1 = document.getElementById("menu-friend");
                    menu1.style.display = "block";
                    menu1.style.left = e.clientX + "px";
                    menu1.style.top = document.documentElement.scrollTop + e.clientY + "px";
                    DELETE.kind = 'STUDENT';
                    DELETE.index = index;
                    if (e.button == 2) {
                        menu1.style.visibility = "visible";
                    } else {
                        menu1.style.visibility = "hidden";
                    }
                }
                e.preventDefault();
            };
            _li.innerHTML = x.studentname;
            document.getElementById('Student_class').append(_li);
        });
    }
}

function refreshDATELIST() {
    if (document.getElementById('Class_Student_Date')) {
        document.getElementById('Class_Student_Date').innerHTML = '';
        DATELIST.forEach((x, index) => {
            var _li = document.createElement('li');
            if (DATEINDEX > -1 && DATEINDEX === index) {
                _li.className = 'theDate chooseDate';
            } else {
                _li.className = 'theDate';
            }
            _li.onclick = function () {
                DATEINDEX = index;
                BlackBoxListDate = x.datedata;
                refreshBlackBoxListDate();
                if (document.getElementsByClassName('chooseDate').length > 0) {
                    document.getElementsByClassName('chooseDate')[0].className = 'theClass';
                }
                this.className = 'theDate chooseDate';
            };
            _li.oncontextmenu = function (e) {
                if (document.getElementById("menu-friend")) {
                    var menu1 = document.getElementById("menu-friend");
                    menu1.style.display = "block";
                    menu1.style.left = e.clientX + "px";
                    menu1.style.top = document.documentElement.scrollTop + e.clientY + "px";
                    DELETE.kind = 'DATE';
                    DELETE.index = index;
                    if (e.button == 2) {
                        menu1.style.visibility = "visible";
                    } else {
                        menu1.style.visibility = "hidden";
                    }
                }
                e.preventDefault();
            };
            _li.innerHTML = x.datename;
            document.getElementById('Class_Student_Date').append(_li);
        });
    }
}

function refreshBlackBoxListDate() {
    if (document.getElementById('BlackBoxList')) {
        document.getElementById('BlackBoxList').innerHTML = '';
        BlackBoxListDate.forEach((x, index) => {
            var _div = document.createElement('div');
            _div.className = 'theDiv ' + 'fullDiv' + x.value;
            _div.onclick = function () {
                if (x.value < 5) {
                    x.value++;
                    _div.className = 'theDiv ' + 'fullDiv' + x.value;
                }
            };
            _div.oncontextmenu = function (e) {
                if (document.getElementById("menu-friend")) {
                    var menu1 = document.getElementById("menu-friend");
                    menu1.style.display = "block";
                    menu1.style.left = e.clientX + "px";
                    menu1.style.top = document.documentElement.scrollTop + e.clientY + "px";
                    DELETE.kind = 'BlackBoxList';
                    DELETE.index = index;
                    if (e.button == 2) {
                        menu1.style.visibility = "visible";
                    } else {
                        menu1.style.visibility = "hidden";
                    }
                }
                e.preventDefault();
            };
            var _ten = parseInt(new Date().toLocaleDateString().split('/')[2]) % 10;
            _div.innerHTML =
                `<div class="theDivDiv">` +
                `<div class="theDivName">` + x.studentname + `</div>` +
                `<div class="lineDiv"></div>` +
                `<img class="backImg" style="top:` + '-' + parseInt(Math.random() * 100) + 'px' + `;left:` + '-' + parseInt(Math.random() * 100) + 'px' + `;" src="./images/back.jpg">` +
                `<div class="theDivClick">` +
                `<i class="` + 'i1 ' + iconList[_ten].classname + `" style="color:` + iconList[_ten].color + `"></i>` +
                `<i class="` + 'i2 ' + iconList[_ten].classname + `" style="color:` + iconList[_ten].color + `"></i>` +
                `<i class="` + 'i3 ' + iconList[_ten].classname + `" style="color:` + iconList[_ten].color + `"></i>` +
                `<i class="` + 'i4 ' + iconList[_ten].classname + `" style="color:` + iconList[_ten].color + `"></i>` +
                `<i class="` + 'i5 ' + iconList[_ten].classname + `" style="color:` + iconList[_ten].color + `"></i>`
                + `</div>` +
                `</div>`;
            document.getElementById('BlackBoxList').append(_div);
        });
    }
}

function updateDATA() {
    if (kanMessage) {
        var _DDD = JSON.stringify(DATA);
        ipcRenderer.send('asynchronous-message', _DDD);
    }
}

window.deleteAny = function deleteAny() {
    if (DELETE.kind === 'CLASS') {
        if (INDEX === DELETE.index) {
            STUDENT = [];
            DATELIST = [];
            INDEX = -1;
            DATEINDEX = -1;
            refreshSTUDENT();
            refreshDATELIST();
        } else {
            if (INDEX > DELETE.index) {
                INDEX--;
            }
        }
        DATA = DATA.filter((x, index) => {
            return x && index !== DELETE.index
        });
        updateDATA();
        refreshCLASSLIST();
    } else if (DELETE.kind === 'STUDENT') {
        if (INDEX > -1) {
            STUDENT = deepCopy(STUDENT).filter((x, index) => {
                return x && index !== DELETE.index
            });
            DATA[INDEX].student = deepCopy(STUDENT).filter((x) => {
                x.show = 1;
                return x
            });
            updateDATA();
            refreshSTUDENT();
        }
    } else if (DELETE.kind === 'DATE') {
        if (INDEX > -1) {
            if (DATEINDEX === DELETE.index) {
                BlackBoxListDate = [];
                DATEINDEX = -1;
                refreshBlackBoxListDate();
            } else {
                if (DATEINDEX > DELETE.index) {
                    DATEINDEX--;
                }
            }
            DATELIST = deepCopy(DATELIST).filter((x, index) => {
                return x && index !== DELETE.index
            });
            DATA[INDEX].dateList = deepCopy(DATELIST);
            updateDATA();
            refreshDATELIST();
        }
    } else if (DELETE.kind === 'BlackBoxList') {
        if (DATEINDEX > -1) {
            BlackBoxListDate = BlackBoxListDate.filter((x, index) => {
                return x && index !== DELETE.index
            });
            DATELIST[DATEINDEX].datedata = deepCopy(BlackBoxListDate);
            DATA[INDEX].dateList = deepCopy(DATELIST);
        }
    }
};
