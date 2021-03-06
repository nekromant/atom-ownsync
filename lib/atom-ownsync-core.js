'use babel';

/*
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details.
 */

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
    /* Will be serialized */
    state = {
        lastTarballInstallDate: 0
    };

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
        this.tracker = new AtomOwnSyncUpdateTracker(this)
        this.loadState(function() {
            this.loadSettings();
            /* Make sure the tarball directory is stored on per-machine basis */
            atom.config.set("atom-ownsync.tarballPath", this.state.dir)
            /* Do we need to apply new configuration ? */
            v = atom.config.get("atom-ownsync.updateConfigurationAtStart")
            if (v) {
                console.log("atom-ownsync: Checking for a new config")
                this.installTarballPackage()
            }
        }.bind(this));
    }


    getStateFilename() {
        return atom.getLoadSettings().atomHome + "/atom-ownsync-state.js"
    }

    saveState(callback) {
        path = this.getStateFilename()
        var json = JSON.stringify(this.state);
        fs.writeFile(path, json, 'utf8', function(err) {
            if (err)
                throw err;
            if (callback != null)
                callback(err);
        });
    }

    loadState(callback) {
        var path = this.getStateFilename()
        console.log("Loading state from: " + path)
        fs.access(path, fs.constants.F_OK, function(err) {
            if (err == null) {
                console.log(path);
                fs.readFile(path, 'utf8', function(err, data) {
                    if (err)
                        throw err;
                    this.state = JSON.parse(data)
                    console.log("Loaded state")
                    console.log(this.state)
                    if (err)
                        throw err;
                    if (callback)
                        callback(this.state)
                }.bind(this))
            } else {
                callback(this.state)
            }
        }.bind(this))
    }

    destroy() {

    }

    getArchivePath() {
        return this.dir + "/" + this.archive;
    }


    showTarballInfo() {
        this.notify.addSuccess("Configuration will be saved to/loaded from : " + this.getArchivePath());
    }

    loadSettings() {
        console.log('AtomOwnSync: (Re)Reading configuration');
        this.dir = atom.config.get("atom-ownsync.tarballPath");
        /* This is called when the user changes dir settings as well, so we'll have
            to update state file as well
        */
        this.state.dir = this.dir
        this.archive = atom.config.get("atom-ownsync.tarballName")
        this.excludes = atom.config.get("atom-ownsync.IgnoredFilesList")
        console.log('AtomOwnSync: Save/restore from ' + this.dir + '/' + this.archive);
        console.log('AtomOwnSync: Excluding files: ' + this.excludes);
        this.saveState();
    }

    createTarballPackage() {
        this.tracker.whenTarballOutOfDate(function(err, status) {
            if (err != null) {
                this.notify.addError("Error while checking for changes, see developer log and file a bug");
            } else {
                if (status)
                    this.startTarballCreation()
                else
                    this.notify.addSuccess("The tarball is already up to date, no action taken");
            }
        }.bind(this))
    }

    startTarballCreation() {
        var path = atom.getLoadSettings().atomHome;
        var dirObj = new Directory(path);
        var archive = this.getArchivePath();
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
        var proc = new BufferedProcess({
            command,
            args,
            stdout,
            exit
        });

        this.notify.addWarning("Creating tarball: " + archive);
    }

    finalizeTarballCreation(archive) {
        var stamp = fs.statSync(archive);
        this.state.lastTarballInstallDate = stamp.mtime.getTime()
        this.saveState(function() {
            this.notify.addSuccess("Tarball ready: " + archive);
        })
    }

    installTarballPackage() {
        var archive = this.getArchivePath();
        fs.stat(archive, function(err, stamp) {
            if (err != null)
                throw err;
            this.loadState(function() {
                if (stamp.mtime > this.state.lastTarballInstallDate) {
                    this.notify.addWarning("Updated Configuration available! Now installing tarball: " + archive + ". Atom will automatically reload once we're done");
                    this.startTarballUnpack()
                } else {
                    this.notify.addSuccess("atom-ownsync: Configuration is already up-to-date, no action taken");
                }
            }.bind(this))
        }.bind(this))
    }

    startTarballUnpack() {
        var path = atom.getLoadSettings().atomHome;
        var archive = this.getArchivePath();
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

    }

    finalizeTarballUnpack(archive) {
        var stamp = fs.statSync(archive);
        this.state.lastTarballInstallDate = stamp.mtime.getTime()
        this.saveState(function() {
            this.notify.addSuccess("Configuration updated, reloading atom");
            atom.reload();
        }.bind(this))
    }

}
