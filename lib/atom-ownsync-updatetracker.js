/*
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details.
 */

'use babel';

import {
    Directory,
    BufferedProcess,
    AtomEnvironment
} from 'atom';

/* We'll need some node modules for this shit to work */
const fs = require('fs');
const util = require('util');

export default class AtomOwnSyncUpdateTracker {

    constructor(core) {
        this.core = core;
    }

    handleError(err, callback) {
        this.operationInProgress = false;
        callback(err, null)
    }

    whenTarballOutOfDate(callback)
    {
        if (this.operationInProgress)
            return;
        this.operationInProgress = true;
        var archive = this.core.getArchivePath();
        fs.stat(archive, function(err, stat) {
            if (err != null)
                this.handleError(err, callback)
            else
                this.gotArchiveStat(stat, callback);
        }.bind(this));
    }

    gotArchiveStat(archiveStat, callback) {
        var path = atom.getLoadSettings().atomHome;
        var dirObj = new Directory(path);
        /* Man, I hate js callback hell */
        var ent = dirObj.getEntries(function(err, items) {
            if (err != null)
                this.handleError(err, callback)
            else
                this.gotDirContents(archiveStat, items, callback);
        }.bind(this))
    }

    gotDirContents(astat, items, callback) {
        var path = atom.getLoadSettings().atomHome;
        var total = 0;
        items.forEach(function(item, i, arr) {
            var el = path + '/' + item.getBaseName();
            total++;
            /* Fire a shitload stat()s, get results in callbacks */
            fs.stat(el, function(err, stat) {
                total--;
                console.log("remaining: " + total);
                var name = item.getBaseName()
                if (err != null)
                    this.handleError(err, callback)
                else
                    this.gotFileStat(astat, stat, name, callback);
                if (total == 0 && this.operationInProgress) {
                    /* No achive update needed */
                    callback(null, false);
                    this.operationInProgress = false;
                }

            }.bind(this))
        }.bind(this))
    }

    gotFileStat(archiveStat, stats, name, callback) {
        if (!this.operationInProgress)
            return; /* We've already decided */

        for (let value of this.core.excludes) {
            if (value == name)
                return;
        }

        if (archiveStat.mtime < stats.mtime) {
            console.log(name + " modified, archive invalid")
            console.log("archive: " + archiveStat.mtime)
            console.log("object: " + stats.mtime)
            this.operationInProgress = false;
            /* Archive is out of date */
            callback(null, true);
        }

    }
}
