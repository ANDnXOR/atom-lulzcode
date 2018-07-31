'use babel';

// import AtomLulzcodeView from './atom-lulzcode-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';
let toolBar;

exports.config = {
  serial_device: {
    type: 'string',
    default: '/dev/ttyUSB0'
  }
}

function upload_callback(data) {
  editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    path = editor.getPath();
    console.log('Path to file: ' + path);
    console.log('Serial Device: ' + atom.config.get('atom-lulzcode.serial_device'));
    console.log('This platform is ' + process.platform);

    command = 'sh';
    args = [
      atom.packages.resolvePackagePath("atom-lulzcode") + "/send.sh",
      atom.config.get('atom-lulzcode.serial_device'),
      path
    ];
    stdout = (output) => console.log(output);
    exit = (code) => console.log("YMODEM exited with #{code}");
    process = new BufferedProcess({command, args, stdout, exit});
  }
}

export default {
  activate() {
    require('atom-package-deps').install('atom-lulzcode');
  }
}

// export default {
//
//   atomLulzcodeView: null,
//   modalPanel: null,
//   subscriptions: null,
//
//   activate(state) {
//     this.atomLulzcodeView = new AtomLulzcodeView(state.atomLulzcodeViewState);
//     this.modalPanel = atom.workspace.addModalPanel({
//       item: this.atomLulzcodeView.getElement(),
//       visible: true
//     });
//
//     // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
//     this.subscriptions = new CompositeDisposable();
//
//     // Register command that toggles this view
//     this.subscriptions.add(atom.commands.add('atom-workspace', {
//       'atom-lulzcode:toggle': () => this.toggle()
//     }));
//   },
//
//   deactivate() {
//     this.modalPanel.destroy();
//     this.subscriptions.dispose();
//     this.atomLulzcodeView.destroy();
//   },
//
//   serialize() {
//     return {
//       atomLulzcodeViewState: this.atomLulzcodeView.serialize()
//     };
//   },
//
//   toggle() {
//     console.log('AtomLulzcode was toggled!');
//     return (
//       this.modalPanel.isVisible() ?
//       this.modalPanel.hide() :
//       this.modalPanel.show()
//     );
//   }
// };

export function consumeToolBar(getToolBar) {
  toolBar = getToolBar('atom-lulzcode');

  // Using custom icon set (Ionicons)
  const button = toolBar.addButton({
    icon: 'happy-outline',
    callback: upload_callback,
    tooltip: 'Upload',
    iconset: 'ion'
  });


  // Cleaning up when tool bar is deactivated
  toolBar.onDidDestroy(() => {
    this.toolBar = null;
    // Teardown any stateful code that depends on tool bar ...
  });
}

export function deactivate() {
  if (toolBar) {
    toolBar.removeItems();
    toolBar = null;
  }
}
