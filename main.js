//現在のGroup格納用変数
var CurrentGrNo = 0;

//現在のKeyNo格納用変数
var GroupKeyNo = 0;

//削除メッセージKeyNo格納用変数
var erase_key_num = 0;

var category_name = ["仕事", "家事", "子供", "遊び", "Gs"];

//各Groupのkey(最後値)の格納用変数
var GroupKeyAry = [
/*{0,1,2],*/  /* GroupのKey(0〜n)    */
 0,           /* Group0のKey(0〜n)   */
 0,           /* Group1のKey(0〜n)   */
 0,           /* Group2のKey(0〜n)   */
 0,           /* Group3のKey(0〜n)   */
 0            /* Group4のKey(0〜n)   */
];

//各Groupのメッセージ文字列の格納用変数
var GroupValueAry = [
/*{"","",""],*/ /* GroupのKey(0〜n)に対応するValue    */
 [""],          /* Group0のKey(0〜n)に対応するValue   */
 [""],          /* Group1のKey(0〜n)に対応するValue   */
 [""],          /* Group2のKey(0〜n)に対応するValue   */
 [""],          /* Group3のKey(0〜n)に対応するValue   */
 [""]           /* Group4のKey(0〜n)に対応するValue   */
];

$('#group_select_no').html(createTimeSelctBox(0, category_name.length));       //グループNoの選択肢生成

//1.送信 クリックイベント
$('.submit_box').on("click", function () {
    // val()で値を取得する
    var value = $('#input_box_text').val();

    if( value!="" ){
        //console.log( CurrentGrNo );

        // 配列に保存する(※保存前に改行コードを<br>に変換)
        value = value.replace(/\r?\n/g, '<br>');
        GroupValueAry[CurrentGrNo][GroupKeyNo] = value;

        // KeyNoをインクリメント
        //parseInt(GroupKeyNo) += 1;
        GroupKeyNo = parseInt(GroupKeyNo) + 1;
        console.log( GroupKeyNo );
        GroupKeyAry[CurrentGrNo] = GroupKeyNo;

        //console.log( GroupKeyAry );
        //console.log( GroupValueAry ); 

        // データを保存する
        main_saveData();

        //データを書き出す
        main_writeData(value);

        //書き込まれている要素の高さが現状定義しているoutput_boxの高さを超えたら増加
        main_adjustMessageBox();

        //から文字を代入
        $('#input_box_text').val("");

        //console.log(GroupValueAry);
    }
  });

//2.終了 クリックイベント
$('.all_clear_box').on("click", function () {
    //削除する(output内のhtmlを削除)
    $('#message_box').empty();

    //配列を削除(文字列(GroupValueAry)と文字列の最後尾(GroupKeyAry)の両方)
    GroupValueAry[CurrentGrNo].splice(0,GroupValueAry[CurrentGrNo].length);
    GroupValueAry[CurrentGrNo][0] = "";
    GroupKeyAry[CurrentGrNo] = 0;
    GroupKeyNo = GroupKeyAry[CurrentGrNo];

    //localstorageを、一回、全クリア
    localStorage.clear();

    // localstorageを、加工したデータで保存し直す
    main_saveData();

    //メッセージボックス調整
    main_adjustMessageBox();

    //console.log( GroupKeyAry );
    //console.log( GroupValueAry ); 
});

//.初期化モーダル(OKボタン) クリックイベント
$('.initialize_confirm_box_ok').on("click", function () {
    $('#message_box').empty();
    localStorage.clear();

    for( var i=0; i<category_name.length; i++ ){
        GroupValueAry[i].splice(0,GroupValueAry[i].length);
        GroupValueAry[i][0] = "";
        GroupKeyAry[i] = 0;
        GroupKeyNo = GroupKeyAry[i];
    }
    category_name.splice(5,(category_name.length-5));
    CurrentGrNo = 0;

    // localstorageを、加工したデータで保存し直す
    main_saveData();

    main_reload();
    
    quitInitializeConfirmBox();
});

