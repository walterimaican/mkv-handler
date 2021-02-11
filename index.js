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
        console.log(`Running: ${script}`);
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

const subtitlePrompt = async () => {
    const filePath = await waitForInput('Path of srt file (eg. E:\\Desktop\\mySub.srt): ');
    const shiftSyncResponse = await waitForInput('Shift or Sync? (Default: Shift): ');

    if (shiftSyncResponse.toLowerCase() === 'sync') {
        console.log('Syncing');
        const startTime = await waitForInput('Correct time for first subtitle (eg. 00:01:30): ');
        const endTime = await waitForInput('Correct time for last subtitle (eg. 02:30:00): ');
        await execWrapper(`subshift sync ${filePath} ${startTime} ${endTime}`);
    } else {
        console.log('Shifting');
        const shift = await waitForInput('Shift in milliseconds (eg. 1000 to delay 1 second or -1000 to advance 1 second): ');
        await execWrapper(`subshift shift ${filePath} ${shift}`);
    }
    
    console.log();
    return;
}

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

