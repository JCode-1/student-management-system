// =========================================
// STUDENT MANAGEMENT SYSTEM
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const studentForm = document.getElementById("student-form");
const studentTable = document.getElementById("student-table");
const emptyState = document.getElementById("empty-state");

const totalStudents = document.getElementById("total-students");
const totalCourses = document.getElementById("total-courses");
const recordsCount = document.getElementById("records-count");
const latestRegistration =
    document.getElementById("latest-registration");

const searchInput = document.getElementById("search-input");
const clearSearch = document.getElementById("clear-search");


// =========================================
// STUDENT DATA
// =========================================

let students = [];


// =========================================
// HAMBURGER MENU
// =========================================

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", function() {

        sidebar.classList.toggle("open");
        menuToggle.classList.toggle("active");

    });

}


// =========================================
// CLOSE SIDEBAR AFTER NAVIGATION
// =========================================

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(function(navItem) {

    navItem.addEventListener("click", function() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }

    });

});


// =========================================
// TOAST
// =========================================

const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toast-icon");
const toastMessage = document.getElementById("toast-message");

let toastTimer;


function showToast(message, icon = "✓") {

    if (!toast || !toastIcon || !toastMessage) {
        return;
    }

    clearTimeout(toastTimer);

    toastMessage.textContent = message;
    toastIcon.textContent = icon;

    toast.classList.add("show");

    toastTimer = setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);

}


// =========================================
// SAVE STUDENTS
// =========================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// =========================================
// LOAD STUDENTS
// =========================================

function loadStudents() {

    const savedStudents =
        localStorage.getItem("students");

    if (!savedStudents) {

        students = [];

        displayStudents();

        return;

    }


    try {

        const parsedStudents =
            JSON.parse(savedStudents);


        if (Array.isArray(parsedStudents)) {

            students = parsedStudents.map(
                function(student) {

                    return {
                        id: Number(student.id),
                        name: String(student.name || ""),
                        age: Number(student.age),
                        course: String(student.course || ""),
                        registeredDate:
                            student.registeredDate || "—"
                    };

                }
            );

        } else {

            students = [];

        }

    } catch (error) {

        console.error(
            "Could not load student records:",
            error
        );

        students = [];

    }


    displayStudents();

}


// =========================================
// DISPLAY STUDENTS
// =========================================

function displayStudents(studentList = students) {

    if (!studentTable) {
        return;
    }


    studentTable.innerHTML = "";


    // =====================================
    // TOTAL STUDENTS
    // =====================================

    if (totalStudents) {

        totalStudents.textContent =
            students.length;

    }


    // =====================================
    // RECORD COUNT
    // =====================================

    if (recordsCount) {

        recordsCount.textContent =
            students.length === 1
                ? "1 Student"
                : `${students.length} Students`;

    }


    // =====================================
    // LATEST REGISTRATION
    // =====================================

    if (latestRegistration) {

        if (students.length === 0) {

            latestRegistration.textContent = "—";

        } else {

            latestRegistration.textContent =
                students[students.length - 1].name;

        }

    }


    // =====================================
    // TOTAL COURSES
    // =====================================

    const uniqueCourses = new Set();

    students.forEach(function(student) {

        uniqueCourses.add(
            student.course.toLowerCase().trim()
        );

    });


    if (totalCourses) {

        totalCourses.textContent =
            uniqueCourses.size;

    }


    // =====================================
    // EMPTY STATE
    // =====================================

    if (studentList.length === 0) {

        if (emptyState) {

            emptyState.style.display = "block";


            if (students.length === 0) {

                emptyState.innerHTML = `

                    <div class="empty-icon">
                        👨‍🎓
                    </div>

                    <h3>
                        No Students Found
                    </h3>

                    <p>
                        Add a student to start
                        building your student records.
                    </p>

                `;

            } else {

                const searchTerm =
                    searchInput
                        ? searchInput.value.trim()
                        : "";

                emptyState.innerHTML = `

                    <div class="empty-icon">
                        🔍
                    </div>

                    <h3>
                        No Matching Students
                    </h3>

                    <p>
                        No student matches
                        "<strong>${searchTerm}</strong>".
                    </p>

                `;

            }

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display = "none";

    }


    // =====================================
    // CREATE TABLE ROWS
    // =====================================

    studentList.forEach(function(student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.id}
            </td>


            <td>

                <div class="student-name-cell">

                    <span class="student-avatar">
                        ${student.name
                            .charAt(0)
                            .toUpperCase()}
                    </span>

                    <span>
                        ${student.name}
                    </span>

                </div>

            </td>


            <td>
                ${student.age}
            </td>


            <td>

                <span class="course-badge">
                    ${student.course}
                </span>

            </td>


            <td>
                ${student.registeredDate || "—"}
            </td>


            <td>

                <button
                    type="button"
                    class="action-button view-button"
                    onclick="viewStudent(${student.id})"
                >
                    View
                </button>


                <button
                    type="button"
                    class="action-button edit-button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="action-button delete-button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        studentTable.appendChild(row);

    });

}


