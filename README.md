# Alarmoquy


![](https://i.imgur.com/xx40SQS.png){:height="700px" width="400px"}


Alarmoquy is a smart alarm that takes commute data from google maps and dynamically updates the alarm based on a desired arrival time. We run the data through our advanced algorithm by taking into account your actual daily commute length against google's estimated time. Add google calendar implementation, several custom user settings, and you have a highly accurate smart alarm that ensures you won't be late again!

## Team

  - __Product Owner__: Danny Schrader
  - __Scrum Master__: Rory Eagan
  - __Development__: Quentin Vidal

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)


## Usage

> Settings:
User inputs default preferences.

> Alarms Screen:
Add alarms and instantiate them when needed.
> Alarm Detail Screen:
User Labels alarm, sets location and desired arrival time along with alarm specific preferences.
Alarm is set and alarm time is dynamically set based on user preferences, google maps commute data, and real life user location data. 
> Google Login:
User can log in with google oath to authenticate the use of adding alarms from their respective calandars.
> Calendar Screen:
Calendar event data appears from the user's google calendar information, to add an alarm for an event the user simply clicks on the "add alarm" button on event they wish to create an alarm for.
> Push Notification:
Alarm goes on just in time! 

## Development

### Installing Dependencies

From within the root directory:

Fork and clone:
git clone https://github.com/HouseMartell/commuteAlarm.git

Install Dependencies:
Npm install

to run: 
```npm start```

local server (optional)
```npm run server dev```










