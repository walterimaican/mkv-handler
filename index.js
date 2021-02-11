const { exec } = require('child_process');
const path = require('path');
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

// Need subtitleFile and inputFile; subtitleLanguage and outputFile are optional
const mergeSingleSubtitle = async ({ inputFile, outputFile, subtitleFile, subtitleLanguage}) => {
    // Sanitize
    inputFile = inputFile.replace(/"/g, '');
    outputFile = outputFile.replace(/"/g, '');
    subtitleFile = subtitleFile.replace(/"/g, '');

    // If no outputFile provided, overwrite inputFile
    const shouldOverwrite = outputFile.length === 0 ? true : false;
    const output = shouldOverwrite 
        ? path.join(path.dirname(inputFile), `temp_${path.basename(inputFile)}`)
        : outputFile;

    const flags = subtitleLanguage.length === 0 ? '' : `--language 0:${subtitleLanguage}`;
    const mergeScript = `mkvmerge -o "${output}" "${inputFile}" ${flags} "${subtitleFile}"`;

    console.log();
    await execWrapper(mergeScript);
    await execWrapper(`rm -f "${inputFile}"`);
    await execWrapper(`rm -f "${subtitleFile}"`);

    if (shouldOverwrite) {
        const overwriteScript = `mv -f "${output}" "${inputFile}"`;
        await execWrapper(overwriteScript);
    }
};

const mergeMultipleSubtitles = async () => {};

const mergeSubtitles = async () => {
    const singleMultiResponse = await waitForInput('Merge subtitles for a single file or multiple files? (s || m): ');

    if (singleMultiResponse.toLowerCase() === 's') {
        const inputFile = await waitForInput('Path of input MKV (eg. E:\\Desktop\\myMKV.mkv): ');
        const subtitleFile = await waitForInput('Path of input subtitle file (eg. E:\\Desktop\\mySub.srt): ');
        const subtitleLanguage = await waitForInput('Optional subtitle language (eg. jpn | Provide none for unlabeled track): ');
        const outputFile = await waitForInput('Path of output MKV (eg. E:\\Desktop\\myNewMKV.mkv | Provide none to overwrite input MKV): ');
        await mergeSingleSubtitle({ inputFile, outputFile, subtitleFile, subtitleLanguage });
    } else if (singleMultiResponse.toLowerCase() === 'm') {
        await mergeMultipleSubtitles();
    } else {
        console.error(`Command '${singleMultiResponse}' not recognized.\n`)
    }
};

const mergePrompt = async () => {
    const subtitlesPrompt = '(s) Merge Subtitles\n';
    const mergeMenu = 'What would you like to do?\n'
    + subtitlesPrompt
    + '> ';
    const menuChoice = await waitForInput(mergeMenu);
    switch(menuChoice) {
        case 's':
            await mergeSubtitles();
            break;
        default:
            console.error(`Command '${response}' not recognized.\n`);
            break;
    }

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
    const extract = '(e) extract\n';
    const info = '(i) info\n';
    const merge = '(m) merge\n';
    const propedit = '(p) propedit\n';
    const subtitle = '(s) subtitle\n'
    const quit = '(q) quit\n';
    const mainMenu = 'What would you like to do?\n'
    // + extract
    // + info
    + merge
    // + propedit
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
            // case 'e':
            //     await extractPrompt();
            //     break;
            // case 'i':
            //     await infoPrompt();
            //     break;
            case 'm':
                await mergePrompt();
                break;
            // case 'p':
            //     await propEditPrompt();
            //     break;
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

