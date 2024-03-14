# Discord JS template in Typescript

## Installation

- Clone the repository
- Run `npm i` and `npm i -g typescript tsx` to install all dependences
- Change `.envExemple` file to `.env`
- Enter your bot token and bot id in `.env` file

## Developpement

- You can copy the ping.ts file in `/src/commands/default` to start creating your own commands
- You can modify the files in `/src/events` to use events as you would

## NPM commands

- Run `npm run dev` to run the dev mode
- Tun `npm run build` to build the project
- Run `npm run start` to run the compiled code

## Docker configuration

- Change the service name and the full path to your bot in `docker-compose.yml` file
- Run `docker compose up` to run the container