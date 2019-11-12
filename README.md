
# Comment injecter et retirer mes volumes du container Doker ?

# TODO
- Remove SIGN IN from SIGN UP PAGE
- Change wrap to envellop
Make a first step for owner to fill himself and have a first result such as "normal consumption" and possible comsumption after efurbishment.
- Possibility to use BIM model to fill the infomations by a script
- Seulement des fichiers bim qui contiennent des infos en plus après ajout de KPI?
- Comment différencier deux taches crées en même temps avec le même nom?
- Faire un mail au PO pour prévenir qu'on a développé Baboon mais qu'on ne l'utilisera pas???

# local build and run
- docker build -t rezbuild .
- docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 -p 8081:8081 -it rezbuild

# distant build and run
- docker run -p 3000:3000 -p 3001:3001 -p 27017:27017 -p 8081:8081 --name rezbuild tydius/rezbuild
- docker run -d --name ouroboros -v /var/run/docker.sock:/var/run/docker.sock pyouroboros/ouroboros


# LAST DEBUGGING

V - taches grisées non interatives
V - taches impossible après taches TODO
~ - Visualiser toutes informations pour chaque modèle
V - Tache customizée non fonctionnelle ASIS
V - Récupérer base de données