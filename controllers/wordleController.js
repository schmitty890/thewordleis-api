import puppeteer from "puppeteer";
import luxon from "luxon";
import cron from "node-cron";
import chalk from "chalk";
import mongoose from "mongoose";

import { WordSchema } from "../models/wordModel";
const CurrentWord = mongoose.model("CurrentWord", WordSchema);

let originalWordle = "";
let originalDay = 0;
let newWordle = "";

async function findOne() {
  try {
    CurrentWord.find({}, (err, latestWord) => {
      if (err) {
        res.send(err);
      }

      console.log(latestWord);
      if (latestWord.length !== 0) {
        console.log("original wordle: " + latestWord[1].word);
        originalWordle = latestWord[1].word;
        originalDay = latestWord[1].day;
      }
    })
      .sort({ $natural: -1 })
      .limit(2); // set to last known value in database (maybe hawaii word?)

    CurrentWord.find({}, (err, latestWord) => {
      if (err) {
        res.send(err);
      }
      console.log(latestWord);
      if (latestWord.length !== 0) {
        console.log("new wordle: " + latestWord[0].word);
        newWordle = latestWord[0].word;
      }
    })
      .sort({ $natural: -1 })
      .limit(1); // set to last known value in database (maybe hawaii word?)
  } catch (err) {
    console.log(err);
  } finally {
    // client.close();
  }
}

await findOne();

export const getTheWordle = async (req, res) => {
  console.log("getTheWordle");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulateTimezone("Pacific/Apia"); // the furthest east time zone I found

  await page.goto("https://www.nytimes.com/games/wordle/index.html");
  await page.waitForTimeout(3000);
  // click close button
  const button = await (
    await page.evaluateHandle(
      `document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-modal").shadowRoot.querySelector("div > div > div")`
    )
  ).asElement();
  button.click();

  const spaces = [
    {
      spaceName: "row 1 space 1",
      row: 1,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 1 space 2",
      row: 1,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 1 space 3",
      row: 1,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 1 space 4",
      row: 1,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 1 space 5",
      row: 1,
      space: 5,
      guess: "E",
    },
    {
      spaceName: "row 2 space 1",
      row: 2,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 2 space 2",
      row: 2,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 2 space 3",
      row: 2,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 2 space 4",
      row: 2,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 2 space 5",
      row: 2,
      space: 5,
      guess: "E",
    },
    {
      spaceName: "row 3 space 1",
      row: 3,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 3 space 2",
      row: 3,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 3 space 3",
      row: 3,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 3 space 4",
      row: 3,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 3 space 5",
      row: 3,
      space: 5,
      guess: "E",
    },
    {
      spaceName: "row 4 space 1",
      row: 4,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 4 space 2",
      row: 4,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 4 space 3",
      row: 4,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 4 space 4",
      row: 4,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 4 space 5",
      row: 4,
      space: 5,
      guess: "E",
    },
    {
      spaceName: "row 5 space 1",
      row: 5,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 5 space 2",
      row: 5,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 5 space 3",
      row: 5,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 5 space 4",
      row: 5,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 5 space 5",
      row: 5,
      space: 5,
      guess: "E",
    },
    {
      spaceName: "row 6 space 1",
      row: 6,
      space: 1,
      guess: "H",
    },
    {
      spaceName: "row 6 space 2",
      row: 6,
      space: 2,
      guess: "O",
    },
    {
      spaceName: "row 6 space 3",
      row: 6,
      space: 3,
      guess: "U",
    },
    {
      spaceName: "row 6 space 4",
      row: 6,
      space: 4,
      guess: "S",
    },
    {
      spaceName: "row 6 space 5",
      row: 6,
      space: 5,
      guess: "E",
    },
  ];

  for (var i = 0; i < spaces.length; i++) {
    console.log(spaces[i].spaceName);
    const guess = await (
      await page.evaluateHandle(
        `document.querySelector("body > game-app").shadowRoot.querySelector("#board > game-row:nth-child(${spaces[i].row})").shadowRoot.querySelector("div > game-tile:nth-child(${spaces[i].space})").shadowRoot.querySelector("div")`
      )
    ).asElement();
    guess.type(spaces[i].guess);
    await page.waitForTimeout(500);
    if (spaces[i].space === 5) {
      page.keyboard.press("Enter");
      await page.waitForTimeout(3000);
      if (spaces[i].space === 5 && spaces[i].row === 6) {
        console.log("getting element");
        const answer = await (
          await page.evaluateHandle(
            `document.querySelector("body > game-app").shadowRoot.querySelector("#game-toaster > game-toast").shadowRoot.querySelector("div")`
          )
        )
          .asElement()
          .getProperty("innerHTML");

        await page.waitForTimeout(2000);
        console.log(answer._remoteObject.value);
        console.log(answer._remoteObject.value.length);
        newWordle = answer._remoteObject.value;

        // updateDBTimeZones(newWordle);
        // mongo here
        const firstTimeDay = luxon.DateTime.local().setZone("Pacific/Apia").day;

        const newCurrentWord = new CurrentWord({
          word: newWordle,
          day: firstTimeDay,
        });
        console.log(newCurrentWord);
        // console.log("saving if users can edit");
        newCurrentWord.save((err, theCurrentWord) => {
          if (err) {
            return res.status(400).send({ message: err });
          } else {
            console.log("new word saved");
            return res.json(theCurrentWord);
          }
        });
        // mongo here
        // res.send("New wordle obtained: " + newWordle);
        console.log("New wordle obtained: " + newWordle);
      }
    }
  }

  await browser.close();
  // updateDBTimeZones(newWordle);
};

