import { Qinpel } from "qinpel-app/types/qinpel"

// @ts-ignore
const qinpel = window.frameElement.qinpel as Qinpel;

const appsExtensions = ["htm", "html", "css", "js", "ts"];
const cmdsExtensions = ["h", "c", "hpp", "cpp", "rs", "jl", "java", "py", "ruby"];
const execExtensions = ["exe", "jar", "com", "bat", "sh"];
const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
const movieExtensions = ["avi", "mp4"];
const musicExtensions = ["wav", "mp3"];
const zippedExtensions = ["zip", "rar", "7z", "tar", "gz"];

class DropRun {
    private divDirs: HTMLDivElement;
    private divActs: HTMLDivElement;
    private divCmds: HTMLDivElement;

    private buttonUp: HTMLButtonElement;
    private buttonUpImg: HTMLImageElement;
    private inputPath: HTMLInputElement;
    private buttonDrop: HTMLButtonElement;
    private buttonDropImg: HTMLImageElement;

    private divCmdRun: HTMLDivElement;
    private selectCmd: HTMLSelectElement;
    private inputCmd: HTMLInputElement;
    private divCmdBar: HTMLDivElement;
    private selectBar: HTMLSelectElement;

    public constructor() {
        this.initBody();
        this.initDirs();
        this.initActs();
        this.initCmds();
    }

    private initBody() {
        this.divDirs = document.getElementById("divDirs") as HTMLDivElement;
        this.divActs = document.getElementById("divActs") as HTMLDivElement;
        this.divCmds = document.getElementById("divCmds") as HTMLDivElement;
    }

    private initDirs() {
        qinpel.util.disableSelection(this.divDirs);
    }

    private initActs() {
        this.buttonUp = document.createElement("button");
        this.buttonUpImg = document.createElement("img");
        this.buttonUpImg.src = "./assets/up.png";
        this.buttonUp.appendChild(this.buttonUpImg);
        this.divActs.appendChild(this.buttonUp);

        this.inputPath = document.createElement("input");
        this.inputPath.value = ".";
        qinpel.util.addKeyAction(this.inputPath, () => {
            this.dirList();
            qinpel.frame.statusInfo(this.inputPath.value);
        });
        this.divActs.appendChild(this.inputPath);

        this.buttonDrop = document.createElement("button");
        this.buttonDropImg = document.createElement("img");
        this.buttonDropImg.src = "./assets/drop.png";
        this.buttonDrop.appendChild(this.buttonDropImg);
        this.divActs.appendChild(this.buttonDrop);
    }

    private initCmds() {
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
    }

    private loadCmds() {
        qinpel.get("/list/cmd")
            .then(res => {
                // TODO
            })
            .catch(err => {
                qinpel.frame.statusError(err, "(ErrCode-000001)");
            });
    }

    public dirList() {
        this.dirClean();
        this.dirLoad();
    }

    private dirClean() {
        this.divDirs.innerHTML = "";
    }

    private dirLoad() {
        qinpel.post("/dir/list", { path: this.inputPath.value })
            .then(res => {
                for (let line of qinpel.util.getTextLines(res.data)) {
                    let lineValue = line.substring(3);
                    if (!lineValue) {
                        continue;
                    }
                    if (line.indexOf("P: ") === 0) {
                        this.inputPath.value = lineValue;
                    } else if (line.indexOf("D: ") === 0) {
                        this.newDir(lineValue);
                    } else if (line.indexOf("F: ") === 0) {
                        this.newFile(lineValue);
                    }
                }
            })
            .catch(err => {
                this.divDirs.innerText = qinpel.util.getErrorMessage(err);
            });
    }

    private newDir(name) {
        this.dirNewItem(name, "dir.png");
    }

    private newFile(name) {
        this.dirNewItem(name, getIconName());

        function getIconName() {
            let extension = qinpel.util.getFileExtension(name);
            if (appsExtensions.indexOf(extension) > -1) {
                return "apps.png";
            } else if (cmdsExtensions.indexOf(extension) > -1) {
                return "cmds.png";
            } else if (execExtensions.indexOf(extension) > -1) {
                return "exec.png";
            } else if (imageExtensions.indexOf(extension) > -1) {
                return "image.png";
            } else if (movieExtensions.indexOf(extension) > -1) {
                return "movie.png";
            } else if (musicExtensions.indexOf(extension) > -1) {
                return "music.png";
            } else if (zippedExtensions.indexOf(extension) > -1) {
                return "zipped.png";
            } else {
                return "file.png";
            }
        }
    }

    private dirNewItem(name: string, icon: string) {
        const divItem = document.createElement("div");
        divItem.className = "divDirsItem";
        const divItemBody = document.createElement("div");
        divItemBody.className = "divDirsItemBody";
        divItem.appendChild(divItemBody);
        const spanIcon = document.createElement("span");
        spanIcon.className = "divDirsItemSpan";
        const imgIcon = document.createElement("img");
        imgIcon.src = "./assets/" + icon
        spanIcon.appendChild(imgIcon);
        divItemBody.appendChild(spanIcon);
        const spanText = document.createElement("span");
        spanText.className = "divDirsItemSpan";
        spanText.innerText = name;
        divItemBody.appendChild(spanText);
        this.divDirs.appendChild(divItem);
        qinpel.util.addAction(divItem, () => {
            if (divItem.classList.contains("divDirsItemSelected")) {
                divItem.classList.remove("divDirsItemSelected");
            } else {
                divItem.classList.add("divDirsItemSelected");
            }
        });
    }
}

const dropRun = new DropRun();
dropRun.dirList();
