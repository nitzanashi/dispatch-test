import fetch from 'node-fetch';

const {
    GITHUB_TOKEN,
} = process.env;

const GITHUB_API_URL = 'https://api.github.com';
const BRANCH = 'release/seo';
const WORKFLOW = 'lighthouse.yml';
const BASE_URL = `${GITHUB_API_URL}/repos/nitzanashi/dispatch-test`;
const DISPATCH_URL = `${BASE_URL}/actions/workflows/${WORKFLOW}/dispatches`;

(async () => {
    /**
     * dispatch lighthouse.
     * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
     */
    const request = await fetch(DISPATCH_URL, {
        body: JSON.stringify({
            ref: BRANCH,
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        method: 'POST',
    });

    if (request.status === 204) {
        console.log('success');
        process.exit(0);
    }

    console.log(`Request failed with status code ${request.status}: ${request.statusText}`);
    process.exit(1);
})();
