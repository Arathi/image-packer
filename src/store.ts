import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface Task {
    uri: string;
    fileName: string;
    totalLength: number;
    completedLength: number;
}

export interface TasksState {
    tasks: Task[];
}

const state = {
    tasks: []
};

const getters = {
    //
}

const actions = {
    // 
}

const mutations = {
    addTask(state: Store<TasksState>, task: Task) {
        state
    }
}

export const key: InjectionKey<Store<TasksState>> = Symbol();
export const store = createStore<TasksState>({
    state,
    getters,
    actions,
    // mutations
});
