/* Toggl APIにアクセスするための各種エンドポイント *************************************************************/
/****
    @func:
        @request togglへリクエストを送信し、返り値をjson.parseした結果を返す
            @param {string, array}
                path: リクエスト先のエンドポイントのパス
                options: リクエストヘッダー
            @return {string} リクエスト結果のjson形式のstring
        @post togglの指定エンドポイントへPOST送信し、返り値をjson.parseした結果を返す
            @param {string} リクエスト先のエンドポイントのパス
            @return {string} リクエスト結果のjson形式のstring
        @get togglの指定エンドポイントへGET送信し、返り値をjson.parseした結果を返す
            @param {string} リクエスト先のエンドポイントのパス
            @return {array} リクエスト結果のjsonをparseしたもの
        @Users togglのuserエンドポイントへGET送信し、ユーザー情報を取得する
            @param -
            @return {array} ユーザーに紐づく一覧情報
        @Project 所定のproject情報を取得する
            @param {string} project id
            @return {array} プロジェクト情報一覧
****/
var Toggl = {
    BASIC_AUTH: TOGGL_TOKEN + ':api_token',
    URL: 'https://www.toggl.com/api/v8',
  
    request: function(path, options){
      var url = this.URL + path;
      var response = UrlFetchApp.fetch(url, options);
  
      return JSON.parse(response);
    },
    post: function(path){
      var options = {
        'method' : 'post',
        'headers': {"Authorization" : "Basic " + Utilities.base64Encode(this.BASIC_AUTH)}
      }
      
      return this.request(path, options);
    },
    get: function(path){
      var options = {
        'method' : 'get',
        'headers': {"Authorization" : "Basic " + Utilities.base64Encode(this.BASIC_AUTH)}
      }
  
      return this.request(path, options);
    },
    Users: function(){
      var path = '/me?with_related_data=true';
      return this.get(path)
    },
    Project: function(id) {
      var path = '/projects/' + id
      return this.get(path);
    },
  }
  