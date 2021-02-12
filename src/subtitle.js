const { waitForInput, execWrapper } = require('./utils');

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
};

module.exports = { subtitlePrompt };