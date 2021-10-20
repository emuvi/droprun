(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"qinpel-cps/all":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
var explorer_1 = require("./src/explorer");
Object.defineProperty(exports, "Explorer", { enumerable: true, get: function () { return explorer_1.Explorer; } });

},{"./src/explorer":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    applyOnDivBody: function (divBody) {
        divBody.style.padding = "3px";
        divBody.style.overflow = "scroll";
    },
    applyOnDivItem: function (divItem) {
        divItem.style.display = "inline-block";
        divItem.style.padding = "9px";
        divItem.style.margin = "1px";
        divItem.style.borderRadius = "2px";
    },
    applyOnDivItemBody: function (divItemBody) {
        divItemBody.style.display = "flex";
        divItemBody.style.flexDirection = "column";
        divItemBody.style.cursor = "pointer";
        divItemBody.style.width = "84px";
    },
    applyOnSpanIcon: function (spanIcon) {
        spanIcon.style.textAlign = "center";
    },
    applyOnSpanText: function (spanText) {
        spanText.style.textAlign = "center";
        spanText.style.wordWrap = "break-word";
    },
    applyOnDivSelect: function (divItem) {
        divItem.style.backgroundColor = "rgba(108, 0, 255, 0.3)";
    },
    applyOnDivUnSelect: function (divItem) {
        divItem.style.backgroundColor = "initial";
    }
};

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
var qinpel = window.frameElement.qinpel;
var explorer_styles_1 = require("./explorer-styles");
var appsExtensions = ["htm", "html", "css", "js", "jsx", "ts", "tsx"];
var cmdsExtensions = [
    "h", "c", "hpp", "cpp", "rs", "jl",
    "cs", "csproj", "fs", "ml", "fsi", "mli", "fsx", "fsscript",
    "java", "gy", "gvy", "groovy", "sc", "scala", "clj",
    "py", "ruby", "php", "phtml",
];
var execExtensions = ["exe", "jar", "com", "bat", "sh"];
var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
var movieExtensions = ["avi", "mp4"];
var musicExtensions = ["wav", "mp3"];
var zippedExtensions = ["zip", "rar", "7z", "tar", "gz"];
var Explorer = (function () {
    function Explorer() {
        this.divBody = document.createElement("div");
        this.actualFolder = "";
        this.serverFolder = "";
        this.initBody();
    }
    Explorer.prototype.initBody = function () {
        explorer_styles_1.default.applyOnDivBody(this.divBody);
        qinpel.util.disableSelection(this.divBody);
    };
    Explorer.prototype.install = function (parent) {
        parent.appendChild(this.divBody);
    };
    Explorer.prototype.getActualFolder = function () {
        return this.actualFolder;
    };
    Explorer.prototype.getServerFolder = function () {
        return this.serverFolder;
    };
    Explorer.prototype.load = function (folder, callBack) {
        var _this = this;
        this.clean();
        qinpel.post("/dir/list", { path: folder })
            .then(function (res) {
            _this.actualFolder = folder;
            for (var _i = 0, _a = qinpel.util.getTextLines(res.data); _i < _a.length; _i++) {
                var line = _a[_i];
                var lineValue = line.substring(3);
                if (!lineValue) {
                    continue;
                }
                if (line.indexOf("P: ") === 0) {
                    _this.serverFolder = lineValue;
                    if (callBack) {
                        callBack(lineValue);
                    }
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
            _this.divBody.innerText = qinpel.util.getErrorMessage(err);
        });
    };
    Explorer.prototype.clean = function () {
        this.divBody.innerHTML = "";
    };
    Explorer.prototype.newDir = function (name) {
        this.newItem(name, "explorer-dir.png");
    };
    Explorer.prototype.newFile = function (name) {
        this.newItem(name, getIconName());
        function getIconName() {
            var extension = qinpel.util.getFileExtension(name);
            if (appsExtensions.indexOf(extension) > -1) {
                return "explorer-apps.png";
            }
            else if (cmdsExtensions.indexOf(extension) > -1) {
                return "explorer-cmds.png";
            }
            else if (execExtensions.indexOf(extension) > -1) {
                return "explorer-exec.png";
            }
            else if (imageExtensions.indexOf(extension) > -1) {
                return "explorer-image.png";
            }
            else if (movieExtensions.indexOf(extension) > -1) {
                return "explorer-movie.png";
            }
            else if (musicExtensions.indexOf(extension) > -1) {
                return "explorer-music.png";
            }
            else if (zippedExtensions.indexOf(extension) > -1) {
                return "explorer-zipped.png";
            }
            else {
                return "explorer-file.png";
            }
        }
    };
    Explorer.prototype.newItem = function (name, icon) {
        var divItem = document.createElement("div");
        explorer_styles_1.default.applyOnDivItem(divItem);
        this.divBody.appendChild(divItem);
        var divItemBody = document.createElement("div");
        explorer_styles_1.default.applyOnDivItemBody(divItemBody);
        divItem.appendChild(divItemBody);
        var spanIcon = document.createElement("span");
        explorer_styles_1.default.applyOnSpanIcon(spanIcon);
        divItemBody.appendChild(spanIcon);
        var imgIcon = document.createElement("img");
        imgIcon.src = "/run/app/qinpel-app/assets/" + icon;
        spanIcon.appendChild(imgIcon);
        var spanText = document.createElement("span");
        explorer_styles_1.default.applyOnSpanText(spanText);
        spanText.innerText = name;
        divItemBody.appendChild(spanText);
        var selected = false;
        qinpel.util.addAction(divItem, function () {
            if (!selected) {
                explorer_styles_1.default.applyOnDivSelect(divItem);
                selected = true;
            }
            else {
                explorer_styles_1.default.applyOnDivUnSelect(divItem);
                selected = false;
            }
        });
    };
    return Explorer;
}());
exports.Explorer = Explorer;

},{"./explorer-styles":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL2V2ZXJ0L0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9pbmRleC5qcyIsIi4uL3FpbnBlbC1jcHMvYWxsLmpzIiwiLi4vcWlucGVsLWNwcy9zcmMvZXhwbG9yZXItc3R5bGVzLmpzIiwiLi4vcWlucGVsLWNwcy9zcmMvZXhwbG9yZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHFpbnBlbCA9IHdpbmRvdy5mcmFtZUVsZW1lbnQucWlucGVsO1xyXG52YXIgYWxsXzEgPSByZXF1aXJlKFwicWlucGVsLWNwcy9hbGxcIik7XHJcbnZhciBEcm9wUnVuID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERyb3BSdW4oKSB7XHJcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdERpcnMoKTtcclxuICAgICAgICB0aGlzLmluaXRBY3RzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q21kcygpO1xyXG4gICAgfVxyXG4gICAgRHJvcFJ1bi5wcm90b3R5cGUuaW5pdEJvZHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXZEaXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaXZEaXJzXCIpO1xyXG4gICAgICAgIHRoaXMuZGl2QWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGl2QWN0c1wiKTtcclxuICAgICAgICB0aGlzLmRpdkNtZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpdkNtZHNcIik7XHJcbiAgICB9O1xyXG4gICAgRHJvcFJ1bi5wcm90b3R5cGUuaW5pdERpcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5leHBsb3JlciA9IG5ldyBhbGxfMS5FeHBsb3JlcigpO1xyXG4gICAgICAgIHRoaXMuZXhwbG9yZXIuaW5zdGFsbCh0aGlzLmRpdkRpcnMpO1xyXG4gICAgfTtcclxuICAgIERyb3BSdW4ucHJvdG90eXBlLmluaXRBY3RzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5idXR0b25VcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgdGhpcy5idXR0b25VcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgdGhpcy5idXR0b25VcEltZy5zcmMgPSBcIi4vYXNzZXRzL3VwLnBuZ1wiO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uVXAuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25VcEltZyk7XHJcbiAgICAgICAgdGhpcy5kaXZBY3RzLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uVXApO1xyXG4gICAgICAgIHRoaXMuaW5wdXRQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRQYXRoLnZhbHVlID0gXCIuXCI7XHJcbiAgICAgICAgcWlucGVsLnV0aWwuYWRkS2V5QWN0aW9uKHRoaXMuaW5wdXRQYXRoLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmxvYWRFeHBsb3JlcigpO1xyXG4gICAgICAgICAgICBxaW5wZWwuZnJhbWUuc3RhdHVzSW5mbyhfdGhpcy5pbnB1dFBhdGgudmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGl2QWN0cy5hcHBlbmRDaGlsZCh0aGlzLmlucHV0UGF0aCk7XHJcbiAgICAgICAgdGhpcy5idXR0b25Ecm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLmJ1dHRvbkRyb3BJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uRHJvcEltZy5zcmMgPSBcIi4vYXNzZXRzL2Ryb3AucG5nXCI7XHJcbiAgICAgICAgdGhpcy5idXR0b25Ecm9wLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRHJvcEltZyk7XHJcbiAgICAgICAgdGhpcy5kaXZBY3RzLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRHJvcCk7XHJcbiAgICB9O1xyXG4gICAgRHJvcFJ1bi5wcm90b3R5cGUuaW5pdENtZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXZDbWRSdW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuZGl2Q21kUnVuLmlkID0gXCJkaXZDbWRSdW5cIjtcclxuICAgICAgICB0aGlzLmRpdkNtZHMuYXBwZW5kQ2hpbGQodGhpcy5kaXZDbWRSdW4pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0Q21kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgICB0aGlzLmRpdkNtZFJ1bi5hcHBlbmRDaGlsZCh0aGlzLnNlbGVjdENtZCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dENtZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICB0aGlzLmRpdkNtZFJ1bi5hcHBlbmRDaGlsZCh0aGlzLmlucHV0Q21kKTtcclxuICAgICAgICB0aGlzLmRpdkNtZEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5kaXZDbWRCYXIuaWQgPSBcImRpdkNtZEJhclwiO1xyXG4gICAgICAgIHRoaXMuZGl2Q21kcy5hcHBlbmRDaGlsZCh0aGlzLmRpdkNtZEJhcik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgIHRoaXMuZGl2Q21kQmFyLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0QmFyKTtcclxuICAgICAgICB0aGlzLmxvYWRDbWRzKCk7XHJcbiAgICB9O1xyXG4gICAgRHJvcFJ1bi5wcm90b3R5cGUubG9hZENtZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcWlucGVsLmdldChcIi9saXN0L2NtZFwiKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcWlucGVsLmZyYW1lLnN0YXR1c0Vycm9yKGVyciwgXCIoRXJyQ29kZS0wMDAwMDEpXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIERyb3BSdW4ucHJvdG90eXBlLmxvYWRFeHBsb3JlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZXhwbG9yZXIubG9hZCh0aGlzLmlucHV0UGF0aC52YWx1ZSwgZnVuY3Rpb24gKHNlcnZlckZvbGRlcikge1xyXG4gICAgICAgICAgICBfdGhpcy5pbnB1dFBhdGgudmFsdWUgPSBzZXJ2ZXJGb2xkZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERyb3BSdW47XHJcbn0oKSk7XHJcbnZhciBkcm9wUnVuID0gbmV3IERyb3BSdW4oKTtcclxuZHJvcFJ1bi5sb2FkRXhwbG9yZXIoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5FeHBsb3JlciA9IHZvaWQgMDtcclxudmFyIGV4cGxvcmVyXzEgPSByZXF1aXJlKFwiLi9zcmMvZXhwbG9yZXJcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkV4cGxvcmVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBleHBsb3Jlcl8xLkV4cGxvcmVyOyB9IH0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0ge1xyXG4gICAgYXBwbHlPbkRpdkJvZHk6IGZ1bmN0aW9uIChkaXZCb2R5KSB7XHJcbiAgICAgICAgZGl2Qm9keS5zdHlsZS5wYWRkaW5nID0gXCIzcHhcIjtcclxuICAgICAgICBkaXZCb2R5LnN0eWxlLm92ZXJmbG93ID0gXCJzY3JvbGxcIjtcclxuICAgIH0sXHJcbiAgICBhcHBseU9uRGl2SXRlbTogZnVuY3Rpb24gKGRpdkl0ZW0pIHtcclxuICAgICAgICBkaXZJdGVtLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xyXG4gICAgICAgIGRpdkl0ZW0uc3R5bGUucGFkZGluZyA9IFwiOXB4XCI7XHJcbiAgICAgICAgZGl2SXRlbS5zdHlsZS5tYXJnaW4gPSBcIjFweFwiO1xyXG4gICAgICAgIGRpdkl0ZW0uc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIycHhcIjtcclxuICAgIH0sXHJcbiAgICBhcHBseU9uRGl2SXRlbUJvZHk6IGZ1bmN0aW9uIChkaXZJdGVtQm9keSkge1xyXG4gICAgICAgIGRpdkl0ZW1Cb2R5LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICBkaXZJdGVtQm9keS5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW5cIjtcclxuICAgICAgICBkaXZJdGVtQm9keS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICBkaXZJdGVtQm9keS5zdHlsZS53aWR0aCA9IFwiODRweFwiO1xyXG4gICAgfSxcclxuICAgIGFwcGx5T25TcGFuSWNvbjogZnVuY3Rpb24gKHNwYW5JY29uKSB7XHJcbiAgICAgICAgc3Bhbkljb24uc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgIH0sXHJcbiAgICBhcHBseU9uU3BhblRleHQ6IGZ1bmN0aW9uIChzcGFuVGV4dCkge1xyXG4gICAgICAgIHNwYW5UZXh0LnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgc3BhblRleHQuc3R5bGUud29yZFdyYXAgPSBcImJyZWFrLXdvcmRcIjtcclxuICAgIH0sXHJcbiAgICBhcHBseU9uRGl2U2VsZWN0OiBmdW5jdGlvbiAoZGl2SXRlbSkge1xyXG4gICAgICAgIGRpdkl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDEwOCwgMCwgMjU1LCAwLjMpXCI7XHJcbiAgICB9LFxyXG4gICAgYXBwbHlPbkRpdlVuU2VsZWN0OiBmdW5jdGlvbiAoZGl2SXRlbSkge1xyXG4gICAgICAgIGRpdkl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XHJcbiAgICB9XHJcbn07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4cGxvcmVyLXN0eWxlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkV4cGxvcmVyID0gdm9pZCAwO1xyXG52YXIgcWlucGVsID0gd2luZG93LmZyYW1lRWxlbWVudC5xaW5wZWw7XHJcbnZhciBleHBsb3Jlcl9zdHlsZXNfMSA9IHJlcXVpcmUoXCIuL2V4cGxvcmVyLXN0eWxlc1wiKTtcclxudmFyIGFwcHNFeHRlbnNpb25zID0gW1wiaHRtXCIsIFwiaHRtbFwiLCBcImNzc1wiLCBcImpzXCIsIFwianN4XCIsIFwidHNcIiwgXCJ0c3hcIl07XHJcbnZhciBjbWRzRXh0ZW5zaW9ucyA9IFtcclxuICAgIFwiaFwiLCBcImNcIiwgXCJocHBcIiwgXCJjcHBcIiwgXCJyc1wiLCBcImpsXCIsXHJcbiAgICBcImNzXCIsIFwiY3Nwcm9qXCIsIFwiZnNcIiwgXCJtbFwiLCBcImZzaVwiLCBcIm1saVwiLCBcImZzeFwiLCBcImZzc2NyaXB0XCIsXHJcbiAgICBcImphdmFcIiwgXCJneVwiLCBcImd2eVwiLCBcImdyb292eVwiLCBcInNjXCIsIFwic2NhbGFcIiwgXCJjbGpcIixcclxuICAgIFwicHlcIiwgXCJydWJ5XCIsIFwicGhwXCIsIFwicGh0bWxcIixcclxuXTtcclxudmFyIGV4ZWNFeHRlbnNpb25zID0gW1wiZXhlXCIsIFwiamFyXCIsIFwiY29tXCIsIFwiYmF0XCIsIFwic2hcIl07XHJcbnZhciBpbWFnZUV4dGVuc2lvbnMgPSBbXCJqcGdcIiwgXCJqcGVnXCIsIFwicG5nXCIsIFwiZ2lmXCIsIFwiYm1wXCJdO1xyXG52YXIgbW92aWVFeHRlbnNpb25zID0gW1wiYXZpXCIsIFwibXA0XCJdO1xyXG52YXIgbXVzaWNFeHRlbnNpb25zID0gW1wid2F2XCIsIFwibXAzXCJdO1xyXG52YXIgemlwcGVkRXh0ZW5zaW9ucyA9IFtcInppcFwiLCBcInJhclwiLCBcIjd6XCIsIFwidGFyXCIsIFwiZ3pcIl07XHJcbnZhciBFeHBsb3JlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBFeHBsb3JlcigpIHtcclxuICAgICAgICB0aGlzLmRpdkJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuYWN0dWFsRm9sZGVyID0gXCJcIjtcclxuICAgICAgICB0aGlzLnNlcnZlckZvbGRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xyXG4gICAgfVxyXG4gICAgRXhwbG9yZXIucHJvdG90eXBlLmluaXRCb2R5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGV4cGxvcmVyX3N0eWxlc18xLmRlZmF1bHQuYXBwbHlPbkRpdkJvZHkodGhpcy5kaXZCb2R5KTtcclxuICAgICAgICBxaW5wZWwudXRpbC5kaXNhYmxlU2VsZWN0aW9uKHRoaXMuZGl2Qm9keSk7XHJcbiAgICB9O1xyXG4gICAgRXhwbG9yZXIucHJvdG90eXBlLmluc3RhbGwgPSBmdW5jdGlvbiAocGFyZW50KSB7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZGl2Qm9keSk7XHJcbiAgICB9O1xyXG4gICAgRXhwbG9yZXIucHJvdG90eXBlLmdldEFjdHVhbEZvbGRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3R1YWxGb2xkZXI7XHJcbiAgICB9O1xyXG4gICAgRXhwbG9yZXIucHJvdG90eXBlLmdldFNlcnZlckZvbGRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXJ2ZXJGb2xkZXI7XHJcbiAgICB9O1xyXG4gICAgRXhwbG9yZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZm9sZGVyLCBjYWxsQmFjaykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jbGVhbigpO1xyXG4gICAgICAgIHFpbnBlbC5wb3N0KFwiL2Rpci9saXN0XCIsIHsgcGF0aDogZm9sZGVyIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgX3RoaXMuYWN0dWFsRm9sZGVyID0gZm9sZGVyO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gcWlucGVsLnV0aWwuZ2V0VGV4dExpbmVzKHJlcy5kYXRhKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBsaW5lID0gX2FbX2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmVWYWx1ZSA9IGxpbmUuc3Vic3RyaW5nKDMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsaW5lVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoXCJQOiBcIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXJ2ZXJGb2xkZXIgPSBsaW5lVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxCYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKGxpbmVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5pbmRleE9mKFwiRDogXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubmV3RGlyKGxpbmVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaW5lLmluZGV4T2YoXCJGOiBcIikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5uZXdGaWxlKGxpbmVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICBfdGhpcy5kaXZCb2R5LmlubmVyVGV4dCA9IHFpbnBlbC51dGlsLmdldEVycm9yTWVzc2FnZShlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEV4cGxvcmVyLnByb3RvdHlwZS5jbGVhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmRpdkJvZHkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH07XHJcbiAgICBFeHBsb3Jlci5wcm90b3R5cGUubmV3RGlyID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5ld0l0ZW0obmFtZSwgXCJleHBsb3Jlci1kaXIucG5nXCIpO1xyXG4gICAgfTtcclxuICAgIEV4cGxvcmVyLnByb3RvdHlwZS5uZXdGaWxlID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5ld0l0ZW0obmFtZSwgZ2V0SWNvbk5hbWUoKSk7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SWNvbk5hbWUoKSB7XHJcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBxaW5wZWwudXRpbC5nZXRGaWxlRXh0ZW5zaW9uKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoYXBwc0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImV4cGxvcmVyLWFwcHMucG5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY21kc0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImV4cGxvcmVyLWNtZHMucG5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZXhlY0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImV4cGxvcmVyLWV4ZWMucG5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW1hZ2VFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJleHBsb3Jlci1pbWFnZS5wbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChtb3ZpZUV4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImV4cGxvcmVyLW1vdmllLnBuZ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG11c2ljRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXhwbG9yZXItbXVzaWMucG5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoemlwcGVkRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXhwbG9yZXItemlwcGVkLnBuZ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXhwbG9yZXItZmlsZS5wbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBFeHBsb3Jlci5wcm90b3R5cGUubmV3SXRlbSA9IGZ1bmN0aW9uIChuYW1lLCBpY29uKSB7XHJcbiAgICAgICAgdmFyIGRpdkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGV4cGxvcmVyX3N0eWxlc18xLmRlZmF1bHQuYXBwbHlPbkRpdkl0ZW0oZGl2SXRlbSk7XHJcbiAgICAgICAgdGhpcy5kaXZCb2R5LmFwcGVuZENoaWxkKGRpdkl0ZW0pO1xyXG4gICAgICAgIHZhciBkaXZJdGVtQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZXhwbG9yZXJfc3R5bGVzXzEuZGVmYXVsdC5hcHBseU9uRGl2SXRlbUJvZHkoZGl2SXRlbUJvZHkpO1xyXG4gICAgICAgIGRpdkl0ZW0uYXBwZW5kQ2hpbGQoZGl2SXRlbUJvZHkpO1xyXG4gICAgICAgIHZhciBzcGFuSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGV4cGxvcmVyX3N0eWxlc18xLmRlZmF1bHQuYXBwbHlPblNwYW5JY29uKHNwYW5JY29uKTtcclxuICAgICAgICBkaXZJdGVtQm9keS5hcHBlbmRDaGlsZChzcGFuSWNvbik7XHJcbiAgICAgICAgdmFyIGltZ0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0ljb24uc3JjID0gXCIvcnVuL2FwcC9xaW5wZWwtYXBwL2Fzc2V0cy9cIiArIGljb247XHJcbiAgICAgICAgc3Bhbkljb24uYXBwZW5kQ2hpbGQoaW1nSWNvbik7XHJcbiAgICAgICAgdmFyIHNwYW5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgZXhwbG9yZXJfc3R5bGVzXzEuZGVmYXVsdC5hcHBseU9uU3BhblRleHQoc3BhblRleHQpO1xyXG4gICAgICAgIHNwYW5UZXh0LmlubmVyVGV4dCA9IG5hbWU7XHJcbiAgICAgICAgZGl2SXRlbUJvZHkuYXBwZW5kQ2hpbGQoc3BhblRleHQpO1xyXG4gICAgICAgIHZhciBzZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHFpbnBlbC51dGlsLmFkZEFjdGlvbihkaXZJdGVtLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGV4cGxvcmVyX3N0eWxlc18xLmRlZmF1bHQuYXBwbHlPbkRpdlNlbGVjdChkaXZJdGVtKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV4cGxvcmVyX3N0eWxlc18xLmRlZmF1bHQuYXBwbHlPbkRpdlVuU2VsZWN0KGRpdkl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFeHBsb3JlcjtcclxufSgpKTtcclxuZXhwb3J0cy5FeHBsb3JlciA9IEV4cGxvcmVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1leHBsb3Jlci5qcy5tYXAiXX0=
