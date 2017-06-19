"use strict";

import { createStore, combineReducers } from "redux";
import { createAction, handleActions } from "redux-actions";
import { createSelector } from "reselect";

const initialState = {
    hero: {
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
    },
    monster: {}
};

const levels = [
    { xp:    0, maxHealth: 50 }, // Level 1
    { xp:  100, maxHealth: 55 }, // Level 2
    { xp:  250, maxHealth: 60 }, // Level 3
    { xp:  500, maxHealth: 67 }, // Level 4
    { xp: 1000, maxHealth: 75 }, // Level 5
];

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
const levelUp = createAction(Actions.LEVEL_UP);
const gainXp = createAction(Actions.GAIN_XP);
const move = createAction(Actions.MOVE, (x, y) => ({ x, y }));
const drinkPotion = createAction(Actions.DRINK_POTION);
const takeDamage = createAction(Actions.TAKE_DAMAGE);

/*
 * Reducers
**/
function heroReducer(state = initialState.hero, action) {
    const { stats, inventory } = state;

    switch (action.type) {
        // case Actions.LEVEL_UP:
        //     const level = state.level + 1;
        //     return { ...state, level };

        case Actions.GAIN_XP:
            let { level, xp } = state;

            xp += action.payload;

            if (xp == levels[level].xp) {
                level++;
            }

            return { ...state, level, xp };

        case Actions.MOVE:
            let { position: { x, y } } = state;
            x += action.payload.x;
            y += action.payload.y;
            return { ...state, position: { x, y } };

        case Actions.DRINK_POTION:
            return {
                ...state,
                stats: statsReducer(stats, action),
                inventory: inventoryReducer(inventory, action)
            };

        case Actions.TAKE_DAMAGE:
            return {
                ...state,
                stats: statsReducer(stats, action)
            };
    }

    return state;
}

function statsReducer(state = initialState.hero.stats, action) {
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

function inventoryReducer(state = initialState.hero.inventory, action) {
    let { potions } = state;

    switch (action.type) {
        case Actions.DRINK_POTION:
            potions = Math.max(0, potions - 1);
            return { ...state, potions };
    }

    return state;
}

function monsterReducer(state = initialState.monster, action) {
    // TODO: write monster reducer logic

    return state;
}

/*
 * Selectors
**/
function getXp(state) {
    return state.hero.xp;
}

function getHealth(state) {
    return state.hero.stats.heath;
}

const getLevel = createSelector(getXp, function(xp) {
    return levels.filter(level => xp >= level.xp).length;
});

const getMaxHealth = createSelector(getLevel, function(l) {
    return levels[l].maxHealth;
});

const isHealthLow = createSelector(
    [ getHealth, getMaxHealth ],
    function(health, maxHealth){
        return health < maxHealth * 0.15;
    });

/*
 * Bootstrapping
**/
const reducer = combineReducers({
    hero: heroReducer,
    monster: monsterReducer
});
const store = createStore(reducer);

store.subscribe(function() {
    console.log(JSON.stringify(store.getState()));
});

// store.dispatch(move(1, 0));
// store.dispatch(move(0, 1));
// store.dispatch(takeDamage(13));
// store.dispatch(drinkPotion());
// store.dispatch(gainXp(100));
// store.dispatch(levelUp());

console.log(isHealthLow(store.getState()));
console.log(isHealthLow(store.getState()));
store.dispatch(gainXp(100));
console.log("LEVEL UP");
console.log(isHealthLow(store.getState()));
