[User
|_id: Integer;
email: String;
password: String;
firstname: String;
lastname: String;
roles: \[\] String;
projects: \[\] ProjectId;
revisions: \[\] RevisionId;
tasks: \[\] TaskId
|
|]

[Project
|_id: Integer;
name: String;
owner: UserId;
created: Date;
users: \[\] UserId;
revisions: \[\] RevisionId
|
]

[Revision
|_id: Integer;
owner: UserId;
created: Date;
model: File;
project: ProjectId;
tasks: \[\] TaskId
|
|
]

[Task
|_id: Integer;
owner: UserId;
revision: RevisionId;
type: \[\] String;
state: String;
requirements: \[\] String;
constraints: \[\] String
|
|
]

[User]1..* - 0..*[Project]
[User]1 - 1..*[Revision]
[User]0..1 - 0..*[Task]
[Project] 1 - 0..*[Revision]
[Revision] 1 - *[Task]
