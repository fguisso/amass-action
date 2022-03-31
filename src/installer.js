import fs from 'fs';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const ROOT_URL = "https://github.com/OWASP/Amass/releases/download";

export async function downloadAndInstall() {
	const toolName = "amass";
	const releasePackageName = "amass_linux_amd64"
    const version = "v3.19.1"
	
	core.startGroup(`Download and install Amass ${version}`);

	const url = `${ROOT_URL}/${version}/${releasePackageName}.zip`;

	core.info(`Download version ${version} from ${url}.`);

	const downloadDir = await tc.downloadTool(url);
	if (downloadDir == null) {
		throw new Error(`Unable to download Amass from ${url}.`);
	}

	const installDir = await tc.extractZip(downloadDir);
	if (installDir == null) {
		throw new Error("Unable to extract Amass.");
	}

	const binPath = `${installDir}/${releasePackageName}/${toolName}`
	fs.chmodSync(binPath, "777");

	core.info(`Amass ${version} was successfully installed to ${installDir}.`);
	core.endGroup();
	return binPath
}