/* eslint-disable @typescript-eslint/no-require-imports */
// const fs = require('fs')
const { join } = require('path')
const { cwd } = require('process')
const { Scope } = require('ts-morph')
const { Project, ts, printNode } = require('ts-morph')

// exports.newFolder = (path, params) => {
//   const project = new Project({
//     tsConfigFilePath: join(path, '../../../../tsconfig.node.json')
//   })
//   project.addSourceFilesAtPaths(join(path, '../../app.router.ts'))
//   const sourceFile = project.getSourceFile(join(path, '../../app.router.ts'))
//   sourceFile.addFunction('newFunction', () => {})
//   sourceFile.save()
// }

function newFolder(path, params) {
  const project = new Project({
    tsConfigFilePath: join(path, '../../../tsconfig.node.json')
  })
  project.addSourceFilesAtPaths(join(path, './app.router.ts'))
  const sourceFile = project.getSourceFile(join(path, './app.router.ts'))
  const classDeclaration = sourceFile?.getClass('AppRouterFactory')
  const constructors = classDeclaration?.getConstructors()
  constructors[0].addParameter({
    decorators: [{ name: 'inject', arguments: ['BxampleRouter'] }],
    scope: Scope.Private,
    name: 'bxampleRouter',
    type: 'BxampleRouter'
  })
  console.log(classDeclaration?.getChildren())
  // sourceFile.saveSync()
  // sourceFile.save()
}

exports.newFile = (path) => {
  console.log(path)
}

exports.finish = () => {
  console.log('finish')
}

newFolder(cwd())
