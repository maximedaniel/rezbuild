
# EACH FEATURE -> SCHEMA APP/API

# SYSTEM ARCHITECTURE

# WORKFLOW
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

The workflow of the REZBUILD PLATFORM is illustrated in Figure [X].
The source code of the REZBUILD plateform is hosted on GitHub.
After each push on GitHub, DockerHub automatically pulls the source code and builds a Docker image.
After each build on DockerHub, a Docker hosted on ESTIA server automatically pulls the docker image and push it into a container.
The container runs the image made of two parts:
a DB running on *localhost:27017* (*@rezbuilddb.estia.fr*),
an API running on *localhost:3000* (*@rezbuildapi.estia.fr*), 
and an APP running on *localhost:3001* (*@rezbuildapp.estia.fr*).

# SYSTEM ARCHITECTURE

The REZBUILD PLATEFORM is made of three parts: a DB, an API and an APP.
The next sections describe the three parts in details.

## DB
The REZBUILD DB is illustrated in Figure [X].
The DB is a MongoDB database made of four models: 
- USER
- PROJECT
- REVISION
- TASK

The *USER* model represents a user of the plateform and 
is defined by six attributes: 
- *id*: the Object ID of the user (e.g, 0xf84ac9), 
- *firstname*: the first name of the user (e.g, Alice), 
- *lastname*: the lastname of the user (e.g, Dupont),
- *roles*: the role(s) of the user (e.g., [customer, architect]),
- *email*: the email of the user (e.g., alice.dupont@mail.com),
- *password*: the password of the user.

The *PROJECT* model represents a project of the plateform.
One project can have multiple users and is defined by six attributes: 
- *id*: the Object ID of the project (e.g, 0x8d6ab2), 
- *date*: the creation date of the project (e.g,  14:45:87 14th March 2019), 
- *name*: the name of the project (e.g, MyRezbuildProject),
- *owner*: the User ID of the owner of the project (e.g., 0xf84ac9),
- *users*: the User ID(s) of the user(s) of the projects (e.g., [0xf84ac9, 0x7a6b8])


The *REVISION* model represents a version of a project.
One revision belongs to one project and is defined by six attributes: 
- *id*: the Object ID of the revision (e.g, 0x023056), 
- *project*: the Project ID of the project of the revision (e.g, 0x8d6ab2),
- *date*: the creation date of the revision (e.g,  18:05:07 14th March 2019), 
- *files*: the File ID(s) of the files of creation date of the revision (e.g,  18:05:07 14th March 2019), 
- *prev*: the Revision ID(s) of the revision(s) backwarding the revision (e.g., [0x414ab9, 0xbafb8]),
- *next*: the Revision ID(s) of the revision(s) forwarding the revision (e.g., [0x414ab9, 0xbafb8]),

The *TASK* model represents an action on a revision. 
One task belongs to one revision and is defined by X attributes: 

- *id*: the Object ID of the task (e.g, 0x0ff076), 
- *revision*: the Revision ID of the revision of the task (e.g, 0x8d6ab2),
- *state*: the state of the task (e.g, IN_PROGRESS),
- *users*: the User ID(s) of the user(s) assigned to the task (e.g., [0xf84ac9, 0x7a6b8]),
- *inputs*: the inputs (requirements) of the task (e.g., [OLD_LCA_KPI, OLD_BIM_MODEL, OLD_COMMENT]),
- *outputs*: the outputs (results) of the task (e.g., [NEW_LCA_KPI, NEW_BIM_MODEL, NEW_COMMENT]),


## API

The REZBUILD API is illustrated in Figure [X].
The API runs on a Node.js Server. Using Mongoose.js, the API connects to REZBUILD DB and perform operations.
The API makes use of Mongoose queries in JSON Format as parameters and return statement for the operations on the DB.
More information about Mongoose query can be found using this url: https://mongoosejs.com/docs/3.7.x/docs/api.html#query-js
The API implements CRUD operations (Create, Retreive, Update, Delete):
- CREATE
    @: *rezbuildapi.estia.fr/api/<MODEL>/create*
    function: create a <MODEL> instance using the given map.
    param1 (map): JSON Object containing a Mongoose query mapping <MODEL> attributes
    return: JSON Object containing the created <MODEL> instance
