import * as core from '@actions/core';
import * as exec from '@actions/exec';

import * as installer from './installer';

const domains = core.getInput('domains', { required: true });
const passive = core.getBooleanInput('passive', { required: false });
const brute = core.getBooleanInput('brute', { required: false });
const output = core.getInput('output', { required: false });

let execOutput = '';
let execError = '';

const options = {};
options.listeners = {
  stdout: (data) => {
    execOutput += data.toString();
  },
  stderr: (data) => {
    execError += data.toString();
  }
};

async function run() {
	try {
		// download and install
		const binPath = await installer.downloadAndInstall();
        const params = ['enum'];

        // Setting up params
        params.push(`-d=${domains}`);
        if (passive) params.push('-passive');
        if (brute) params.push('-brute');
        params.push(`-o=${output ? output : 'amass.txt'}`);

		// run tool
        exec.exec(binPath, params, options);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();