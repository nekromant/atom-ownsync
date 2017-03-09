'use babel';

import { CompositeDisposable } from 'atom';
import AtomOwnSyncCore from './atom-ownsync-core';

export default {

  atomOwnsyncView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    "tarballPath": {
      type: 'string',
      default: "/home/necromant/nextCloud/configs",
      description: "Path to place tarball. Either relative to atom's home dir or absolute"
    },
    "tarballName": {
      type: 'string',
      description: "Tarball archive name without any slashes",
      default: "atom-config.tgz"
    },
    "IgnoredFilesList": {
      type: 'array',
      description: "The files and directories inside the .atom directory to exclude from tarballs. You'd better keep defaults in place",
      default: [
            ".node-gyp",
            "blob-store",
            "compile-cache",
            "recovery",
            "projects.cson",
            "storage"
        ],
      items: {
        type: 'string'
      }
    }
  },

  activate(state) {

    this.core = new AtomOwnSyncCore();
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    atom.config.observe('atom-ownsync',  this.core.loadSettings);

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
