-- drop db to wipe mindracers_database
DROP DATABASE IF EXISTS mindracers_database;

-- create mindracers_database for testing
CREATE DATABASE mindracers_database;

-- use mindracers_database as the main db to run sql commands against
USE mindracers_database;


DROP TABLE IF EXISTS user;

CREATE TABLE user(
    id              INT         PRIMARY KEY,
    email           VARCHAR(30),
    password        VARCHAR(24),
    username        VARCHAR(20),
    score           INT,
    gameDate        DATETIME
);

-- display all tables in current database
SHOW tables;

DESCRIBE user;

INSERT INTO user
(id, email, password, username, score, gameDate)
VALUES
(1, "none1@none1.com", "password1", "user1", 10, "2025-03-01 11:31:54"),
(2, "none2@none2.com", "password2", "user2", 20, "2025-03-02 22:31:54");

SELECT * FROM user;

------------------------

DROP TABLE IF EXISTS game_seq;

CREATE TABLE game_seq(
    gameid          INT         PRIMARY KEY,
    next_val        INT
);

-- display all tables in current database
SHOW tables;

DESCRIBE game_seq;

INSERT INTO game_seq
(gameid, next_val)
VALUES
(1, 10),
(2, 20);

SELECT * FROM game_seq;

------------------------

DROP TABLE IF EXISTS game;

CREATE TABLE game(
    id          INT             PRIMARY KEY,
    user_id     INT,
    score       INT,
    time        TIME
);

-- display all tables in current database
SHOW tables;

DESCRIBE game;

-- INSERT INTO game
-- (gameid, next_val)
-- VALUES
-- (100, 1),
-- (200, 2);

SELECT * FROM game;
