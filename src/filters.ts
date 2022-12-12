import {ExamInfo} from "./interfaces/ExamInfo";

const {Searcher} = require("fast-fuzzy");

function byLecturer(examsList: ExamInfo[], lecturer: string, searchOptions : any) {
    let lecturersList = examsList.map(x => x.lecturers).flat();
    lecturersList = [...new Set(lecturersList)]
    const searcher = new Searcher(lecturersList);
    const searchResults = searcher.search(lecturer, searchOptions)
    return searchResults.map((searchResult: string) => {
        return examsList.filter((exam => {
            return exam.lecturers.includes(searchResult)
        }))
    }).flat();
}

function byGroup(examsList: ExamInfo[], group: string, searchOptions : any) {
    let groupsList = examsList.map(x => x.groups).flat();
    groupsList = [...new Set(groupsList)]
    const searcher = new Searcher(groupsList);
    const searchResults = searcher.search(group, searchOptions)
    return searchResults.map((searchResult: string) => {
        return examsList.filter((exam => {
            return exam.groups.includes(searchResult)
        }))
    }).flat();
}

function bySubject(examsList: ExamInfo[], subject: string, searchOptions : any) {
    let subjectsList = examsList.map(x => x.subject);
    subjectsList = [...new Set(subjectsList)]
    const searcher = new Searcher(subjectsList);
    const searchResults = searcher.search(subject, searchOptions)
    return searchResults.map((searchResult: string) => {
        return examsList.filter((exam => {
            return exam.subject === searchResult
        }))
    }).flat();
}

function byUniversity(examsList: ExamInfo[], university: string, searchOptions : any) {
    let universityList = examsList.map(x => x.university);
    universityList = [...new Set(universityList)]
    const searcher = new Searcher(universityList);
    const searchResults = searcher.search(university, searchOptions)
    return searchResults.map((searchResult: string) => {
        return examsList.filter((exam => {
            return exam.university === searchResult
        }))
    }).flat();
}


export default {
    byGroup: byGroup,
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity
}



