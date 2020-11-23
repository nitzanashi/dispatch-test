import fetch from 'node-fetch';
import {exec} from 'child_process';
import {promisify} from 'util';

const {
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    GITHUB_API_URL,
} = process.env;

const execPromise = promisify(exec);

const BRANCH = 'release/seo';
const WORKFLOW = 'lighthouse.yml';
const BASE_URL = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/workflows/${WORKFLOW}/dispatches`;

(async () => {
    let ref;

    try {
        const test = (await execPromise('git branch -r')).stdout;
        console.log(test);
        ref = (await execPromise(`git show-ref remotes/origin/${BRANCH}`)).stdout.split(' ')[0];
    } catch (e) {
        console.log(e);
        console.log('Branch does not exists nothing to do.');
        process.exit(0);
    }

    console.log(`The ref for ${BRANCH} is: ${ref}`);

    /**
     * dispatch lighthouse.
     * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
     */
    const request = await fetch(BASE_URL, {
        body: JSON.stringify({
            ref,
            workflow_id: WORKFLOW, // DO WE NEED THIS?
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        method: 'POST',
    });

    if (request.status === 200) {
        console.log('success');
        process.exit(0);
    }

    console.log(`Request failed with status code ${request.status}: ${request.statusText}`);
    process.exit(1);
})();
