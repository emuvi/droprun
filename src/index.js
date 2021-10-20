"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qinpel = window.frameElement.qinpel;
var all_1 = require("qinpel-cps/all");
var DropRun = (function () {
    function DropRun() {
        this.initBody();
        this.initDirs();
        this.initActs();
        this.initCmds();
    }
    DropRun.prototype.initBody = function () {
        this.divDirs = document.getElementById("divDirs");
        this.divActs = document.getElementById("divActs");
        this.divCmds = document.getElementById("divCmds");
    };
    DropRun.prototype.initDirs = function () {
        this.explorer = new all_1.Explorer();
        this.explorer.install(this.divDirs);
    };
    DropRun.prototype.initActs = function () {
        var _this = this;
        this.buttonUp = document.createElement("button");
        this.buttonUpImg = document.createElement("img");
        this.buttonUpImg.src = "./assets/up.png";
        this.buttonUp.appendChild(this.buttonUpImg);
        this.divActs.appendChild(this.buttonUp);
        this.inputPath = document.createElement("input");
        this.inputPath.value = ".";
        qinpel.util.addKeyAction(this.inputPath, function () {
            _this.loadExplorer();
            qinpel.frame.statusInfo(_this.inputPath.value);
        });
        this.divActs.appendChild(this.inputPath);
        this.buttonDrop = document.createElement("button");
        this.buttonDropImg = document.createElement("img");
        this.buttonDropImg.src = "./assets/drop.png";
        this.buttonDrop.appendChild(this.buttonDropImg);
        this.divActs.appendChild(this.buttonDrop);
    };
    DropRun.prototype.initCmds = function () {
        this.divCmdRun = document.createElement("div");
        this.divCmdRun.id = "divCmdRun";
        this.divCmds.appendChild(this.divCmdRun);
        this.selectCmd = document.createElement("select");
        this.divCmdRun.appendChild(this.selectCmd);
        this.inputCmd = document.createElement("input");
        this.divCmdRun.appendChild(this.inputCmd);
        this.divCmdBar = document.createElement("div");
        this.divCmdBar.id = "divCmdBar";
        this.divCmds.appendChild(this.divCmdBar);
        this.selectBar = document.createElement("select");
        this.divCmdBar.appendChild(this.selectBar);
        this.loadCmds();
    };
    DropRun.prototype.loadCmds = function () {
        qinpel.get("/list/cmd")
            .then(function (res) {
        })
            .catch(function (err) {
            qinpel.frame.statusError(err, "(ErrCode-000001)");
        });
    };
    DropRun.prototype.loadExplorer = function () {
        var _this = this;
        this.explorer.load(this.inputPath.value, function (serverFolder) {
            _this.inputPath.value = serverFolder;
        });
    };
    return DropRun;
}());
var dropRun = new DropRun();
dropRun.loadExplorer();
//# sourceMappingURL=index.js.map