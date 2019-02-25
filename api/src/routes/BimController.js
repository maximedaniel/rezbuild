import BimServerClient from '../bimserver/bimserverclient.js'

export default class BimController {
	constructor() {
		this.client = null;
		this.api = new BimServerClient("http://localhost:8082/");
	}

	login(username, password){
        return new Promise(
            (resolve, reject) =>
            (
                this.api.init((client, version) =>
                {
                    this.client = client;
                    this.client.login(username, password, resolve, reject)
                })
            )
        );
	}
	signin(username, password){
        return new Promise(
            (resolve, reject) =>
            (
                new BimServerClient("http://localhost:8082/").init((client, version) => {
                    client.login(username, password, resolve, reject)
                })
            )
        );
	}


	terminateLongRunningAction(topicId){
	  return new Promise(( sDownloadResult, err) =>
	    this.client.call( "ServiceInterface", "terminateLongRunningAction",
      { topicId : topicId}, sDownloadResult, err));
	}

	initiateCheckin(poid, deserializerOid){
	  return new Promise(( checkin, err) =>
	    this.client.call( "ServiceInterface", "initiateCheckin",
      { poid : poid, deserializerOid : deserializerOid }, checkin, err));
	}

	checkinSync(poid, comment, deserializerOid, fileSize, fileName, data, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinSync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid, fileSize : fileSize,
      fileName : fileName, data : data, merge : merge}, id, err));
	}

	checkinAsync(poid, comment, deserializerOid, fileSize, fileName, data, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinAsync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid, fileSize : fileSize,
      fileName : fileName, data : data, merge : merge}, id, err));
	}

	checkinInitiatedSync(poid, comment, deserializerOid, fileSize, fileName, data, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinInitiatedSync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid, fileSize : fileSize,
      fileName : fileName, data : data, merge : merge}, id, err));
	}

	checkinInitiatedAsync(poid, comment, deserializerOid, fileSize, fileName, data, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinInitiatedAsync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid, fileSize : fileSize,
      fileName : fileName, data : data, merge : merge}, id, err));
	}

	checkinFromUrlSync(poid, comment, deserializerOid, fileName, url, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinFromUrlSync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid,
      fileName : fileName, url : url, merge : merge}, id, err));
	}

	checkinFromUrlAsync(poid, comment, deserializerOid, fileName, url, merge){
	  return new Promise(( id, err) =>
	    this.client.call( "ServiceInterface", "checkinFromUrlAsync",
      {poid : poid, comment : comment, deserializerOid : deserializerOid,
      fileName : fileName, url : url, merge : merge}, id, err));
	}

	checkout(roid, serializerOid, sync){
	  return new Promise(( topicId, err) =>
	    this.client.call( "ServiceInterface", "checkout",
      { roid : roid, serializerOid : serializerOid, sync : sync}, topicId, err));
	}

	download(roids, query, serializerOid, sync){
	  return new Promise(( topicId, err) =>
	    this.client.call( "ServiceInterface", "download",
      { roids : roids, query : query, serializerOid : serializerOid, sync : sync}, topicId, err));
	}

	downloadCompareResults(serializerOid, roid1, roid2, mcid, type, sync){
	  return new Promise(( topicId, err) =>
	    this.client.call( "ServiceInterface", "downloadCompareResults",
      { serializerOid : serializerOid, roid1 : roid1, roid2 : roid2, mcid : mcid, type : type, sync : sync}, topicId, err));
	}

	getDownloadData(topicId){
	  return new Promise(( sDownloadResult, err) =>
	    this.client.call( "ServiceInterface", "getDownloadData",
      { topicId : topicId}, sDownloadResult, err));
	}

	getSerializerByName(serializerName){
	  return new Promise(( serializer, err) =>
	    this.client.call( "ServiceInterface", "getSerializerByName",
      { serializerName : serializerName }, serializer, err));
	}

	getSerializerById(oid){
	  return new Promise(( serializer, err) =>
	    this.client.call( "ServiceInterface", "getSerializerById",
      { oid : oid }, serializer, err));
	}

	getSerializerByContentType(contentType ){
	  return new Promise(( serializer, err) =>
	    this.client.call( "ServiceInterface", "getSerializerByContentType",
      { contentType  : contentType}, serializer, err));
	}


	getDeserializerByName(deserializerName){
	  return new Promise(( deserializer, err) =>
	    this.client.call( "ServiceInterface", "getDeserializerByName",
      { deserializerName : deserializerName }, deserializer, err));
	}
	getDeserializerById(oid){
	  return new Promise(( deserializer, err) =>
	    this.client.call( "ServiceInterface", "getDeserializerById",
      { oid : oid }, deserializer, err));
	}

	getQueryEngineById(oid){
	  return new Promise(( queryEngine, err) =>
	    this.client.call( "ServiceInterface", "getQueryEngineById",
      { oid  : oid }, queryEngine, err));
	}

	getQueryEngineExampleKeys(qeid){
	  return new Promise(( queryEngines, err) =>
	    this.client.call( "ServiceInterface", "getQueryEngineExampleKeys",
      { qeid  : qeid }, queryEngines, err));
	}

	getQueryEngineExample(qeid, key){
	  return new Promise(( queryEngine, err) =>
	    this.client.call( "ServiceInterface", "getQueryEngineExample",
      { qeid  : qeid, key : key}, queryEngine, err));
	}

	getSuggestedDeserializerForExtension(extension, poid){
	  return new Promise(( deserializerName, err) =>
	    this.client.call( "ServiceInterface", "getSuggestedDeserializerForExtension",
      { extension  : extension,  poid : poid}, deserializerName, err));
	}

	addExtendedDataToProject(poid, extendedData){
	  return new Promise(( res, err) =>
	    this.client.call( "ServiceInterface", "addExtendedDataToProject",
      {poid: poid,  extendedData : extendedData}, err));
	}

	addExtendedDataToRevision(roid, extendedData){
	  return new Promise(( res, err) =>
	    this.client.call( "ServiceInterface", "addExtendedDataToRevision",
      { roid  : roid,  extendedData : extendedData}, err));
	}

	addUserToExtendedDataSchema(uoid, edsid){
	  return new Promise(( res, err) =>
	    this.client.call( "ServiceInterface", "addUserToExtendedDataSchema",
      { uoid  : uoid,  edsid : edsid}, err));
	}

	removeUserToExtendedDataSchema(uoid, edsid){
	  return new Promise(( res, err) =>
	    this.client.call( "ServiceInterface", "removeUserToExtendedDataSchema",
      { uoid  : uoid,  edsid : edsid}, err));
	}

	getExtendedData(oid){
	  return new Promise(( extendedData, err) =>
	    this.client.call( "ServiceInterface", "getExtendedData",
      { oid  : oid}, extendedData, err));
	}

	getExtendedDataSchemaFromRepository(namespace){
	  return new Promise(( extendedDataSchema, err) =>
	    this.client.call( "ServiceInterface", "getExtendedDataSchemaFromRepository",
      { namespace  : namespace}, extendedDataSchema, err));
	}

	getAllExtendedDataSchemas(){
	  return new Promise(( extendedData, err) =>
	    this.client.call( "ServiceInterface", "getAllExtendedDataSchemas", extendedData, err));
	}

	getServiceDescriptor(baseUrl, serviceIdentifier){
	  return new Promise(( serviceDescriptor, err) =>
	    this.client.call( "ServiceInterface", "getServiceDescriptor",
	    {baseUrl : baseUrl, serviceIdentifier : serviceIdentifier}, serviceDescriptor, err));
	}

	getAllServiceDescriptors(){
	  return new Promise(( serviceDescriptors, err) =>
	    this.client.call( "ServiceInterface", "getAllServiceDescriptors", serviceDescriptors, err));
	}

	getAllRepositoryExtendedDataSchemas(usePre){
	  return new Promise(( extendedDataSchemas, err) =>
	    this.client.call( "ServiceInterface", "getAllRepositoryExtendedDataSchemas",
	    {usePre:usePre}, extendedDataSchemas, err));
	}

	getAllRepositoryModelCheckers(usePre){
	  return new Promise(( modelCheckers, err) =>
	    this.client.call( "ServiceInterface", "getAllRepositoryModelCheckers",
	    {usePre:usePre}, modelCheckers, err));
	}

	getAllPublicProfiles(notificationsUrl, serviceIdentifier){
	  return new Promise(( publicProfiles, err) =>
	    this.client.call( "ServiceInterface", "getAllPublicProfiles",
	    {notificationsUrl: notificationsUrl, serviceIdentifier:serviceIdentifier}, publicProfiles, err));
	}

	getAllPrivateProfiles(notificationsUrl, serviceIdentifier){
	  return new Promise(( privateProfiles, err) =>
	    this.client.call( "ServiceInterface", "getAllPrivateProfiles",
	    {notificationsUrl: notificationsUrl, serviceIdentifier:serviceIdentifier}, privateProfiles, err));
	}

	getAllExtendedDataOfRevision(roid){
	  return new Promise(( extendedData, err) =>
	    this.client.call( "ServiceInterface", "getAllExtendedDataOfRevision",
      { roid  : roid}, extendedData, err));
	}

	getAllExtendedDataOfRevisionAndSchema(roid, schemaId){
	  return new Promise(( extendedData, err) =>
	    this.client.call( "ServiceInterface", "getAllExtendedDataOfRevisionAndSchema",
      { roid  : roid, schemaId : schemaId}, extendedData, err));
	}

	getLastExtendedDataOfRevisionAndSchema(roid, schemaId){
	  return new Promise(( extendedData, err) =>
	    this.client.call( "ServiceInterface", "getLastExtendedDataOfRevisionAndSchema",
      { roid  : roid, schemaId : schemaId}, extendedData, err));
	}
	getExtendedDataSchemaByName(name){
	  return new Promise(( extendedDataSchema, err) =>
	    this.client.call( "ServiceInterface", "getExtendedDataSchemaByName",
      { name  : name}, extendedDataSchema, err));
	}

	getExtendedDataSchemaById(oid){
	  return new Promise(( extendedDataSchema, err) =>
	    this.client.call( "ServiceInterface", "getExtendedDataSchemaById",
      { oid  : oid}, extendedDataSchema, err));
	}

	getProjectByPoid(poid){
	  return new Promise((project, err) =>
	    this.client.call( "ServiceInterface", "getProjectByPoid",
      { poid : poid}, project, err));
	}

	getProjectByUuid(uuid){
	  return new Promise((project, err) =>
	    this.client.call( "ServiceInterface", "getProjectByUuid",
      { uuid : uuid}, project, err));
	}

	getProjectSmallByPoid(poid){
	  return new Promise((project, err) =>
	    this.client.call( "ServiceInterface", "getProjectSmallByPoid",
      { poid : poid}, project, err));
	}

	getRevision(roid){
	  return new Promise((revision, err) =>
	    this.client.call( "ServiceInterface", "getRevision",
      { roid : roid}, revision, err));
	}

	getRevisionSummary(roid){
	  return new Promise((revisionSummary, err) =>
	    this.client.call( "ServiceInterface", "getRevisionSummary",
      { roid : roid}, revisionSummary, err));
	}

	uploadFile(file){
	  return new Promise((fileUploaded, err) =>
	    this.client.call( "ServiceInterface", "uploadFile",
      { file : file}, fileUploaded, err));
	}

	getFile(fileId){
	  return new Promise((file, err) =>
	    this.client.call( "ServiceInterface", "getFile",
      { fileId : fileId}, file, err));
	}

	getFileMeta(fileId){
	  return new Promise((fileMeta, err) =>
	    this.client.call( "ServiceInterface", "getFileMeta",
      { fileId : fileId}, fileMeta, err));
	}

	triggerNewRevision(roid, soid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "triggerNewRevision",
      { roid : roid, soid : soid}, err));
	}

	triggerRevisionService(roid, soid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "triggerRevisionService",
      { roid : roid, soid : soid}, err));
	}

	triggerNewExtendedData(edid, soid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "triggerNewExtendedData",
      { edid : edid, soid : soid}, err));
	}

	getAllLocalServiceDescriptors(){
	  return new Promise((localServiceDescriptors, err) =>
	    this.client.call( "ServiceInterface", "getAllLocalServiceDescriptors",
      localServiceDescriptors, err));
	}

	getAllLocalProfiles(serviceIdentifier){
	  return new Promise((localProfiles, err) =>
	    this.client.call( "ServiceInterface", "getAllLocalProfiles",
      {serviceIdentifier : serviceIdentifier}, localProfiles, err));
	}

	addLocalServiceToProject(poid, sService, internalServiceOid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "addLocalServiceToProject",
      {poid : poid, sService : sService,  internalServiceOid : internalServiceOid}, err));
	}

	shareRevision(roid){
	  return new Promise((revisionShared, err) =>
	    this.client.call( "ServiceInterface", "shareRevision",
      {roid : roid}, revisionShared, err));
	}

	getOidByGuid(roid, guid){
	  return new Promise((oid, err) =>
	    this.client.call( "ServiceInterface", "getOidByGuid",
      {roid : roid, guid : guid}, oid, err));
	}

	cleanupLongAction(topicId){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "cleanupLongAction",
      {topicId : topicId}, err));
	}

	getUserSettings(){
	  return new Promise((sUserSettings , err) =>
	    this.client.call( "ServiceInterface", "getUserSettings",
      sUserSettings , err));
	}

	getUserRelatedLogs(uoid){
	  return new Promise((sLogActions, err) =>
	    this.client.call( "ServiceInterface", "getUserRelatedLogs",
      {uoid : uoid}, sLogActions, err));
	}

	getAllRelatedProjects(poid){
	  return new Promise((sProjectSmalls, err) =>
	    this.client.call( "ServiceInterface", "getAllRelatedProjects",
      {poid : poid}, sProjectSmalls, err));
	}

	getAllModelCheckers(){
	  return new Promise((sModelCheckers, err) =>
	    this.client.call( "ServiceInterface", "getAllModelCheckers",
      sModelCheckers, err));
	}

	addModelChecker(modelCheckerInstance){
	  return new Promise((modelCheckersAdded, err) =>
	    this.client.call( "ServiceInterface", "addModelChecker",
      {modelCheckerInstance : modelCheckerInstance}, modelCheckersAdded, err));
	}

	updateModelChecker(modelCheckerInstance){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "updateModelChecker",
      {modelCheckerInstance : modelCheckerInstance}, err));
	}

	validateModelChecker(oid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "validateModelChecker",
      {oid : oid}, err));
	}

	updateRevision(sRevision){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "updateRevision",
      { sRevision : sRevision}, res, err));
	}

	userHasCheckinRights(uoid, poid){
	  return new Promise((hasCheckinRights, err) =>
	    this.client.call( "ServiceInterface", "userHasCheckinRights",
      { uoid : uoid, poid : poid}, hasCheckinRights, err));
	}

	userHasRights(poid){
	  return new Promise((hasRights, err) =>
	    this.client.call( "ServiceInterface", "userHasRights",
      {poid : poid}, hasRights, err));
	}

	getGeoTag(goid){
	  return new Promise((geoTag, err) =>
	    this.client.call( "ServiceInterface", "getGeoTag",
      { goid : goid}, geoTag, err));
	}

	updateGeoTag(sGeoTag){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "getGeoTag",
      { sGeoTag : sGeoTag}, err));
	}

	getUserByUoid(uoid){
	  return new Promise((user, err) =>
	    this.client.call( "ServiceInterface", "getUserByUoid",
      { uoid : uoid}, user, err));
	}

	getCheckoutWarnings(poid){
	  return new Promise((checkoutWarnings, err) =>
	    this.client.call( "ServiceInterface", "getCheckoutWarnings",
      { poid : poid}, checkoutWarnings, err));
	}

	getCheckinWarnings(poid){
	  return new Promise((checkinWarnings, err) =>
	    this.client.call( "ServiceInterface", "getCheckinWarnings",
      { poid : poid}, checkinWarnings, err));
	}

	getAllCheckoutsOfProjectAndSubProjects(poid){
	  return new Promise((checkouts, err) =>
	    this.client.call( "ServiceInterface", "getAllCheckoutsOfProjectAndSubProjects",
      { poid : poid}, checkouts, err));
	}

	getAllRevisionsOfProject(poid){
	  return new Promise((revisions, err) =>
	    this.client.call( "ServiceInterface", "getAllRevisionsOfProject",
      { poid : poid}, revisions, err));
	}

	getTopLevelProjectByName(name){
	  return new Promise((project, err) =>
	    this.client.call( "ServiceInterface", "getTopLevelProjectByName",
      { name : name}, project, err));
	}

	getSubProjects(poid){
	  return new Promise((subprojects, err) =>
	    this.client.call( "ServiceInterface", "getSubProjects",
      { poid : poid}, subprojects, err));
	}

	getAllProjectsSmall(){
	  return new Promise((allSmallProjects, err) =>
	    this.client.call( "ServiceInterface", "getAllProjectsSmall", allSmallProjects, err));
	}

	getAllProjects(onlyTopLevel, onlyActive){
	  return new Promise((allProjects, err) =>
	    this.client.call( "ServiceInterface", "getAllProjects",
      { onlyTopLevel : onlyTopLevel, onlyActive : onlyActive}, allProjects, err));
	}

	getAllReadableProjects(){
	  return new Promise((allReadableProjects, err) =>
	    this.client.call( "ServiceInterface", "getAllReadableProjects", allReadableProjects, err));
	}

	getAllWritableProjects(){
	  return new Promise((allReadableProjects, err) =>
	    this.client.call( "ServiceInterface", "getAllWritableProjects", allWritableProjects, err));
	}

	addProject(projectName, schema){
	  return new Promise((createdProject, err) =>
	    this.client.call( "ServiceInterface", "addProject",
      { projectName : projectName, schema : schema}, createdProject, err));
	}

	addServiceToProject(poid, sService){
	  return new Promise((serviceAdded, err) =>
	    this.client.call( "ServiceInterface", "addServiceToProject",
      { poid : poid, sService : sService}, serviceAdded, err));
	}

	deleteService(oid){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "deleteService", { oid : oid}, err));
	}

	getService(soid){
	  return new Promise((sService, err) =>
	    this.client.call( "ServiceInterface", "getService", { soid : soid}, sService, err));
	}

	getNewService(soid){
	  return new Promise((sService, err) =>
	    this.client.call( "ServiceInterface", "getNewService", { soid : soid}, sService, err));
	}

	addProjectAsSubProject(projectName, parentPoid, schema){
	  return new Promise((createdSubProject, err) =>
	    this.client.call( "ServiceInterface", "addProjectAsSubProject",
      { projectName : projectName, parentPoid : parentPoid, schema: schema}, createdSubProject, err));
	}

	updateProject(sProject){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "updateProject",
      { sProject : sProject}, res, err));
	}

	deleteProject(poid){
	  return new Promise((deletedProject, err) =>
	    this.client.call( "ServiceInterface", "deleteProject",
      { poid : poid}, deletedProject, err));
	}

	undeleteProject(poid){
	  return new Promise((undeletedProject, err) =>
	    this.client.call( "ServiceInterface", "undeleteProject",
      { poid : poid}, undeletedProject, err));
	}

	branchToNewProject(roid, projectName, comment, sync){
	  return new Promise((branch, err) =>
	    this.client.call( "ServiceInterface", "branchToNewProject",
      { roid : roid, projectName : projectName, comment : comment, sync : sync}, branch, err));
	}

	branchToNewProject(roid, destPoid, comment, sync){
	  return new Promise((branch, err) =>
	    this.client.call( "ServiceInterface", "branchToExistingProject",
      { roid : roid, destPoid : destPoid, comment : comment, sync : sync}, branch, err));
	}

	addUser(username, name, type, selfRegistration, resetUrl){
	  return new Promise((createdUser, err) =>
	    this.client.call( "ServiceInterface", "addUser",
      { username : username, name : name, type : type, selfRegistration : selfRegistration, resetUrl : resetUrl}, createdUser, err));
	}

	addUserWithPassword(username, password, name, type, selfRegistration, resetUrl){
	  return new Promise((createdUser, err) =>
	    this.client.call( "ServiceInterface", "addUserWithPassword",
      { username : username, password : password, name : name, type : type, selfRegistration : selfRegistration, resetUrl : resetUrl}, createdUser, err));
	}

	changeUserType(uoid, userType){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "changeUserType",
      { uoid : uoid, userType : userType}, res, err));
	}

	addUserToProject(uoid, poid){
	  return new Promise((addedUserToProject, err) =>
	    this.client.call( "ServiceInterface", "addUserToProject",
      { uoid : uoid, poid : poid}, addedUserToProject, err));
	}

	removeUserFromProject(uoid, poid){
	  return new Promise((removedUserToProject, err) =>
	    this.client.call( "ServiceInterface", "removeUserFromProject",
      { uoid : uoid, poid : poid}, removedUserToProject, err));
	}

	deleteUser(uoid){
	  return new Promise((deletedUser, err) =>
	    this.client.call( "ServiceInterface", "deleteUser",
      { uoid : uoid}, deletedUser, err));
	}

	undeleteUser(uoid){
	  return new Promise((userDeleted, err) =>
	    this.client.call( "ServiceInterface", "undeleteUser",
      { uoid : uoid}, userDeleted, err));
	}

	getUserByUserName(username){
	  return new Promise((sUser, err) =>
	    this.client.call( "ServiceInterface", "getUserByUserName",
	    {username : username}, sUser, err));
	}

	getAllUsers(){
	  return new Promise((allUsers, err) =>
	    this.client.call( "ServiceInterface", "getAllUsers", allUsers, err));
	}

	getAllServicesOfProject(poid){
	  return new Promise((allServices, err) =>
	    this.client.call( "ServiceInterface", "getAllServicesOfProject",
	    {poid : poid}, allServices, err));
	}

	getAllNewServicesOfProject(poid){
	  return new Promise((allNewServices, err) =>
	    this.client.call( "ServiceInterface", "getAllNewServicesOfProject",
	    {poid : poid}, allNewServices, err));
	}

	getAllModelCheckersOfProject(poid){
	  return new Promise((allModelCheckers, err) =>
	    this.client.call( "ServiceInterface", "getAllModelCheckersOfProject",
	    {poid : poid}, allModelCheckers, err));
	}

	getAllCheckoutsOfProject(poid){
	  return new Promise((allCheckouts, err) =>
	    this.client.call( "ServiceInterface", "getAllCheckoutsOfProject",
	    {poid : poid}, allCheckouts, err));
	}

	getAllRevisionsByUser(uoid){
	  return new Promise((allRevisions, err) =>
	    this.client.call( "ServiceInterface", "getAllRevisionsByUser",
	    {uoid : uoid}, allRevisions, err));
	}

	getAllCheckoutsByUser(uoid){
	  return new Promise((allCheckouts, err) =>
	    this.client.call( "ServiceInterface", "getAllCheckoutsByUser",
	    {uoid : uoid}, allCheckouts, err));
	}

	getAllCheckoutsOfRevision(roid){
	  return new Promise((allCheckouts, err) =>
	    this.client.call( "ServiceInterface", "getAllCheckoutsOfRevision",
	    {roid : roid}, allCheckouts, err));
	}

	getAvailableClasses(){
	  return new Promise((availableClasses, err) =>
	    this.client.call( "ServiceInterface", "getAvailableClasses", availableClasses, err));
	}

	getAvailableClassesInRevision(roid){
	  return new Promise((availableClasses, err) =>
	    this.client.call( "ServiceInterface", "getAvailableClassesInRevision",
	    {roid : roid}, availableClasses, err));
	}

	getAllNonAuthorizedProjectsOfUser(uoid){
	  return new Promise((nonAuthorizedProjects, err) =>
	    this.client.call( "ServiceInterface", "getAllNonAuthorizedProjectsOfUser",
	    {uoid : uoid}, nonAuthorizedProjects, err));
	}

	getAllNonAuthorizedUsersOfProject(poid){
	  return new Promise((nonAuthorizedUsers, err) =>
	    this.client.call( "ServiceInterface", "getAllNonAuthorizedUsersOfProject",
	    { poid : poid}, nonAuthorizedUsers, err));
	}

	getAllAuthorizedUsersOfProject(poid){
	  return new Promise((authorizedUsers, err) =>
	    this.client.call( "ServiceInterface", "getAllAuthorizedUsersOfProject",
	    {poid : poid}, authorizedUsers, err));
	}

	getUsersProjects(uoid){
	  return new Promise((usersProjects, err) =>
	    this.client.call( "ServiceInterface", "getUsersProjects",
	    {uoid : uoid}, usersProjects, err));
	}

	setRevisionTag(roid, tag){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "setRevisionTag",
	    {roid : roid, tag: tag}, err));
	}

	compare(roid1, roid2, sCompareType, mcid){
	  return new Promise((sCompareResult, err) =>
	    this.client.call( "ServiceInterface", "compare",
	    {roid1 : roid1, roid2 : roid2, sCompareType : sCompareType, mcid : mcid}, sCompareResult, err));
	}

	sendCompareEmail(sCompareType, mcid, poid, roid1, roid2, address){
	  return new Promise((res, err) =>
	    this.client.call( "ServiceInterface", "sendCompareEmail",
	    { sCompareType : sCompareType, mcid : mcid, poid : poid, roid1 : roid1, roid2 : roid2, address : address}, err));
	}
}