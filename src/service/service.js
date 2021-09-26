"use strict";

const { Cli } = require(`./cli`);

const { DEFAULT_COMMAND, USER_ARGV_INDEX, ExitCode } = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);

const [userCommand] = userArguments;

if (userArguments.length === 0) {
  Cli[DEFAULT_COMMAND].run();
} else if (!Cli[userCommand]) {
  process.exit(ExitCode.ERROR);
}

Cli[userCommand].run(userArguments.slice(1));
