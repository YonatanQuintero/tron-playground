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

4. Run the application:

```bash
npm start
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the application in development mode.

## Key Features

- Estimate resources: The `estimate-resources.ts` file demonstrates how to estimate the required resources for a transaction.
- Send USDT tokens: The `send-usdt.ts` file shows how to send USDT tokens to a specified address.
- Manage resources delegation: The `resources-delegation.ts` file demonstrates how to delegate resources from main wallet to user wallet adn then send user transaction.

## License

This project is licensed under the ISC License.