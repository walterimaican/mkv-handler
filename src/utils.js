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

const sanitize = (givenString) => {
    return givenString.replace(/"/g, '');
}

const templateHelper = async (template) => {
    // show_ep_01_credits.mkv
    if (!template.includes('?')) {
        console.error('No "?" provided, exiting...');
        return null;
    }

    let templateSplit = template.split('?');
    templateSplit = templateSplit.filter(slice => slice.length > 0);

    // show_??_??_credits.mkv
    if (templateSplit.length > 2) {
        console.error('More than one grouping of "?"s provided, exiting...');
        return null;
    }

    // ??_show_ep_01_credits.mkv
    // show_ep_01_credits.mkv??
    let identifierLocation = 'middle';
    if (templateSplit.length === 1 && template[0] === '?') {
        identifierLocation = 'start';
    } else if (templateSplit.length === 1 && template[template.length - 1] === '?') {
        identifierLocation = 'end';
    }
    
    return { templateSplit, identifierLocation };
}

module.exports = { waitForInput, execWrapper, sanitize, templateHelper };