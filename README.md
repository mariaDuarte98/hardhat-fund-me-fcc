# Hardhat Fund Me
*This repo has been updated to work with Sepolia Testnet over Goerli.*

This was a project I made as part of the course  Javascript Blockchain/Smart Contract FreeCodeCamp Course. The course can be found here: https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=523s

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`


# Usage

Deploy:

```
yarn hardhat deploy
```

## Testing

```
yarn hardhat test
```

### Test Coverage

```
yarn hardhat coverage
```


# Deployment to a testnet 

```
yarn hardhat deploy --network sepolia
```

## Scripts

After deploy to a testnet or local net, you can run the scripts. 

```
yarn hardhat run scripts/fund.js
```

or
```
yarn hardhat run scripts/withdraw.js
```

## Estimate gas

You can estimate how much gas things cost by running:

```
yarn hardhat test
```

And you'll see and output file called `gas-report.txt`

## Verify on etherscan


```
yarn hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```

# Linting

`solhint` installation: [Documentation](https://protofire.github.io/solhint/#installation)

To check linting / code formatting:
```
yarn lint
```
or, to fix: 
```
yarn lint:fix
```

# Formatting 

```
yarn format
```

# Thank you!


