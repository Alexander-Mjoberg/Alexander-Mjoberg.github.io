
//Global variable declarations
let specializations = ['']
let specialization = "";
let program = "";
let courses = "";
let courseRowsPerSpec = [];
let state = "";
let simpleMode = false;
let showNamesInSchedule = false;

//States with enum
const states = {
    selectProgram: 'selectProgram',
    selectSpecilization: 'selectSpecilization',
    selectCourses: 'selectCourses',
}
let currentState = states.selectProgram;


//Variables for points
let hpRequired = 90;
let hpInSpecRequired = 45;
let apRequired = 45;
let apInSpecRequired = 30;

//Filter values
let filterIds = ["filterOnSelected", "filterHPMethod", "filterHPPoints", "filterLevel", "filterLP1", "filterLP2", "filterLP3", "filterLP4"]
let desireSelected = true;
let desiredUnselected = true;
let desiredComparatorValue = 1;
let desiredHp = 0;
let desiredLevel = 'All'
let desiredPeriods = [true, true, true, true];


//Assign onclick and onchange functionality
document.querySelectorAll("button[id^='SelectProgram']").forEach((item, index) => item.onclick = selectProgram);
document.getElementById("backButton").onclick = backButtonHandler;
document.getElementById("showHideNamesScheduleButton").onclick = () => {
    showNamesInSchedule = !showNamesInSchedule;
    printCoursesOrganizedByPeriod();
}
document.getElementById("simpleListButton").onclick = switchSimpleList;
document.getElementById("saveButton").onclick = exportToCsv;
filterIds.forEach((button, index) => document.getElementById(button).onchange = handleFilterOnSelected)


function handleFilterOnSelected() {
    let val = this.value;
    switch (this.id) {
        case "filterOnSelected":
            if (val == "Alla") {
                desireSelected = true;
                desiredUnselected = true;
            }
            else if (val == "Ja") {
                desireSelected = true;
                desiredUnselected = false;
            }
            else {
                desireSelected = false;
                desiredUnselected = true;
            }
            break;
        case "filterHPMethod":
            if (val == "More")
                desiredComparatorValue = 1;
            else if (val == "Less")
                desiredComparatorValue = -1;
            else
                desiredComparatorValue = 0;
            break;
        case "filterHPPoints":
            desiredHp = val;
            break;
        case "filterLevel":
            desiredLevel = val;
            break;
        case "filterLP1":
        case "filterLP2":
        case "filterLP3":
        case "filterLP4":
            desiredPeriods = [document.getElementById("filterLP1").checked, document.getElementById("filterLP2").checked, document.getElementById("filterLP3").checked, document.getElementById("filterLP4").checked];
            break;
    }
    doFilters();
    //courses.forEach((course,index) => course.domRows.forEach((tr,index1) => tr.childNodes.forEach((td,index2) => td.style.display = 'table-cell')));
    //setTimeout(doFilters,2500);
}


function listSpecialization(item, index) {
    let body = document.getElementById("SpecializationCenteredColumn");
    let rowDiv = document.createElement("div")
    rowDiv.setAttribute('class', 'rowDiv')
    let specButton = document.createElement("button");
    specButton.setAttribute('class', 'button buttonSpecUnpressed');
    specButton.textContent = item;
    specButton.setAttribute('id', item);
    specButton.onclick = selectSpecialiazation;
    body.appendChild(rowDiv);
    rowDiv.appendChild(specButton)
    return specButton;
}


function selectProgram() {
    program = this.id.split("SelectProgram").pop();
    pt = document.getElementById("programTable")
    pt.setAttribute('class', 'progDiv')
    pt.style.opacity = 0;
    setTimeout(showSpecializations, 1000)
    document.getElementById("SpecializationSelector").style.display = 'Flex';
    specializations = specializationDict[program];
    if (program == "MD" || program == "A" || program == "BI") {
        specializations = [""];
        this.id = "Fortsätt utan att välja specialisering";
        specialization = specialization == "Fortsätt utan att välja specialisering"
        selectSpecialiazation()
    }
    specializations.forEach(listSpecialization);
    listSpecialization("Fortsätt utan att välja specialisering").style.fontStyle = 'Italic';
    currentState = states.selectSpecilization;

}

function backButtonHandler() {
    switch (currentState) {
        case states.selectProgram:
            break;
        case states.selectSpecilization:
            unselectProgram();
            break;
        case states.selectCourses:
            unselectSpecialization();

    }
}

