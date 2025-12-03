# 🔒 FOSSA CLI Training Repository

A hands-on training environment for learning FOSSA CLI security scanning and license compliance.

## ⚠️ Security Warning

**This repository intentionally contains vulnerable packages for educational purposes. DO NOT use in production!**

## 🎯 What You'll Learn

- Install and configure FOSSA CLI
- Perform security and license scans
- Integrate FOSSA into CI/CD pipelines
- Configure custom scanning rules
- Generate compliance reports

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 16+
- Git
- FOSSA account and API key

### 2. Setup

```bash
# Clone the repository
git clone <repository-url>
cd fossa-cli-training

# Install dependencies (intentionally vulnerable!)
npm install

# Install FOSSA CLI
curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash

# Set your API key
export FOSSA_API_KEY="your-api-key-here"
```

### 3. Run Your First Scan

```bash
# List detected targets
fossa list-targets

# Run analysis
fossa analyze

# Check for policy violations
fossa test
```

## 📚 Training Materials

1. **[Complete Tutorial](./FOSSA_CLI_TUTORIAL.md)** - Comprehensive step-by-step guide
2. **[Application Code](./app.js)** - Sample vulnerable Node.js application
3. **[Pipeline Examples](./.github/workflows/)** - CI/CD integration samples

## 🏗️ Repository Structure

```
fossa-cli-training/
├── README.md                          # This file
├── FOSSA_CLI_TUTORIAL.md              # Complete training guide
├── package.json                       # Vulnerable dependencies
├── app.js                            # Sample application
├── .fossa.yml                        # FOSSA configuration
├── .github/workflows/fossa-scan.yml   # GitHub Actions
├── .gitlab-ci.yml                    # GitLab CI/CD
└── docs/                             # Additional documentation
```

## 🧪 Vulnerable Packages Included

This repository includes the following intentionally vulnerable packages:

| Package | Version | Vulnerability Type |
|---------|---------|-------------------|
| express | 4.16.0 | Multiple CVEs |
| lodash | 4.17.4 | Prototype pollution |
| moment | 2.19.0 | ReDoS (Regular Expression DoS) |
| request | 2.88.0 | Deprecated, security issues |
| minimist | 0.0.8 | Prototype pollution |
| debug | 2.2.0 | ReDoS vulnerability |
| qs | 1.0.0 | Various vulnerabilities |
| tar | 2.0.0 | Arbitrary file overwrite |

## 🔧 Common Commands

```bash
# Basic analysis
fossa analyze

# Local analysis (no upload)
fossa analyze --output

# List all targets
fossa list-targets

# Generate reports
fossa report attribution

# Test against policies
fossa test

# Debug mode
fossa analyze --debug
```

## 📋 Training Exercises

### Exercise 1: Basic Scanning
1. Run `fossa list-targets`
2. Perform `fossa analyze --output`
3. Count the vulnerable dependencies

### Exercise 2: Configuration
1. Modify `.fossa.yml`
2. Compare scan results if dependency graph changes
3. Add custom project metadata to `.fossa.yml`

### Exercise 3: CI/CD Integration
1. Set up GitHub Actions workflow
2. Configure secret for API key
3. Test the worflow

### Exercise 4: Report Generation
2. Create attribution report
3. Export results to different formats

## 🐛 Troubleshooting

### Common Issues

**No API key provided:**
```bash
export FOSSA_API_KEY="your-key-here"
```

**No targets found:**
Ensure you're in a directory with `package.json`, `pom.xml`, or other supported project files.

**Analysis timeout:**
Use `.fossa.yml` to exclude large directories:
```yaml
paths:
  exclude:
    - node_modules
    - dist
```

## 📊 Expected Results

When you run FOSSA on this repository, you should see:
- **10+ vulnerable dependencies** detected
- **Multiple high-severity** vulnerabilities
- **License compliance** issues (if policies are configured)
- **Detailed dependency graph** with transitive dependencies

## 🔗 Additional Resources

- [FOSSA CLI Documentation](https://github.com/fossas/fossa-cli)
- [Complete Tutorial](./FOSSA_CLI_TUTORIAL.md)
- [FOSSA User Guide](https://docs.fossa.com/)
- [Policy Management](https://docs.fossa.com/docs/policy-management)

## 🆘 Getting Help

1. Check the [complete tutorial](./FOSSA_CLI_TUTORIAL.md)
2. Review [troubleshooting section](#-troubleshooting)
3. Consult FOSSA documentation
4. Contact your FOSSA administrator

## 📄 License

This training material is provided under the MIT License. See LICENSE file for details.

**Remember:** This is for training purposes only. Never use these vulnerable packages in production!

---

## 🎉 Ready to Start?

1. Follow the [Quick Start](#-quick-start) guide above
2. Open the [Complete Tutorial](./FOSSA_CLI_TUTORIAL.md)
3. Begin with Exercise 1
4. Learn by doing!

Happy scanning! 🔍
