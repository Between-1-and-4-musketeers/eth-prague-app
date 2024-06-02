
# DecGov

Fuly decentralized  governance running in the [ICP](https://internetcomputer.org/) chain

Every DAO needs a place to hold votes about proposals/changes to their operation. DecGov makes it super easy to create and maintain such a place. With just a few clicks, your DAO can hold a vote in just minutes!




## Project structure

The project is made up of 3 main parts:  
[Database](https://github.com/TheRamsay/eth-prague-pepani/tree/main/backend/db)  
[FrontEnd](https://github.com/TheRamsay/eth-prague-pepani)  
[API](https://github.com/TheRamsay/eth-prague-pepani-backend)

Each one of these parts is runned as a [ICP Cannister](https://internetcomputer.org/docs/current/concepts/canisters-code), communicating with each other through the ICP network. 

### Database

Database takes use of the awesome [IC-Sqlite pakage](https://github.com/froghub-io/ic-sqlite), we implemented database functions in Rust and exposed them to as an api with Candid.

### FrontEnd

Frontend uses NEXT.js React framework, its deployed as a static site inside of a canister. 

### API

Api is in Typescript, utilizing Azel for WASM bindings and the ability to be runned as a canister. 

## Features

Decentralization   
Abilty to write on blockchain using (evm-rpc-canister)[https://github.com/internet-computer-protocol/evm-rpc-canister]  


## How to run  

First, lets run the database canister.   

```bash
git clone https://github.com/TheRamsay/eth-prague-pepani
cd eth-prague-pepani/backend/db
dfx deploy
```
This should build, produce and deploy the canister. Take a note of its id.   

Then click the link you get in the terminal and you will get to the Candid UI. Here , one of the first options should be a button that runs the `create_table` functions. Click it to create all the necessary tables.  

Then, lets run the API canister  

```bash
git clone https://github.com/TheRamsay/eth-prague-pepani-backend
cd eth-prague-pepani-backend
```
Head to the file `src/service/actor-locator.ts` and change the `return createBackendActor("YOUR_DB_CANISTER_ID",...)` to the id of the database canister.  
Also check that the `EvmActor` canister id is correct. 

Then run    
```bash
dfx deploy
```

Then, lets run the FrontEnd canister.  

```bash
cd eth-prague-pepani
```

Here, create an `.env` file in the root of the project with the following content:  
```
NEXT_PUBLIC_IC_HOST = "http://localhost:8000"
CANISTER_ID = backend_canister_id
```

Then run  
```bash
dfx deploy
```

And you should be good to go! The UI should be available at the link you get in the terminal.


## Links 
App deploy: https://fgysu-kqaaa-aaaag-albxq-cai.icp0.io/
Db deploy: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=fbzua-hiaaa-aaaag-albxa-cai
Backend deploy: https://qiz7r-fqaaa-aaaal-ajh4a-cai.raw.icp0.io/