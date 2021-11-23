import { QinAsset, QinButton, QinColumn, QinCombo, QinExplorer, QinIcon, QinLine, QinString } from "qinpel-cps"
import { QinEvent, QinSoul } from "qinpel-res";

class DropRun extends QinColumn {

    private qinExplorer = new QinExplorer();

    private qinMiddle = new QinLine();
    private qinUp = new QinButton(new QinIcon(QinAsset.FaceArrowUp));
    private qinFolder = new QinString(".");
    private qinDrop = new QinButton(new QinIcon(QinAsset.FaceArrowDown));

    private qinBottom = new QinLine();
    private qinCommands = new QinCombo();
    private qinParameters = new QinString();
    private qinWildcard = new QinButton(new QinIcon(QinAsset.FaceCog));

    public constructor() {
        super();
        this.qinExplorer.install(this);
        this.qinExplorer.putAsFlexMax();

        this.qinMiddle.install(this);
        this.qinUp.install(this.qinMiddle);
        this.qinUp.addAction(qinEvent => {
            if (qinEvent.isPrimary()) {
                this.qinExplorer.goFolderUp(folder => {
                    this.qinFolder.setData(folder);
                });
            }
        });
        this.qinFolder.install(this.qinMiddle);
        this.qinFolder.putAsFlexMax();
        this.qinDrop.install(this.qinMiddle);
        this.qinDrop.addAction(qinEvent => {
            if (qinEvent.isPrimary()) {
                this.dropSelectedAndRun();
            }
        });
        this.qinFolder.addAction(qinEvent => {
            if (qinEvent.isEnter) {
                this.loadExplorer();
            }
        });

        this.qinBottom.install(this);
        this.qinCommands.install(this.qinBottom);
        this.qinParameters.install(this.qinBottom);
        this.qinParameters.putAsFlexMax();
        this.qinWildcard.install(this.qinBottom);
        this.qinWildcard.addAction(qinEvent => {
            if (qinEvent.isPrimary()) {
                this.qinParameters.insertAtCursor("$selected$");
            }
        });

        this.loadCmds();
    }

    private loadCmds() {
        this.qinpel().get("/list/cmd")
            .then(res => {
                let cmds = QinSoul.body.getTextLines(res.data)
                for (const cmd of cmds) {
                    this.qinCommands.addOption(cmd, cmd);
                }
            })
            .catch(err => {
                this.qinpel().frame.statusError(err, "{droprun-qap}(ErrCode-000001)");
            });
    }

    public loadExplorer() {
        this.qinExplorer.load(this.qinFolder.getData(),
            (serverFolder) => {
                this.qinFolder.setData(serverFolder);
            });
    }

    public dropSelectedAndRun() {
        let command = this.qinCommands.getData();
        let parameters = QinSoul.body.parseParameters(this.qinParameters.getData());
        let selected = this.qinExplorer.getData();
        for (const item of selected) {
            let item_params = [];
            for (const param of parameters) {
                item_params.push(param.replace("$selected$", item));
            }
            this.qinpel().post("/run/cmd/" + command, {
                params: item_params,
                inputs: []
            })
                .then(res => {
                    // TODO
                })
                .catch(err => {
                    // TODO
                });
        }
    }


}

const mainApp = new DropRun();
mainApp.putAsBody();
mainApp.loadExplorer();
