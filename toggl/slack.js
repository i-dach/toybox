/* Slackへの挙動を司る定義 *************************************************************/
/****
    @func:
        post -> 引数で受け取った情報をSlackへ投稿する
            @param: 
                info -> Toggl APIから取得したユーザー情報
                mess -> 投稿テキスト(タスク一覧文字列)
            @return: 
                res -> Slackからのリクエスト成否
****/
var Slack = {
    post: function(payload){
      var options = {
        'method': 'POST',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
      }
  
      var res = UrlFetchApp.fetch(WEBHOOKURL, options);
      return res;
    },
  }
