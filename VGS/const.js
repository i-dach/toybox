/* **************************************************
# TL;DR
Clientからの依頼をTrelloに登録する
************************************************** */

/* 定数 */
const SPREAD_SHEET_ID = "xxx"; // スプレッドシートのID
const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
const RANGE = "A2:K100";// 取得するのセル範囲
const TIMER = {
    1: {
        limit: "1h",
        re: "Doingに変更してから15m以内",
    },
    2: {
        limit: "2h",
        re: "Doingに変更してから15m以内",
    },
    3: {
        limit: "4h",
        re: "Doingに変更してから15m以内",
    },
    5: {
        limit: "8h (1days)",
        re: "Doingに変更してから15m以内",
    },
    8: {
        limit: "16h (2days)",
        re: "Doingに変更してから2h以内",
    },
    13: {
        limit: "24h (3days)",
        re: "Doingに変更してから2h以内",
    },
    21: {
        limit: "40h (1week)",
        re: "Doingに変更してから2h以内",
    },
    34: {
        limit: "80h (2weeks)",
        re: "Doingに変更してから2h以内",
    },
    55: {
        limit: "160h (1month)",
        re: "Doingに変更してから2h以内",
    },
    "∞": {
        limit: "",
        re: "-",
    },
};
const KEYS = {
    "timestamp": 0,     // タイムスタンプ
    "tldr": 1,          // 概要
    "slackId": 2,       // 依頼者Slack名
    "complete": 3,      // 達成条件
    "background": 4,    // 課題の背景
    "info": 5,          // 備考
    "must": 6,          // 依頼者の責任について
    "department": 7,    // 依頼部署
    "size": 8,          // 課題の規模感
    "noproblem": 9,     // やらなくてもいいこと
    "emerg": 10,        // 緊急度について
    "due": 11,          // 期限日
};
const TEMPLATE = {
    0: {
        name: "# 【クエスト難易度】",
        line: {
            emerg: {
                name: "## □ 緊急度",
                val: "",
            },
            limit: {
                name: "## □ 制限時間",
                val: "",
            },
            re: {
                name: "## □ 帰還可能時間",
                val: "",
            },
            timestamp: {
                name: "## □ 作成日",
                val: "",
            },
        }
    },
    1: {
        name: "# 【クエスト基本情報】",
        line: {
            slackId: {
                name: "## □ 依頼主",
                val: "",
            },
            complete: {
                name: "## □ クエスト達成条件",
                val: "",
            },
            background: {
                name: "## □ 依頼背景",
                val: "",
            },
            noproblem: {
                name: "## □ やらなくていいこと",
                val: "",
            },
        }
    },
    2: {
        name: "# 【クエスト補足情報】",
        line: {
            info: {
                name: "## □ その他の提供情報",
                val: "",
            },
        }
    },
}

// Trello API KEYS
var scriptProperties = PropertiesService.getScriptProperties();
const API_KEY = scriptProperties.getProperty('TRELLO_KEY');
const API_TOKEN = scriptProperties.getProperty('TRELLO_TOKEN');
const AUTH_TOKEN = scriptProperties.getProperty('TRELLO_OAUTH');

// Trello ID
const BOARD_ID = "xxxx"; // クエストボード
const POS = '0';

// Trello API ENDPOINT
const LIST_URL = `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${API_TOKEN}`;
const CARD_URL = "https://api.trello.com/1/cards";
