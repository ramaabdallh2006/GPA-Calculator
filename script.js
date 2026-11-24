let subjects = JSON.parse(localStorage.getItem('mari_gpa_subjects')) || new Array();
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

    const barPercent = Math.min(Number(finalPercent), 100).toFixed(0);
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
        subjects.splice(editIndex, 1, subjectData);
        editIndex = -1;
        document.querySelector("#addBtn span").innerText = "➕ إضافة";
    }

    document.getElementById("subjectName").value = "";
    document.getElementById("subjectGrade").value = "";
    document.getElementById("subjectHours").value = "";
    updateUI();
};

function editSubject(index) {
    const sub = subjects.at(index);
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
        subjects = new Array();
        updateUI();
    }
};

document.getElementById("themeBtn").onclick = function() {
    document.body.classList.toggle("dark-mode");
    this.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};

// حفظ النتيجة كصورة احترافية مباشرة بدون مكتبات خارجية (تعمل 100% دائماً)
document.getElementById("exportBtn").onclick = function() {
    if (subjects.length === 0) {
        alert("أضف مادة واحدة على الأقل لتتمكن من حفظ النتيجة كصورة!");
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = 800;
    const rowHeight = 48;
    const height = 360 + (subjects.length * rowHeight);
    canvas.width = width;
    canvas.height = height;

    // الخلفية
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // الترويسة الزرقاء
    const grad = ctx.createLinearGradient(0, 0, width, 130);
    grad.addColorStop(0, "#1e3799");
    grad.addColorStop(1, "#0c2461");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 130);

    // عنوان الترويسة
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Cairo, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("كشف المعدل التراكمي (GPA)", width / 2, 55);
    ctx.font = "16px Cairo, Arial, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("جامعة ماري الخاصة – قسم الهندسة المعلوماتية", width / 2, 95);

    // ملخص النتائج
    const gpa = document.getElementById("gpaValue").innerText;
    const percent = document.getElementById("percentValue").innerText;
    const hours = document.getElementById("hoursValue").innerText;

    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(40, 150, width - 80, 80);

    ctx.fillStyle = "#1e3799";
    ctx.font = "bold 22px Cairo, Arial, sans-serif";
    ctx.fillText(`المعدل: ${gpa} / 4.00   |   النسبة: ${percent}   |   الساعات: ${hours}`, width / 2, 198);

    // رأس الجدول
    let y = 260;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, y, width - 80, 42);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Cairo, Arial, sans-serif";
    ctx.fillText("المادة", 630, y + 27);
    ctx.fillText("العلامة", 420, y + 27);
    ctx.fillText("التقدير", 270, y + 27);
    ctx.fillText("الساعات", 120, y + 27);

    // صفوف المواد
    y += 42;
    subjects.forEach((sub, i) => {
        const info = getGlobalGrade(sub.grade);
        ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#f8fafc";
        ctx.fillRect(40, y, width - 80, rowHeight);

        ctx.fillStyle = "#102a43";
        ctx.font = "16px Cairo, Arial, sans-serif";
        ctx.fillText(sub.name, 630, y + 30);
        ctx.fillText(String(sub.grade), 420, y + 30);
        ctx.fillText(info.letter, 270, y + 30);
        ctx.fillText(String(sub.hours), 120, y + 30);
        y += rowHeight;
    });

    // التذييل وتوقيعك
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Cairo, Arial, sans-serif";
    ctx.fillText("تم الحساب عبر حاسبة جامعة ماري – تصميم وبرمجة: راما عبدالله 💻", width / 2, height - 25);

    // تنزيل الصورة فوراً
    const link = document.createElement("a");
    link.download = "GPA-Mari-University.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
};


updateUI();
