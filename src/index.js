const { version, releases } = require('../package.json');
const { mergePrompt } = require('./merge');
const { subtitlePrompt } = require('./subtitle');
const { waitForInput, getLatestVersion } = require('./utils');

(async () => {
    const separator = '========================================';
    // const extract = '(e) extract\n';
    // const info = '(i) info\n';
    const merge = '(m) merge\n';
    // const propedit = '(p) propedit\n';
    const subtitle = '(s) subtitle\n'
    const quit = '(q) quit\n';
    const mainMenu = 'What would you like to do?\n'
    + merge
    + subtitle
    + quit
    + '> ';

    let versionMessage = null;
    const latestVersion = await getLatestVersion();
    if (latestVersion > version) {
        versionMessage = `\nv${latestVersion} available at ${releases}\n`;
    }

    let stillUsing = true;
    while (stillUsing) {
        console.log(separator);
        console.log(`MKV-Handler v${version}`);
        if (versionMessage) console.log(versionMessage);
        console.log(separator);

        const response = await waitForInput(mainMenu); 
        switch(response) {
            case 'm':
                await mergePrompt();
                break;
            case 's':
                await subtitlePrompt();
                break;
            case 'q':
                console.log('Goodbye.');
                stillUsing = false;
                break;
            default:
                console.error(`Command '${response}' not recognized.\n`);
                break;
        }
    }
})();

