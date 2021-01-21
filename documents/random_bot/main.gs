/* 環境変数 -------------------------------------------------------------------------------------------------*/
var mode = "dev";       // ←モード切替用。dev: testチャンネル、 prod: 本番
var webhook_url = {
    "dev"   : "xxxxx",
    "prod"  : "xxxxx"
}
var offices = {
    "jitaku": {
        "name": "自宅",
        "spreadsheet": SpreadsheetApp.openById("xxx"),
        "floor": [
            {
                "name": "1F",
                "sheet": "自宅", 
                "capacity":4,
            },
        ],
        "event": {
            "trush": {"run": "Weekday", "num": 1}, 
            "vacuumu": {"run": 5, "num": 2},
        }
    },
}

/* Value function(値の計算、値の取得など) -----------------------------------------------------------------------------------------------*/
function mention(arg) {
    if(mode == "dev"){
        return "<@ "+ arg +"> ";
    }

    return "<@"+ arg +"> ";
}

function getRandomInt(max) {
    var rand = Math.floor(Math.random() * Math.floor(max))
    if(rand == 0) rand++; 
    return rand;
}

function getDayOfWeek() {
    var date = new Date()
    return date.getDay();
}

function getSomeone(spreadsheet, sheet_name, seats){
    var sheet = spreadsheet.getSheetByName(sheet_name);
    var num = getRandomInt(seats) + 1;
    var cell = sheet.getRange("A"+String(num));
    var val = cell.getValue();
    Logger.log("A"+String(num) + " :"+ val);

    if(val.length <= 0) {
      Logger.log("blank in A"+String(num));
      return getSomeone(spreadsheet, sheet_name, seats)
    }

    return val;
}

function isActiveDay(conditions) {
    var day = getDayOfWeek();

    if(conditions == "Weekday" || conditions == day){
        return true;
    }

    return false;
}


/* Event function(動作を司る関数) -------------------------------------------------------------------------------------------------*/
function postSlack(text){
    var url = webhook_url[mode];
    var options = {
        "method" : "POST",
        "headers": {"Content-type": "application/json"},
        "payload" : '{"text":"' + text + '"}'
    };
    UrlFetchApp.fetch(url, options);
}

// 担当者を指名する func
function nominate(spreadsheet, sheet, capacity, num, block_list){
    var parsons = Array();
    for(var i = 0; i < num; i++){
        parsons.push(getSomeone(spreadsheet, sheet, capacity));
    }

    if(block_list != undefined && block_list.length > 0) {
        for(var key in block_list) {
            for(var i = 0; i < num; i++){
                if(parsons[i] == block_list[key]) return nominate(spreadsheet, sheet, capacity, num, block_list);
            }        
        }    
    }

    return parsons;
}

function getMsg(type, str, args){
    var msg = str;

    switch(type){
        case "declare":
            msg = "今日の"+ args +"清掃当番を決めるよ！";
            msg += "呼ばれたらちゃんと :hand: とかでもいいから返事くらいしな！";
            msg += "\n居ないなら周りの人が代わりに返事しな！\n";
            msg += "\n/* ------------------------------------- */";
            break;
        case "againDeclare":
            msg = "なにさ！面倒くさいね！";
            msg += "\nしょうがないから代わりの清掃当番を決めるよ！";
            msg += "\n代わってもらった人はちゃんとお礼をしな！";
            msg += "\n/* ------------------------------------- */";
            break;
        case "done":
            msg += "\n/* ------------------------------------- */";
            msg += "\n\n分からないことは私に聞かないでマニュアルをみな！";
            msg += "\n```";
            msg += "\nゴミ捨て： xxxx";
            msg += "\nフロア清掃：　xxxx";
            msg += "\n```";
            msg += "\n\n\nさあ、掃除に励みな！";
            msg += "\n汚物は消毒よ！";
            msg += "\nhttp://genkibox.com/linepic/wp-content/uploads/2017/10/line0486.jpg"
            break;
        case "doneAgain":
            msg += "\n/* ------------------------------------- */";
            msg += "\n\nまったく、私も忙しいんだから後は自分たちでなんとかしな！";
            msg += "\n\n\n泣き言なんて聞きたかないね！さっさとおやり！";
            msg += "\nhttps://pbs.twimg.com/media/B08im8CCEAAuPxQ.jpg"
            break;
        case "target":
            msg += "\n\n`"+ args +"` の担当を呼ぶよ！";
            break;
        case "trush":
            msg += "\nゴミ捨ては";
            for(var id in args) {
                msg += mention(args[id]);
            }
            msg += "！";
            break;
        case "vacuumu":
            msg += "\nフロア清掃は";
            for(var id in args) {
                msg += mention(args[id]);
            }
            msg += "！";
            break;
        case "again":
            msg += "\n代わりは"+ mention(args) +"がやりな！　あんたには悪いけど頼むわね！";
            break;        
        default:
            msg = "呼んだかい！？";
    }

    return msg;
}

function againHandle(spreadsheet, floor, num){
    var msg = getMsg("againDeclare", "");
    parsons = nominate(spreadsheet, floor['sheet'], floor['capacity'], num);
    msg = getMsg("again", msg, parsons);
    msg = getMsg("doneAgain", msg);
    postSlack(msg);
}

function cleanHandle(office){
    var msg = getMsg("declare", "", office['name']);

    // フロアごとに担当を指名していく
    for(var key in office['floor']) {
        var block_list = Array();               // 選ばれしものたち
        floor = office['floor'][key];
        msg = getMsg("target", msg, floor['name']);
        
        // 掃除イベント別に担当を抽出する
        Object.keys(office['event']).forEach(function(key) {
            event = office['event'][key];

            // その掃除をやるべき日なのかを確認
            if(isActiveDay(event['run'])) {
                // eventで必要な人数を選ぶ
                parsons = nominate(office['spreadsheet'], floor['sheet'], floor['capacity'], event['num'], block_list);
                block_list.push(parsons)
                msg = getMsg(key, msg, parsons);
            }
        }); 
    }

    msg = getMsg("done", msg);
    postSlack(msg);
}


/* Handler function -------------------------------------------------------------------------------------------------*/
function againHandler(){
    againHandle(offices['jitaku']['spreadsheet'], offices['jitaku']['floor'][0], 1);
}

function cleanHandler(){
    cleanHandle(offices['jitaku']);
}
  
function test(){
    cleanHandle(offices['jitaku']);
}

// まとめて発砲
function main(e) {
    cleanHandler();
}