// =========================================
// ADD STUDENT
// =========================================

if (studentForm) {

    studentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Prevent accidental double submission
            if (studentForm.dataset.submitting === "true") {
                return;
            }

            studentForm.dataset.submitting = "true";


            // =================================
            // GET FORM VALUES
            // =================================

            const id = Number(
                document.getElementById("student-id").value
            );

            const name =
                document.getElementById("student-name")
                    .value.trim();

            const age = Number(
                document.getElementById("student-age").value
            );

            const course =
                document.getElementById("student-course")
                    .value.trim();


            // =================================
            // VALIDATE ID
            // =================================

            if (!Number.isFinite(id)) {

                showToast(
                    "Please enter a valid student ID.",
                    "!"
                );

                studentForm.dataset.submitting = "false";

                return;

            }


            // =================================
            // CHECK DUPLICATE ID
            // =================================

            const existingStudent =
                students.find(
                    function(student) {

                        return Number(student.id) === id;

                    }
                );


            if (existingStudent) {

                showToast(
                    "A student with this ID already exists.",
                    "!"
                );

                studentForm.dataset.submitting = "false";

                return;

            }


            // =================================
            // CREATE STUDENT
            // =================================

            const student = {

                id: id,

                name: name,

                age: age,

                course: course,

                registeredDate:
                    new Date().toLocaleDateString()

            };


            // =================================
            // ADD TO ARRAY
            // =================================

            students.push(student);


            // =================================
            // SAVE
            // =================================

            saveStudents();


            // =================================
            // REFRESH
            // =================================

            displayStudents();


            // =================================
            // CLEAR FORM
            // =================================

            studentForm.reset();


            showToast(
                "Student added successfully!",
                "✓"
            );


            // Allow another submission
            setTimeout(function() {

                studentForm.dataset.submitting = "false";

            }, 300);

        }
    );

}


// =========================================
// DELETE MODAL
// =========================================

const deleteModal =
    document.getElementById("delete-modal");

const deleteMessage =
    document.getElementById("delete-message");

const cancelDelete =
    document.getElementById("cancel-delete");

const confirmDelete =
    document.getElementById("confirm-delete");

let studentToDelete = null;


// =========================================
// OPEN DELETE MODAL
// =========================================

function deleteStudent(id) {

    const student =
        students.find(
            function(student) {

                return Number(student.id) === Number(id);

            }
        );


    if (!student) {

        showToast(
            "Student record not found.",
            "!"
        );

        return;

    }


    studentToDelete =
        Number(student.id);


    if (deleteMessage) {

        deleteMessage.innerHTML = `
            Are you sure you want to permanently
            delete <strong>${student.name}</strong>'s
            record?
        `;

    }


    if (deleteModal) {

        deleteModal.classList.add("active");

    }

}


// =========================================
// CONFIRM DELETE
// =========================================

if (confirmDelete) {

    confirmDelete.addEventListener(
        "click",
        function() {

            if (studentToDelete === null) {
                return;
            }


            const idToDelete =
                Number(studentToDelete);


            const deletedStudent =
                students.find(
                    function(student) {

                        return Number(student.id) ===
                            idToDelete;

                    }
                );


            if (!deletedStudent) {

                showToast(
                    "Student record not found.",
                    "!"
                );

                studentToDelete = null;

                return;

            }


            // =================================
            // REMOVE FROM ARRAY
            // =================================

            students =
                students.filter(
                    function(student) {

                        return Number(student.id) !==
                            idToDelete;

                    }
                );


            // =================================
            // SAVE NEW ARRAY
            // =================================

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );


            // =================================
            // CLOSE MODAL
            // =================================

            if (deleteModal) {

                deleteModal.classList.remove(
                    "active"
                );

            }


            // =================================
            // CLEAR DELETE ID
            // =================================

            studentToDelete = null;


            // =================================
            // REFRESH TABLE
            // =================================

            displayStudents();


            // =================================
            // SUCCESS
            // =================================

            showToast(
                `${deletedStudent.name} was deleted successfully!`,
                "✓"
            );

        }
    );

}


// =========================================
// CANCEL DELETE
// =========================================

if (cancelDelete) {

    cancelDelete.addEventListener(
        "click",
        function() {

            if (deleteModal) {

                deleteModal.classList.remove(
                    "active"
                );

            }

            studentToDelete = null;

        }
    );

}


// =========================================
// CLOSE DELETE MODAL OUTSIDE
// =========================================

if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        function(event) {

            if (event.target === deleteModal) {

                deleteModal.classList.remove(
                    "active"
                );

                studentToDelete = null;

            }

        }
    );

}


