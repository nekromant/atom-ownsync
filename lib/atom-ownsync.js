'use babel';

/*
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details.
 */

import {
    CompositeDisposable
} from 'atom';

import AtomOwnSyncCore from './atom-ownsync-core';

export default {

    atomOwnsyncView: null,
    modalPanel: null,
    subscriptions: null,

    config: {
        "tarballPath": {
            type: 'string',
            default: "/home/necromant/nextCloud/configs",
            description: "Path to place tarball. The path should be absolute. This setting will NOT be synchronized between machines.",
            order: 1
        },
        "tarballName": {
            type: 'string',
            description: "Tarball archive name without any slashes",
            default: "atom-config.tgz",
            order: 1
        },
        "IgnoredFilesList": {
            type: 'array',
            order: 1,
            description: "The files and directories inside the .atom directory to exclude from tarballs. You'd better keep defaults in place",
            default: [
                "atom-ownsync-state.js",
                ".node-gyp",
                "blob-store",
                "compile-cache",
                "recovery",
                "projects.cson",
                "storage"
            ],
            items: {
                type: 'string'
            },
        },
        "updateConfigurationAtStart": {
            type: 'boolean',
            description: "Check for updated configuration on atom's startup and install the package, if any",
            default: false,
            order: 2
        },
        "saveConfigurationAtExit": {
            type: 'boolean',
            description: "Save new configuration tarball on exit (if needed)",
            default: false,
            order: 2
        },
        "debug": {
            type: 'boolean',
            description: "Enable debugging via console.log()",
            default: false,
            order: 99
        },
    },

    activate(state) {
        this.core = new AtomOwnSyncCore();
        this.subscriptions = new CompositeDisposable();

        atom.config.observe('atom-ownsync', function() {
            this.core.loadSettings()
        }.bind(this));

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
