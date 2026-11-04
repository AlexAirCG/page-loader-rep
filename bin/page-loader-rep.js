#!/usr/bin/env node
import { Command } from 'commander'
import loadPage from '../src/index.js'

const program = new Command()

program
  .name('page-loader-rep')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>')
  .option('-o, --output <dir>', 'output directory', process.cwd())
  .action((url, options) => {
    loadPage(url, options.output)
      .then((filepath) => {
        console.log(filepath)
      })
      .catch((error) => {
        console.error(error.message)
        process.exit(1)
      })
  })

program.parse()
