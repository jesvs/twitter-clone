-- import as root
create database twitter;
create user 'twitter_user'@'localhost';
grant all privileges on twitter.* to 'twitter_user'@'localhost';
use twitter;

create table Tweets (
    id int not null auto_increment,
    body text not null,
    handle varchar(15) not null,
    created_at timestamp not null default current_timestamp,
    primary key (`id`)
);

INSERT INTO Tweets(handle, body) VALUES('DonkkaShane', 'Having a great time teaching this Twitter clone course!');
INSERT INTO Tweets(handle, body) VALUES('DonkkaShane', 'Yogi is the best dog in the world!');
