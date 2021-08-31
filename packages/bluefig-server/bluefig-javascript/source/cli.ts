// #region imports
    // #region libraries
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
const VERSION = `0.0.0-0`;

const availableCommands = `Available commands:

    file        - get distribution/index.js filepath
    version     - print version;
    help        - print help.
`;



const file = async () => {
    const indexPath = path.join(
        __dirname,
        './index.js',
    );

    console.log(indexPath);
}


const version = () => {
    console.log(`\n\tbluefig version ${VERSION}\n`);
}


const help = (
    command: string,
) => {
    console.log(`\n\tCommand '${command}' is unknown. ${availableCommands}\n`);
}



const cli = () => {
    try {
        const arg = process.argv[2];
        if (!arg) {
            console.log(`\n\tIncorrect usage. ${availableCommands}\n`);
            return;
        }

        const command = arg.trim().toLowerCase();

        switch (command) {
            case 'file':
                file();
                break;
            case 'version':
                version();
                break;
            case 'help':
                help(command);
                break;
            default:
                help(command);
        }
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
// #endregion module



// #region exports
module.exports = cli;
// #endregion exports
