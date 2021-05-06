# CRUD on a musical database

This repository sets up a backend connection to a MySQL database using the following template in an `.env` file

```bash
DB_USER= database username
DB_PASSWORD= password
DB_NAME= music_library
DB_HOST= localhost
DB_PORT= 3307
```

Once you have populated the `.env` file, you can use the command `npm start`

This will start an express server locally which you can use `GET` `POST` `PATCH` and `DELETE` HTTP methods to manipulate the data at the following endpoints:

| Endpoint                         | Method   | Function                                                               |
| -------------------------------- | -------- | ---------------------------------------------------------------------- |
| /artist                          | `GET`    | retrieves all artists                                                  |
| /artist/:artistID                | `GET`    | retrieves one artist by specific ID                                    |
| /artist                          | `POST`   | creates a new artist from request body                                 |
| /artist/:artistID                | `PATCH`  | alters specific artist data from request body                          |
| /artist/:artistID                | `DELETE` | deletes artist specified                                               |
| /albums                          | `GET`    | retrieves all albums                                                   |
| /artist/:artistID/album          | `GET`    | retrieves all albums by one artist                                     |
| /artist/:artistID/album/:albumID | `GET`    | retrieves one album by ID, by artist                                   |
| /artist/:artistID/album          | `POST`   | creates a new album linked to the artist, using data from request body |
| /artist/:artistID/album/:albumID | `PATCH`  | alters specific album by artist, using request body data               |
| /artist/:artistID/album/:albumID | `DELETE` | deletes specific album                                                 |

---

## Data schema

Artist JSON is set out below:

```javascript
{
    "name": "The Beatles",
    "Genre": "Classic Rock"
}
```

Album JSON is like the following:

```javascript
{
    "name": "Abbey Road",
    "year": "1969"
}
```
