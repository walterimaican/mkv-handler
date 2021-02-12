const fs = require('fs');
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

    const videoTemplateQuery = 'Path of video used as template for renaming, with episode identifier: ?\n(eg. E:\\Desktop\\show_ep_01.mkv -> E:\\Desktop\\show_ep_?.mkv)\n> ';
    const videoTemplatePath = sanitize(await waitForInput(videoTemplateQuery));
    const videoBase = path.basename(videoTemplatePath);
    const videoExt = path.extname(videoTemplatePath);
    const videoTemplateResults = await templateHelper(videoBase);
    if (!videoTemplateResults) return;
    
    const subtitleTemplateQuery = 'Path of subtitle whose name will be overwritten, with episode identifier: ?\n(eg. E:\\Desktop\\my_sub_01.srt -> E:\\Desktop\\my_sub_?.mkv)\n> ';
    const subtitleTemplatePath = sanitize(await waitForInput(subtitleTemplateQuery));
    const subtitleDir = path.dirname(subtitleTemplatePath);
    const subtitleBase = path.basename(subtitleTemplatePath);
    const subtitleExt = path.extname(subtitleTemplatePath);
    const subtitleTemplateResults = await templateHelper(subtitleBase);
    if (!subtitleTemplateResults) return;

    const subtitles = fs.readdirSync(subtitleDir).filter((file) => subtitleTemplateResults.templateRE.test(file));
    let subtitleProposals = [];

    subtitles.map((subtitle) => {
        let parsedSegments = subtitle;
        subtitleTemplateResults.templateSplit.forEach((segment) => {
            parsedSegments = parsedSegments.split(segment).filter((segment) => segment.length > 0)[0];
        });

        const episode = parsedSegments;
        const newName = videoBase.replace('?', episode).replace(videoExt, subtitleExt);
        const proposedPath = path.join(subtitleDir, newName);
        subtitleProposals.push({ subtitle: path.join(subtitleDir, subtitle), proposedPath });
    });

    console.log(subtitleProposals);
    const approval = await waitForInput('Is the above set of changes valid? (y || n): ');
    if (approval.toLowerCase() === 'y') {
        const renamePromises = subtitleProposals.map((proposal) => {
            return new Promise(() => {
                execWrapper(`mv -f "${proposal.subtitle}" "${proposal.proposedPath}"`);
            });
        });
        
        await Promise.allSettled(renamePromises);
    } else {
        console.log('Cancelling...');
        return;
    }
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