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
import { QinBody, QinSoul } from "qinpel-res";

class DropRun extends QinColumn {
  private _qinExplorer = new QinFileView();

  private _qinUp = new QinButton({ icon: new QinIcon(QinAsset.FaceArrowUp) });
  private _qinFolder = new QinString();
  private _qinDrop = new QinButton({ icon: new QinIcon(QinAsset.FaceArrowDown) });
  private _qinFind = new QinLine({ items: [this._qinUp, this._qinFolder, this._qinDrop] });

  private _qinCommands = new QinCombo();
  private _qinParameters = new QinString();
  private _qinWildcard = new QinButton({ icon: new QinIcon(QinAsset.FaceCog) });
  private _qinMount = new QinLine({
    items: [this._qinCommands, this._qinParameters, this._qinWildcard],
  });

  private _qinTokens = new QinCombo();
  private _qinAsk = new QinButton({ icon: new QinIcon(QinAsset.FaceEye) });
  private _qinRunning = new QinLine({ items: [this._qinTokens, this._qinAsk] });

  public constructor() {
    super();
    this.initExplorer();
    this.initFind();
    this.initMount();
    this.initRunning();
  }

  private initRunning() {
    this._qinRunning.install(this);
    this._qinTokens.style.putAsFlexMax();
  }

  private initExplorer() {
    this._qinExplorer.install(this);
    this._qinExplorer.style.putAsFlexMax();
  }

  private initFind() {
    this._qinFind.install(this);
    this._qinUp.addActionMain((_) => {
      this._qinExplorer.goFolderUp((folder) => {
        this._qinFolder.value = folder;
      });
    });
    this._qinFolder.style.putAsFlexMax();
    this._qinFolder.addAction((qinEvent) => {
      if (qinEvent.isEnter) {
        this.loadExplorer();
      }
    });
    this._qinDrop.addActionMain((_) => {
      this.dropSelectedAndRun();
    });
  }

  private initMount() {
    this._qinMount.install(this);
    this.loadCmds();
    this._qinParameters.style.putAsFlexMax();
    this._qinWildcard.addActionMain((_) => {
      this._qinParameters.insertAtCursor("%FILE%");
    });
  }

  private loadCmds() {
    this.qinpel.talk
      .get("/list/cmds")
      .then((res) => {
        let cmds = QinSoul.body.getTextLines(res.data);
        for (const cmd of cmds) {
          this._qinCommands.addItem({ title: cmd, value: cmd });
        }
      })
      .catch((err) => {
        this.qinpel.jobbed.statusError(err, "{droprun-qap}(ErrCode-000001)");
      });
  }

  public loadExplorer() {
    this._qinExplorer.load(this._qinFolder.value, (serverFolder) => {
      this._qinFolder.value = serverFolder;
    });
  }

  public dropSelectedAndRun() {
    const exec = this._qinCommands.value;
    const parameters = QinBody.parseParameters(this._qinParameters.value);
    console.log("parameters", parameters);
    const all_selected = this._qinExplorer.value;
    for (const selected of all_selected) {
      let display = exec;
      let args = [];
      for (let parameter of parameters) {
        let prepared = parameter.replace(/%FILE%/g, selected);
        display += ' "' + prepared + '"';
        args.push(prepared);
      }
      this.qinpel.talk
        .post("/cmd/run", { exec, args })
        .then((res) => {
          this._qinTokens.addItem({ value: res.data, title: display, selected: true });
        })
        .catch((err) => {
          this.qinpel.jobbed.statusError(err, "{droprun}(ErrCode-000001)");
        });
    }
  }
}

const mainApp = new DropRun();
mainApp.style.putAsBody();
mainApp.loadExplorer();
