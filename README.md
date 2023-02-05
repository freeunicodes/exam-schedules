# Exam Schedules

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-88.47%25-yellow.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-76.92%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-81.81%25-yellow.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-88.17%25-yellow.svg?style=flat) |

## გარემოს გამართვა
### პრერეკვიზიტები
- node >= 12
- yarn
- hub (github-ის cli)
- windows-ის შემთხვევაში: git და git bash

### აუცილებელი ნაბიჯები
1. კლონირება
2. კლონირების შემდეგ გახსენი დირექტორია bash-ში და გაუშვი ბრძანება
```shell
yarn
```
3. credentials ფაილების გამართვა
    - გადაიტანე ფაილები token.json და credentials.json `data` ფოლდერში


<!-- TODO add instructions -->

## პროგრამის გამოყენება
* პირველ რიგში საჭიროა Build
```sh
yarn build
```

* პროგრამის გასაშვებად გამოიყენეთ
```sh
yarn start -l "Lecturer" -u "University" -s "subject" -g "group"
```
შეგიძლიათ გამოიყენოთ მხოლოდ ის option რომლის მიხედვითაც გინდათ მოძებნა.
მაგალითად:
```sh
yarn start -u "Freeuni" -s "შესავალი ციფრულ ტექნოლოგიებში"
```

