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
            var economicDatum = {
                category: 'ECONOMIC AND FINANCIAL',
                taskNames: [],
                normData: [],
                realData: []
            }
            var energyDatum = {
                category: 'ENERGY AND ENVIRONMENTAL',
                taskNames: [],
                normData: [],
                realData: []
            }
            taskList.forEach(task => {
                let taskFullname = task.name + ' (' + moment(task.date).format('lll') + ')';
                var state = ComputeVersion.fetchRelevantTasks(task, tasks);
                if (state.economicTask){
                    economicDatum.taskNames.push({ taskId: task._id, taskFullname: taskFullname });
                    for (let i = 0; i < state.economicTask.names.length; i++){
                        if (common.ACTIONS[state.economicTask.action].priorities[i]){
                            let minValue = Number(common.ACTIONS[state.economicTask.action].minValues[i]);
                            let maxValue = Number(common.ACTIONS[state.economicTask.action].maxValues[i]);
                            let realValue = Number(state.economicTask.values[i]);
                            let normValue = (realValue-minValue) / (maxValue-minValue);
                            let indicator = state.economicTask.names[i].concat(", ", String(minValue), "-", String(maxValue), " [", state.economicTask.formats[i], "]");

                            let normDatum = {indicator:indicator, [task._id]:normValue.toFixed(2)}
                            let realDatum = {indicator:indicator, [task._id]:realValue.toFixed(2)}

                            if(economicDatum.normData.filter(x => x.indicator === indicator).length > 0){
                                economicDatum.normData = economicDatum.normData.map(prevDatum =>
                                    (prevDatum.indicator === indicator)? {...prevDatum, ...normDatum}: prevDatum);
                                economicDatum.realData = economicDatum.realData.map(prevDatum =>
                                    (prevDatum.indicator === indicator)? {...prevDatum, ...realDatum}: prevDatum);
                            } else {
                                economicDatum.normData.push(normDatum);
                                economicDatum.realData.push(realDatum);
                            }
                        }
                    }
                }
                if(state.energyTask){
                    energyDatum.taskNames.push({ taskId: task._id, taskFullname: taskFullname });
                    for (let i = 0; i < state.energyTask.names.length; i++){
                        if (common.ACTIONS[state.energyTask.action].priorities[i]){
                            let minValue = Number(common.ACTIONS[state.energyTask.action].minValues[i]);
                            let maxValue = Number(common.ACTIONS[state.energyTask.action].maxValues[i]);
                            let realValue = Number(state.energyTask.values[i]);
                            let normValue = (realValue-minValue) / (maxValue-minValue);
                            let indicator = state.energyTask.names[i].concat(", ", String(minValue), "-", String(maxValue), " [", state.energyTask.formats[i], "]");

                            let normDatum = {indicator:indicator, [task._id]:normValue.toFixed(2)}
                            let realDatum = {indicator:indicator, [task._id]:realValue.toFixed(2)}
                            
                            if (energyDatum.normData.filter(x => x.indicator === indicator).length > 0){
                                energyDatum.normData = energyDatum.normData.map(prevDatum =>
                                    (prevDatum.indicator === indicator)? {...prevDatum, ...normDatum}: prevDatum);
                                energyDatum.realData = energyDatum.realData.map(prevDatum =>
                                    (prevDatum.indicator === indicator)? {...prevDatum, ...realDatum}: prevDatum);
                            } else {
                                energyDatum.normData.push(normDatum);
                                energyDatum.realData.push(realDatum);
                            }
                        }
                    }
                }
            } );
            return [economicDatum, energyDatum];
        }
} 
export default ComputeVersion;
