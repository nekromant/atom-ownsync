# The atom-ownsync package

A dumb plugin to prepare atom configuration tarballs to sync painlessly via
ownCloud/nextCloud/DropBox/etc. This plugin relies on some external sync tool to get the actual job done.

WARNING: Don't use just yet, early alpha. Only been tested and works on linux, since it relies on GNU tar for creating tarballs

# TODO:
- [X] Implement basic config file tarballing
- [X] Implement settings for configuration/archive names storage
- [X] Update changed configuration on the fly
- [ ] Handle relative paths to tarball directory
- [ ] Make tarball operation atomic
- [ ] Make sure this stuff works on windows
- [ ] Make sure this stuff works on mac
- [ ] Check file modification dates to determine if tarballing is really needed
- [ ] Automatically backup/restore on start/exit
- [ ] ...
- [ ] PROFIT!

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
