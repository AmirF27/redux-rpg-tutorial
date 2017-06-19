"use strict";

import { createStore, combineReducers } from "redux";

const initialState = {
    level: 1,
    xp: 0,
    position: {
        x: 0,
        y: 0
    },
    stats: {
        health: 50,
        maxHealth: 50
    },
    inventory: {
        potions: 2
    }
};

/*
 * Actions
**/
const Actions = {
    LEVEL_UP: "LEVEL_UP",
    GAIN_XP: "GAIN_XP",
    MOVE: "MOVE",
    DRINK_POTION: "DRINK_POTION",
    TAKE_DAMAGE: "TAKE_DAMAGE"
};

/*
 * Action Creators
**/
function gainXp(xp) {
    return {
        type: Actions.GAIN_XP,
        payload: xp
    };
}

function levelUp() {
    return {
        type: Actions.LEVEL_UP
    };
}

function move(x, y) {
    return {
        type: Actions.MOVE,
        payload: { x, y }
    };
}

function drinkPotion() {
    return {
        type: Actions.DRINK_POTION
    };
}

function takeDamage(amount) {
    return {
        type: Actions.TAKE_DAMAGE,
        payload: amount
    };
}

/*
 * Reducers
**/
function levelReducer(state = 1, action) {
    switch (action.type) {
        case Actions.LEVEL_UP:
            return state + 1;
    }
    return state;
}

function xpReducer(state = 0, action) {
    switch (action.type) {
        case Actions.GAIN_XP:
            return state + action.payload;
    }
    return state;
}

function positionReducer(state = initialState.position, action) {
    switch (action.type) {
        case Actions.MOVE:
            let { x, y } = action.payload;
            x += state.x;
            y += state.y;
            return { x, y };
    }
    return state;
}

function statsReducer(state = initialState.stats, action) {
    let { health, maxHealth } = state;

    switch (action.type) {
        case Actions.DRINK_POTION:
            health = Math.min(health + 10, maxHealth);
            return { ...state, health, maxHealth };

        case Actions.TAKE_DAMAGE:
            health = Math.max(0, health - action.payload);
            return { ...state, health };
    }
    return state;
}

function inventoryReducer(state = initialState.stats, action) {
    let { potions } = state;

    switch (action.type) {
        case Actions.DRINK_POTION:
            potions = Math.max(0, potions - 1);
            return { ...state, potions };
    }
    return state;
}

/*
 * Bootstrapping
**/
const reducer = combineReducers({
    level: levelReducer,
    xp: xpReducer,
    position: positionReducer,
    stats: statsReducer,
    inventory: inventoryReducer
});
const store = createStore(reducer);

store.subscribe(function() {
    console.log(JSON.stringify(store.getState()));
});

store.dispatch(move(1, 0));
store.dispatch(move(0, 1));
store.dispatch(takeDamage(13));
store.dispatch(drinkPotion());
store.dispatch(gainXp(100));
store.dispatch(levelUp());
