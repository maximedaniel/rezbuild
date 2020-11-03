/**
 * @class ComputeVersion
 * @extends Component
 * @description Define a set of static functions for version graph exploration
 */
//import {mean} from 'mathjs'
import moment from 'moment'
import common from 'common'

class ComputeVersion {
    static getFirstParentTaskWithAction = (tasks, taskId, action) => {
        var currTask = tasks.filter((task) => task._id === taskId)[0];
        var prevTasks = currTask.prev.map((prevTaskId) => tasks.filter((task) => task._id === prevTaskId)[0]);
        if (prevTasks.length > 0){
            var resTasks = prevTasks.filter((prevTask) => (prevTask.action.includes(action) && prevTask.lane !=='lane_todo'));
            if(resTasks.length > 0){
                return resTasks[0];
            } else return ComputeVersion.getFirstParentTaskWithAction(tasks, prevTasks[0]._id, action);
        } else return null;
    }
    static getLastChildTaskWithAction = (tasks, taskId, action) => {
        var currTask = tasks.filter((task) => task._id === taskId)[0];
        var nextTasks = currTask.next.map((nextTaskId) => tasks.filter((task) => task._id === nextTaskId)[0]);
        var resTasks = nextTasks.filter((nextTask) => (nextTask.action.includes(action) && nextTask.lane !=='lane_todo'));
        if (resTasks.length > 0){
            if(resTasks[0].next.length) return ComputeVersion.getLastChildTaskWithAction(tasks, resTasks[0]._id, action);
            else return resTasks[0];
        } else return null;
    }
    static fetchRelevantTasks = (task, tasks) => {
        if(task.action.includes('MODEL_ASIS')){
            let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'MODEL_ASIS')||task:task;
            return {
                modelTask : refTask,
                economicTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECON_AND_FIN_ASIS'),
                socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_ASIS'),
                energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGY_AND_ENV_ASIS'),
                comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_ASIS'),
                error: false, pending: false};
            }
            else if(task.action.includes('KPI_ECON_AND_FIN_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECON_AND_FIN_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicTask :refTask,
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGY_AND_ENV_ASIS'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_SOCIAL_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_SOCIAL_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_ASIS'),
                    socialTask :refTask, 
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGY_AND_ENV_ASIS'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENERGY_AND_ENV_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENERGY_AND_ENV_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_ASIS'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),  
                    energyTask : refTask,
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_COMFORT_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_COMFORT_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_ASIS'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),  
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGY_AND_ENV_ASIS'),
                    comfortTask : refTask,
                    error: false, pending: false};
            } 
            else if(task.action.includes('MODEL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'MODEL_TOBE')||task:task;
                return {
                    modelTask : refTask,
                    economicTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECON_AND_FIN_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_TOBE'),
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGY_AND_ENV_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            }
            else if(task.action.includes('KPI_ECON_AND_FIN_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECON_AND_FIN_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicTask :refTask,
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_SOCIAL_TOBE'),
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_ENERGY_AND_ENV_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_SOCIAL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_SOCIAL_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_TOBE'),
                    socialTask :refTask, 
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGY_AND_ENV_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENERGY_AND_ENV_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENERGY_AND_ENV_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),  
                    energyTask : refTask,
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_COMFORT_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_COMFORT_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECON_AND_FIN_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),  
                    energyTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGY_TOBE'),
                    comfortTask : refTask,
                    error: false, pending: false};
            } 
            else {
                return {
                    modelTask : null,
                    economicTask :null,
                    socialTask : null,
                    energyTask : null,
                    comfortTask : null,
                    error: false, pending: true};
            }
        }
        static computeScoreOfRelevantTask(tasks, ...taskList) {
            var data = [];
            var economicDatum = {
                parentTask: new Map(),
                category: 'ECONOMIC AND FINANCIAL',
                data: []
            }
            var energyDatum = {
                parentTask : new Map(),
                category: 'ENERGY AND ENVIRONMENTAL',
                data: []
            }
            taskList.forEach(task => {
                let taskFullname = task.name + ' (' + moment(task.date).format('LLL') + ')';
                var state = ComputeVersion.fetchRelevantTasks(task, tasks);
                if(state.economicTask){
                    for (let i = 0; i < state.economicTask.names.length; i++){
                        if(common.ACTIONS[state.economicTask.action].priorities[i]){
                            let indicator = state.economicTask.names[i];
                            let minValue = common.ACTIONS[state.economicTask.action].minValues[i];
                            let maxValue = common.ACTIONS[state.economicTask.action].maxValues[i];
                            let currValue = state.economicTask.values[i];
                            let score = (currValue-minValue) / (maxValue-minValue);
                            let datum = {indicator:indicator, [task._id]:score.toFixed(2)}
                            // look for indicator
                            if(economicDatum.data.filter(datum => datum.indicator === indicator).length > 0){
                                economicDatum.data = economicDatum.data.map(prevDatum =>
                                    (prevDatum.indicator === datum.indicator)? {...prevDatum, ...datum}: prevDatum
                                );
                            } else {
                                economicDatum.data.push(datum);
                            }
                        }
                    }
                    economicDatum.parentTask.set(task._id, taskFullname);
                }
                if(state.energyTask){
                    for (let i = 0; i < state.energyTask.names.length; i++){
                        if(common.ACTIONS[state.energyTask.action].priorities[i]){
                            let indicator = state.energyTask.names[i];
                            let minValue = common.ACTIONS[state.energyTask.action].minValues[i];
                            let maxValue = common.ACTIONS[state.energyTask.action].maxValues[i];
                            let currValue = state.energyTask.values[i];
                            let score = (currValue-minValue) / (maxValue-minValue);
                            let datum = {indicator:indicator, [task._id]:score.toFixed(2)}
                            // look for indicator
                            if(energyDatum.data.filter(datum => datum.indicator === indicator).length > 0){
                                energyDatum.data = energyDatum.data.map(prevDatum =>
                                    (prevDatum.indicator === datum.indicator)? {...prevDatum, ...datum}: prevDatum
                                );
                            } else {
                                energyDatum.data.push(datum);
                            }
                        }
                    }
                    energyDatum.parentTask.set(task._id, taskFullname);
                }
            } );
            data.push(economicDatum);
            data.push(energyDatum);
            return data;
        }
} 
export default ComputeVersion;
