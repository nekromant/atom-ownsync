'use babel';
import {
    Directory,
    BufferedProcess,
    AtomEnvironment
} from 'atom';

export default class AtomOwnSyncCore {
    archive = "atom-config.tgz"
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
    }

    destroy() {

    }

    showTarballInfo() {
        console.log('AtomOwnSync: Reading tarball info!');
        this.notify.addInfo("Configuration tarball last updated on , size 10Mb, blah");
    }

    loadSettings() {
        console.log('AtomOwnSync: (Re)Reading configuration');
        this.dir = atom.config.get("atom-ownsync.tarballPath")
        this.archive = atom.config.get("atom-ownsync.tarballName")
        this.excludes = atom.config.get("atom-ownsync.IgnoredFilesList")
        console.log('AtomOwnSync: Save/restore from ' + this.dir + '/' + this.archive);
        console.log('AtomOwnSync: Excluding files: ' + this.excludes);
    }

    createTarballPackage() {
        path = atom.getLoadSettings().atomHome;
        dirObj = new Directory(path);
        archive = this.dir + "/" + this.archive;
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
        /*
        TODO: Deal with modification times
        ent = dirObj.getEntriesSync()
        ent.forEach(function(item, i, arr) {
            console.log(item.getBaseName())
        })
        */
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
        const args = ["xp", "-C", path, "-f", archive];
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
