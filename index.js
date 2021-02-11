const { exec } = require('child_process');
const readline = require('readline');

const waitForInput = async (query) => {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        crlfDelay: Infinity,
    });

    return new Promise((resolve) => {
        readlineInterface.question(query, (answer) => {
            readlineInterface.close();
            resolve(answer);
        });
    });
};

const execWrapper = async (script) => {
    let returnStatus;
    await new Promise((resolve) => {
        let resolveStatus = true;

        exec(script, (error, stdout, stderr) => {
            if (error && error.message) {
                console.error(error.message);
                resolveStatus = false;
            }
            if (stderr) {
                console.error(stderr);
                resolveStatus = false;
            }
            if (stdout) {
                console.log(stdout);
            }

            resolve(resolveStatus);
        });
    }).then((resolveStatus) => (returnStatus = resolveStatus));

    return returnStatus;
};

const extractPrompt = async () => {
    console.log('This feature is not yet supported.');
    console.log();
    return;
};

const infoPrompt = async () => {
    console.log('This feature is not yet supported.');
    console.log();
    return;
};

const mergePrompt = async () => {
    await execWrapper('mkvmerge');
    console.log();
    return;
};

const propEditPrompt = async () => {
    console.log('This feature is not yet supported.');
    console.log();
    return;
};

(async () => {
    const separator = '========================================';
    const mainMenu = 
    `What would you like to do?
        (e) extract
        (i) info
        (m) merge
        (p) propedit
        (q) quit
        \n> `;

    let stillUsing = true;
    while (stillUsing) {
        console.log(separator);
        console.log('MKV-Handler');
        console.log(separator);

        const response = await waitForInput(mainMenu); 
        switch(response) {
            case 'e':
                await extractPrompt();
                break;
            case 'i':
                await infoPrompt();
                break;
            case 'm':
                await mergePrompt();
                break;
            case 'p':
                await propEditPrompt();
                break;    
            case 'q':
                console.log('Goodbye.');
                stillUsing = false;
                break;
            default:
                console.log(`Unknown command: '${response}'.\n`);
                break;
        }
    }
})();

