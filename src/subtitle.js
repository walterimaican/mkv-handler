const { waitForInput, execWrapper } = require('./utils');

const syncSubtitles = async () => {
    const filePath = await waitForInput('Path of srt file (eg. E:\\Desktop\\mySub.srt): ');
    const startTime = await waitForInput('Correct time for first subtitle (eg. 00:01:30): ');
    const endTime = await waitForInput('Correct time for last subtitle (eg. 02:30:00): ');
    await execWrapper(`subshift sync ${filePath} ${startTime} ${endTime}`);
};

const shiftSubtitles = async () => {
    const filePath = await waitForInput('Path of srt file (eg. E:\\Desktop\\mySub.srt): ');
    const shift = await waitForInput('Shift in milliseconds (eg. 1000 to delay 1 second or -1000 to advance 1 second): ');
    await execWrapper(`subshift shift ${filePath} ${shift}`);
};

const subtitlePrompt = async () => {
    const sync = '(sy) Sync Subtitles\n';
    const shift = '(sh) Shift Subtitles\n';
    const rename = '(r) Rename Subtitles\n';
    const subtitleMenu = 'What would you like to do?\n'
    + sync
    + shift
    + rename
    + '> ';
    const menuChoice = await waitForInput(subtitleMenu);
    switch(menuChoice) {
        case 'sy':
            await syncSubtitles();
            break;
        case 'sh':
            await shiftSubtitles();
            break;
        default:
            console.error(`Command '${response}' not recognized.\n`);
            break;
    }
    
    console.log();
    return;
};

module.exports = { subtitlePrompt };