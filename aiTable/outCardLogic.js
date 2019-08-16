const GenTable = require('./genTable');
const _ = require('lodash');
const cardConfig = require('./cardConfig');

const MaJiangDef = {
  MAX_NUM: 42,
};

/**
 * 查表法出牌
 */
class outCardLogic {
    constructor() {
        this.genTable = GenTable.Instance(); 
    };

    init(){
        return this;
    };

    outAI (originalCards, originalGuiCard) {
        var ret = 0;
        var originalRet = 0;
        var max = 0;
        var input = [];
        var guiCard = [];
      
        _.forEach(originalCards, function(e){  
          if (cardConfig[e]) {
            input.push(cardConfig[e].private_point);
          }
        });
        _.forEach(originalGuiCard, function(e){  
          if (cardConfig[e]) {
            guiCard.push(cardConfig[e].private_point);
          }
        });
      
        for (var i = 0; i < input.length; i++)
        {
          var c = input[i];
          var originalC = originalCards[i];
          // if (cache[c.toString()] == 0)
          // {
            if (!_.includes(guiCard, c))
            {
              var tmpInput = _.cloneDeep(input);
              tmpInput.splice(i, 1);
              var score = this.calc(tmpInput, guiCard);
              //return;
              if (score > max)
              {
                max = score;
                ret = c;
                originalRet = originalC;
              }
            }
          }
        //   cache[c] = 1;
        // }
      
        // 再转换原来的
        return originalRet;
    };
      
    calc (input, guiCard){
        var cards = [];
        for (var i = 0; i < MaJiangDef.MAX_NUM; i++)
        {
          cards.push(0);
        }
        for (var n = 0; n < input.length; n++) {
          let tmpC = input[n];
          cards[tmpC- 1] += 1;
        }

        var guiNum = 0;
        for (var m = 0; m < guiCard.length; m++) {
          let tmpD = guiCard[m];
          guiNum += cards[tmpD - 1];
          cards[tmpD - 1] = 0;
        }
        // List<Integer> ting = HuUtil.isTingCard(cards, guiNum);
        // if (!ting.isEmpty())
        // {
        //   return ting.size() * 10;
        // }
      
        var wanKey = 0;
        var tongKey = 0;
        var tiaoKey = 0;
        var fengKey = 0;
        var jianKey = 0;
      
        for (let i = cardConfig[31].private_point; i <= cardConfig[39].private_point; i++)
        {
          var num = cards[i - 1];
          wanKey = wanKey * 10 + num;
        }
        for (let i = cardConfig[51].private_point; i <= cardConfig[59].private_point; i++)
        {
          var num = cards[i - 1];
          tongKey = tongKey * 10 + num;
        }
        for (let i = cardConfig[41].private_point; i <= cardConfig[49].private_point; i++)
        {
          var num = cards[i - 1];
          tiaoKey = tiaoKey * 10 + num;
        }
        for (let i = cardConfig[21].private_point; i <= cardConfig[24].private_point; i++)
        {
          var num = cards[i - 1];
          fengKey = fengKey * 10 + num;
        }
        for (let i = cardConfig[11].private_point; i <= cardConfig[13].private_point; i++)
        {
          var num = cards[i - 1];
          jianKey = jianKey * 10 + num;
        }
        var tmp = [];
      
        var wanAITableInfo = this.genTable.AITable[wanKey.toString()];
        tmp.push(wanAITableInfo);
      
        var tongAITableInfo = this.genTable.AITable[tongKey.toString()];
        tmp.push(tongAITableInfo);
      
        var tiaoAITableInfo = this.genTable.AITable[tiaoKey.toString()];
        tmp.push(tiaoAITableInfo);
      
        var fengAITableInfo = this.genTable.AITableFeng[fengKey.toString()];
        tmp.push(fengAITableInfo);
      
        var jianAITableInfo = this.genTable.AITableJian[jianKey.toString()];
        tmp.push(jianAITableInfo);
        var ret = [];
        this.calcAITableInfo(ret, tmp, 0, false, 0);
        var d = _.max(ret);

        return d ? d.toString() : null;
    };
      
    calcAITableInfo (ret,  tmp,  index,  jiang, cur){
        if (index >= tmp.length)
        {
          if (jiang)
          {
            ret.push(cur);
          }
          return;
        }
        var aiTableInfos = tmp[index];
        if (!aiTableInfos) {
          return;
        }
      
        for (var i = 0; i < aiTableInfos.length; i++) {
          var aiTableInfo = aiTableInfos[i];
          //console.log("index:%j, i:%j, aiTableInfo:%j", index, i, aiTableInfo);
          if (jiang)
          {
            if (!!Number(aiTableInfo.jiang) == false)
            {
              this.calcAITableInfo(ret, tmp, index + 1, jiang, Number(cur) + Number(aiTableInfo.p));
            }
          }
          else
          {
            this.calcAITableInfo(ret, tmp, index + 1, !!Number(aiTableInfo.jiang), Number(cur) + Number(aiTableInfo.p));
          }
        }
    };
}
module.exports = outCardLogic;