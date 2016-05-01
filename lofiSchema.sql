DROP DATABASE LOFI;
DROP USER lofiAdmin;
create database LOFI;
use LOFI; 

CREATE USER lofiAdmin IDENTIFIED BY '1234678aA'; 

grant usage on *.* to lofiAdmin@localhost identified by '12345678aA'; 
grant all privileges on LOFI.* to lofiAdmin@localhost; 

CREATE TABLE Product (
	Id INT NOT NULL AUTO_INCREMENT, 
	Name VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE Dealer (
	id INT NOT NULL AUTO_INCREMENT, 
	Name VARCHAR(255) NOT NULL,
	Address VARCHAR(255) NOT NULL,
	OpeningHour INT NOT NULL DEFAULT 8,
	ClosingHour INT NOT NULL DEFAULT 17,
	DeliverySpeed DOUBLE NOT NULL DEFAULT 10,
	PosX DOUBLE NOT NULL,
	PosY DOUBLE NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE Deal (
	Id INT NOT NULL AUTO_INCREMENT,
	ProductId INT NOT NULL,
	DealerId INT NOT NULL,
	Quantity INT NOT NULL,
	UnitPrize DOUBLE NOT NULL,
	Expiry DATETIME NOT NULL,
	PRIMARY KEY (Id),
	CONSTRAINT `StockProduct` FOREIGN KEY (`ProductId`) REFERENCES `Product` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION,
	CONSTRAINT `StockDealer` FOREIGN KEY (`DealerId`) REFERENCES `Dealer` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE Reservation (
	Id INT NOT NULL AUTO_INCREMENT,
	DealId INT NOT NULL,
	Name VARCHAR(255) NOT NULL,
	Address VARCHAR(255) NOT NULL,
	PosX DOUBLE NOT NULL,
	PosY DOUBLE NOT NULL,
	Created DATETIME NOT NULL,
	PRIMARY KEY (Id),
	CONSTRAINT `ReservationDeal` FOREIGN KEY (`DealId`) REFERENCES `Deal` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

INSERT INTO `LOFI`.`Product`(Id, `Name`)
VALUES
(1,'Auto lusso'),
(2,'Pranzo pesce'),
(3,'Gacca pelle'),
(4,'Auto economica');

INSERT INTO `LOFI`.`Dealer`(`id`,`Name`,`Address`,`PosX`,`PosY`)
VALUES
(1,"MegaStore","Corso Largo, 1",153,78),
(2,"Il Botteghino","Corso Largo, 45",153,178),
(3,"Da Giovanna","Piazza Rotonda, 4",353,-278),
(4,"Outlet","Via Serpico, 20",-53,378);

INSERT INTO `LOFI`.`Deal`(`ProductId`,`DealerId`,`Quantity`,`UnitPrize`,`Expiry`)
VALUES
(1,1,7,1423,'2016-5-30'),
(1,2,17,1625,'2016-5-30'),
(1,4,10,2421,'2016-5-30'),
(2,3,5,13,'2016-5-30'),
(2,4,15,58,'2016-5-30'),
(3,2,27,125,'2016-5-30'),
(3,4,16,321,'2016-5-30'),
(3,3,43,113,'2016-5-30'),
(4,1,25,323,'2016-5-30');