//.初期化モーダル(キャンセルボタン) クリックイベント
$('.initialize_confirm_box_ng, .close_initialize_confirm_box').on("click", function () {
    quitInitializeConfirmBox();
});

//2.初期化 クリックイベント
$('.initialize_btn').on("click", function () {

    $('.initialize_confirm_box').fadeIn(100);
    /*
    $('.top_board_box .container').css({
        'background-color':'rgba(0, 0, 0, 0.6)'
    });
    */

    /*
    $('#message_box').empty();
    localStorage.clear();

    for( var i=0; i<category_name.length; i++ ){
        GroupValueAry[i].splice(0,GroupValueAry[i].length);
        GroupValueAry[i][0] = "";
        GroupKeyAry[i] = 0;
        GroupKeyNo = GroupKeyAry[i];
    }
    category_name.splice(5,(category_name.length-5));
    CurrentGrNo = 0;

    // localstorageを、加工したデータで保存し直す
    main_saveData();

    main_reload();
    */
});

//.削除モーダル(OKボタン) クリックイベント
$('.erase_box_ok').on("click", function () {
    //配列から削除
    GroupValueAry[CurrentGrNo].splice(erase_key_num,1);
    //console.log(GroupValueAry);
    GroupKeyNo -= 1;
    GroupKeyAry[CurrentGrNo] = GroupKeyNo;

    //データを保存
    main_saveData();
    
    //データを全部書き出す
    $('#message_box').empty();
    main_reWriteData();

    //アウトプットボックスの再度調整
    main_adjustMessageBox();

    //erase_boxの終了
    quitEraseBox();
});

//.削除モーダル(キャンセルボタン) クリックイベント
$('.erase_box_ng, .close_erase_box').on("click", function () {
    quitEraseBox();
});

//3.リストメッセージクリックイベント(削除モーダルを表示)
$(document).on("dblclick",".each_message", function () {

    $('.erase_box').fadeIn(150);
    /*
    $('.main_board_box .container').css({
        'background-color':'rgba(0, 0, 0, 0.6)'
    });*/

    erase_key_num = $('.each_message').index(this);
});

//クリックイベント(会話開始ボタン)
$('.conversation_start_btn').on("click",function(){
    CurrentGrNo = $('#group_select_no').val();          //入力されたGroupNoの取得
    var diff_for_calc = parseInt(CurrentGrNo)+1;        //四則演算を行うと、CurrentGrNoが文字列化される？
    //console.log( CurrentGrNo );

    //配列がなかった場合に増設
    if( diff_for_calc>GroupKeyAry.length ){
        var diff = diff_for_calc-GroupKeyAry.length;
        console.log( diff );
        for( var i=0; i<diff; i++ ){
            GroupKeyAry.push([0]);
            GroupValueAry.push([""]);
        }
    }

    main_saveData();                                    //データのsave
});

//クリックイベント(登録ボタン)
$('.create_start_btn').on("click",function(){
    var new_name = $('#create_start_input_text').val();
    $('#create_start_input_text').val("");

    if( new_name != "" ){
        //配列増設
        GroupKeyAry[category_name.length] = 0;
        GroupValueAry[category_name.length] = [""];
        category_name[category_name.length] = new_name;

        //選択肢追加
        $('#group_select_no').html(createTimeSelctBox(0, category_name.length));

        //データ保存
        main_saveData();
    }
});

//?.リロード
main_reload();

//----------------------------------
//関数群
//----------------------------------
//erase_box終了関数
function quitEraseBox(){
    $('.erase_box').hide();
    $('.main_board_box .container').css({
        'background-color':'white'
    });

    erase_key_num = 0;
}

//initialize_confirm_box終了関数
function quitInitializeConfirmBox(){
    $('.initialize_confirm_box').hide();
    $('.top_board_box .container').css({
        'background-color':'white'
    });
}

