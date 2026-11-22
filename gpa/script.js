let totalWeightedGrades = 0; // للمعدل المئوي
let totalQualityPoints = 0;  // لمجموع نقاط الجودة العالمية (نقاط المادة × ساعاتها)
let totalHours = 0;          // لمجموع الساعات المعتمدة

// 1. دالة تحويل العلامة المئوية إلى نقاط ورمز عالمي (نظام 4.0 القياسي)
function getGlobalGrade(grade) {
    if (grade >= 90) return { points: 4.0, letter: "A" };
    if (grade >= 85) return { points: 3.7, letter: "A-" };
    if (grade >= 80) return { points: 3.3, letter: "B+" };
    if (grade >= 75) return { points: 3.0, letter: "B" };
    if (grade >= 70) return { points: 2.7, letter: "B-" };
    if (grade >= 65) return { points: 2.3, letter: "C+" };
    if (grade >= 60) return { points: 2.0, letter: "C" };
    if (grade >= 50) return { points: 1.0, letter: "D" };
    return { points: 0.0, letter: "F" }; // راسب
}

document.getElementById("addBtn").onclick = function () {
    let name = document.getElementById("subjectName").value;
    let gradeText = document.getElementById("subjectGrade").value;
    let hours = Number(document.getElementById("subjectHours").value);

    if (name === "" || gradeText === "" || Number(gradeText) < 0 || Number(gradeText) > 100 || hours <= 0) {
        alert("يرجى إدخال اسم المادة، علامة بين 0 و 100، وعدد الساعات!");
        return;
    }

    let grade = Number(gradeText);
    let globalInfo = getGlobalGrade(grade); // جلب النقاط والرمز الحرفي
    let subjectQualityPoints = globalInfo.points * hours; // نقاط المادة المرجحة بالساعات

    // إضافة المادة للجدول مع الرمز العالمي ونقاطها
    let tableBody = document.getElementById("subjectsList");
    tableBody.innerHTML += `<tr>
        <td>${name}</td>
        <td>${grade} (${globalInfo.letter})</td>
        <td>${hours}</td>
        <td>${subjectQualityPoints.toFixed(2)}</td>
    </tr>`;

    totalWeightedGrades += (grade * hours);
    totalQualityPoints += subjectQualityPoints;
    totalHours += hours;

    // تفريغ الحقول
    document.getElementById("subjectName").value = "";
    document.getElementById("subjectGrade").value = "";
    document.getElementById("subjectHours").value = "";
};

document.getElementById("calcBtn").onclick = function () {
    if (totalHours === 0) {
        alert("أضيفي مادة واحدة على الأقل أولاً!");
        return;
    }

    // حساب المعدل المئوي والمعدل التراكمي العالمي (GPA)
    let finalPercent = (totalWeightedGrades / totalHours).toFixed(2);
    let globalGPA = (totalQualityPoints / totalHours).toFixed(2);

    // تحديد التقدير العام
    let status = "";
    if (globalGPA >= 3.7) status = "ممتاز مع مرتبة الشرف 🌟";
    else if (globalGPA >= 3.0) status = "جيد جداً 👏";
    else if (globalGPA >= 2.3) status = "جيد 👍";
    else if (globalGPA >= 2.0) status = "مقبول 🙂";
    else status = "إنذار أكاديمي / راسب ❌";

    document.getElementById("result").innerText = `المعدل المئوي: ${finalPercent}% | المعدل التراكمي (GPA): ${globalGPA} / 4.0`;
    document.getElementById("gradeText").innerText = `التقدير العام: ${status}`;
};
