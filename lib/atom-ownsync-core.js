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
        "storage"
    ]

    constructor(dir) {
        this.dir = dir;
    }

    destroy() {

    }
    
    showTarballInfo() {
        console.log('AtomOwnsync: Reading tarball info!');
        notMgr = atom.notifications;
        notMgr.addInfo("Configuration tarball last updated on , size 10Mb, blah");
    }

    createTarballPackage() {
        path = atom.getLoadSettings().atomHome;
        dirObj = new Directory(path);
        archive = "/tmp/shit.tgz"
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
        proc = new BufferedProcess({command, args, stdout, exit});

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
    }

    finalizeTarballUnpack(archive) {
        console.log("Unpacking complete, reloading window")
        atom.reload();
    }

    installTarballPackage() {
        path = atom.getLoadSettings().atomHome;
        archive = "/tmp/shit.tgz"
        const command = 'tar'
        const args = ["xp", "-C", path, "-f", archive];
        const stdout = (output) => console.log(output)
        const exit = (code) => this.finalizeTarballUnpack(archive)
        const proc = new BufferedProcess({command, args, stdout, exit});
    }
}