// =========================================
// EDIT STUDENT
// =========================================

const editModal =
    document.getElementById("edit-modal");

const editForm =
    document.getElementById("edit-form");

const editId =
    document.getElementById("edit-id");

const editName =
    document.getElementById("edit-name");

const editAge =
    document.getElementById("edit-age");

const editCourse =
    document.getElementById("edit-course");

const closeModal =
    document.getElementById("close-modal");

const cancelEdit =
    document.getElementById("cancel-edit");


// =========================================
// OPEN EDIT MODAL
// =========================================

function editStudent(id) {

    const student =
        students.find(
            function(student) {

                return Number(student.id) === Number(id);

            }
        );


    if (!student) {
        return;
    }


    editId.value = student.id;
    editName.value = student.name;
    editAge.value = student.age;
    editCourse.value = student.course;


    editModal.classList.add("active");

    editName.focus();

}


// =========================================
// SAVE EDIT
// =========================================

if (editForm) {

    editForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                Number(editId.value);


            const student =
                students.find(
                    function(student) {

                        return Number(student.id) === id;

                    }
                );


            if (!student) {
                return;
            }


            student.name =
                editName.value.trim();

            student.age =
                Number(editAge.value);

            student.course =
                editCourse.value.trim();


            saveStudents();

            displayStudents();


            editModal.classList.remove(
                "active"
            );


            showToast(
                "Student updated successfully!",
                "✓"
            );

        }
    );

}


// =========================================
// CLOSE EDIT MODAL
// =========================================

function closeEditModal() {

    editModal.classList.remove("active");

    editForm.reset();

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeEditModal
    );

}


if (cancelEdit) {

    cancelEdit.addEventListener(
        "click",
        closeEditModal
    );

}


if (editModal) {

    editModal.addEventListener(
        "click",
        function(event) {

            if (event.target === editModal) {

                closeEditModal();

            }

        }
    );

}


// =========================================
// SEARCH
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();


            if (clearSearch) {

                if (searchTerm !== "") {

                    clearSearch.classList.add("show");

                } else {

                    clearSearch.classList.remove("show");

                }

            }


            const filteredStudents =
                students.filter(
                    function(student) {

                        return (

                            student.name
                                .toLowerCase()
                                .includes(searchTerm)

                            ||

                            student.course
                                .toLowerCase()
                                .includes(searchTerm)

                            ||

                            String(student.id)
                                .includes(searchTerm)

                        );

                    }
                );


            displayStudents(
                filteredStudents
            );

        }
    );

}


// =========================================
// CLEAR SEARCH
// =========================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function() {

            searchInput.value = "";

            clearSearch.classList.remove(
                "show"
            );

            displayStudents();

            searchInput.focus();

        }
    );

}


// =========================================
// VIEW STUDENT
// =========================================

const viewModal =
    document.getElementById("view-modal");

const closeViewModal =
    document.getElementById("close-view-modal");

const closeViewButton =
    document.getElementById("close-view-button");

const viewAvatar =
    document.getElementById("view-avatar");

const viewName =
    document.getElementById("view-name");

const viewCourse =
    document.getElementById("view-course");

const viewId =
    document.getElementById("view-id");

const viewAge =
    document.getElementById("view-age");

const viewCourseDetail =
    document.getElementById("view-course-detail");

const viewDate =
    document.getElementById("view-date");


// =========================================
// OPEN VIEW
// =========================================

function viewStudent(id) {

    const student =
        students.find(
            function(student) {

                return Number(student.id) === Number(id);

            }
        );


    if (!student) {
        return;
    }


    viewAvatar.textContent =
        student.name.charAt(0).toUpperCase();

    viewName.textContent =
        student.name;

    viewCourse.textContent =
        student.course;

    viewId.textContent =
        student.id;

    viewAge.textContent =
        student.age;

    viewCourseDetail.textContent =
        student.course;

    viewDate.textContent =
        student.registeredDate || "—";


    viewModal.classList.add("active");

}


// =========================================
// CLOSE VIEW
// =========================================

function closeStudentView() {

    viewModal.classList.remove("active");

}


if (closeViewModal) {

    closeViewModal.addEventListener(
        "click",
        closeStudentView
    );

}


if (closeViewButton) {

    closeViewButton.addEventListener(
        "click",
        closeStudentView
    );

}


if (viewModal) {

    viewModal.addEventListener(
        "click",
        function(event) {

            if (event.target === viewModal) {

                closeStudentView();

            }

        }
    );

}


// =========================================
// CURRENT DATE
// =========================================

const currentDate =
    document.getElementById("current-date");


function updateCurrentDate() {

    if (!currentDate) {
        return;
    }


    const today =
        new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


// =========================================
// START APPLICATION
// =========================================

loadStudents();

updateCurrentDate();