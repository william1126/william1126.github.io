var data = ['吃吐吧', '雪球咖啡', '麥味登', '安好食', '全家', '小木屋鬆餅', '活大', '女九','摩斯漢堡','7-ELEVEN','豬ㄟ早餐店'],
timer = null, //定時器
flag = 0; //用於鍵盤事件狀態標記
// 開始抽獎
function playFun() {
var title = document.getElementById('title');
var play = document.getElementById('play');
//每次都先清除上一次的定時器任務，避免抽獎效果累加頻率會越來越快
clearInterval(timer);
timer = setInterval(function() {
var random = Math.floor(Math.random() * data.length);
title.innerHTML = data[random];
}, 50);
play.style.background = '#999';
}
//停止抽獎
function stopFun() {
clearInterval(timer);
var play = document.getElementById('play');
play.style.background = '#036';
}




