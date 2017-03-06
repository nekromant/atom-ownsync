'use babel';

import { CompositeDisposable } from 'atom';
import AtomOwnSyncCore from './atom-ownsync-core';

export default {

  atomOwnsyncView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.core = new AtomOwnSyncCore('/home/necromant/nextCloud/configs');
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-ownsync:show-tarball-info': () => this.core.showTarballInfo(),
      'atom-ownsync:create-config-package': () => this.core.createTarballPackage(),
      'atom-ownsync:install-config-package': () => this.core.installTarballPackage()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  showInfo() {
    console.log(atom.getLoadSettings().atomHome);
  }

};
