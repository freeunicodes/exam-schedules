import {ExamInfo} from "./interfaces/ExamInfo";

const {Searcher} = require("fast-fuzzy");

const searchOptions = {
    threshold: .7,
    returnMatchData: true
}

function mapAndFilterExamsList(mapFn: any, filterFn: any, examsList: any, searchString: string) {
    let lecturersList = examsList.map(mapFn).flat();

    lecturersList = [...new Set(lecturersList)]
    const searcher = new Searcher(lecturersList);
    let searchResults = searcher.search(searchString, searchOptions)

    // Return match data can be true for debugging or other purposes
    if (searchOptions.returnMatchData) {
        searchResults = searchResults.map((obj: any) => obj.item);
    }

    return searchResults.map((searchResult: string) => {
        return examsList.filter((x: any) => filterFn(x, searchResult));
    }).flat();
}

function byLecturer(examsList: ExamInfo[], lecturer: string) {
    return mapAndFilterExamsList(
        (x: any) => {
            return x.lecturers;
        },
        (x: any, searchResult: any) => {
            return x.lecturers.includes(searchResult)
        }, examsList, lecturer);
}

function byGroup(examsList: ExamInfo[], group: string) {
    return mapAndFilterExamsList(
        (x: any) => {
            return x.groups;
        },
        (x: any, searchResult: any) => {
            return x.groups.includes(searchResult)
        }, examsList, group);
}

function bySubject(examsList: ExamInfo[], subject: string) {
    return mapAndFilterExamsList(
        (x: any) => {
            return x.subject;
        },
        (x: any, searchResult: any) => {
            return x.subject === searchResult
        }, examsList, subject);
}

function byUniversity(examsList: ExamInfo[], university: string) {
    return mapAndFilterExamsList(
        (x: any) => {
            return x.university;
        },
        (x: any, searchResult: any) => {
            return x.university === searchResult
        }, examsList, university);
}

export default {
    byGroup: byGroup,
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity
}



