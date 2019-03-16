# shiftWerk
shiftWerk is a community shift planning application that connects shift workers with shift work

## Team

  - __Product Owner__: daft-punk thesis
  - __Scrum Master__: Jay Kindell
  - __Development Team Members__: Alexa Welch, Taniecia Duplantis, David Lum, Frank D'Amico

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage
// !!! UPDATE USAGE !!! //
- npm start: starts the development server and compiles client files

- npm build: compiles the current state of the client files (typically used when starting the production server)

- node server/index.js: starts the production server (typically used to connect to database and complete http requests)


## Requirements

- Node 8.15.0
- Express 4.16.4
- PostgreSQL 7.8.2
- Angular 7.20
- Ionic/angular 1.4.0

## Development

Client Files:
Home: 
- home.page - entry point for new user, werker, maker

New User:
- new-user.page - login for new user(s)

!!! User: (!!! we can't reuse components so these should be redistributed to werker & maker directories)
- history, notifications, pendingshifts, schedule, 

Maker:
- maker-home - maker sees 3 shift views:  
  - maker-unfilled-shifts - upcoming shifts (open positions available)
  - maker-pending-shifts - maker views upcoming shifts (positions filled)
  - maker-history-shifts - maker views past shifts, including werkers & their ratings

- maker-create-shift - maker create new shift, details, positions needed
- maker-profile - component for Maker user profile
- maker-positions - !!! is this to create more positions??? do we need???
- maker-search - search for werkers to invite to shift
- maker-settings - opens maker-profile to update/edit/save
- maker-navbar - bottom navigation(home, profile, ...)

Werker:
- werker-home - werker sees list of 
  - werker-shift-small - condensed details of pending shifts
  - werker-shift-expanded - expanded details of pending shift
- werker-notifications - show shifts werker has been invited to

- werker-profile - component for Werker profile
  - werker-settings - opens werker-profile from cog to update/save
- werker-schedule - shows upcoming shifts
- werker-history - shows past shifts with maker ratings
- werker-navbar - bottom navigation
- werker-search - search for shifts
 
Back-end Files:

- database/index.js - the database configuration

- server/index.js - the server


### Installing Dependencies

From within the root directory:

```
npm install
```

### Roadmap

View the project roadmap [here](https://github.com/daft-funk/shiftwerk/issues)


## Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
