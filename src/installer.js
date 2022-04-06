import fs from 'fs';
import https from 'https';
import os from 'os';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const ROOT_URL = "https://github.com/OWASP/Amass/releases/download";

function getPackage() {
    switch (os.type()) {
        case 'Windows_NT':
            return `/amass_windows_amd64`;
        case 'Darwin':
            return `/amass_darwin_amd64`;
		case 'Freebsd':
            return `/amass_freebsd_amd64`;
        case 'Linux':
        default:
            return `/amass_linux_amd64`;
    }
}

async function getLatestInfo() {
	return new Promise((resolve, reject) => {
		let data = [];
		https.get({
			hostname: 'api.github.com',
			path: '/repos/OWASP/Amass/releases/latest',
			headers: { 'User-Agent': 'Github Actions' }
		}, res => {
			res.on('data', chunk => data += chunk);
			res.on('close', () => resolve(JSON.parse(data)));
		}).on('error', err => {
			reject(err);
		});
	});
};

export async function downloadAndInstall(version) {
	const toolName = "amass";
	const release = await getLatestInfo();
	console.log(release.tag_name);

	core.startGroup(`Download and install Amass ${version ? version : release.tag_name }`);

	const packageName = getPackage();
	const url = `${ROOT_URL}/${version ? version : release.tag_name }/${packageName}.zip`;

	core.info(`Download version ${version ? version : release.tag_name } from ${url}.`);

	const downloadDir = await tc.downloadTool(url);
	if (downloadDir == null) {
		throw new Error(`Unable to download Amass from ${url}.`);
	}

	const installDir = await tc.extractZip(downloadDir);
	if (installDir == null) {
		throw new Error("Unable to extract Amass.");
	}

	const binPath = `${installDir}/${packageName}/${toolName}`
	fs.chmodSync(binPath, "777");

	core.info(`Amass ${version ? version : release.tag_name } was successfully installed to ${installDir}.`);
	core.endGroup();
	return binPath
}