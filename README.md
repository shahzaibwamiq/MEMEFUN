# Meme-fun Coin Launcher using ZigChain SDK
---

## Overview

This project is a **Meme-fun Coin Launcher** built using the **ZigChain SDK**, backed by **Cosmos-Kit**. It enables users to deploy and manage custom blockchain-based tokens efficiently.

---

## Tech Stack

- **ZigChain SDK** (`@zigchain/zigchain-sdk@0.0.18`)
- **Cosmos-Kit** (for wallet management)
- **Node.js** (for backend interactions)
- **JavaScript/TypeScript** (for frontend and SDK integration)

---

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

### Setup
Clone the repository:
```sh
git clone https://github.com/yamaankhan20/meme-fun.git
cd meme-fun
```

Install dependencies:
```sh
npm install
```

---

## Set Up the Zigchain

### 1.1 Initialize Shadcn UI

Set up Shadcn UI by running:

```bash
npx shadcn@latest init
```

### 1.2 Configure `.npmrc` to access the Private Zigchain SDK

To interact with the Zigchain blockchain, you will need to install the `zigchain-sdk` package.

The `zigchain-sdk` is a private package hosted on GitHub Package Registry. To install it, you need to configure your project to access the private package using a valid authentication token.

Create a `.npmrc` file in the root directory of your project with the following content:

```ini
//npm.pkg.github.com/:_authToken=AUTH_TOKEN
@zigchain:registry=https://npm.pkg.github.com
always-auth=true
```

- Replace `AUTH_TOKEN` with the token provided to you.
- The `always-auth=true` ensures the token is used for all requests to GitHub's registry.

### 1.3 Install ZigChain SDK:
```sh
npm install @zigchain/zigchain-sdk@0.0.18 --legacy-peer-deps
```

### 1.4 Install Cosmos Kit:
```sh
npm install cosmos-kit@2.23.9 --legacy-peer-deps
```

### 1.5 Install Chain Registry:
```sh
npm install chain-registry --legacy-peer-deps
```

### 1.6 Install Cosmos React:
```sh
npm install @cosmos-kit/react --legacy-peer-deps
```

### 1.7 Install ZigChain JS:
```sh
npm install @zigchain/zigchainjs@0.0.3 --legacy-peer-deps
```

---

## Running the Application
Start the development server:
```sh
npm run dev
```

---

## Features
- Create and deploy new blockchain tokens.
- Connect to Cosmos-based wallets via **Cosmos-Kit**.
- Manage token parameters such as supply, decimals, and metadata.
- Broadcast transactions securely using **ZigChain SDK**.

## License
This project is licensed under the **MIT License**.
