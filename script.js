let subjects = JSON.parse(localStorage.getItem('mari_gpa_subjects')) || [];
let editIndex = -1;

function getGlobalGrade(grade) {
    if (grade >= 98) return { points: 4.00, letter: "A+", badge: "badge-a" };
    if (grade >= 95) return { points: 3.75, letter: "A", badge: "badge-a" };
    if (grade >= 90) return { points: 3.50, letter: "A-", badge: "badge-a" };
    if (grade >= 85) return { points: 3.25, letter: "B+", badge: "badge-b" };
    if (grade >= 80) return { points: 3.00, letter: "B", badge: "badge-b" };
    if (grade >= 75) return { points: 2.75, letter: "B-", badge: "badge-b" };
    if (grade >= 70) return { points: 2.50, letter: "C+", badge: "badge-c" };
    if (grade >= 65) return { points: 2.25, letter: "C", badge: "badge-c" };
    if (grade >= 60) return { points: 2.00, letter: "C-", badge: "badge-c" };
    if (grade >= 55) return { points: 1.75, letter: "D+", badge: "badge-d" };
    if (grade >= 50) return { points: 1.50, letter: "D", badge: "badge-d" };
    return { points: 0.00, letter: "F", badge: "badge-f" };
}

function getOverallStatus(gpa) {
    if (gpa >= 3.75) return { text: "ممتاز مع مرتبة الشرف 🌟", color: "#10b981" };
    if (gpa >= 3.25) return { text: "ممتاز 🔥", color: "#10b981" };
    if (gpa >= 2.75) return { text: "جيد جداً 👏", color: "#3b82f6" };
    if (gpa >= 2.25) return { text: "جيد 👍", color: "#0ea5e9" };
    if (gpa >= 2.00) return { text: "مقبول (وضع سليم)", color: "#eab308" };
    if (gpa > 0) return { text: "إنذار أكاديمي (تحت 2.00) ⚠️", color: "#ef4444" };
    return { text: "بانتظار إدخال المواد", color: "#64748b" };
}

function updateUI() {
    localStorage.setItem('mari_gpa_subjects', JSON.stringify(subjects));
    const tableBody = document.getElementById("subjectsList");
    tableBody.innerHTML = "";

    if (subjects.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">لا توجد مواد مضافة بعد.. أضف مادتك الأولى بالأعلى 👆</td></tr>`;
        document.getElementById("gpaValue").innerText = "0.00";
        document.getElementById("gpaValue").style.color = "var(--primary)";
        document.getElementById("percentValue").innerText = "0.0%";
        document.getElementById("hoursValue").innerText = "0";
        document.getElementById("gradeStatus").innerText = "بانتظار إدخال المواد";
        document.getElementById("gradeStatus").style.color = "var(--text-muted)";
        document.getElementById("progressBar").style.width = "0%";
        document.getElementById("progressPercent").innerText = "0%";
        return;
    }

    let totalWeightedGrades = 0;
    let totalQualityPoints = 0;
    let totalHours = 0;

    subjects.forEach((sub, index) => {
        const info = getGlobalGrade(sub.grade);
        const qualityPoints = (info.points * sub.hours).toFixed(2);

        totalWeightedGrades += (sub.grade * sub.hours);
        totalQualityPoints += (info.points * sub.hours);
        totalHours += sub.hours;

        tableBody.innerHTML += `
            <tr>
                <td><strong>${sub.name}</strong></td>
                <td>${sub.grade}</td>
                <td><span class="badge ${info.badge}">${info.letter}</span></td>
                <td>${sub.hours}</td>
                <td>${qualityPoints}</td>
                <td data-html2canvas-ignore="true">
                    <button class="action-btn btn-edit" onclick="editSubject(${index})" title="تعديل">✏️</button>
                    <button class="action-btn btn-delete" onclick="deleteSubject(${index})" title="حذف">🗑️</button>
                </td>
            </tr>
        `;
    });

    const finalPercent = (totalWeightedGrades / totalHours).toFixed(1);
    const globalGPA = (totalQualityPoints / totalHours).toFixed(2);
    const status = getOverallStatus(Number(globalGPA));

    document.getElementById("gpaValue").innerText = globalGPA;
    document.getElementById("gpaValue").style.color = status.color;
    document.getElementById("percentValue").innerText = finalPercent + "%";
    document.getElementById("hoursValue").innerText = totalHours;

    const statusEl = document.getElementById("gradeStatus");
    statusEl.innerText = status.text;
    statusEl.style.color = status.color;

    const barPercent = Math.min((globalGPA / 4) * 100, 100).toFixed(0);
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = barPercent + "%";
    progressBar.style.backgroundColor = status.color;
    document.getElementById("progressPercent").innerText = barPercent + "%";
}

document.getElementById("addBtn").onclick = function() {
    const name = document.getElementById("subjectName").value.trim();
    const gradeVal = document.getElementById("subjectGrade").value;
    const hoursVal = document.getElementById("subjectHours").value;

    if (!name || gradeVal === "" || Number(gradeVal) < 0 || Number(gradeVal) > 100 || Number(hoursVal) <= 0) {
        alert("يرجى إدخال اسم المادة، وعلامة صحيحة بين 0 و 100، وعدد الساعات!");
        return;
    }

    const subjectData = { name, grade: Number(gradeVal), hours: Number(hoursVal) };

    if (editIndex === -1) {
        subjects.push(subjectData);
    } else {
        subjects[editIndex] = subjectData;
        editIndex = -1;
        document.querySelector("#addBtn span").innerText = "➕ إضافة";
    }

    document.getElementById("subjectName").value = "";
    document.getElementById("subjectGrade").value = "";
    document.getElementById("subjectHours").value = "";
    updateUI();
};

function editSubject(index) {
    const sub = subjects[index];
    document.getElementById("subjectName").value = sub.name;
    document.getElementById("subjectGrade").value = sub.grade;
    document.getElementById("subjectHours").value = sub.hours;
    editIndex = index;
    document.querySelector("#addBtn span").innerText = "💾 حفظ التعديل";
    document.getElementById("subjectName").focus();
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    updateUI();
}

document.getElementById("clearBtn").onclick = function() {
    if (subjects.length > 0 && confirm("هل أنت متأكد من حذف جميع المواد؟")) {
        subjects = [];
        updateUI();
    }
};

document.getElementById("themeBtn").onclick = function() {
    document.body.classList.toggle("dark-mode");
    this.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};

document.getElementById("exportBtn").onclick = function() {
    if (subjects.length === 0) {
        alert("أضف مادة واحدة على الأقل لتتمكن من حفظ النتيجة كصورة!");
        return;
    }

    if (typeof html2canvas === "undefined") {
        alert("جاري تحميل أداة التصوير، يرجى المحاولة بعد ثوانٍ أو التأكد من اتصال الإنترنت.");
        return;
    }

    const btn = this;
    const originalText = btn.innerText;
    btn.innerText = "⏳ جاري الحفظ...";

    const captureArea = document.getElementById("captureArea");
    html2canvas(captureArea, {
        scale: 2,
        backgroundColor: document.body.classList.contains("dark-mode") ? "#1e293b" : "#ffffff",
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'GPA-Mari-University.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        btn.innerText = originalText;
    }).catch(err => {
        alert("حدث خطأ أثناء حفظ الصورة، حاول مرة أخرى.");
        btn.innerText = originalText;
    });
};

updateUI();
