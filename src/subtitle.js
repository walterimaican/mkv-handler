const path = require('path');
const { waitForInput, execWrapper, sanitize, templateHelper } = require('./utils');

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

const renameSubtitles = async () => {
    console.log('Renaming batch of subtitles based off of corresponding video files.\n');

    const videoTemplateQuery = 'Path of video used as template for renaming, with episode identifier: ?\n(eg. E:\\Desktop\\show_ep_01.mkv -> E:\\Desktop\\show_ep_??.mkv)\n> ';
    const videoTemplatePath = sanitize(await waitForInput(videoTemplateQuery));
    const videoTemplateResults = await templateHelper(path.basename(videoTemplatePath));
    if (!videoTemplateResults) return;
    
    const subtitleTemplateQuery = 'Path of subtitle whose name will be overwritten, with episode identifier: ?\n(eg. E:\\Desktop\\my_sub_01.srt -> E:\\Desktop\\my_sub_??.mkv)\n> ';
    const subtitleTemplatePath = sanitize(await waitForInput(subtitleTemplateQuery));
    const subtitleTemplateResults = await templateHelper(path.basename(subtitleTemplatePath));
    if (!subtitleTemplateResults) return;



    // get array of before - after subtitle file name change and print and confirm w/user before renaming
}

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
        case 'r':
            await renameSubtitles();
            break;
        default:
            console.error(`Command '${response}' not recognized.\n`);
            break;
    }
    
    console.log();
    return;
};

module.exports = { subtitlePrompt };