//データの保存
function main_saveData(){
    //localStorage.setItem(GroupKeyAry[0], value);
    var json_GroupKeyAry = JSON.stringify(GroupKeyAry);            //この関数で文字列に変換
    //console.log(json_GroupKeyAry);
    localStorage.setItem("GroupKeyArray", json_GroupKeyAry);

    var json_GroupValueAry = JSON.stringify(GroupValueAry);        //この関数で文字列に変換
    //console.log(json_GroupValueAry);
    localStorage.setItem("GroupValueArray", json_GroupValueAry);

    var json_CurrentGrNo = JSON.stringify(CurrentGrNo);            //この関数で文字列に変換
    //console.log(json_CurrentGrNo);
    localStorage.setItem("CurrentGrNo", json_CurrentGrNo);

    var json_category_name = JSON.stringify(category_name);            //この関数で文字列に変換
    //console.log(json_CurrentGrNo);
    localStorage.setItem("category_name", json_category_name);
}

//データの書き出し
function main_writeData( value ){
    var mes = `<p class="each_message">
       ${value}
       </p>`
    $('#message_box').append(mes);
}

//データの全書き出し(localstageの保存データから全部読み込んで再度書き直します)
function main_reWriteData(){
    for (var i=0; i<GroupKeyAry[CurrentGrNo]; i++) {
        var value = GroupValueAry[CurrentGrNo][i];
        main_writeData(value);
    }
}

//メッセージボックス調整関数
function main_adjustMessageBox(){
    var total_height = $('#message_box').height();
    var output_box_height = $('.output_box').height();
    if( total_height>output_box_height ){
        $('.output_box').height(total_height+150);
    }
    else if( total_height==0 ){
        $('.output_box').height(400);
    }
 //   console.log("main_adjustMessageBox");
}

//リロード関数
function main_reload(){
    var loadGroupKeyArray = localStorage.getItem("GroupKeyArray");
    var checkGroupKeyAry = JSON.parse(loadGroupKeyArray);               //この関数で元のオブジェクトに戻す(※これはJS用)
    if( checkGroupKeyAry != null ){
        GroupKeyAry = checkGroupKeyAry;
    }
    console.log(GroupKeyAry);

    var loadGroupValueArray = localStorage.getItem("GroupValueArray");
    var checkGroupValueAry = JSON.parse(loadGroupValueArray);           //この関数で元のオブジェクトに戻す(※これはJS用)
    if( checkGroupValueAry != null ){
        GroupValueAry = checkGroupValueAry;
    }
    console.log(GroupValueAry);

    var loadCategory_name = localStorage.getItem("category_name");  
    var checkCategory_name = JSON.parse(loadCategory_name);                 //この関数で元のオブジェクトに戻す(※これはJS用)
    if( checkCategory_name != null ){
        category_name = checkCategory_name;
    }
    console.log(category_name);

    var loadCurrentGrNo = localStorage.getItem("CurrentGrNo");  
    var checkCurrentGrNo = JSON.parse(loadCurrentGrNo);                 //この関数で元のオブジェクトに戻す(※これはJS用)
    if( checkCurrentGrNo != null ){
        CurrentGrNo = checkCurrentGrNo;

        //タイトルの書き換え
        var new_name = category_name[CurrentGrNo];
        var mes = `<p>${new_name}</p>`
        $('.group_no_box').append(mes);
    }
    console.log(CurrentGrNo);

    if( (checkGroupKeyAry != null)
    &&  (checkGroupValueAry != null)
    &&  (checkCurrentGrNo != null)
    &&  (checkCategory_name != null) ){
        main_reWriteData();
        GroupKeyNo = GroupKeyAry[CurrentGrNo];
        main_adjustMessageBox();
    }
//    console.log("main_reload");

    //選択肢追加(追加したカテゴリを再表示する為)
    $('#group_select_no').html(createTimeSelctBox(0, category_name.length));
}

//selecboxの選択肢の生成
function createTimeSelctBox(start, end){                //SelectBox生成関数
    var num="";

    for(var i=start; i<end; i++){
        var new_name = category_name[i];
        num +=`<option value=${i}>${category_name[i]}</option>`;
    }
    return num;
}
