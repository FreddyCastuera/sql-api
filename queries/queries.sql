/*queries para crear las tablas del post y de los usuarios*/
CREATE TABLE users(
	id int NOT NULL AUTO_INCREMENT,
    UserName VARCHAR(100),
    qualification int, 
	PRIMARY KEY (id)
);
CREATE TABLE posts(
	id int NOT NULL AUTO_INCREMENT,
    user_id int,
    score int,
    workflow text,
	createdAt datetime,
    coverImage VARCHAR(100),
	PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
/*query para crear la tabla que relaciona los usuarios con los posts*/
CREATE TABLE users_posts(
	id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    post_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (post_id) REFERENCES posts(id)
)
/*query para crear inicialmente 5 usuarios*/
INSERT INTO users (UserName,qualification)
VALUES ('Jose Garcia',5),('Jorge Lopez',4),('Miguel Perez',5)