export const updateDBTimeZones = async (req, res) => {
  console.log(newWordle);
  console.log("update database timezones");
  // update the time zones HERE, if 0, update with new word to database. otherwise, leave it alone
  // list of time zones
  var allTheTimeZones = [
    "Europe/Andorra",
    "Asia/Dubai",
    "Asia/Kabul",
    "Europe/Tirane",
    "Asia/Yerevan",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    "Antarctica/Mawson",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Cordoba",
    "America/Argentina/Salta",
    "America/Argentina/Jujuy",
    "America/Argentina/Tucuman",
    "America/Argentina/Catamarca",
    "America/Argentina/La_Rioja",
    "America/Argentina/San_Juan",
    "America/Argentina/Mendoza",
    "America/Argentina/San_Luis",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Ushuaia",
    "Pacific/Pago_Pago",
    "Europe/Vienna",
    "Australia/Lord_Howe",
    "Antarctica/Macquarie",
    "Australia/Hobart",
    "Australia/Currie",
    "Australia/Melbourne",
    "Australia/Sydney",
    "Australia/Broken_Hill",
    "Australia/Brisbane",
    "Australia/Lindeman",
    "Australia/Adelaide",
    "Australia/Darwin",
    "Australia/Perth",
    "Australia/Eucla",
    "Asia/Baku",
    "America/Barbados",
    "Asia/Dhaka",
    "Europe/Brussels",
    "Europe/Sofia",
    "Atlantic/Bermuda",
    "Asia/Brunei",
    "America/La_Paz",
    "America/Noronha",
    "America/Belem",
    "America/Fortaleza",
    "America/Recife",
    "America/Araguaina",
    "America/Maceio",
    "America/Bahia",
    "America/Sao_Paulo",
    "America/Campo_Grande",
    "America/Cuiaba",
    "America/Santarem",
    "America/Porto_Velho",
    "America/Boa_Vista",
    "America/Manaus",
    "America/Eirunepe",
    "America/Rio_Branco",
    "America/Nassau",
    "Asia/Thimphu",
    "Europe/Minsk",
    "America/Belize",
    "America/St_Johns",
    "America/Halifax",
    "America/Glace_Bay",
    "America/Moncton",
    "America/Goose_Bay",
    "America/Blanc-Sablon",
    "America/Toronto",
    "America/Nipigon",
    "America/Thunder_Bay",
    "America/Iqaluit",
    "America/Pangnirtung",
    "America/Atikokan",
    "America/Winnipeg",
    "America/Rainy_River",
    "America/Resolute",
    "America/Rankin_Inlet",
    "America/Regina",
    "America/Swift_Current",
    "America/Edmonton",
    "America/Cambridge_Bay",
    "America/Yellowknife",
    "America/Inuvik",
    "America/Creston",
    "America/Dawson_Creek",
    "America/Fort_Nelson",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Dawson",
    "Indian/Cocos",
    "Europe/Zurich",
    "Africa/Abidjan",
    "Pacific/Rarotonga",
    "America/Santiago",
    "America/Punta_Arenas",
    "Pacific/Easter",
    "Asia/Shanghai",
    "Asia/Urumqi",
    "America/Bogota",
    "America/Costa_Rica",
    "America/Havana",
    "Atlantic/Cape_Verde",
    "America/Curacao",
    "Indian/Christmas",
    "Asia/Nicosia",
    "Asia/Famagusta",
    "Europe/Prague",
    "Europe/Berlin",
    "Europe/Copenhagen",
    "America/Santo_Domingo",
    "Africa/Algiers",
    "America/Guayaquil",
    "Pacific/Galapagos",
    "Europe/Tallinn",
    "Africa/Cairo",
    "Africa/El_Aaiun",
    "Europe/Madrid",
    "Africa/Ceuta",
    "Atlantic/Canary",
    "Europe/Helsinki",
    "Pacific/Fiji",
    "Atlantic/Stanley",
    "Pacific/Chuuk",
    "Pacific/Pohnpei",
    "Pacific/Kosrae",
    "Atlantic/Faroe",
    "Europe/Paris",
    "Europe/London",
    "Asia/Tbilisi",
    "America/Cayenne",
    "Africa/Accra",
    "Europe/Gibraltar",
    "America/Godthab",
    "America/Danmarkshavn",
    "America/Scoresbysund",
    "America/Thule",
    "Europe/Athens",
    "Atlantic/South_Georgia",
    "America/Guatemala",
    "Pacific/Guam",
    "Africa/Bissau",
    "America/Guyana",
    "Asia/Hong_Kong",
    "America/Tegucigalpa",
    "America/Port-au-Prince",
    "Europe/Budapest",
    "Asia/Jakarta",
    "Asia/Pontianak",
    "Asia/Makassar",
    "Asia/Jayapura",
    "Europe/Dublin",
    "Asia/Jerusalem",
    "Asia/Kolkata",
    "Indian/Chagos",
    "Asia/Baghdad",
    "Asia/Tehran",
    "Atlantic/Reykjavik",
    "Europe/Rome",
    "America/Jamaica",
    "Asia/Amman",
    "Asia/Tokyo",
    "Africa/Nairobi",
    "Asia/Bishkek",
    "Pacific/Tarawa",
    "Pacific/Enderbury",
    "Pacific/Kiritimati",
    "Asia/Pyongyang",
    "Asia/Seoul",
    "Asia/Almaty",
    "Asia/Qyzylorda",
    "Asia/Qostanay", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    "Asia/Aqtobe",
    "Asia/Aqtau",
    "Asia/Atyrau",
    "Asia/Oral",
    "Asia/Beirut",
    "Asia/Colombo",
    "Africa/Monrovia",
    "Europe/Vilnius",
    "Europe/Luxembourg",
    "Europe/Riga",
    "Africa/Tripoli",
    "Africa/Casablanca",
    "Europe/Monaco",
    "Europe/Chisinau",
    "Pacific/Majuro",
    "Pacific/Kwajalein",
    "Asia/Yangon",
    "Asia/Ulaanbaatar",
    "Asia/Hovd",
    "Asia/Choibalsan",
    "Asia/Macau",
    "America/Martinique",
    "Europe/Malta",
    "Indian/Mauritius",
    "Indian/Maldives",
    "America/Mexico_City",
    "America/Cancun",
    "America/Merida",
    "America/Monterrey",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Chihuahua",
    "America/Ojinaga",
    "America/Hermosillo",
    "America/Tijuana",
    "America/Bahia_Banderas",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Africa/Maputo",
    "Africa/Windhoek",
    "Pacific/Noumea",
    "Pacific/Norfolk",
    "Africa/Lagos",
    "America/Managua",
    "Europe/Amsterdam",
    "Europe/Oslo",
    "Asia/Kathmandu",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Auckland",
    "Pacific/Chatham",
    "America/Panama",
    "America/Lima",
    "Pacific/Tahiti",
    "Pacific/Marquesas",
    "Pacific/Gambier",
    "Pacific/Port_Moresby",
    "Pacific/Bougainville",
    "Asia/Manila",
    "Asia/Karachi",
    "Europe/Warsaw",
    "America/Miquelon",
    "Pacific/Pitcairn",
    "America/Puerto_Rico",
    "Asia/Gaza",
    "Asia/Hebron",
    "Europe/Lisbon",
    "Atlantic/Madeira",
    "Atlantic/Azores",
    "Pacific/Palau",
    "America/Asuncion",
    "Asia/Qatar",
    "Indian/Reunion",
    "Europe/Bucharest",
    "Europe/Belgrade",
    "Europe/Kaliningrad",
    "Europe/Moscow",
    "Europe/Simferopol",
    "Europe/Kirov",
    "Europe/Astrakhan",
    "Europe/Volgograd",
    "Europe/Saratov",
    "Europe/Ulyanovsk",
    "Europe/Samara",
    "Asia/Yekaterinburg",
    "Asia/Omsk",
    "Asia/Novosibirsk",
    "Asia/Barnaul",
    "Asia/Tomsk",
    "Asia/Novokuznetsk",
    "Asia/Krasnoyarsk",
    "Asia/Irkutsk",
    "Asia/Chita",
    "Asia/Yakutsk",
    "Asia/Khandyga",
    "Asia/Vladivostok",
    "Asia/Ust-Nera",
    "Asia/Magadan",
    "Asia/Sakhalin",
    "Asia/Srednekolymsk",
    "Asia/Kamchatka",
    "Asia/Anadyr",
    "Asia/Riyadh",
    "Pacific/Guadalcanal",
    "Indian/Mahe",
    "Africa/Khartoum",
    "Europe/Stockholm",
    "Asia/Singapore",
    "America/Paramaribo",
    "Africa/Juba",
    "Africa/Sao_Tome",
    "America/El_Salvador",
    "Asia/Damascus",
    "America/Grand_Turk",
    "Africa/Ndjamena",
    "Indian/Kerguelen",
    "Asia/Bangkok",
    "Asia/Dushanbe",
    "Pacific/Fakaofo",
    "Asia/Dili",
    "Asia/Ashgabat",
    "Africa/Tunis",
    "Pacific/Tongatapu",
    "Europe/Istanbul",
    "America/Port_of_Spain",
    "Pacific/Funafuti",
    "Asia/Taipei",
    "Europe/Kiev",
    "Europe/Uzhgorod",
    "Europe/Zaporozhye",
    "Pacific/Wake",
    "America/New_York",
    "America/Detroit",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Indiana/Indianapolis",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Vevay",
    "America/Chicago",
    "America/Indiana/Tell_City",
    "America/Indiana/Knox",
    "America/Menominee",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/North_Dakota/Beulah",
    "America/Denver",
    "America/Boise",
    "America/Phoenix",
    "America/Los_Angeles",
    "America/Anchorage",
    "America/Juneau",
    "America/Sitka",
    "America/Metlakatla",
    "America/Yakutat",
    "America/Nome",
    "America/Adak",
    "Pacific/Honolulu",
    "America/Montevideo",
    "Asia/Samarkand",
    "Asia/Tashkent",
    "America/Caracas",
    "Asia/Ho_Chi_Minh",
    "Pacific/Efate",
    "Pacific/Wallis",
    "Pacific/Apia",
    "Africa/Johannesburg",
  ];

  let dataArray = [];

  allTheTimeZones.forEach((timeZone) => {
    let currentDay;
    let strTime = luxon.DateTime.local().setZone(timeZone);
    console.log(strTime.day);
    // console.log(strTime.day + " " + strTime.hour);
    // console.log(timeZone, strTime.hour);

    console.log(strTime.day === originalDay);
    // if strTime.hour is 0, that means its midnight. update their values in the database to the new value to send to the user. else, do nothing.
    if (strTime.day === originalDay) {
      console.log(
        chalk.red(
          `${timeZone} NEEDS SECOND WORDLE ${originalWordle}: hour:${strTime.hour} day:${strTime.day}`
        )
      );
      dataArray.push({
        timeZone: timeZone,
        word: originalWordle,
        day: strTime.day,
      });
    } else {
      console.log(
        chalk.green(
          `${timeZone} NEEDS FIRST WORDLE ${newWordle} : hour:${strTime.hour} day:${strTime.day}`
        )
      );
      dataArray.push({
        timeZone: timeZone,
        word: newWordle,
        day: strTime.day,
      });
    }

    // if (strTime.hour == 0) {
    //   // save to the database, and add it to the users localstorage
    //   currentDay = strTime.day;
    //   console.log(
    //     chalk.green(
    //       `${timeZone} NEEDS FIRST WORDLE ${newWordle} : hour:${strTime.hour} day:${strTime.day}`
    //     )
    //   );
    //   dataArray.push({ timeZone: timeZone, word: newWordle });
    // } else if (strTime.day === currentDay) {
    //   // add it to the users localstorage
    //   console.log(strTime.day + ": " + currentDay);
    //   console.log(
    //     chalk.yellow(
    //       `${timeZone} NEEDS FIRST WORDLE ${newWordle}: hour:${strTime.hour} day:${strTime.day}`
    //     )
    //   );
    //   dataArray.push({ timeZone: timeZone, word: newWordle });
    // } else {
    //   // add it to the users localstorage
    //   console.log(
    //     chalk.red(
    //       `${timeZone} NEEDS SECOND WORDLE ${originalWordle}: hour:${strTime.hour} day:${strTime.day}`
    //     )
    //   );
    //   dataArray.push({ timeZone: timeZone, word: originalWordle });
    // }
  });

  console.log("Timezones have updated");
  res.send(dataArray);
};

export const wordleCronJob = async (req, res) => {
  console.log(
    "Pacific/Apia time: " + luxon.DateTime.local().setZone("Pacific/Apia").hour
  );
  console.log("hawaii time: " + luxon.DateTime.local().hour); // TODO: this is different in heroku. it is getting a different time. need to specify hawaii. if it even matters
  // cronjob that runs ever hour on the hour
  cron.schedule("0 * * * *", () => {
    console.log("starting cron job...");
    const firstTimeZone = luxon.DateTime.local().setZone("Pacific/Apia").hour;

    if (firstTimeZone === 1) {
      console.log("calling getWordleWord()...");
      getTheWordle(); // sets the variable 'newWordle'
    } else {
      console.log("calling updateDBTimeZones()...");
      updateDBTimeZones(newWordle); // passes the new word to the timezones needed to be updated
    }
  });
  // res.send("Cron job has started");
  console.log("Cron job has started");
};

export const test = async (req, res) => {
  console.log("ayo our test here");
  res.send("ayo our test here");
};
