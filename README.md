# amass-action
In-depth Attack Surface Mapping and Asset Discovery for Github Actions

This Amass Action for recon orchestration using Github Actions.

**WIP**

At this star point, this action just execute the command:
```bash
amass -brute -d DOMAIN -o OUTPUT.txt

or

amass -passive -d DOMAIN -o OUTPUT.txt
```

## Example


Running Amass with brute force in the owasp.org domain and upload the output in the Github Workflow Artifacts.
```yaml
name: Amass Enum

on:
    workflow_dispatch:

jobs:
  amass-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
        with:
          go-version: 1.17

      - name: Amass - Enumeration
        uses: fguisso/amass-action@main
        with:
          domains: owasp.org
          brute: true

      - name: GitHub Workflow artifacts
        uses: actions/upload-artifact@v2
        with:
          name: amass.txt
          path: amass.txt
```

### Available Inputs
| Key               | Description                                         | Required |
| ----------------- | ------------------------------------------------------------------------------ | -------- |
| `domains`         | Domain names separated by commas (can be used multiple times)                  | true     |
| `passive`         | Disable DNS resolution of names and dependent features                         | fasle    |
| `brute`           | Execute brute forcing after searches                                           | fasle    |
| `output`          | Path to the text file containing terminal stdout/stderr (default: amass.txt)   | fasle    |
