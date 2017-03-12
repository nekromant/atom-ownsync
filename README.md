# The atom-ownsync package
_BIG FAT WARNING_: This plugin is very early alpha. If you are going to try it out - MAKE YOUR OWN BACKUP of the .atom folder in case bugs happen.

This package provides a simple way to sync your atom configuration over several computers. It is planned to have 2 modes of operation:

- Tarball mode. Prepare atom configuration tarballs and put them in a directory which is synchronised via ownCloud/nextCloud/DropBox/etc. And vice-versa.

- Git mode. Commit all the changed configuration files into git and push/pull to
    synchronise. (Planned! Not yet implemented)

## Works under
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
- [ ] Make tarball operation atomic
- [ ] Make sure this stuff works on windows
- [ ] Make sure this stuff works on mac
- [X] Check file modification dates to determine if tarballing is really needed
- [ ] Automatically backup/restore on start/exit
- [ ] Add option to use git instead of tar as backend
- [ ] ...
- [ ] PROFIT!

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
