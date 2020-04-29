# TwilioHackCoronavirus

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.

## About
The frontend Angular application helps consumers find hard-to-find grocery items due to the Coronavirus situation. Items like toilet paper, kitchen towels, meat, eggs have been in short supply since many people bought existing stock in panic. Consumers are frequently dissapointed at grocery stores to not find these items now. The app allows consumers who are at some stores carrying these items, to help their fellow citizens by publishing an image with location information.

## How it works
This application uses Angular 5.2.1 with bootstrap UI. There are 2 main pages 1) Items page - Displays Items requested by others and collects subscriber information if they need an item 2) Image page - Allows shoppers to take a picture and send location information to the system. The server side system then matches an Item submitted with requests and sends out an SMS message to persons requesting the item.

## How to use it
The application is deployed as a website. It is currently hosted at https://twilio-hackathon-menezes.herokuapp.com/

## Setup
- Nodejs
- Angular 5.2+
- npm

## Local development
After the above requirements have been met:
1. Clone this repository and cd into it
```
https://github.com/pipe2path/twilio-hack-coronavirus.git
cd twilio-hack-coronavirus
```

2. Install dependencies
```
npm install
```

3. Set your environment variables
```
npm run setup
```

4. Run the application
```
ng serve
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4050/`. 
The app will automatically reload if you change any of the source files.

## Cloud deployment
You can deploy this application to variety of host services. I have used Heroku which offers a great mix of deployment options and additional resources for Database, Cloud storage etc.
[Heroku](https://dashboard.heroku.com/)

## License
[MIT](https://opensource.org/licenses/mit-license.html)



