/**
 * @class ComputeVersion
 * @extends Component
 * @description Define a set of static functions for version graph exploration
 */
//import {mean} from 'mathjs'
//import moment from 'moment'
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
                economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECONOMICAL_ASIS'),
                socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_ASIS'),
                energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGICAL_ASIS'),
                comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_ASIS'),
                error: false, pending: false};
            }
            else if(task.action.includes('KPI_ECONOMICAL_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECONOMICAL_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicalTask :refTask,
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_ASIS'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_SOCIAL_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_SOCIAL_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_ASIS'),
                    socialTask :refTask, 
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_ASIS'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENERGICAL_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENERGICAL_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_ASIS'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),  
                    energicalTask : refTask,
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_COMFORT_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_COMFORT_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_ASIS'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),  
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_ASIS'),
                    comfortTask : refTask,
                    error: false, pending: false};
            } 
            else if(task.action.includes('MODEL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'MODEL_TOBE')||task:task;
                return {
                    modelTask : refTask,
                    economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_TOBE'),
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            }
            else if(task.action.includes('KPI_ECONOMICAL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECONOMICAL_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicalTask :refTask,
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_SOCIAL_TOBE'),
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks,modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_SOCIAL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_SOCIAL_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask :refTask, 
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENERGICAL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENERGICAL_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),  
                    energicalTask : refTask,
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_COMFORT_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_COMFORT_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),  
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : refTask,
                    error: false, pending: false};
            } 
            else {
                return {
                    modelTask : null,
                    economicalTask :null,
                    socialTask : null,
                    energicalTask : null,
                    comfortTask : null,
                    error: false, pending: true};
            }
        }
        static computeScoreOfRelevantTask(tasks, ...taskList) {
            var data = [];
            var economicalDatum = {
                //id: task._id,
                //name: task.name + ' (' + moment(task.date).format('LLL') + ')', 
                category: 'ECONOMICAL',
                data: [],
            }
            var energicalDatum = {
                //id: task._id,
               // name: task.name + ' (' + moment(task.date).format('LLL') + ')', 
                category: 'ENERGY',
                data: [],
            }
            taskList.forEach(task => {
                var state = ComputeVersion.fetchRelevantTasks(task, tasks);
                if(state.economicalTask){
                    for (let i = 0; i < state.economicalTask.names.length; i++){
                        if(common.ACTIONS[state.economicalTask.action].priorities[i]){
                            let indicator = state.economicalTask.names[i];
                            let minValue = common.ACTIONS[state.economicalTask.action].minValues[i];
                            let maxValue = common.ACTIONS[state.economicalTask.action].maxValues[i];
                            let currValue = state.economicalTask.values[i];
                            let score = (currValue-minValue) / (maxValue-minValue);
                            let datum = {indicator:indicator, [task._id]:score.toFixed(2)}
                            // look for indicator
                            if(economicalDatum.data.filter(datum => datum.indicator === indicator).length > 0){
                                economicalDatum.data = economicalDatum.data.map(prevDatum =>
                                    (prevDatum.indicator === datum.indicator)? {...prevDatum, ...datum}: prevDatum
                                );
                            } else {
                                economicalDatum.data.push(datum);
                            }
                            
                        }
                    }
                }
                if(state.energicalTask){
                    for (let i = 0; i < state.energicalTask.names.length; i++){
                        if(common.ACTIONS[state.energicalTask.action].priorities[i]){
                            let indicator = state.energicalTask.names[i];
                            let minValue = common.ACTIONS[state.energicalTask.action].minValues[i];
                            let maxValue = common.ACTIONS[state.energicalTask.action].maxValues[i];
                            let currValue = state.energicalTask.values[i];
                            let score = (currValue-minValue) / (maxValue-minValue);
                            let datum = {indicator:indicator, [task._id]:score.toFixed(2)}
                            // look for indicator
                            if(energicalDatum.data.filter(datum => datum.indicator === indicator).length > 0){
                                energicalDatum.data = energicalDatum.data.map(prevDatum =>
                                    (prevDatum.indicator === datum.indicator)? {...prevDatum, ...datum}: prevDatum
                                );
                            } else {
                                energicalDatum.data.push(datum);
                            }
                        }
                    }
                }
            } );
            data.push(economicalDatum);
            data.push(energicalDatum);
            return data;
        }
} 
export default ComputeVersion;