function unselectProgram() {
    program = '';
    pt = document.getElementById("programTable")
    document.getElementById("SpecializationSelector").style.opacity = 0;
    document.getElementById("backBand").style.opacity = 0;
    setTimeout(() => pt.style.display = 'block', 780);
    setTimeout(hideSpecializations, 800);
    setTimeout(() => pt.style.opacity = 1, 800);
    currentState = states.selectProgram;
    document.getElementById("topText").innerHTML = "Kursval specialisering LTH";
}

function showSpecializations() {
    document.getElementById("programTable").style.display = 'None';
    document.getElementById("SpecializationSelector").style.opacity = 1;
    document.getElementById("backBand").style.opacity = 1;
}

function switchSimpleList() {
    simpleMode = !simpleMode
    let hideThis = simpleMode ? document.getElementById("courseBox") : document.getElementById("simpleCourseBox");
    let showThis = simpleMode ? document.getElementById("simpleCourseBox") : document.getElementById("courseBox");
    hideThis.style.display = 'none';
    showThis.style.display = 'block';
}

//Hide specialiazation & show programtable
function hideSpecializations() {
    let scc = document.getElementById("SpecializationCenteredColumn");
    let cn = scc.childNodes;
    while (scc.childNodes.length > 0) {
        cn.forEach((item, index) => scc.removeChild(item));
    }
    document.getElementById("SpecializationSelector").style.display = 'none';

}

function selectSpecialiazation() {
    specialization = (program == "MD" || program == "A" || program == "BI") ? "Fortsätt utan att välja specialisering" : this.id;
    let noSpecSelected = specialization == "Fortsätt utan att välja specialisering"
    cb = document.getElementById("courseBox");
    document.getElementById("SpecializationSelector").style.opacity = 0;
    courses = courseDict[program];
    specializations.push('Valfria kurser');
    specializations.push('Externt valfria kurser');
    specializations.forEach(spec => tableCreate(spec))
    tableCreate("");  //Case for simpleTable
    setTimeout(() => cb.style.display = 'block', 780);
    setTimeout(() => document.getElementById("StatisticsArea").style.display = 'block', 780);
    setTimeout(hideSpecializations, 800);
    setTimeout(() => cb.style.opacity = 1, 800);
    document.getElementById("topText").innerHTML = noSpecSelected ? "Kursval " + program : "Kursval " + program + " - " + specialization;
    scrollTo(150, 0);
    filterIds.forEach((filter, index) => document.getElementById(filter).disabled = false);
    document.getElementById("simpleListButton").disabled = false;
    document.getElementById("saveButton").disabled = false;
    currentState = states.selectCourses;
}


function unselectSpecialization() {
    specialization = "";
    cb = document.getElementById("courseBox");
    ss = document.getElementById("SpecializationSelector");
    cb.style.opacity = 0;
    specializations.pop();
    specializations.pop();
    removeChildren(cb);
    removeChildren(document.getElementById("simpleCourseBox"));
    ss.style.display = 'Flex';
    document.getElementById("StatisticsArea").style.display = 'None';
    specializations = specializationDict[program];
    specializations.forEach(listSpecialization);
    listSpecialization("Fortsätt utan att välja specialisering").style.fontStyle = 'Italic';
    setTimeout(showSpecializations, 800);
    currentState = states.selectSpecilization;
}

function removeChildren(domElem) {
    let children = domElem.childNodes;
    while (domElem.childElementCount > 0) {
        domElem.removeChild(children[0]);
    }
}

