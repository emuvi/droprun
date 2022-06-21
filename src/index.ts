import {
  QinAsset,
  QinButton,
  QinColumn,
  QinCombo,
  QinFileView,
  QinIcon,
  QinLine,
  QinString,
} from "qinpel-cps";
import { QinSoul } from "qinpel-res";

class DropRun extends QinColumn {
  private qinExplorer = new QinFileView();

  private qinMiddle = new QinLine();
  private qinUp = new QinButton({ icon: new QinIcon(QinAsset.FaceArrowUp) });
  private qinFolder = new QinString();
  private qinDrop = new QinButton({ icon: new QinIcon(QinAsset.FaceArrowDown) });

  private qinBottom = new QinLine();
  private qinCommands = new QinCombo();
  private qinParameters = new QinString();
  private qinWildcard = new QinButton({ icon: new QinIcon(QinAsset.FaceCog) });

  public constructor() {
    super();
    this.qinExplorer.install(this);
    this.qinExplorer.style.putAsFlexMax();

    this.qinMiddle.install(this);
    this.qinUp.install(this.qinMiddle);
    this.qinUp.addActionMain((_) => {
      this.qinExplorer.goFolderUp((folder) => {
        this.qinFolder.value = folder;
      });
    });
    this.qinFolder.install(this.qinMiddle);
    this.qinFolder.style.putAsFlexMax();
    this.qinDrop.install(this.qinMiddle);
    this.qinDrop.addActionMain((_) => {
      this.dropSelectedAndRun();
    });
    this.qinFolder.addAction((qinEvent) => {
      if (qinEvent.isEnter) {
        this.loadExplorer();
      }
    });
    this.qinBottom.install(this);
    this.qinCommands.install(this.qinBottom);
    this.qinParameters.install(this.qinBottom);
    this.qinParameters.style.putAsFlexMax();
    this.qinWildcard.install(this.qinBottom);
    this.qinWildcard.addActionMain((_) => {
      this.qinParameters.insertAtCursor("$selected$");
    });
    this.loadCmds();
  }

  private loadCmds() {
    this.qinpel.talk
      .get("/list/cmds")
      .then((res) => {
        let cmds = QinSoul.body.getTextLines(res.data);
        for (const cmd of cmds) {
          this.qinCommands.addItem({ title: cmd, value: cmd });
        }
      })
      .catch((err) => {
        this.qinpel.jobbed.statusError(err, "{droprun-qap}(ErrCode-000001)");
      });
  }

  public loadExplorer() {
    this.qinExplorer.load(this.qinFolder.value, (serverFolder) => {
      this.qinFolder.value = serverFolder;
    });
  }

  public dropSelectedAndRun() {
    let command = this.qinCommands.value;
    let parameters = QinSoul.body.parseParameters(this.qinParameters.value);
    let selected = this.qinExplorer.value;
    for (const item of selected) {
      let item_params = [];
      for (const param of parameters) {
        item_params.push(param.replace("$selected$", item));
      }
      this.qinpel.talk
        .post("/run/cmd/" + command, {
          params: item_params,
          inputs: [],
        })
        .then((res) => {
          // [ TODO ]
        })
        .catch((err) => {
          // [ TODO ]
        });
    }
  }
}

const mainApp = new DropRun();
mainApp.style.putAsBody();
mainApp.loadExplorer();
