CREATE DATABASE [IF NOT EXISTS] mustangV3



CREATE TABLE `index` (
  `name` <type>,
  `email` <type>,
  `url` <type>,
  PRIMARY KEY (`name`)
);

CREATE TABLE `location` (
  `city` <type>,
  `state` <type>,
  `zipcode` <type>,
  `lat` <type>,
  `lng` <type>,
  PRIMARY KEY (`lat`, `lng`)
);

CREATE TABLE `contacts` (
  `PK` fName,
  `PK` lNmane,
  `` pName,
  `` phone number,
  `` email,
  `` favorite hobby,
  `FK` lat,
  `FK` lng
);

