const outCardLogic = require('./outCardLogic');

// 手牌
const cards = ['31' , '32', '33', '38', '38', '41', '45'];

// 选出一张最优牌
var outLogic = new outCardLogic();
var card = outLogic.outAI(cards);

console.log("card:%j", card);
