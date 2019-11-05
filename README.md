
# Dev

# Technical

Network architecture


# User stories
Mockup
Validation
Realisation

# local run
- docker build -t rezbuild .
- docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 -p 8081:8081 -it rezbuild

# Distant run
- docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 -p 8081:8081 --name rezbuild tydius/rezbuild
- docker run -d --name ouroboros -v /var/run/docker.sock:/var/run/docker.sock pyouroboros/ouroboros


# Task
V - create Task
~ - Integrer données entrées au projet (manque dernier onglet)
X - move to next node when created
V - disabled multiple todo task sequence ?

X -  Ajouter KPI à ASIS MODEL
X - Integrer liste des KPI par category


