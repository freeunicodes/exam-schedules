# Exam Schedules

| Statements                                                                            | Branches                                                                       | Functions                                                                           | Lines                                                                       |
|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| ![Statements](https://img.shields.io/badge/statements-88.47%25-yellow.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-76.92%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-81.81%25-yellow.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-88.17%25-yellow.svg?style=flat) |

Service which provides exam schedules for _Free University of Tbilisi_ and _Agrarian University of Tbilisi_.
API has multiple endpoints for filtering exams by subject, lecturer, group and University.

## Requirements

- node
- yarn
- docker (optional)
- google service account

## Getting Started

1. Run this command in cloned repository to install package dependencies:

```shell
yarn
```

2. Create Google service account and get secret service account key as a JSON file:

https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount

3. Create `.env` file with `GOOGLE_APPLICATION_CREDENTIALS` set to the path of secret JSON file and
   `SPREADSHEET_ID` set to the exam schedules spreadsheet provided by University. The spreadsheet ID can be found in the
   URL of the spreadsheet. For example:

```dotenv
GOOGLE_APPLICATION_CREDENTIALS="/path/to/secret.json"
SPREADSHEET_ID="1Ap5rNol7xSLyxhLRFrHoeNBGdf4Unw4kcU-OHK-MrKs"
```

4. After this, you can start the server by calling this command from the root directory:

```shell
yarn start
```

5. If everything goes well, you will get a valid JSON response from the server when you make a request from your web
   browser.

## Usage

App consists of two separate modules, `exam-schedules-api` and `exam-schedules-lib`. They are in their respective
folders in the project directory. API module requires LIB module to create web server and provide results in JSON form, 
but LIB module can be used as a separate CLI application.

To make use of the CLI app, you must run `yarn start-cli` script with optional filter arguments, like this:
```sh
yarn start-cli -l "Lecturer" -u "University" -s "subject" -g "group"
```
or with fewer arguments:
```sh
yarn start-cli -u "Freeuni" -s "შესავალი ციფრულ ტექნოლოგიებში"
```

## Testing
To run `exam-schedules-api` module tests, use this command:
```shell
yarn test-api
```
To run `exam-schedules-lib` module tests, use this command:
```shell
yarn test-lib
```
Other useful scripts can be found in `package.json` files either in the root directory or
in the separate module root directories.
