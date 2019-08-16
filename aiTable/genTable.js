const fs = require('fs');

class GenTable {

    constructor() {
        this.AITable = {};
        this.AITableFeng = {};
        this.AITableJian = {};
        this.AITableDemo = {};
    }

    static Instance() {
        if (!GenTable.instance) {
            let instance = new GenTable();
            instance.init();
            GenTable.instance = instance;
        }
        return GenTable.instance;
    }

    init() {
        this.load();
    }

    load() {
        this._load('/tbl/majiang_ai_normal.txt', this.AITable);
        this._load('/tbl/majiang_ai_feng.txt', this.AITableFeng);
        this._load('/tbl/majiang_ai_jian.txt', this.AITableJian);
        //this._load('/tbl/majiang_ai_jian_demo.txt', this.AITableDemo);
    }

    _load(fileName, keyDic) {
        if (!fs.existsSync(__dirname + fileName)) {
            console.log(fileName, "文件不存在");
            return;
        }

        const fileDoc = fs.readFileSync(__dirname + fileName);
        const keyArray = String(fileDoc).split('\n');
        //console.log(keyArray);
        for (let i = 0; i < keyArray.length; i++) {
            var key = keyArray[i];
            if (key) {
                var childrenKeyArray = String(key).split(' ');
                if (childrenKeyArray.length == 3) {
                    var decKey = childrenKeyArray[0].replace(/[\r]/g, "");
                    var jiang = childrenKeyArray[1].replace(/[\r]/g, "");
                    var p = childrenKeyArray[2].replace(/[\r]/g, "");
                    var aiTableInfos = keyDic[decKey] ? keyDic[decKey] : [];
                    var aiTableInfo = {
                    jiang: jiang,
                    p: p
                    };
                    aiTableInfos.push(aiTableInfo);
                    keyDic[childrenKeyArray[0]] = aiTableInfos;
                }
            }
        }
    }
}

module.exports = GenTable;