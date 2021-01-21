/* **************************************************
# TL;DR
Spreadsheetの内容を加工して返す

# システム設計

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
 TL;DR Spreadsheetから基本情報を取得する

 @return {string[][]} rows 指定された行に入力された情報
 */
function getRows() {
    list = spreadsheet
            .getSheetByName("news")
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
 TL;DR Newsメッセージを作る
 
 @param {string[][]} messages ニュース情報一覧
 @return {boolean} res GETメッセージ
 */
function createNews(messages) {
    // const headers = {
    //     "content-type": "application/json",
    //     "Authorization": `Bearer ${AUTH_TOKEN}`,
    //   };

    // var payload = {
    //     'key': API_KEY,
    //     'token': API_TOKEN,
    //     'idList': list_id,
    //     'name': tldr,
    //     'desc': card,
    //     'due': "",
    // };

    // const params = {
    //     method: "post",
    //     headers,
    //     payload: JSON.stringify(payload),
    //     muteHttpExceptions: true,
    // };

    // res = UrlFetchApp.fetch(CARD_URL, params);
    // console.log("Response from views.open:", res.getContentText());
    return JSON.stringify(messages)
}