var data1 = ['墨洋拉麵', 
            '順園小館', 
            '鍋in', 
            '大埔鐵板燒', 
            '小飯館兒', 
            '山嵐拉麵', 
            '力量拉麵', 
            '大家素食',
            '無鍋不樂',
            '大盛豬排',
            'Miss Energy',
            '麻辣巴蕾酸辣粉',
            'YU POKE',
            'JJ POKE',
            '鷹流東京豚骨拉麵-極匠',
            '12MINI經典即享鍋',
            '辛殿麻辣鍋',
            '赤神日式豬排',
            '戰醬燒肉',
            '貳樓餐廳',
            '十二巷拉麵',
            '壹之穴沾麵專門店',
            '源士林粥品 (台大店)',
            '叮叮食堂',
            '裸湯拉麵-雞白湯',
            '笑嘻嘻港式現炒飯麵',
            '憶馬當鮮',
            '池先生',
            '溏老鴨平價小火鍋',
            '七里亭',
            '好想吃冰',
            'NoName無名咖哩 台大店',
            '柒食貳','稻咖哩','台大小福','活大餐廳','台科大第一學生餐廳','麗陽商場-台科大第三學生餐廳',
            '男一快餐','女九自助餐'],
timer1 = null, //定時器
flag1 = 0; //用於鍵盤事件狀態標記
window.onload = function() {
var play1 = document.getElementById('play1'),
stop1 = document.getElementById('stop1');
// 開始抽獎
play1.onclick = playFun1;
stop1.onclick = stopFun1;
// 鍵盤事件
document.onkeyup = function(event1) {
event1 = event1 || window.event1;
if (event1.keyCode == 13) {
if (flag1 == 0) {
playFun1();
flag1 = 1;
} else {
stopFun1();
flag1 = 0;
}
}
}
}
// 開始抽獎
function playFun1() {
var title1 = document.getElementById('title1');
var play1 = document.getElementById('play1');
//每次都先清除上一次的定時器任務，避免抽獎效果累加頻率會越來越快
clearInterval(timer1);
timer1 = setInterval(function() {
var random1 = Math.floor(Math.random() * data1.length);
title1.innerHTML = data1[random1];
}, 50);
play1.style.background = '#999';
}
//停止抽獎
function stopFun1() {
clearInterval(timer1);
var play1 = document.getElementById('play1');
play1.style.background = '#036';
}