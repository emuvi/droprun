"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qinpel = window.frameElement.qinpel;
var appsExtensions = ["htm", "html", "css", "js", "ts"];
var cmdsExtensions = ["h", "c", "hpp", "cpp", "rs", "jl", "java", "py", "ruby"];
var execExtensions = ["exe", "jar", "com", "bat", "sh"];
var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
var movieExtensions = ["avi", "mp4"];
var musicExtensions = ["wav", "mp3"];
var zippedExtensions = ["zip", "rar", "7z", "tar", "gz"];
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
        qinpel.util.disableSelection(this.divDirs);
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
            _this.dirList();
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
    DropRun.prototype.dirList = function () {
        this.dirClean();
        this.dirLoad();
    };
    DropRun.prototype.dirClean = function () {
        this.divDirs.innerHTML = "";
    };
    DropRun.prototype.dirLoad = function () {
        var _this = this;
        qinpel.post("/dir/list", { path: this.inputPath.value })
            .then(function (res) {
            for (var _i = 0, _a = qinpel.util.getTextLines(res.data); _i < _a.length; _i++) {
                var line = _a[_i];
                var lineValue = line.substring(3);
                if (!lineValue) {
                    continue;
                }
                if (line.indexOf("P: ") === 0) {
                    _this.inputPath.value = lineValue;
                }
                else if (line.indexOf("D: ") === 0) {
                    _this.newDir(lineValue);
                }
                else if (line.indexOf("F: ") === 0) {
                    _this.newFile(lineValue);
                }
            }
        })
            .catch(function (err) {
            _this.divDirs.innerText = qinpel.util.getErrorMessage(err);
        });
    };
    DropRun.prototype.newDir = function (name) {
        this.dirNewItem(name, "dir.png");
    };
    DropRun.prototype.newFile = function (name) {
        this.dirNewItem(name, getIconName());
        function getIconName() {
            var extension = qinpel.util.getFileExtension(name);
            if (appsExtensions.indexOf(extension) > -1) {
                return "apps.png";
            }
            else if (cmdsExtensions.indexOf(extension) > -1) {
                return "cmds.png";
            }
            else if (execExtensions.indexOf(extension) > -1) {
                return "exec.png";
            }
            else if (imageExtensions.indexOf(extension) > -1) {
                return "image.png";
            }
            else if (movieExtensions.indexOf(extension) > -1) {
                return "movie.png";
            }
            else if (musicExtensions.indexOf(extension) > -1) {
                return "music.png";
            }
            else if (zippedExtensions.indexOf(extension) > -1) {
                return "zipped.png";
            }
            else {
                return "file.png";
            }
        }
    };
    DropRun.prototype.dirNewItem = function (name, icon) {
        var divItem = document.createElement("div");
        divItem.className = "divDirsItem";
        var divItemBody = document.createElement("div");
        divItemBody.className = "divDirsItemBody";
        divItem.appendChild(divItemBody);
        var spanIcon = document.createElement("span");
        spanIcon.className = "divDirsItemSpan";
        var imgIcon = document.createElement("img");
        imgIcon.src = "./assets/" + icon;
        spanIcon.appendChild(imgIcon);
        divItemBody.appendChild(spanIcon);
        var spanText = document.createElement("span");
        spanText.className = "divDirsItemSpan";
        spanText.innerText = name;
        divItemBody.appendChild(spanText);
        this.divDirs.appendChild(divItem);
        qinpel.util.addAction(divItem, function () {
            if (divItem.classList.contains("divDirsItemSelected")) {
                divItem.classList.remove("divDirsItemSelected");
            }
            else {
                divItem.classList.add("divDirsItemSelected");
            }
        });
    };
    return DropRun;
}());
var dropRun = new DropRun();
dropRun.dirList();
//# sourceMappingURL=index.js.map