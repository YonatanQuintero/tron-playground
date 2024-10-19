# Tron Playground Application

This project is a TypeScript application that interacts with the Tron blockchain using the `tronweb` library. The application demonstrates various functionalities related to Tron blockchain operations, such as estimating resources, sending USDT tokens, and managing resources delegation.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)
- [License](#license)

## Project Structure

The project's structure is as follows:

```
tron-playground/
├── config.ts
├── package-lock.json
├── package.json
├── README.md
├── src/
│   ├── services/
│   │   ├── theter.service.ts
│   │   ├── tron-web.service.ts
│   │   └── tron.service.ts
│   ├── types/
│   │   └── resources.type.ts
│   └── v2/
│       ├── estimate-resources.ts
│       ├── resources-delegation.ts
│       └── send-usdt.ts
├── tsconfig.json
└── index.ts
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/YonatanQuintero/tron-playground.git
cd tron-playground
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Tron wallet private key:

```
TRON_ADDRESS=your_tron_address
TRON_PRIVATE_KEY=tron_address_private_key
TRON_API_KEY=your_tron_pro_api_key
NILE_USDT_CONTRACT=nile_usdt_contract
USER_ADDRESS=another_user_address
USER_PRIVATE_KEY=user_address_private_key
```

### 4. Run the Application

Execute specific tasks using the CLI script `index.ts` with `ts-node`:

```bash
npx ts-node index.ts <task> [additionalTasks...]
```

**Examples:**

- **Execute a Single Task:**

  ```bash
  npx ts-node index.ts estimateResources
  ```

- **Execute Multiple Tasks:**

  ```bash
  npx ts-node index.ts estimateResources sendUsdt
  ```

- **Execute All Tasks:**

  ```bash
  npx ts-node index.ts estimateResources sendUsdt resourcesDelegation
  ```

**Alternative Execution Method:**

If you prefer running the script directly without specifying `ts-node` each time, you can add execution permissions (on Unix-like systems) and run the script as follows:

1. **Make the Script Executable:**

   ```bash
   chmod +x index.ts
   ```

2. **Run the Script:**

   ```bash
   ./index.ts <task> [additionalTasks...]
   ```

**Note:** Ensure that `ts-node` is installed either globally or as a development dependency in your project for the above method to work.

## Key Features

- **Estimate Resources**: The `estimate-resources.ts` file demonstrates how to estimate the required resources for a Tron transaction.
  
- **Send USDT Tokens**: The `send-usdt.ts` file shows how to send USDT tokens to a specified address.
  
- **Manage Resources Delegation**: The `resources-delegation.ts` file demonstrates how to delegate resources from the main wallet to a user wallet and send user transactions.
  
- **Command-Line Interface (CLI)**: The `index.ts` script allows executing specific tasks based on command-line arguments, enhancing flexibility and control.
  
- **TypeScript Support**: Leveraging TypeScript ensures type safety and better tooling support, improving code reliability and maintainability.
  
- **Modular Architecture**: Organized with a clear directory structure, separating services, types, and tasks for better code management.

## License

This project is licensed under the ISC License.

---