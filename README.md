# The atom-ownsync package
_BIG FAT WARNING_: This plugin is very early alpha. If you are going to try it out - MAKE YOUR OWN BACKUP of the .atom folder in case bugs happen.

This package provides a simple way to sync your atom configuration over several computers via existing file synchronization tools. This package is planned to have 2 modes of operation:

- Tarball mode. Prepare atom configuration tarballs and put them in a directory which is synchronised via ownCloud/nextCloud/DropBox/etc. And vice-versa.

- Git mode. Commit all the changed configuration files into git and push/pull to synchronize. (Planned! Not yet implemented)

# Getting started

- Install the plugin
```
apm install atom-ownsync
```
- Navigate to the package settings and adjust the tarball storage directory (that should be in your dropbox/owncloud/nextcloud folder).

- The rest of the stuff is optional

- Create your first configuration package

# Why not just add/symlink .atom to your dropbox folder?

.atom directory contains thousands of files, thanks to the way nodejs and the rest of the software stack works. Synchronization of thousands of small files is painfully slow and provides a HUGE load both for the desktop sync client and the server your are synchronizing with. Pushing a .tar file back and forth is way faster, though consumes a bit of network traffic.

# Works under
- [X] linux
- [ ] mac
- [ ] windows

_WARNING_: This plugin is very early alpha. Only been tested and works on linux, since it relies on GNU tar for creating tarballs.

_HELP WANTED_: The author of this plugin is not very familiar with js/coffeescript being more a linux kernel dev. If you are a js guru and can spare a few minutes to do a proper code review I'd be very grateful

# TODO:
- [X] Implement basic config file tarballing
- [X] Implement settings for configuration/archive names storage
- [X] Update changed configuration on the fly
- [ ] Handle relative paths to tarball directory
- [ ] Multiple tarball directories
- [ ] Make tarball operation atomic
- [ ] Make sure this stuff works on windows
- [ ] Make sure this stuff works on mac
- [X] Check file modification dates to determine if tarballing is really needed
- [X] Automatically restore on start
- [ ] Automatically backup on exit
- [ ] Implement git backend
- [ ] ...
- [ ] PROFIT!

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
