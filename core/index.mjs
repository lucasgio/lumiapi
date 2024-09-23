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

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ajustar la ruta de plantillas (Verificar la ubicación de tu carpeta core)
const templatesPath = path.join(__dirname)

// Mostrar mensaje de bienvenida
const displayWelcomeMessage = () => {
  console.clear()
  console.log(
    gradient.pastel.multiline(figlet.textSync('RESTSNAP CLI', { horizontalLayout: 'full' }))
  )
  console.log(
    chalk.blueBright.bold(
      '\nA new and easy way to create a rest API with TypeScript and Domain Driven Design!\n'
    )
  )
}

// Preguntar los detalles del proyecto
const askQuestions = () => {
  return inquirer.prompt([
    {
      name: 'projectName',
      type: 'input',
      message: 'What is the name of your project?',
      default: 'my-restsnap-project',
    },
    {
      name: 'dockerize',
      type: 'confirm',
      message: 'Do you want to dockerize the project?',
    },
  ])
}

// Seleccionar el administrador de paquetes
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

// Crear la estructura de carpetas del proyecto
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
      fs.ensureDirSync(dirPath)
    }

    spinner.succeed('Project folder structure created successfully!')
  } catch (error) {
    spinner.fail('Failed to create project structure.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

// Copiar los archivos de plantilla
const copyTemplateFiles = async (projectPath, dockerize, spinner) => {
  try {

  
    
    if (!fs.existsSync(templatesPath)) {
      throw new Error(`Template path ${templatesPath} not found.`)
    }

    const filesToCopyWithoutDocker = [
      { source: '.gitignore', dest: '.gitignore' },
      { source: 'tsconfig.json', dest: 'tsconfig.json' },
      { source: 'package_template.json', dest: 'package.json' },
      { source: 'README.md', dest: 'README.md' },
      { source: '.env.example', dest: '.env.example' },
      { source: 'jest.config.js', dest: 'jest.config.js' },
      { source: 'src/app.ts', dest: 'src/app.ts' },
      { source: 'src/server.ts', dest: 'src/server.ts' },
      { source: 'src/common/exceptions/BadRequestException.ts', dest: 'src/common/exceptions/BadRequestException.ts' },
      { source: 'src/common/exceptions/ForbiddenRequestException.ts', dest: 'src/common/exceptions/ForbiddenRequestException.ts' },
      { source: 'src/common/exceptions/NotFoundRequestException.ts', dest: 'src/common/exceptions/NotFoundRequestException.ts' },
      { source: 'src/common/exceptions/UnauthorizedRequestException.ts', dest: 'src/common/exceptions/UnauthorizedRequestException.ts' },
      { source: 'src/common/exceptions/README.md', dest: 'src/common/exceptions/README.md' },
      { source: 'src/config/app.ts', dest: 'src/config/app.ts' },
      { source: 'src/middleware/errorHandler.ts', dest: 'src/middleware/errorHandler.ts' },
      { source: 'src/routes/routes.ts', dest: 'src/routes/routes.ts' },
      { source: 'src/utils/CustomException.ts', dest: 'src/utils/CustomException.ts' },
      { source: 'src/utils/LoggerHelper.ts', dest: 'src/utils/LoggerHelper.ts' },
      { source: '.eslintrc.js', dest: '.eslintrc.js' },
      { source: 'tsconfig.json', dest: 'tsconfig.json' },
      { source: '.gitignore', dest: '.gitignore' },
      { source: 'package_template.json', dest: 'package.json' },
      { source: '.prettierrc.json', dest: '.prettierrc.json' }, 
    ]

    const filesToCopy = dockerize ? filesToCopyWithoutDocker.concat({ 
      source: 'Dockerfile', dest: 'Dockerfile',
      source: 'docker-compose.yml', dest: 'docker-compose.yml',
    }) : filesToCopyWithoutDocker

    for (const file of filesToCopy) {
      const sourcePath = path.join(templatesPath, file.source)
      const destPath = path.join(projectPath, file.dest)
      if (fs.existsSync(sourcePath)) {
        fs.copySync(sourcePath, destPath)
      } else {
        console.log(chalk.yellow(`Warning: Template file ${file.source} not found. Skipping.`))
      }
    }

    spinner.succeed('Core of restsnap copied successfully!')
  } catch (error) {
    spinner.fail('Failed to copy core restsnap files.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

// Modificar el package.json
const modifyPackageJson = async (projectPath, projectName, spinner) => {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = fs.readJsonSync(packageJsonPath)
    packageJson.name = projectName

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 })
    spinner.succeed('package.json configured successfully!')
  } catch (error) {
    spinner.fail('Failed to modify package.json.')
    console.error(chalk.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

// Instalar las dependencias
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

// Ejecutar el script
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

    if (dockerize) {
      console.log(chalk.greenBright(`\nProject "${projectName}" created successfully!\n`))
      console.log(`To start the project, run the following commands:\n`)
      console.log(`   cd ${projectName}`)
      console.log(`   cp .env.example .env`)
      console.log(`   docker-compose up -d`)
      console.log(chalk.bold.green('\nHappy coding! 🚀\n'))
    } else {
      console.log(chalk.greenBright(`\nProject "${projectName}" created successfully!\n`))
      console.log(`To start the project, run the following commands:\n`)
      console.log(`   cd ${projectName}`)
      console.log(`   cp .env.example .env`)
      console.log(`   ${managerDependency} run dev`)
      console.log(chalk.bold.green('\nHappy coding! 🚀\n'))
    }
  } catch (error) {
    console.error(chalk.red(`Fatal error: ${error.message}`))
    process.exit(1)
  }
}

run()
