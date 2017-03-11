'use babel';

import {
    Directory,
    BufferedProcess,
    AtomEnvironment
} from 'atom';
import AtomOwnSyncUpdateTracker from './atom-ownsync-updatetracker';

/* We'll need some node modules for this shit */
const fs = require('fs');
const util = require('util');

export default class AtomOwnSyncCore {
    archive = "atom-config.tgz"
    operationInProgress = ""
    excludes = [
        ".node-gyp",
        "blob-store",
        "compile-cache",
        "recovery",
        "projects.cson",
        "storage"
    ]

    constructor() {
        this.notify = atom.notifications;
        this.loadSettings();
        this.tracker = new AtomOwnSyncUpdateTracker(this)
    }

    destroy() {

    }

    getArchivePath() {
        return this.dir + "/" + this.archive;
    }


    showTarballInfo() {
        console.log('AtomOwnSync: Reading tarball info!');
        this.tracker.trackChanges(function(err, status) {
                console.log(err, status)
        })
        //this.notify.addInfo("Configuration tarball last updated on , size 10Mb, blah");
    }

    loadSettings() {
        console.log('AtomOwnSync: (Re)Reading configuration');
        this.dir = atom.config.get("atom-ownsync.tarballPath")
        this.archive = atom.config.get("atom-ownsync.tarballName")
        this.excludes = atom.config.get("atom-ownsync.IgnoredFilesList")
        console.log('AtomOwnSync: Save/restore from ' + this.dir + '/' + this.archive);
        console.log('AtomOwnSync: Excluding files: ' + this.excludes);
    }

    startTarballCreation() {
        path = atom.getLoadSettings().atomHome;
        dirObj = new Directory(path);
        archive = this.getArchivePath();
        const command = 'tar'
        const args = ["cpz", "-C", path, "-f", archive];
        this.excludes.forEach(function(item, i, arr) {
            args.push("--exclude")
            args.push(item)
        })
        args.push(".")
        console.log(args);
        const stdout = (output) => console.log(output)
        const exit = (code) => this.finalizeTarballCreation(archive)
        proc = new BufferedProcess({
            command,
            args,
            stdout,
            exit
        });

        this.notify.addInfo("Creating tarball: " + archive);
    }

    createTarballPackage() {
        this.tracker.trackChanges(function(err, status) {
            if (err != null) {
                this.notify.addError("Error while checking for changes, see developer log and file a bug");
            } else {
                if (status)
                    this.startTarballCreation()
                else
                    this.notify.addInfo("The tarball is already up to date");
            }
        }.bind(this))
    }

    finalizeTarballCreation(archive) {
        console.log("Compression complete: " + archive)
        this.notify.addInfo("Tarball ready: " + archive);
    }

    finalizeTarballUnpack(archive) {
        this.notify.addInfo("Tarball unpacked");
        atom.reload();
    }

    installTarballPackage() {
        path = atom.getLoadSettings().atomHome;
        archive = this.dir + "/" + this.archive;
        const command = 'tar'
        const args = ["x", "-C", path, "-f", archive];
        const stdout = (output) => console.log(output)
        const exit = (code) => this.finalizeTarballUnpack(archive)
        const proc = new BufferedProcess({
            command,
            args,
            stdout,
            exit
        });
        this.notify.addInfo("Installing tarball: " + archive);
    }
}
