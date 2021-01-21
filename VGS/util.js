/* **************************************************
# TL;DR
Clientからの依頼をTrelloに登録する
************************************************** */

/* 式 -----------------------------------------------------------------------------------*/
/*
 TL;DR log出力

 @param {string} str 引数に渡された文字列
 */
function logger(str){
    console.log(logger.caller, str);
}

 /*
 TL;DR Spreadsheetからクエストの基本情報を取得する

 @return {string[][]} rows 指定された行に入力された情報
 */
function getRows() {
    list = spreadsheet
            .getSheetByName("form")
            .getRange(RANGE)
            .getValues();

    logger(list);
    return list;
}

/*
 TL;DR rowをkey:value式に変換する
 
 @param {string[]} row Spreadsheetの行情報
 @param {string[]} kyes ヘッダーに対応する列番号の定義
 @return {string[]} format テンプレートに当てはめた文字列情報
 */
function convert(row, keys) {
    var format = {};
    for(var key in keys){
        // format["timestamp"] = row[0]
        format[key] = row[KEYS[key]];
    }

    logger(format);
    return format;
}

 /*
 TL;DR 制限時間と帰還可能時間を求める
 
 @param {string} size 入力された課題の規模感
 @param {string} key 求める対象時間(制限時間か帰還可能時間)

 @return {string} timer 制限時間 / 帰還可能時間
 */
function setTimer(size, key) {
    return TIMER[size][key];
}

 /*
 TL;DR Spreadsheetの入力情報をテンプレートに当てはめる
 
 @param {string[]} row Spreadsheetの行情報
 @return {string} format テンプレートに当てはめた文字列情報
 */
function templater(row) {
    var format = '';
    for(var range in TEMPLATE){
      var line = TEMPLATE[range];
      format += line.name + '\n';

        for(var key in line.line){
            str = row[key];
            if(key == "re" || key == "limit"){
                str = setTimer(row["size"], key);
            }

            format += line.line[key]["name"] + '\n';
            format += str + '\n'; 
        }
      format += '\n';
    }

    logger(format);
    return format;
}

 /*
 TL;DR Trelloの指定ボードのListの特定IDを取得する
 
 @param {string} pos 欲しいListのボード内での位置
 @return {string} id 欲しいListId
 */
function getListId(pos) {
    const headers = {
        "content-type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      };

    const params = {
        method: "get",
        headers,
        muteHttpExceptions: true,
    };

    json = UrlFetchApp.fetch(LIST_URL, params);
    res = JSON.parse(json);
    for(var line in res){
console.log(pos, line, res[line], line === pos);
        if(line === pos) {
            return res[line]["id"];
        }
    }
  
    return "";
}

 /*
 TL;DR Trelloのクエストボードへクエストとして登録する
 
 @param {string} list_id 登録先ListID
 @param {string} tldr クエスト概要
 @param {string} card クエスト情報
 @param {string} due クエスト期限日
 @return {boolean} res trelloへのcard作成が成否したか
 */
function createQuest(list_id, tldr, card, due) {
    const headers = {
        "content-type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      };

    var payload = {
        'key': API_KEY,
        'token': API_TOKEN,
        'idList': list_id,
        'name': tldr,
        'desc': card,
        'due': "",
    };

    if(due !== "undefined") {
        payload.due = due;    // カードの締切日
    }

    const params = {
        method: "post",
        headers,
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
    };

    res = UrlFetchApp.fetch(CARD_URL, params);
    console.log("Response from views.open:", res.getContentText());
}

/*
 TL;DR 登録済みの行を削除する
 
 @return {boolean} res trelloへのcard作成が成否したか
*/
function deleteRows() {
  spreadsheet.deleteRows(2,100)
}