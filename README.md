# Alarmoquy

<img src="https://i.imgur.com/qAMhv6v.png" width="500">


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
User inputs default preferences, and can log into google calendar.
<img src="https://i.imgur.com/TeNCIxU.png" width="500">
<img src="https://i.imgur.com/3RBzUqc.png" width="500">

> Alarms Screen:
Add alarms and instantiate them when needed.
<img src="https://i.imgur.com/t8UEK0J.png" width="400">
<img src="https://i.imgur.com/rzPuRDg.png" width="400">

> Alarm Detail Screen:
User Labels alarm, sets location and desired arrival time along with alarm specific preferences.
Alarm is set and alarm time is dynamically set based on user preferences, google maps commute data, and real life user location data. 
<p align="center">
<img src="https://i.imgur.com/JHdkjlt.png" width="50%">
<img src="https://i.imgur.com/p4akdpC.png" width="50%">
</p>



> Google Login:
User can log in with google oath to authenticate the use of adding alarms from their respective calandars.


> Calendar Screen:
Calendar event data appears from the user's google calendar information, to add an alarm for an event the user simply clicks on the "add alarm" button on event they wish to create an alarm for.
<img src="https://i.imgur.com/5xoqX7o.png" width="500">
<img src="https://i.imgur.com/gi1fLYF.png" width="500">

> Push Notification:
Alarm goes on just in time! 
<img src="https://i.imgur.com/GXslLoQ.png" width="500">


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










