#!/usr/bin/env node
/* eslint-disable no-undef */

import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import figlet from 'figlet'
import gradient from 'gradient-string'
import { exec } from 'child_process'

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to templates (docker, etc.)
const templatesPath = path.join(__dirname, '@lumiapi/core')

// Display the welcome message
const displayWelcomeMessage = () => {
  console.clear()
  console.log(
    gradient.pastel.multiline(figlet.textSync('Lumiapi Installer', { horizontalLayout: 'full' }))
  )
  console.log(
    chalk.blueBright.bold(
      '\nA new and easy way to create a rest API with TypeScript and Domain Driven Design!\n'
    )
  )
}

// Prompt the developer for project details
const askQuestions = () => {
  return inquirer.prompt([
    {
      name: 'projectName',
      type: 'input',
      message: 'What is the name of your project?',
      default: 'my-lumiapi-project',
    },
    {
      name: 'dockerize',
      type: 'confirm',
      message: 'Do you want to dockerize the project?',
    },
  ])
}

// Select the package manager
const selectManager = async () => {
  const { whichManagerPackage } = await inquirer.prompt([
    {
      name: 'whichManagerPackage',
      type: 'list',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn'],
      default: 'npm',
    },
  ])
  return whichManagerPackage;
}

// Create project folder structure
const createStructure = async (projectPath, spinner) => {
  try {
    const folders = [
      'src',
      'tests',
      'src/common',
      'src/app',
      'src/app/datasource',
      'src/app/domain',
      'src/app/infrastructure',
      'src/app/infrastructure/controllers',
      'src/app/infrastructure/entities',
      'src/common/exceptions',
      'src/common/i18n',
      'src/config',
      'src/middleware',
      'src/routes',
      'src/utils',
    ]

    for (const folder of folders) {
      const dirPath = path.join(projectPath, folder)
      if (fs.existsSync(dirPath)) {
        console.log(
          chalk.yellow(`Warning: Directory ${dirPath} already exists. Skipping creation.`)
        )
        continue
      }
      fs.ensureDirSync(dirPath)
    }

    spinner.succeed('Project folder structure created successfully!')
  } catch (error) {
    spinner.fail('Failed to create project structure.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1) // Exit the process on failure
  }
}

// Copy template files
const copyTemplateFiles = async (projectPath, dockerize, spinner) => {
  try {
    if (!fs.existsSync(templatesPath)) {
      throw new Error(`Template path ${templatesPath} not found.`)
    }

    const filesToCopy = [
      { source: 'Dockerfile', dest: 'Dockerfile' },
      { source: 'docker-compose.yml', dest: 'docker-compose.yml' },
      { source: '.gitignore', dest: '.gitignore' },
      { source: 'tsconfig.json', dest: 'tsconfig.json' },
    ]

    for (const file of filesToCopy) {
      const sourcePath = path.join(templatesPath, file.source)
      const destPath = path.join(projectPath, file.dest)
      if (fs.existsSync(sourcePath)) {
        fs.copySync(sourcePath, destPath)
      } else {
        console.log(chalk.yellow(`Warning: Template file ${file.source} not found. Skipping.`))
      }
    }

    spinner.succeed('Core of lumiapi copied successfully!')
  } catch (error) {
    spinner.fail('Failed to copy core lumiapi files.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

// Modify package.json
const modifyPackageJson = async (projectPath, projectName, spinner) => {
  try {
    const packageJsonPath = path.join(templatesPath, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Core lumiapi package.json not found at ${packageJsonPath}`)
    }

    const packageJson = fs.readJsonSync(packageJsonPath)
    packageJson.name = projectName

    const outputPath = path.join(projectPath, 'package.json')
    fs.writeJsonSync(outputPath, packageJson, { spaces: 2 })
    spinner.succeed('package.json configured successfully!')
  } catch (error) {
    spinner.fail('Failed to modify package.json.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

// Install dependencies
const installDependencies = (projectPath, spinner, managerDependency) => {
  return new Promise((resolve, reject) => {
    exec(`${managerDependency} install`, { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        spinner.fail('Failed to install dependencies.')
        console.error(chalk.red(`Error: ${error.message}`))
        return reject(error)
      }
      if (stderr) {
        console.error(chalk.yellow(`Warning: ${stderr}`))
      }
      console.log(stdout)
      spinner.succeed('Dependencies installed successfully!')
      resolve()
    })
  })
}

// Main function to run the script
const run = async () => {
  try {
    displayWelcomeMessage()
    const answers = await askQuestions()
    const { projectName, dockerize } = answers

    const managerDependency = await selectManager();

    const projectPath = path.join(process.cwd(), projectName)
    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(`Error: Directory "${projectName}" already exists. Choose a different name.`)
      )
      process.exit(1)
    }
    fs.ensureDirSync(projectPath)

    const spinner = ora(chalk.blueBright('Creating project structure...')).start()
    await createStructure(projectPath, spinner)

    spinner.start(chalk.blueBright('Copying necessary template files...'))
    await copyTemplateFiles(projectPath, dockerize, spinner)

    spinner.start(chalk.blueBright('Setting up package.json...'))
    await modifyPackageJson(projectPath, projectName, spinner)

    spinner.start(chalk.blueBright('Installing dependencies...'))
    await installDependencies(projectPath, spinner, managerDependency)

    console.log(chalk.greenBright(`\nProject "${projectName}" created successfully!\n`))
    console.log(`To start the project, run the following commands:\n`)
    console.log(`   cd ${projectName}`)
    if (dockerize) {
      console.log(`   cp .env.example .env`)
      console.log(`   docker-compose up -d`)
    } else {
      console.log(`   cp .env.example .env`)
      console.log(`   ${managerDependency} run dev`)
    }
    console.log(chalk.bold.green('\nHappy coding! 🚀\n'))
  } catch (error) {
    console.error(chalk.red(`Fatal error: ${error.message}`))
    process.exit(1)
  }
}

// Execute the script
run()
