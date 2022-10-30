#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import node_fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

let timezone = moment.tz.guess();

if(args.t){
    timezone = args.t;
}

if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
    `)
}else{
    let latitude = '35';
    if(args.n){
        latitude = args.n;
    }

    if(args.s){
        latitude = args.s;
    }else{
        console.log("Latitude must be in range");
    }

    let longtitude = '79';
    if(args.e){
        longtitude = args.e;
    }

    if(args.w){
            longtitude = args.w;
    }else{
        console.log("Longitude must be in range")
    }

    const response = await node_fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longtitude + '&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum&timezone=' + timezone)

    const data = await response.json();

    if(args.j){
        console.log(data);
        process.exit(0);
    }

    const days = args.d;

    if (days == 0) {
        console.log("today.")
    } else if (days > 1) {
        console.log("in " + days + " days.")
    } else {
        console.log("tomorrow.")
    }
}
