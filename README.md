
# Technical

Network architecture


# User stories
Mockup
Validation
Realisation

# Docker
- docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 --name rezbuild tydius/rezbuild
- docker run -d --name ouroboros -v /var/run/docker.sock:/var/run/docker.sock pyouroboros/ouroboros

# Account
- [x] signup
    - which roles ?
- [x] signin
- [x] signout
- [ ] settings

# Project
- [x] listProjects
- [x] createProject
    - which criteria ?
- [x] joinProject
- [x] removeProject
- [x] selectProject

# Collaborator
- [X] listCollaborators
- [X] addCollaboratorWithAccount
- [X] addCollaboratorWithUrl

# Tree
- [ ] listRevisions
- [ ] createRevision
- [ ] selectRevision

# Task
- [ ] listTasks
- [ ] selectTask