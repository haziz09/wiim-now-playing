# Wiim Now Playing

Show what the Wiim device is currently playing on a separate screen.

> in design/dev phase

## Also see

- [Plan](docs/PLAN.md)
- [Design](docs/DESIGN.md)
- [Raspberry Pi Setup](docs/RPISETUP.md)

## First time use

Use ``npm install`` to get all required packages after a fresh clone.

Start the server using ``node .\index.js`` to start an instance. Or use ``nodemon`` to start and keep monitoring.

## Development and debugging mode

Use ``nodemon`` to automatically reload the server on any changes you've made.

Debugging in Windows:

- In PowerShell use ``$env:DEBUG = "*"`` or ``$env:DEBUG = "*,-nodemon*"`` before starting ``nodemon`` to see all debugging information.
- In CMD use ``set DEBUG=*`` before starting ``nodemon`` to see all debugging information.
- In Shell/Bash use ``DEBUG="*" node server/index.js``.
- In order to stop debugging information change to ``DEBUG=""``.
- Use ``DEBUG="*,-nodemon*"`` to include all but nodemon module debug info.  
  Or use ``DEBUG="index"`` to only show debug info from the specific index.js module.

[Read more](https://www.npmjs.com/package/debug#windows-command-prompt-notes)
