/* **************************************************
# TL;DR
Spreadsheetの内容を加工して返す

# システム設計

************************************************** */

// APIのentrypoint
function doGET(e) {
    logger("start");

    var data = getRows();
    var messages = Array();
    for(i in data) {
        var str = convert(data[i], KEYS);
//        card = templater(str);
        messages.push(str)
    }

    logger("end");
    return createNews(messages);
}