import {ExamInfo} from "./interfaces/ExamInfo";

// Function returns true if this lecturer is owner of this exam
// TODO: It would be better if all this was implemented with regex (at least make it better or tests will start to fail)
function containsLecturer(exam: ExamInfo, lecturer: string) {
    let lecturerNameFirstLetter = lecturer[0];
    let lecturerLastName = lecturer.split(" ")[1];
    let lecturerSign = lecturerNameFirstLetter + " " + lecturerLastName;
    let lecturerArray = exam.lecturers;
    let containsSignature = lecturerArray.some(el => el[0] === lecturerNameFirstLetter && el.split(" ")[1] === lecturerLastName);
    return lecturerArray.includes(lecturer) || lecturerArray.includes(lecturerSign) || containsSignature;
}

function byLecturer(examsList: ExamInfo[], lecturer: string) {
    return examsList.filter((exam: ExamInfo) => containsLecturer(exam, lecturer));
}

// Function returns true if this group is one of the groups of the exam
function containsGroup(exam: ExamInfo, group: string) {
    let groupsArray = exam.groups;
    return groupsArray.includes(group);
}

function byGroup(examsList: ExamInfo[], group: string) {
    return examsList.filter((exam: ExamInfo) => containsGroup(exam, group));
}

function bySubject(examsList: ExamInfo[], subject: string) {
    return examsList.filter((exam: ExamInfo) => exam.subject.includes(subject));
}

function byUniversity(examsList: ExamInfo[], university: string) {
    return examsList.filter((exam: ExamInfo) => exam.university === university);
}

export default {
    byGroup: byGroup,
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity
}



