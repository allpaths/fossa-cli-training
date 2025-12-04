# FOSSA CLI Training Guide for Jeff

Welcome to the comprehensive FOSSA CLI training guide! This repository contains intentionally vulnerable packages to help you learn how to use FOSSA CLI for security scanning and license compliance.

## 🎯 Learning Objectives

By the end of this tutorial, you will be able to:
- Install and configure FOSSA CLI
- Perform basic security and license scans
- Understand FOSSA CLI output and reports
- Integrate FOSSA CLI into CI/CD pipelines
- Configure custom scanning rules with `.fossa.yml`
- Handle different project types and languages

## ⚠️ Important Security Notice

This repository intentionally contains **vulnerable packages** for training purposes. These include:
- **express 4.16.0** - Known security vulnerabilities
- **lodash 4.17.4** - Prototype pollution vulnerabilities
- **moment 2.19.0** - ReDoS (Regular Expression Denial of Service)
- **request 2.88.0** - Deprecated with security issues
- **minimist 0.0.8** - Prototype pollution vulnerability

**DO NOT** use this code in production environments!

## 📋 Prerequisites

- Node.js (v12 or later)
- Git
- A FOSSA account and API key
- Terminal/Command line access

## 🚀 Quick Start

### Step 1: Clone This Repository

```bash
git clone <repository-url>
cd fossa-cli-training
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install FOSSA CLI

Choose your installation method:

#### Option A: Direct Download (Recommended)
```bash
# Linux/macOS
curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash

# Windows (PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.ps1'))
```

#### Option B: Package Managers
```bash
# Homebrew (macOS)
brew install fossa
```

### Step 4: Configure FOSSA API Key

Set your FOSSA API key as an environment variable:

```bash
export FOSSA_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```bash
echo "FOSSA_API_KEY=your-api-key-here" > .env
```

## 📊 Basic FOSSA CLI Commands

### 1. List Available Targets

First, let's see what FOSSA CLI detects in our project:

```bash
fossa list-targets
```

**Expected Output:**
```
Found project: npm@./
Found target: npm@./:fossa-cli-training-demo
```

### 2. Basic Analysis

Run a basic scan of your project:

```bash
fossa analyze
```

This will:
- Detect your project type (Node.js/npm)
- Scan all dependencies in `package.json`
- Upload results to FOSSA cloud
- Generate a project in your FOSSA dashboard

### 3. Local Analysis (No Upload)

To analyze locally without uploading to FOSSA:

```bash
fossa analyze --output
```

### 4. Generate Reports

Generate attribution report:
```bash
fossa report attribution --json
```

## 🔍 Understanding FOSSA Output

When you run `fossa analyze --output`, you'll see JSON output which at a high level looks something like this:

### Project Information
```json
{
  "projects": [
    {
      "graph": {
        "assocs": [[0, [1, 2]]],
        "deps": [
          {
            "locations": ["https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz"],
            "name": "lodash",
            "tags": {},
            "type": "NodeJSType",
            "version": {
              "type": "EQUAL",
              "value": "4.17.4"
            }
          },
          {
            "locations": ["https://registry.npmjs.org/ms/-/ms-0.7.1.tgz"],
            "name": "ms",
            "tags": {},
            "type": "NodeJSType",
            "version": {
              "type": "EQUAL",
              "value": "0.7.1"
            }
          },
          {
            "locations": ["https://registry.npmjs.org/debug/-/debug-2.2.0.tgz"],
            "name": "debug",
            "tags": {},
            "type": "NodeJSType",
            "version": {
              "type": "EQUAL",
              "value": "2.2.0"
            }
          }
        ],
        "direct": [0]
      },
      "path": "/Users/myuser/support-workspace/fossa-cli-training/",
      "type": "npm"
    }
  ],
  "sourceUnits": [
    {
      "Build": {
        "Artifact": "default",
        "Dependencies": [
          {
            "imports": ["npm+ms$0.7.1"],
            "locator": "npm+debug$2.2.0"
          }
        ],
        "Imports": ["npm+lodash$4.17.4"],
        "Succeeded": true
      },
      "Manifest": "/Users/myuser/support-workspace/fossa-cli-training/",
      "Name": "/Users/myuser/support-workspace/fossa-cli-training/",
      "OriginPaths": ["package-lock.json"],
      "Type": "npm"
    }
  ]
}
```

### Key elements explained:

- **direct**: [0] - Shows that lodash (index 0) is a direct dependency
- **assocs**: [[0, [1, 2]]] - Shows that lodash (index 0) has transitive dependencies ms (index 1) and debug (index 2)
- **dep**s - Array of all dependencies found
- **Import**s: ["npm+lodash$4.17.4"] - The main package we imported
- **Dependencies** - Shows the relationship where debug imports ms

## ⚙️ Advanced Configuration with .fossa.yml

Create a `.fossa.yml` file to customize your scans:

