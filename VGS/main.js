/* **************************************************
# TL;DR
Clientからの依頼をTrelloに登録する

# boardを切り替えたい時
下の記事参照
https://qiita.com/isseium/items/8eebac5b79ff6ed1a180
************************************************** */

// まとめて発砲
function main(e) {
    logger("start");

    var list_id = getListId(POS);
    var data = getRows();
    for(i in data) {
        var str = convert(data[i], KEYS);
        if(str.slackId != ""){
            card = templater(str);
            createQuest(list_id, str.tldr, card, str.due);
        }
    }

    deleteRows();
    logger("end");
}