function updateCounters() {
    //Skapa filter för att beräkna antal poäng
    let filterTotal = (course => course.selected);
    let filterTotalSpec = (course => course.selected && course.specialization.includes(specialization));
    let filterAdvanced = (course => course.selected && (course.level == "A"));
    let filterAdvancedSpec = (course => course.selected && (course.level == "A") && course.specialization.includes(specialization));

    let specSelected = specialization != "Fortsätt utan att välja specialisering"
    //Summera poäng med hjälp av filter, uppdatera på sidan
    let totHp = courses.filter(filterTotal).map(x => x.hp).reduce((total, amount) => total + amount, 0);
    let totHpSpec = courses.filter(filterTotalSpec).map(x => x.hp).reduce((total, amount) => total + amount, 0);
    let advancedHp = courses.filter(filterAdvanced).map(x => x.hp).reduce((total, amount) => total + amount, 0);
    let advancedHpSpec = courses.filter(filterAdvancedSpec).map(x => x.hp).reduce((total, amount) => total + amount, 0);
    //Update point in counters, add a checkmark if sufficient points have been added
    document.getElementById("totalHp").innerHTML = totHp;
    document.getElementById("totalHpMark").innerHTML = (totHp >= hpRequired) ? "✓" : "";

    document.getElementById("hpSpec").innerHTML = specSelected ? totHpSpec : 0;
    document.getElementById("hpSpecMark").innerHTML = (totHpSpec >= hpInSpecRequired && specSelected) ? "✓" : "";

    document.getElementById("totalAp").innerHTML = advancedHp;
    document.getElementById("totalApMark").innerHTML = (advancedHp >= apRequired) ? "✓" : "";

    document.getElementById("apSpec").innerHTML = specSelected ? advancedHpSpec : 0;
    document.getElementById("apSpecMark").innerHTML = (advancedHpSpec >= apInSpecRequired && specSelected) ? "✓" : "";


    countPointsPerSpecialization();
    printCoursesOrganizedByPeriod();
    //Green checkmark if enough points
}

