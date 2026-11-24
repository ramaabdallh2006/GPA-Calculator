let subjects =;
let editIndex = -1;

// دالة تحويل العلامة المئوية وفق النظام الامتحاني الرسمي لجامعة ماري
function getGlobalGrade(grade) {
    if (grade >= 98) return { points: 4.00, letter: "A+" };
    if (grade >= 95) return { points: 3.75, letter: "A" };
    if (grade >= 90) return { points: 3.50, letter: "A-" };
    if (grade >= 85) return { points: 3.25, letter: "B+" };
    if (grade >= 80) return { points: 3.00, letter: "B" };
    if (grade >= 75) return { points: 2.75, letter: "B-" };
    if (grade >= 70) return { points: 2.50, letter: "C+" };
    if (grade >= 65) return { points: 2.25, letter: "C" };
    if (grade >= 60) return { points: 2.00, letter: "C-" };
    if (grade >= 55) return { points: 1.75, letter: "D+ (نجاح مشروط)" };
    if (grade >= 50) return { points: 1.50, letter: "D (نجاح مشروط)" };
    return { points: 0.00, letter: "F (راسب)" };
}

function renderTable() {
    let tableBody = document.getElementById("subjectsList");
    tableBody.innerHTML = "";

    subjects.forEach((sub, index) => {
        let globalInfo = getGlobalGrade(sub.grade);
        let qualityPoints = (globalInfo.points * sub.hours).toFixed(2);

        tableBody.innerHTML += `<tr>
            <td>${sub.name}</td>
            <td>${sub.grade} (${globalInfo.letter})</td>
            <td>${sub.hours}</td>
            <td>${qualityPoints}</td>
            <td>
                <button onclick="editSubject(${index})" style="background:#f39c12; padding:6px 12px; font-size:13px;">تعديل</button>
                <button onclick="deleteSubject(${index})" style="background:#e74c3c; padding:6px 12px; font-size:13px;">حذف</button>
            </td>
        </tr>`;
    });
}

document.getElementById("addBtn").onclick = function() {
    let name = document.getElementById("subjectName").value;
    let gradeText = document.getElementById("subjectGrade").value;
    let hours = Number(document.getElementById("subjectHours").value);

    if (name === "" || gradeText === "" || Number(gradeText) < 0 || Number(gradeText) > 100 || hours <= 0) {
        alert("يرجى إدخال اسم المادة، علامة بين 0 و 100، وعدد الساعات!");
        return;
    }

    let subjectData = { name: name, grade: Number(gradeText), hours: hours };

    if (editIndex === -1) {
        subjects.push(subjectData);
    } else {
        subjects[editIndex] = subjectData;
        editIndex = -1;
        document.getElementById("addBtn").innerText = "إضافة المادة";
    }

    renderTable();

    document.getElementById("subjectName").value = "";
    document.getElementById("subjectGrade").value = "";
    document.getElementById("subjectHours").value = "";
};

function editSubject(index) {
    let sub = subjects[index];
    document.getElementById("subjectName").value = sub.name;
    document.getElementById("subjectGrade").value = sub.grade;
    document.getElementById("subjectHours").value = sub.hours;

    editIndex = index;
    document.getElementById("addBtn").innerText = "حفظ التعديل";
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    renderTable();
}

document.getElementById("calcBtn").onclick = function() {
    if (subjects.length === 0) {
        alert("أضيفي مادة واحدة على الأقل أولاً!");
        return;
    }

    let totalWeightedGrades = 0;
    let totalQualityPoints = 0;
    let totalHours = 0;

    subjects.forEach(sub => {
        let info = getGlobalGrade(sub.grade);
        totalWeightedGrades += (sub.grade * sub.hours);
        totalQualityPoints += (info.points * sub.hours);
        totalHours += sub.hours;
    });

    let finalPercent = (totalWeightedGrades / totalHours).toFixed(2);
    let globalGPA = (totalQualityPoints / totalHours).toFixed(2);

    let status = "";
    if (globalGPA >= 3.50) status = "ممتاز 🌟";
    else if (globalGPA >= 3.00) status = "جيد جداً 👏";
    else if (globalGPA >= 2.50) status = "جيد 👍";
    else if (globalGPA >= 2.00) status = "مقبول (ناجح) 🙂";
    else if (globalGPA >= 1.50) status = "نجاح مشروط ⚠️";
    else status = "راسب ❌";

    document.getElementById("result").innerText = `المعدل المئوي: ${finalPercent}% | المعدل التراكمي (GPA): ${globalGPA} / 4.00`;
    document.getElementById("gradeText").innerText = `التقدير العام: ${status}`;
};
