var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var google = require('googleapis').google;
var authorize = require("./index").authorize;
var fs = require("fs");
var getSheets = function (sheets, spreadsheetId) { return __awaiter(_this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sheets.spreadsheets.get({
                    spreadsheetId: spreadsheetId
                })];
            case 1:
                result = (_a.sent()).data.sheets;
                result = result.map(function (sheet) {
                    return sheet.properties.title;
                });
                return [2 /*return*/, result];
        }
    });
}); };
function getSpreadsheetId() {
    if (!fs.existsSync("./data/SpreadsheetId.json")) {
        throw new Error("SpreadsheetId.json not found in ./data/ directory");
    }
    return JSON.parse(fs.readFileSync("./data/SpreadsheetId.json").toString()).spreadsheetId;
}
function listMajors(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, ranges;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheets = google.sheets({ version: 'v4', auth: auth });
                    ranges = [];
                    return [4 /*yield*/, getSheets(sheets, getSpreadsheetId())
                            .then(function (row) {
                            ranges = row;
                        })];
                case 1:
                    _a.sent();
                    ranges.map(function (range) { return __awaiter(_this, void 0, void 0, function () {
                        var res, rows;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheets.spreadsheets.values.get({
                                        spreadsheetId: getSpreadsheetId(),
                                        range: "".concat(range, "!A2:G")
                                    })];
                                case 1:
                                    res = _a.sent();
                                    rows = res.data.values;
                                    if (!rows || rows.length === 0) {
                                        console.log('No data found.');
                                        return [2 /*return*/];
                                    }
                                    rows.forEach(function (row) {
                                        var examInfo = {
                                            date: range,
                                            time: row[0],
                                            subject: row[1],
                                            lecturers: row[2],
                                            groups: row[3],
                                            university: row[4]
                                        };
                                        console.log(examInfo);
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
authorize().then(listMajors)["catch"](console.error);
