const { mergePrompt } = require('./merge');
const { subtitlePrompt } = require('./subtitle');
const { waitForInput } = require('./utils');

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

    let stillUsing = true;
    while (stillUsing) {
        console.log(separator);
        console.log('MKV-Handler');
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

