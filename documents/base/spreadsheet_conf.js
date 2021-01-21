/* **************************************************
# TL;DR
Spreadsheetの内容を加工して返す

# システム設計

************************************************** */

/* 定数 */
const RANGE = "A2:K100";// 取得するのセル範囲
const KEYS = {
    "date": 0,          // 日付
    "tldr": 1,          // 概要
    "open": 2,          // 掲載開始日
    "due": 3,           // 掲載終了日
};
const TEMPLATE = {
    0: {
        name: "# title",
        line: {
            emerg: {
                name: "## topic",
                val: "",
            },
            limit: {
                name: "## topic",
                val: "",
            },
            re: {
                name: "## topic",
                val: "",
            },
            timestamp: {
                name: "## topic",
                val: "",
            },
        }
    },
    1: {
        name: "# title",
        line: {
            slackid: {
                name: "## topic",
                val: "",
            },
            complete: {
                name: "## topic",
                val: "",
            },
            background: {
                name: "## topic",
                val: "",
            },
            noproblem: {
                name: "## □ やらなくていいこと",
                val: "",
            },
        }
    },
    2: {
        name: "# title",
        line: {
            info: {
                name: "## topic",
                val: "",
            },
        }
    },
}

// KEYS
var scriptProperties = PropertiesService.getScriptProperties();

const spreadsheet = SpreadsheetApp.openById('SPREAD_SHEET_ID');
const API_KEY = scriptProperties.getProperty('API_KEY');
