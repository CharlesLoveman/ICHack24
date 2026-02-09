# ICHack24 - PokARmon

A socket-based WebApp for collecting Pokarmons, born from the mundane pictures you take of your surroundings. _Who doesn't want to initiate a fight between their sentient toaster and microwave!_

Features:

- Collect Pokarmons by taking pictures with your camera, or uploading them from your gallery
- View Pokarmons with their unique stats, movesets
- Create a battle and invite your friend to compete with your Pokarmons
- Mobile and Desktop compatible

Technologies:

- Typescript, React, Styled Components for the Frontend
- Python for the Backend
- MongoDB for the Database

Can be run both locally, or with Docker

### Setup - Docker

Ensure you have a filled `.env` file at root (i.e. `/.env`) with the following variables. You can simply rename `.example` and fill in the values you need (and for any you're unsure about, leaving them as their defaults should suffice):

| Name           | Meaning                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| IMAGES_PATH    | The path on your device where Pokarmon images should be stored                                        |
| DATABASE_PORT  | The port of the database                                                                              |
| DATABASE_HOST  | The host of the database (using `database` lets docker compose network between containers like magic) |
| BACKEND_PORT   | The port of the backend                                                                               |
| FRONTEND_PORT  | The port of the frontend                                                                              |
| PATH_TO_PUBLIC | The path inside the backend container where the images will be stored                                 |

Run `docker compose up` at root.

### Setup - Local

See the `README`s under:

- Frontend
- Backend
- Database

They will illustrate how to install each of these components, and run them, with the correct `.env` setup.