//This function calculates the 5 specializations in which the user has most points.
//TODO: Handle if fewer than 5 applicable specializations.
function countPointsPerSpecialization() {
    //Räkna poäng för varje vald kurs per specialisering
    let specializationDict = {};
    specializations.forEach((spec, index) => specializationDict[spec] = 0);
    selectedCourses = courses.filter(course => course.selected)
    selectedCourses.forEach((course, index) => course.specialization.forEach((spec, index) => specializationDict[spec] += course.hp))
    //Ta bort valfria valfria kurser från räkningen
    delete specializationDict['Externt valfria kurser']
    delete specializationDict['Valfria kurser']
    //Gör om till lista och sortera.
    let items = Object.keys(specializationDict).map(function (key) {
        return [key, specializationDict[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    let top5 = items.slice(0, 5).filter(item => item[1] > 0); //Grab the 5 top elements, then removed any of them that have 0 points.
    let body = document.getElementById('topFiveSpec');
    let reducer = (accumulator, currentValue) => accumulator.concat("<br>".concat(currentValue)); //Build a string using reducer function.
    body.innerHTML = top5.reduce(reducer);
}

//This function creates queues for printing a schedule. Format is [points, colspan] where points is the amount of points for course, and colspan is the amount of periods to cover.
function organizeCoursesByPeriod() {
    let lpQueues = [[], [], [], []];
    selectedCourses = courses.filter(course => course.selected)
    selectedCourses.forEach((course, index) => {
        let coursePeriods = [course.lp1, course.lp2, course.lp3, course.lp4];
        let found = false;
        let foundCourse = [course, 1];
        for (let i = 0; i < 4; i++) {
            if (coursePeriods[i] == true && found) { //Case for skipping cell by setting points to 0, make colspan longer to cover the period.
                lpQueues[i].push([0, 1]) //
                foundCourse[1]++;
            }
            else if (coursePeriods[i] == true) { //Case for first period the course is found in, create cell of length one
                lpQueues[i].push(foundCourse);
                found = true;
            }
        }
    })

    return lpQueues;
}


function printCoursesOrganizedByPeriod() {
    let body = document.getElementById('simpSched');
    if (body.childElementCount > 0) {
        body.removeChild(body.childNodes[0]);
    }

    // create elements <table> and a <tbody>
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");
    tbl.setAttribute('class', 'courseTable')
    tbl.style.whiteSpace = "pre";

    //Header creation
    let header = ['LP1', 'LP2', 'LP3', 'LP4'];
    let headerRow = tblBody.insertRow(-1);
    for (var i = 0; i < header.length; i++) {
        let headerCell = document.createElement("TH");
        headerCell.setAttribute('class', 'courseTableHeaderCell')
        headerCell.setAttribute('style', 'width:8vw;')
        headerCell.innerHTML = header[i];
        headerRow.appendChild(headerCell);
    }
    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);
    // put <table> in the <body>
    body.appendChild(tbl);



    let lpQueues = organizeCoursesByPeriod();
    let nbrOfRows = [lpQueues[0].length, lpQueues[1].length, lpQueues[2].length, lpQueues[3].length].reduce((a, b) => Math.max(a, b)); //Find the longest queue and set it to number of rows.
    for (let i0 = 0; i0 < nbrOfRows; i0++) {
        let i1 = 0;
        var row = document.createElement("tr");


        while (i1 < 4) {
            let course = lpQueues[i1].pop();
            if (course != undefined && course.length > 0 && course[0] != 0) {
                let cell = document.createElement("td");
                let text = course[0].hp + " hp";
                text = showNamesInSchedule ? text.concat("\n" + course[0].name) : text;
                let cellText = document.createTextNode(text);
                cell.appendChild(cellText);
                cell.colSpan = course[1];
                row.appendChild(cell);
                cell.setAttribute('class', 'simpleScheduleCell');
                i1 += course[1];
            }
            else {
                let cell = document.createElement("td");
                row.appendChild(cell);
                i1++;
            }
        }
        tblBody.appendChild(row);
    }
}





function textifyCourse(course) {
    let textToShow = [];
    textToShow[0] = course.selected ? "✓" : "";
    textToShow[1] = course.code;
    textToShow[2] = course.name;
    textToShow[3] = course.hp;
    textToShow[4] = course.level;
    textToShow[5] = course.lp1 ? "✓" : "";
    textToShow[6] = course.lp2 ? "✓" : "";
    textToShow[7] = course.lp3 ? "✓" : "";
    textToShow[8] = course.lp4 ? "✓" : "";
    return textToShow;
}

//
function onCourseSelected() {
    //Invertera selection
    let id = this.id;
    let course = courses.find(searchCourse => searchCourse.code == id);
    course.selected = !course.selected;
    //Räkna om kurser
    updateCounters();
    course.domCheckboxes.forEach((box, index) => box.checked = course.selected);
}


function compareSortValue(a, b) {
    if (a.sortNo > b.sortNo) return 1;
    return -1;
}

function compareHp(course, desiredVal) {
    if (course.hp == desiredVal)
        return 0;
    else if (course.hp > desiredVal)
        return 1;
    return -1;
}

//En funktion för att tillämpa filter innan dom skrivs ut i tabeller. Filtret hittar det som inte passar
function doFilters() {

    //Sätt alla tabeller till att visas
    courses.forEach((course, index) => course.domRows.forEach((tr, index1) => tr.childNodes.forEach((td, index2) => td.style.display = 'table-cell')));
    courses.forEach((course, index) => course.domRows.forEach((tr, index2) => tr.style.display = 'table-row'));
    let divs = [].slice.call(document.getElementsByClassName("courseTableDiv"));
    divs.forEach((div) => div.style.display = '');

    //Filtret hittar kurser som inte passar användarens inställda filter så att dessa kan döljas
    let allFilters = ((course, index) =>
        !((desireSelected && course.selected == true) || (desiredUnselected && course.selected == false)) ||
        course.level != desiredLevel && desiredLevel != 'All' ||
        !(compareHp(course, desiredHp) == desiredComparatorValue) ||
        !((desiredPeriods[0] && course.lp1) || (desiredPeriods[1] && course.lp2) || desiredPeriods[2] && course.lp3 || desiredPeriods[3] && course.lp4) ||
        false);
    coursesToHide = courses.filter(allFilters);

    //Dölj alla kurser som filtret hittade.
    coursesToHide.forEach((course, index) => course.domRows.forEach((tr, index2) => tr.childNodes.forEach((td, index3) => td.style.display = 'None')));
    coursesToHide.forEach((course, index) => course.domRows.forEach((tr, index2) => tr.style.display = 'None'));


    //Gå igenom för alla tabeller:
    //För varje rad
    //Om raden är display är table-row, gå igenom dess barn och måla om.
    //Om alla är display none, dölj hela tabellen.
    courseRowsPerSpec.forEach((specGroup, index) => {
        let i = 0;
        specGroup.forEach((tr, index2) => {
            if (tr.style.display == 'table-row') {
                let cells = [].slice.call(tr.childNodes);
                cells.forEach((cell, index) => cell.setAttribute('class', ((i % 2) ? 'courseTableCellLight' : 'courseTableCellDark')));
                i++;
            }
        })
        if (i == 0) {
            specGroup[0].parentElement.parentElement.parentElement.style.display = 'None';
        }
    })

}

//Skapar alla kurstabeller
function tableCreate(spec) {
    let specTable = spec != "";

    //body reference
    let body = specTable ? document.getElementById("courseBox") : document.getElementById("simpleCourseBox");
    //create div
    let div = document.createElement("div")
    div.setAttribute('class', 'courseTableDiv')
    body.appendChild(div)
    //Add h3 text
    let h3 = document.createElement("h3");
    h3.innerHTML = specTable ? spec : "Alla kurser";
    div.appendChild(h3);

    // create elements <table> and a <tbody>
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");
    tbl.setAttribute('class', 'courseTable')

    //Header creation
    let header = ['Vald', 'Kurskod', 'Kursnamn', 'Högskolepoäng', 'Nivå', 'LP1', 'LP2', 'LP3', 'LP4'];
    let headerRow = tblBody.insertRow(-1);
    for (var i = 0; i < header.length; i++) {
        let headerCell = document.createElement("TH");
        headerCell.setAttribute('class', 'courseTableHeaderCell')
        headerCell.innerHTML = header[i];
        i == 2 ? headerCell.setAttribute('width', '350') : '';
        headerRow.appendChild(headerCell);
    }

    //Filter out courses per specialiazation
    let filterSpecGroup = (course => course.specialization.includes(spec));
    let specCourses = courses.filter(filterSpecGroup);
    specCourses = specTable ? specCourses.sort(compareSortValue) : courses.sort(compareSortValue);

    let courseRows = [];

    // cells creation
    for (var j = 0; j < specCourses.length; j++) {
        let course = specCourses[j];
        // table row creation
        var row = document.createElement("tr");
        courseRows.push(row);
        let courseToText = textifyCourse(course);

        for (var i = 0; i < courseToText.length; i++) {
            // create element <td> and text node
            //Make text node the contents of <td> element
            // put <td> at end of the table row
            let cell = document.createElement("td");
            cell.setAttribute('class', ((j % 2) ? 'courseTableCellLight' : 'courseTableCellDark'));
            let cellText = document.createTextNode(courseToText[i]);
            if (i == 0) {
                let box = document.createElement("input");
                box.setAttribute("type", "checkbox");
                box.setAttribute("class", "courseSelectCheckbox")
                //Sätta checked som default
                //x.setAttribute('checked','');
                //Ge boxen ett ID som består av kurskod+specialisering plats i array av specialisering
                box.setAttribute("id", courseToText[1])
                
                box.onclick = onCourseSelected;
                cell.appendChild(box);
                course.domCheckboxes.push(box);
            }
            else {
                cell.appendChild(cellText);
            }

            row.appendChild(cell);
        }
        //row added to end of table body
        tblBody.appendChild(row);
        course.domRows.push(row);
    }

    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);
    // put <table> in the <body>
    div.appendChild(tbl);
    // tbl border attribute to
    //tbl.setAttribute("border", "2");
    courseRowsPerSpec.push(courseRows);
}

function exportToCsv() {
    var universalBOM = "\uFEFF";
    let csvContent = "data:text/csv;charset=utf-8," + universalBOM + 
        "Kurskod;Kursnamn;Högskolepoäng;Nivå;LP1;LP2;LP3;LP4;Specialiseringsgrupp \r\n";
    selectedCourses.forEach(course => csvContent += stringifyCourse(course));
    //csvContent += stringifyChoices();
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Kursval.csv");
    document.body.appendChild(link);
    link.click();
}

function stringifyCourse(course) {
    var points = course.hp.toString().replace('.', ',');
    var lp1 = course.lp1 ? "X" : "";
    var lp2 =  course.lp2 ? "X" : "";
    var lp3 =  course.lp3 ? "X" : "";
    var lp4 = course.lp4 ? "X" : "";
    return course.name + ";" + course.code + ";" + points + ";" + course.level + ";" + lp1 + ";" + lp2 + ";" + lp3 + ";" + lp4 + ";" + course.specialization.join(', ') + " \r\n";
}

function stringifyChoices() {
    var programtext = "Programval;" + program + "\r\n";
    var specilizationText = "Specialiseringsval;" + specialization.replace("Fortsätt utan att välja specialisering","Ej valt") + "\r\n";
    var HpText = "Högskolepoäng;" + document.getElementById("totalHp").innerHTML + "\r\n";
    var HpSpecText = "Högskolepoäng i specialisering;" + document.getElementById("hpSpec").innerHTML + "\r\n";
    var ApText = "Avancerade poäng;" + document.getElementById("totalAp").innerHTML + "\r\n";
    var ApSpecText = "Avancerade poäng i specialisering;" + document.getElementById("apSpec").innerHTML + "\r\n";
    return "\r\n" + programtext + specilizationText + HpText + HpSpecText + ApText + ApSpecText;
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("questionBox");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
