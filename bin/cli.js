#!/usr/bin/env node
import { Command } from 'commander'
import { greet } from '../src/index.js'

const program = new Command()

program
  .name('my-cli')
  .description('Short description of what the tool does')
  .version('1.0.0')
  .argument('[name]', 'who to greet', 'world')
  .option('-u, --upper', 'print in upper case')
  .action((name, options) => {
    const message = greet(name)
    console.log(options.upper ? message.toUpperCase() : message)
  })

program.parse()
