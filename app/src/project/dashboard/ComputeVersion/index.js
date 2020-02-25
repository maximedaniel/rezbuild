/**
 * @class ComputeVersion
 * @extends Component
 * @description Define a set of static functions for version graph exploration
 */
import {mean} from 'mathjs'
import moment from 'moment'

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
                environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENVIRONMENTAL_ASIS'),
                economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECONOMICAL_ASIS'),
                socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_ASIS'),
                energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGICAL_ASIS'),
                comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_ASIS'),
                error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENVIRONMENTAL_ASIS')){
                    let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENVIRONMENTAL_ASIS')||task:task;
                    let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                    return {
                            modelTask : modelTask,
                            environmentalTask : refTask,
                            economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_ASIS'),
                            socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_ASIS'),
                            energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_ASIS'),
                            comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_ASIS'),
                            error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ECONOMICAL_ASIS')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECONOMICAL_ASIS')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_ASIS')
                return {
                    modelTask : modelTask,
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_ASIS'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_ASIS'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_ASIS'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_ASIS'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENVIRONMENTAL_TOBE'),
                    economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_SOCIAL_TOBE'),
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, refTask._id, 'KPI_COMFORT_TOBE'),
                    error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ENVIRONMENTAL_TOBE')){
                    let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ENVIRONMENTAL_TOBE')||task:task;
                    let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                    return {
                            modelTask : modelTask,
                            environmentalTask : refTask,
                            economicalTask :ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_TOBE'),
                            socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),
                            energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_TOBE'),
                            comfortTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_COMFORT_TOBE'),
                            error: false, pending: false};
            } 
            else if(task.action.includes('KPI_ECONOMICAL_TOBE')){
                let refTask = (task.lane ==='lane_todo')?ComputeVersion.getFirstParentTaskWithAction(tasks, task._id, 'KPI_ECONOMICAL_TOBE')||task:task;
                let modelTask =  ComputeVersion.getFirstParentTaskWithAction(tasks, refTask._id, 'MODEL_TOBE')
                return {
                    modelTask : modelTask,
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_TOBE'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_TOBE'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_TOBE'),
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
                    environmentalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENVIRONMENTAL_TOBE'),
                    economicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ECONOMICAL_TOBE'),
                    socialTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_SOCIAL_TOBE'),  
                    energicalTask : ComputeVersion.getLastChildTaskWithAction(tasks, modelTask._id, 'KPI_ENERGICAL_TOBE'),
                    comfortTask : refTask,
                    error: false, pending: false};
            } 
            else {
                return {
                    modelTask : null,
                    environmentalTask : null,
                    economicalTask :null,
                    socialTask : null,
                    energicalTask : null,
                    comfortTask : null,
                    error: false, pending: true};
            }
        }
        static computeScoreOfRelevantTask(task, tasks) {
            var state = ComputeVersion.fetchRelevantTasks(task, tasks);

            let categories = ['Economical', 'Social', 'Environmental',  'Energical', 'Comfort']; 
            let series = [{name: task.name + ' (' + moment(task.date).format('LLL') + ')', id: task._id, data: []}];
            if(state.economicalTask){
                series[0].data.push(
                    mean(
                        state.economicalTask.names.filter((name, index) => state.economicalTask.values[index] !== 0)
                        .map((name, index) => state.economicalTask.values[index])
                    ).toFixed(2)
                );
            } else series[0].data.push(0);

            if(state.socialTask){
                series[0].data.push(
                    mean(
                        state.socialTask.names.filter((name, index) => state.socialTask.values[index] !== 0)
                        .map((name, index) =>  state.socialTask.values[index])
                    ).toFixed(2)
                );
            } else series[0].data.push(0);

            if(state.environmentalTask){
                series[0].data.push(
                    mean(
                        state.environmentalTask.names.filter((name, index) => state.environmentalTask.values[index] !== 0)
                        .map((name, index) =>  state.environmentalTask.values[index])
                    ).toFixed(2)
                );
            } else series[0].data.push(0);

            if(state.energicalTask){
                series[0].data.push(
                    mean(
                        state.energicalTask.names.filter((name, index) => state.energicalTask.values[index] !== 0)
                        .map((name, index) =>  state.energicalTask.values[index])
                    ).toFixed(2)
                );
            } else series[0].data.push(0);

            if(state.comfortTask){
                    series[0].data.push(
                        mean(
                            state.comfortTask.names.filter((name, index) => state.comfortTask.values[index] !== 0)
                            .map((name, index) =>  state.comfortTask.values[index])
                        ).toFixed(2)
                    );
            } else series[0].data.push(0);

            return {series: series, categories: categories};
        }
} 
export default ComputeVersion;
