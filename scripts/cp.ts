const devDependencies = [
  '@types/jest',
]

const templates = [
  '.gitignore',
  'jest.json',
  'tsconfig.json',
]

const paths = {
  main: 'node/lib/index.js',
  module: 'es/lib/index.js',
  types: 'typings/lib/index.d.ts',
}

const scripts = {
  'build': 'npm run clean && npm run build:es && npm run build:node',
  'build:es': '../../node_modules/.bin/tsc -p . -d --declarationDir typings --outDir es',
  'build:node': '../../node_modules/.bin/tsc -p . -m commonjs --outDir node',
  'build:watch': '../../node_modules/.bin/tsc -p . -w --outDir es',
  'clean': '../../node_modules/.bin/rimraf es node typings',
  'lint': '../../node_modules/.bin/tslint -c ../../tslint.json -p ./tsconfig.json',
  'prepublishOnly': 'npm run lint && npm run build && npm run test',
  'test': '../../node_modules/.bin/jest -c jest.json',
  'test:quick': '../../node_modules/.bin/jest -c jest.json es/*',
  'test:watch': '../../node_modules/.bin/jest -c jest.json --watch es/*',
}

const files = [
  'src/lib/*',
  'es/lib/*',
  'node/lib/*',
  'typings/lib/*',
]

const packageName = process.argv[2]

// If packageName isn't given, throw an error.
if (typeof packageName !== 'string' || packageName.length === 0) {
  throw new Error('PackageName doesn\'t exist.')
}

import * as shelljs from 'shelljs'
import * as path from 'path'
import * as fs from 'fs'

// Create directories
const rootDir = path.join(__dirname, '../')
const packageDir = path.join(rootDir, 'packages', packageName)
shelljs.mkdir(
  packageDir,
  path.join(packageDir, 'src'),
  path.join(packageDir, 'src/lib'),
  path.join(packageDir, 'src/specs'),
)

// Copy template files
templates.forEach(template => {
  shelljs.cp(path.join(rootDir, 'templates', template), packageDir)
})

// Generate package.json
shelljs.cd(packageDir)
shelljs.exec('npm init -y')

// Inject paths, scripts and files
const packageJSONPath = path.join(packageDir, 'package.json')
const packageJSON = fs.readFileSync(packageJSONPath).toString('utf-8')
const parsedJSON = JSON.parse(packageJSON)
Object.assign(parsedJSON, paths, {
  files,
  scripts,
  version: '0.1.0',
  name: `typed-${packageName}`,
})
fs.writeFileSync(packageJSONPath, JSON.stringify(parsedJSON, null, 2))

// Install devDependencies
shelljs.exec('npm i -D ' + devDependencies.join(' '))
