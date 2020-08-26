/***************************************************************
□ TL;DR
　Togglで計測した前日の活動記録を日報形式でSlackに投稿する
　ZACへの登録はとりあえず運用でカバー
***************************************************************/

const WEBHOOKURL = "xxxx";
const TOGGL_TOKEN = 'xxxx';

/* 外部APIとの連携用funcitnos *************************************************************/
// Slackへの挙動を司る定義
var Slack = {
  /****
    func: 引数で受け取った情報をSlackへ投稿する
 
    @param: 
     info -> Toggl APIから取得したユーザー情報
     mess -> 投稿テキスト(タスク一覧文字列)

    @return: 
     res -> Slackからのリクエスト成否
  ****/
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

// Toggl APIにアクセスするための各種エンドポイント
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
  Sessions: function(){
    var path = '/sessions';
    return this.post(path)
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

/* 加工用funcitnos *************************************************************/
var ToggltoSlack = {
  StandardDate: function(){
    var now = new Date();
    return this.FmtConvert(new Date(now.getFullYear(), now.getMonth(), now.getDate()-1), 'YYYY/MM/DD');
  },
  GetName: function(user){
    return user.data.fullname;
  },
  GetEntries: function(user){
    return user.data.time_entries;
  },
  GetTaskName: function(task){
    return task.description;
  },
  GetTaskDuration: function(task){    
    hour = Math.floor(task.duration/3600);
    min  = Math.floor(task.duration/60) - hour*60;
        
    return hour + '時間' + min + '分';
  },
  GetUserProjectsId: function(entries){
    var ids = new Array();
    for(let i=0; i< entries.length; i++) {
      if(ids.indexOf(entries[i].pid) < 0) {
        ids.push(entries[i].pid);
      }
    }
    
    return ids
  },
  GetProjectName: function(pid){
    return Toggl.Project(pid).data.name
  },
  GetUserProjects: function(entries){
    var ids = this.GetUserProjectsId(entries);
    var projects = [];

    for(let i=0; i< ids.length; i++) {
      if(ids[i] !== undefined){
        projects[ids[i]] = this.GetProjectName(ids[i]);
      }
    }

    return projects
  },
  GetTaskDate: function(entry){
    return entry.start.substr(0,10).split('-');
  },
  GetTaskDate: function(entry){
    return entry.start.substr(0,10).split('-');
  },
  FmtConvert: function(date, format){
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, date.getMonth() + 1);
    format = format.replace(/DD/, date.getDate());

    return format;
  },
  GetUserWorkDistinct: function(entries){
    var work = [];
    var standard = this.StandardDate();

    console.log("loop limit:", entries.length);

    // まずは出力したい日付だけに絞る
    for(let i=0; i< entries.length; i++) {    
      // タスクの実行日を取得して整形する
      var start_date = ToggltoSlack.GetTaskDate(entries[i]);
      start_date = new Date(start_date[0], start_date[1] - 1, start_date[2]);
      var work_date = this.FmtConvert(start_date, 'YYYY/MM/DD');

      if(work_date === standard) {
        if(work.indexOf(entries[i].pid) < 0){
          work.push(entries[i]);
        }
      }
    }

    console.log("second step:", work.length);
    var res = {};

    // つぎに同じPJでdurationをまとめ、タスクは子要素としてもつ
    for(let i=0; i< work.length; i++) {
        if(work[i].pid in res){
            res[work[i].pid].duration += work[i].duration;
            if(! work[i].description in res[work[i].pid].description){
              res[work[i].pid].description.push(work[i].description);
            }
            continue;
        } 

        res[work[i].pid] = {};
        res[work[i].pid].duration = work[i].duration;
        res[work[i].pid].description = [];
        res[work[i].pid].description.push(' - '+work[i].description);
    }

    return res;
  },
}

/*handler *************************************************************/
function handler() {
  // レポート対象ユーザー情報の取得
  var user = Toggl.Users();
  var entries = ToggltoSlack.GetEntries(user);
  var projects = ToggltoSlack.GetUserProjects(entries);　// リクエスト数多すぎでもエラーになるので対策として用意
  var work_list = ToggltoSlack.GetUserWorkDistinct(entries);

  var data = []; // Slackに投稿するためのタスクをストックする変数
  data.push(ToggltoSlack.GetName(user) + 'さんの日報');
  data.push('□ ' + ToggltoSlack.StandardDate() + '　やったこと');

  // タスク一覧を一つずつ配列にpush
  for (const key in work_list) {    

    // どこのprojectに属しているかを設定
    var prj = 'No Project';
    if(key !== undefined){
      prj = projects[key];
    }

    // 昨日のタスクだけpush（投稿イメージ：【プロジェクト名】タスク名　40分）
    data.push('▽' + prj + '  ' + ToggltoSlack.GetTaskDuration(work_list[key]) + '\n' + ToggltoSlack.GetTaskName(work_list[key]).join('\n - ')+ '\n');
    
  } 
    // Slackへ送信用
    var payload = {
        text: data.join('\n'),
    }
    console.log(payload);

    Slack.post(payload);
}

/*main *************************************************************/
function main(){
  var date = new Date(); 
  var day = date.getDay();
  
  // 火曜日から土曜日の間実行する
  if ( 1 < day && day < 7 ) {
      handler();
  }
}