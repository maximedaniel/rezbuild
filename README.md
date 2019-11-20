



# IMPORTANT


# TODO
- Add information tooltip to each field of the project information
- Set the form to blank.
- After Login a new user doesn’t know where to start from. Something pointing / Highlighting the “edit” button (where I guess you shall start from) could be helpful here. 
- Project Information → General Information, not clear what Exposure means. Maybe add details about roof/main entrance/etc.
- App not multilingual. I think at least language of the 3 demo sites should be provided (Italian, Spanish, Norwegian). 
- Project Information → General Information: “adjacent to unheated room” not clear what that means. 
- Project Information → General Information:Clear inter-floor height (m) does not accept decimals (cannot enter 2.5 m). Similar issue for other linear dimensions.
- Project Information → General Information: when editing/adding values, when click on Save no message is shown (like “Changes Have been saved”, even though they infact are saved)  and the window remains exactly the same, so user doesn’t get any feedback for his action. 


# DONE
- Invite user remove '#field'
- add float value to every fields
- After Login could be useful to have somewhere indication of user, like “Welcome <username> 
- Mouse over the “edit” button shows 2 buttons “+” and “upload ( I guess). Could be useful to have tooltips when mouse over those, showing something like “Add a new project”, “Upload …” .
- Project Information → Wrap: better use Envelope instead of Wrap.
- When open “Create project” fields are pre-filled with a French site, can it be made more generic? 
- Giving 10 points to each KIPs expectations.
- Download files does not work
- Send mail when todo task assigned.

# Comment injecter et retirer mes volumes du container Doker ?
n
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