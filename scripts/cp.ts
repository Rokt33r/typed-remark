const devDependencies = [
  'typescript',
  'ts-jest',
  'jest',
  'tslint',
]

const packageName = process.argv[2]

// If packageName isn't given, throw an error.
if (typeof packageName !== 'string' || packageName.length === 0) {
  throw new Error('PackageName doesn\'t exist.')
}

import * as shelljs from 'shelljs'
import * as path from 'path'

const rootDir = path.join(__dirname, '../')
const packageDir = path.join(rootDir, 'packages', packageName)

shelljs.mkdir(packageDir, path.join(packageDir, 'src'))
shelljs.cp(path.join(rootDir, 'templates', 'tsconfig.json'), packageDir)
shelljs.cp(path.join(rootDir, 'templates', '.gitignore'), packageDir)
shelljs.cd(packageDir)
// Generate package.json
shelljs.exec('npm init -y')

// Install devDependencies
shelljs.exec('npm i -D ' + devDependencies.join(' '))
