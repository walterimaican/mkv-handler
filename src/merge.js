const fs = require('fs');
const path = require('path');
const { waitForInput, execWrapper, sanitize, templateHelper } = require('./utils');

// Need subtitleFile and inputFile; subtitleLanguage and outputFile are optional
const mergeSingleSubtitle = async ({ inputFile, outputFile, subtitleFile, subtitleLanguage}) => {
    // Sanitize
    inputFile = sanitize(inputFile);
    outputFile = sanitize(outputFile);
    subtitleFile = sanitize(subtitleFile);

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

const mergeMultipleSubtitles = async () => {
    console.log('Subtitles must have the same name and be in the same directory as the MKV they are merging with\n(eg. folder\\myVideo.mkv, folder\\myVideo.srt)');
    await waitForInput('Press [ENTER] when ready.\n');

    const templateQuery = 'Path of MKV to merge, with episode identifier: ?\n(eg. E:\\Desktop\\show_ep_01.mkv -> E:\\Desktop\\show_ep_?.mkv)\n> ';
    const templateFile = sanitize(await waitForInput(templateQuery));
    const directory = path.dirname(templateFile);
    const baseVideo = path.basename(templateFile);
    const templateResults = await templateHelper(baseVideo);
    if (!templateResults) return;

    let subtitleExt = await waitForInput('Subtitle extension (Default: .srt): ');
    if (subtitleExt.length === 0) subtitleExt = '.srt';

    let proposals = [];
    const videos = fs.readdirSync(directory).filter((file) => templateResults.templateRE.test(file));
    videos.forEach((video) => {
        const subtitle = video.replace('.mkv', subtitleExt);
        proposals.push({ video: path.join(directory, video), subtitle: path.join(directory, subtitle) });
    });

    const subtitleLanguage = await waitForInput('Optional subtitle language (eg. jpn | Provide none for unlabeled track): ');
    const outputFile = await waitForInput('Path of output MKV (eg. E:\\Desktop\\myNewMKV.mkv | Provide none to overwrite input MKV): ');

    console.log(proposals);
    const approval = await waitForInput('Is the above set of videos and subtitles valid? (y || n): ');
    if (approval.toLowerCase() === 'y') {
        await proposals.reduce(
            async (promise, proposal) => {
                await promise;

                return new Promise((resolve) => {
                    mergeSingleSubtitle({
                        inputFile: proposal.video,
                        outputFile,
                        subtitleFile: proposal.subtitle,
                        subtitleLanguage,
                    }).then(() => {
                        resolve(true);
                    });
                });
            }, 
            Promise.resolve(true)
        );
    } else {
        console.log('Cancelling...');
        return;
    }
};

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

module.exports = { mergePrompt };