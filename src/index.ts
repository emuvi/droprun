import { Qinpel } from "qinpel-app/types/qinpel"
// @ts-ignore
const qinpel = window.frameElement.qinpel as Qinpel;

import { Explorer } from "qinpel-cps/all"

class DropRun {
    private divDirs: HTMLDivElement;
    private divActs: HTMLDivElement;
    private divCmds: HTMLDivElement;

    private explorer: Explorer;

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
        this.explorer = new Explorer();
        this.explorer.install(this.divDirs);
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
            this.loadExplorer();
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

    public loadExplorer() {
        this.explorer.load(this.inputPath.value,
            (serverFolder) => {
                this.inputPath.value = serverFolder;
            });
    }
}

const dropRun = new DropRun();
dropRun.loadExplorer();