- GET
    @: *rezbuildapi.estia.fr/api/<MODEL>/get*
    function: select <MODEL> instances using the given filter.
    param1 (filter): JSON Object containing a Mongoose query filtering <MODEL> attributes
    return: JSON Object containing the selected <MODEL> instance(s)  
- UPDATE
    @: *rezbuildapi.estia.fr/api/<MODEL>/update*
    function: select and modify <MODEL> instances using the given filter and the given map.
    param1 (filter): JSON Object containing a Mongoose query filtering <MODEL> attributes
    param2 (map): JSON Object containing a Mongoose query mapping <MODEL> attributes
    return : JSON Object containing the updated <MODEL> instance(s)   
- DELETE
    @: *rezbuildapi.estia.fr/api/<MODEL>/delete* 
    function: select and remove <MODEL> instances using the given filter.
    param1 (filter): JSON Object containing a Mongoose query filtering <MODEL> attributes
    return : JSON Object containing the deleted <MODEL> instance(s)

The API uses a Socket.IO server which enables real-time, bidirectional and event-based communication with Socket.IO clients.
Using a socket.IO client, a user can connect to the API.
To be able to call CRUD operations, the client must be authenticated.
The API implements AUTH operations:
- SIGNUP
    @: *rezbuildapi.estia.fr/api/auth/signup* 
    function: sign up a user using the given map.
    param1 (map): JSON Object containing a Mongoose query mapping USER attributes.
    return : True if successfully signed up else False.
- SIGNIN
    @: *rezbuildapi.estia.fr/api/auth/signin* 
    function: authenticate the user using the given email/password and create a Socket.IO session.
    param1 (map): JSON Object containing a Mongoose query mapping the email attribute and the password attribute.
    return : True if successfully signed in else False.
- SIGNOUT
    @: *rezbuildapi.estia.fr/api/auth/signout*
    function: unauthenticate the user using the given email and delete the Socket.IO session.
    param1 (map): JSON Object containing a Mongoose query mapping the email attribute.
    return : True if successfully signed out else False. 

## APP

The REZBUILD APP is illustrated in Figure [X].
The APP runs on a Node.js Server.
The APP uses Materializecss for responsive material web, React.js for dynamic web and D3.js for dynamic data visualization.
The APP is organized in four pages:
- SignupPage
    @: *rezbuildapp.estia.fr/signup*
    description: allows the user to sign up.
    redirects: if signed up then SigninPage
    links: SigninPage
    components: SignupComponent
    forms: SignupForm

- SigninPage
    @: *rezbuildapp.estia.fr/signin*
    description: allows the user to sign in.
    redirects: if signed in then HomePage
    links: SignupPage
    components: SigninComponent
    forms: SigninForm   
    
- HomePage
    @: *rezbuildapp.estia.fr/*
    redirects: if not signed in then SigninPage
    description: allows the user to manage projects.
    links: ProjectPage
    components: NavbarComponent, ProjectListComponent
    forms: SignoutForm, CreateProjectForm, JoinProjectForm, RemoveProjectForm
    
- ProjectPage
    @: *rezbuildapp.estia.fr/<PROJECT_ID>*
    redirects: allows the user to navigate through the revisions of a project and to perform tasks.
    links: HomePage
    components: NavbarComponent, UserListComponent, RevisionGraphComponent, TaskBoardComponent 
    forms: SignoutForm, InviteUserForm, UpdateTaskForm

Each page make use of React Components that handle user forms and make calls to the API.

# DESCRIPTION EACH FUNCTION


# CREATE TASK DESCRIPTION

# USER STORY - VALIDATION TASK

# USER STORY - TECHNOLOGIES BIM (quand ?)
For each node, highlights realized task and vizualize BIM File

# USER STORY - TASK MODIFICATION MODEL BIM ()

# USER STORY - TASK MODIFICATION KPI BIM (Life cycle KPI / consultant)

# METTRE À JOUR MAQUETTE AVEC VERSION LAURA