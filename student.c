#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 100
#define FILE_NAME "students.dat"

struct Student {
    int id;
    char name[50];
    int age;
    char course[50];
};

struct Student students[MAX_STUDENTS];
int studentCount = 0;


// ================================
// SAVE STUDENTS
// ================================

void saveStudents() {

    FILE *file = fopen(FILE_NAME, "wb");

    if (file == NULL) {
        printf("\nError: Could not save student records.\n");
        return;
    }

    fwrite(
        students,
        sizeof(struct Student),
        studentCount,
        file
    );

    fclose(file);
}


// ================================
// LOAD STUDENTS
// ================================

void loadStudents() {

    FILE *file = fopen(FILE_NAME, "rb");

    if (file == NULL) {
        return;
    }

    studentCount = fread(
        students,
        sizeof(struct Student),
        MAX_STUDENTS,
        file
    );

    fclose(file);
}


// ================================
// ADD STUDENT
// ================================

void addStudent() {

    if (studentCount >= MAX_STUDENTS) {
        printf("\nStudent limit reached.\n");
        return;
    }

    printf("\n===== ADD STUDENT =====\n");

    printf("Enter student ID: ");
    scanf("%d", &students[studentCount].id);

    printf("Enter student name: ");
    scanf(" %[^\n]", students[studentCount].name);

    printf("Enter student age: ");
    scanf("%d", &students[studentCount].age);

    printf("Enter student course: ");
    scanf(" %[^\n]", students[studentCount].course);

    studentCount++;

    saveStudents();

    printf("\nStudent added successfully!\n");
}


// ================================
// VIEW STUDENTS
// ================================

void viewStudents() {

    if (studentCount == 0) {
        printf("\nNo students available.\n");
        return;
    }

    printf("\n===== STUDENT LIST =====\n");

    for (int i = 0; i < studentCount; i++) {

        printf("\nStudent %d\n", i + 1);
        printf("ID: %d\n", students[i].id);
        printf("Name: %s\n", students[i].name);
        printf("Age: %d\n", students[i].age);
        printf("Course: %s\n", students[i].course);
    }
}


// ================================
// SEARCH STUDENT
// ================================

void searchStudent() {

    int id;
    int found = 0;

    printf("\nEnter student ID to search: ");
    scanf("%d", &id);

    for (int i = 0; i < studentCount; i++) {

        if (students[i].id == id) {

            printf("\n===== STUDENT FOUND =====\n");

            printf("ID: %d\n", students[i].id);
            printf("Name: %s\n", students[i].name);
            printf("Age: %d\n", students[i].age);
            printf("Course: %s\n", students[i].course);

            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nStudent not found.\n");
    }
}


// ================================
// UPDATE STUDENT
// ================================

void updateStudent() {

    int id;
    int found = 0;

    printf("\nEnter student ID to update: ");
    scanf("%d", &id);

    for (int i = 0; i < studentCount; i++) {

        if (students[i].id == id) {

            printf("\n===== UPDATE STUDENT =====\n");

            printf("Enter new name: ");
            scanf(" %[^\n]", students[i].name);

            printf("Enter new age: ");
            scanf("%d", &students[i].age);

            printf("Enter new course: ");
            scanf(" %[^\n]", students[i].course);

            saveStudents();

            printf("\nStudent updated successfully!\n");

            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nStudent not found.\n");
    }
}


// ================================
// DELETE STUDENT
// ================================

void deleteStudent() {

    int id;
    int found = 0;

    printf("\nEnter student ID to delete: ");
    scanf("%d", &id);

    for (int i = 0; i < studentCount; i++) {

        if (students[i].id == id) {

            for (int j = i; j < studentCount - 1; j++) {
                students[j] = students[j + 1];
            }

            studentCount--;

            saveStudents();

            printf("\nStudent deleted successfully!\n");

            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nStudent not found.\n");
    }
}


// ================================
// MAIN PROGRAM
// ================================

int main() {

    int choice;

    // Load saved students when program starts
    loadStudents();

    while (1) {

        printf("\n==============================\n");
        printf("   STUDENT MANAGEMENT SYSTEM\n");
        printf("==============================\n");

        printf("1. Add Student\n");
        printf("2. View Students\n");
        printf("3. Search Student\n");
        printf("4. Update Student\n");
        printf("5. Delete Student\n");
        printf("6. Exit\n");

        printf("\nEnter your choice: ");
        scanf("%d", &choice);

        switch (choice) {

            case 1:
                addStudent();
                break;

            case 2:
                viewStudents();
                break;

            case 3:
                searchStudent();
                break;

            case 4:
                updateStudent();
                break;

            case 5:
                deleteStudent();
                break;

            case 6:
                printf("\nThank you for using the system.\n");
                return 0;

            default:
                printf("\nInvalid choice. Please try again.\n");
        }
    }

    return 0;
}