```yaml
version: 3

project:
  name: "FOSSA CLI Training Demo"
  team: "Security Team"
  policy: "Default Policy"

targets:
  only:
    - type: npm
      path: .

paths:
  exclude:
    - dist
    - build
```

### Configuration Options:
- **project.name**: Custom project name
- **project.team**: Assign to a team
- **project.policy**: Apply specific policy
- **targets.only**: Include specific targets
- **targets.exclude**: Exclude specific targets
- **paths.exclude**: Exclude directories

## 🔧 CI/CD Pipeline Integration

### GitHub Actions Example

Create `.github/workflows/fossa.yml`:

```yaml
name: FOSSA Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  fossa-scan:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install FOSSA CLI
      run: |
        curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash

    - name: Run FOSSA Analysis
      env:
        FOSSA_API_KEY: ${{ secrets.FOSSA_API_KEY }}
      run: fossa analyze

    - name: Run FOSSA Test (Policy Check)
      env:
        FOSSA_API_KEY: ${{ secrets.FOSSA_API_KEY }}
      run: fossa test
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - security

fossa-scan:
  stage: security
  image: node:16
  before_script:
    - curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash
    - npm ci
  script:
    - fossa analyze
    - fossa test
  variables:
    FOSSA_API_KEY: $FOSSA_API_KEY
  only:
    - main
    - develop
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any

    environment {
        FOSSA_API_KEY = credentials('fossa-api-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install FOSSA CLI') {
            steps {
                sh 'curl -H "Cache-Control: no-cache" https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash'
            }
        }

        stage('FOSSA Analysis') {
            steps {
                sh 'fossa analyze'
            }
        }

        stage('FOSSA Test') {
            steps {
                sh 'fossa test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'fossa.debug.json', allowEmptyArchive: true
        }
    }
}
```

## 🧪 Hands-On Exercises

### Exercise 1: Basic Scan
1. Run `fossa list-targets` and identify the detected targets
2. Run `fossa analyze --output` and examine the JSON output
3. Count how many vulnerable dependencies are detected

### Exercise 2: Custom Configuration
1. Create a `.fossa.yml` file that excludes some directory
2. Compare results with and without the configuration
3. Add a custom project name and team

### Exercise 3: Policy Testing
1. Run `fossa analyze` to upload results
2. Run `fossa test` to check against policies
3. Examine any policy violations

### Exercise 4: Report Generation
1. Generate an attribution report: `fossa report attribution`
2. Compare the different [report formats](https://github.com/fossas/fossa-cli/blob/master/docs/references/subcommands/report.md)

## 🐛 Common Issues and Troubleshooting

### Issue 1: "No API key provided"
**Solution:** Set the FOSSA_API_KEY environment variable:
```bash
export FOSSA_API_KEY="your-key-here"
```

### Issue 2: "No targets found"
**Solution:** Ensure you're in a directory with supported project files:
- `package.json` for Node.js
- `pom.xml` for Maven
- `go.mod` for Go
- `requirements.txt` or `Pipfile` for Python

### Issue 3: Analysis fails with network errors
**Solution:** Check your network connection and firewall settings. FOSSA CLI needs to connect to:
- `app.fossa.com` (or your on-premise URL)
- Package registries (npmjs.org, maven central, etc.)

### Issue 4: Large projects timeout
**Solution:** Use `--timeout` flag or exclude unnecessary paths in `.fossa.yml`:
```yaml
paths:
  exclude:
    - vendor
```

## 📈 Best Practices

### 1. Security Scanning
- Run FOSSA scans on every commit
- Use `fossa test` to enforce policy compliance
- Set up notifications for policy violations
- Regularly update your policies

### 2. Performance Optimization
- Use `.fossa.yml` to exclude unnecessary files
- Cache FOSSA CLI installations in CI/CD
- Run scans in parallel when possible

### 3. Policy Management
- Create different policies for different project types
- Use teams to organize projects
- Regular policy reviews and updates

## 🔗 Additional Resources

- [FOSSA CLI Documentation](https://github.com/fossas/fossa-cli)
- [FOSSA User Guide](https://docs.fossa.com/)
- [Policy Configuration](https://docs.fossa.com/docs/policy-management)
- [API Reference](https://docs.fossa.com/reference/api-overview)

## 📞 Support

If you encounter issues during training:
1. Check the [troubleshooting section](#-common-issues-and-troubleshooting)
2. Review FOSSA documentation
3. Contact your FOSSA administrator
4. Reach out to FOSSA support

---

## 🎉 Congratulations!

You've completed the FOSSA CLI training! You should now be comfortable:
- Installing and configuring FOSSA CLI
- Running security and license scans
- Integrating FOSSA into CI/CD pipelines
- Understanding and acting on FOSSA results

Remember: Security scanning should be an integral part of your development workflow, not an afterthought!

---

**Next Steps:**
1. Integrate FOSSA into your real projects
2. Set up automated scans in your CI/CD pipelines
3. Configure policies that match your organization's requirements
4. Train your team on interpreting and acting on FOSSA results
