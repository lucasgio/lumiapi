#!/usr/bin/env node
/* eslint-disable no-undef */

import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to templates (docker, etc.)
const templatesPath = path.join(__dirname, 'templates')

// Prompt the developer for project details
const askQuestions = () => {
  console.log('\nWelcome to Turboapi Project Installer!\n')

  return inquirer.prompt([
    {
      name: 'projectName',
      type: 'input',
      message: 'What is the name of your project?',
      default: 'my-ts-project',
    },
    {
      name: 'dockerize',
      type: 'confirm',
      message: 'Do you want to dockerize the project?',
    },
  ])
}

// Create project folder structure
const createStructure = (projectPath) => {
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

  folders.forEach((folder) => {
    const dirPath = path.join(projectPath, folder)
    fs.ensureDirSync(dirPath)
  })
}

// Copy template files like Dockerfile, etc.
const copyTemplateFiles = (projectPath, dockerize) => {
  // If dockerize is true, copy Dockerfile and docker-compose.yml
  if (dockerize) {
    fs.copyFileSync(path.join(templatesPath, 'Dockerfile'), path.join(projectPath, 'Dockerfile'))
    fs.copyFileSync(
      path.join(templatesPath, 'docker-compose.yml'),
      path.join(projectPath, 'docker-compose.yml')
    )
  }

  // Copy other files like .gitignore and tsconfig.json
  fs.copyFileSync(path.join(templatesPath, '.gitignore'), path.join(projectPath, '.gitignore'))
  fs.copyFileSync(
    path.join(templatesPath, 'tsconfig.json'),
    path.join(projectPath, 'tsconfig.json')
  )
  // Copy the app.ts and server.ts files
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'app.ts'),
    path.join(projectPath, 'src', 'app.ts')
  )
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'server.ts'),
    path.join(projectPath, 'src', 'server.ts')
  )

  // Copy exception files
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'common', 'exceptions', 'BadRequestException.ts'),
    path.join(projectPath, 'src', 'common', 'exceptions', 'BadRequestException.ts')
  )
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'common', 'exceptions', 'ForbiddenRequestException.ts'),
    path.join(projectPath, 'src', 'common', 'exceptions', 'ForbiddenRequestException.ts')
  )
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'common', 'exceptions', 'NotFoundRequestException.ts'),
    path.join(projectPath, 'src', 'common', 'exceptions', 'NotFoundRequestException.ts')
  )
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'common', 'exceptions', 'UnauthorizedRequestException.ts'),
    path.join(projectPath, 'src', 'common', 'exceptions', 'UnauthorizedRequestException.ts')
  )

  fs.copyFileSync(
    path.join(templatesPath, 'src', 'common', 'exceptions', 'README.md'),
    path.join(projectPath, 'src', 'common', 'exceptions', 'README.md')
  )

  // Copy config app.ts file
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'config', 'app.ts'),
    path.join(projectPath, 'src', 'config', 'app.ts')
  )

  // Copy middleware errorHandler.ts file
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'middleware', 'errorHandler.ts'),
    path.join(projectPath, 'src', 'middleware', 'errorHandler.ts')
  )

  // Copy routes routes.ts file
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'routes', 'routes.ts'),
    path.join(projectPath, 'src', 'routes', 'routes.ts')
  )

  // Copy utils LoggerHelper.ts file
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'utils', 'LoggerHelper.ts'),
    path.join(projectPath, 'src', 'utils', 'LoggerHelper.ts')
  )
  // Copy utils CustomException.ts file
  fs.copyFileSync(
    path.join(templatesPath, 'src', 'utils', 'CustomException.ts'),
    path.join(projectPath, 'src', 'utils', 'CustomException.ts')
  )

  // Copy the .env.example eslintrc and prettierrc jest.config.js files
  fs.copyFileSync(path.join(templatesPath, '.env.example'), path.join(projectPath, '.env.example'))
  fs.copyFileSync(path.join(templatesPath, '.eslintrc.js'), path.join(projectPath, '.eslintrc.js'))
  fs.copyFileSync(
    path.join(templatesPath, 'jest.config.js'),
    path.join(projectPath, 'jest.config.js')
  )
}

// Modify package.json to set project name
const modifyPackageJson = (projectPath, projectName) => {
  const packageJsonPath = path.join(templatesPath, 'package.json')
  const packageJson = fs.readJsonSync(packageJsonPath) // Read the template package.json

  packageJson.name = projectName // Set the project name

  const outputPath = path.join(projectPath, 'package.json')
  fs.writeJsonSync(outputPath, packageJson, { spaces: 2 }) // Write the modified package.json
}

// Main function to run the script
const run = async () => {
  console.clear()
  console.log('Starting the Turboapi Project Installer...\n')

  const answers = await askQuestions()
  const { projectName, dockerize } = answers

  // Create project directory
  const projectPath = path.join(process.cwd(), projectName)
  fs.ensureDirSync(projectPath)

  console.log(`\nCreating project structure for "${projectName}"...\n`)
  // Create the folder structure
  createStructure(projectPath)

  console.log('Copying necessary template files...\n')
  // Copy required template files
  copyTemplateFiles(projectPath, dockerize)

  console.log('Setting up package.json...\n')
  // Modify the package.json file with the project name
  modifyPackageJson(projectPath, projectName)




  console.log(`\nProject "${projectName}" created successfully!\n`)
  if (dockerize) {
    console.log('Dockerfile and docker-compose.yml have been added.')
  }



  if (dockerize) {
    console.log('To start the project, run the following commands:\n')
    console.log(`   cd ${projectName}`)
    console.log(`   npm install or yarn install`)
    console.log(`   docker-compose up -d\n`)
    console.log('Happy coding!\n')
    return
  } else {
    console.log('Installing dependencies done')

    console.log('To start the project, run the following commands:\n')
    console.log(`   cd ${projectName}`)
    console.log(`   npm install or yarn install`)
    console.log(`   npm run dev or yarn dev\n`)
    console.log('Happy coding!\n')
    return
  }
}

// Execute the script
run()
