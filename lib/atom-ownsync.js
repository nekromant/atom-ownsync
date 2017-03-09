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
      description: "Path to place tarball. At the moment only absolute paths (TODO)"
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
    this.subscriptions = new CompositeDisposable();

    atom.config.observe('atom-ownsync',  this.core.loadSettings);

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-ownsync:show-tarball-info': () => this.core.showTarballInfo(),
      'atom-ownsync:create-config-package': () => this.core.createTarballPackage(),
      'atom-ownsync:install-config-package': () => this.core.installTarballPackage()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

};
