# DevOps

![DevOps pipeline](doc/flow.jpg)

## Requirements

Visual Studio Code (<https://code.visualstudio.com/>) for development and SourceTree (<https://www.sourcetreeapp.com/>) for source code version managment.

## Installation

Open SourceTree:

1. Click `Clone` tab
2. Enter `https://gitlab.estia.fr/m.daniel/rezbuild.git` in `Source Path / URL` field
3. Complete the remaining fields
4. Click `Clone` button
5. Wait for clone to complete
6. Click `Git-flow` tab and `Ok` button

## Working develop branch locally

Open Visual Studio Code. First, install the local dependencies:

1. Click `Terminal > New Terminal`
2. Enter `cd local/common`
3. Enter `npm install`
4. :warning: Enter `npm pack` after any `common` source code change
5. Enter `cd ../react-trello`
6. Enter `npm install`
7. :warning: Enter `npm pack` after  any `react-trello` source code change

Then, install and run the REZBUILD Application Protocol Interface (API):

1. Click `Terminal > New Terminal`
2. Enter `cd api`
3. Enter `npm install`
4. Enter `npm run dev`
5. :warning: Enter `npm start` for production testing

Finally, install and run the REZBUILD Application (APP):

1. Click `Terminal > New Terminal`
2. Enter `cd app`
3. Enter `npm install`
4. Enter `npm run dev`
5. :warning: Enter `npm run build && npm start` for production testing

## Saving develop branch remotely

Open SourceTree:

1. Click `BRANCHES > develop`
2. Click and Complete `File Status > Stage All > Push changes... > Commit`

## Pushing develop branch to master branch remotely

Open SourceTree:

1. Click `BRANCHES > develop`
2. Click and Complete `File Status > Stage All > Push changes... > Commit`
3. Click and Complete `Git-flow > Start New Release > Release Name`
4. Click and Complete `Git-flow > Finish Release > Release Name`

This proceduce will update the live version hosted at ESTIA (see <https://rezbuildapp.estia.fr>, <https://rezbuildapi.estia.fr>, <https://rezbuilddb.estia.fr>):

1. DockerHub (see <https://hub.docker.com/>) will automatically start building the lastest version of the GitHub repository into a Docker Image named `tydius/rezbuild` (see <https://hub.docker.com/r/tydius/rezbuild>)
2. The Docker at ESTIA will automatically download and run the lastest version of `tydius/rezbuild` thanks to ouroboros (see <https://github.com/pyouroboros/ouroboros>).

Testing the Docker image locally:

1. Open a Docker terminal
2. Enter `docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 -p 8081:8081 --name rezbuild tydius/rezbuild`
3. Enter `docker run -d --name ouroboros -v /var/run/docker.sock:/var/run/docker.sock pyouroboros/ouroboros`