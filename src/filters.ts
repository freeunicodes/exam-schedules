import {ExamInfo} from "./interfaces/ExamInfo";

//function returns true if this lecturer is owner of this exam
function containsLecturer(exam: ExamInfo, lecturer: string) {
    let lecturerNameFirstLetter = lecturer[0];
    let lecturerSign = lecturerNameFirstLetter + " " + lecturer.split(" ")[1];
    let lecturerArray = exam.lecturers;
    return lecturerArray.includes(lecturer) || lecturerArray.includes(lecturerSign);
}

//function returns filter array of examlist
export function filterExamsByLecturer(examsList: ExamInfo[], lecturer: string) {
    return examsList.filter((exam: ExamInfo) => containsLecturer(exam, lecturer));
}

//function returns true if this group is one of the groups of the exam
function containsGroup(exam: ExamInfo, group: string) {
    let groupsArray = exam.groups;
    return groupsArray.includes(group);
}

//function returns filter array of examlist
export function filterExamsByGroup(examsList: ExamInfo[], group: string) {
    return examsList.filter((exam: ExamInfo) => containsGroup(exam, group));
}

//function returns filter array of examlist
export function filterExamsBySubject(examsList: ExamInfo[], subject: string) {
    return examsList.filter((exam: ExamInfo) => exam.subject.includes(subject));
}

//function returns filter array of examlist
export function filterExamsByUniversity(examsList: ExamInfo[], university: string) {
    return examsList.filter((exam: ExamInfo) => exam.university === university);
}




