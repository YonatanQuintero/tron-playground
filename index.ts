#!/usr/bin/env node

import { estimateResources } from "./src/v2/estimate-resources";
import { resourcesDelegation } from "./src/v2/resources-delegation";
import { sendUsdt } from "./src/v2/send-usdt";

/**
 * Displays usage instructions.
 */
const displayUsage = (): void => {
  console.log(`
Usage: node execute-task.js <task> [additionalTasks...]

Parameters:
  <task>            - The primary task to execute. Options: estimateResources, sendUsdt, resourcesDelegation
  [additionalTasks] - (Optional) Additional tasks to execute sequentially.

Options:
  -h, --help        - Display this help message.

Examples:
  Execute a single task:
    node execute-task.js estimateResources

  Execute multiple tasks:
    node execute-task.js estimateResources sendUsdt

  Execute all tasks:
    node execute-task.js estimateResources sendUsdt resourcesDelegation
  `);
};

/**
 * Maps task names and their aliases to their corresponding functions.
 */
const taskMap: { [key: string]: () => Promise<void> } = {
  estimateresources: estimateResources,
  sendusdt: sendUsdt,
  resourcesdelegation: resourcesDelegation,
  // Aliases
  "estimate-resources": estimateResources,
  "send-usdt": sendUsdt,
  "resources-delegation": resourcesDelegation,
};

/**
 * Retrieves and validates tasks based on user input.
 * @param tasks - Array of task names provided by the user.
 * @returns Array of task functions to execute.
 * @throws Error if no tasks are provided or if an invalid task name is found.
 */
const getTasksToExecute = (tasks: string[]): Array<() => Promise<void>> => {
  if (tasks.length === 0) {
    throw new Error("No task specified.");
  }

  const functionsToExecute: Array<() => Promise<void>> = [];

  tasks.forEach((taskName: string) => {
    const normalizedTaskName = taskName.toLowerCase();
    const taskFunction = taskMap[normalizedTaskName];
    if (!taskFunction) {
      throw new Error(
        `Invalid task name: "${taskName}". Valid tasks are: ${Object.keys(taskMap)
          .filter((key) => !key.includes("-")) // Remove aliases from display
          .join(", ")}`
      );
    }
    functionsToExecute.push(taskFunction);
  });

  return functionsToExecute;
};

/**
 * Executes the provided tasks sequentially.
 * @param tasks - Array of task functions to execute.
 */
const executeTasks = async (tasks: Array<() => Promise<void>>): Promise<void> => {
  for (const task of tasks) {
    try {
      console.log(`\nStarting task: ${task.name}`);
      await task();
      console.log(`Completed task: ${task.name}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error executing task "${task.name}":`, error.message);
      } else {
        console.error(`Unknown error executing task "${task.name}".`);
      }
      throw error; // Re-throw to handle in main
    }
  }
};

/**
 * Parses command-line arguments and orchestrates task execution.
 */
const main = async (): Promise<void> => {
  const args: string[] = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    displayUsage();
    process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
  }

  try {
    const tasksToExecute: Array<() => Promise<void>> = getTasksToExecute(args);
    await executeTasks(tasksToExecute);
    console.log("\nAll specified tasks have been executed successfully.");
  } catch (error) {
    console.error("\nExecution halted due to errors.");
    process.exit(1);
  }
};

// Invoke the main function
main();
