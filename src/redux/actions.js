export const CREATE_NEW_TAB = 'CREATE_NEW_TAB';
export const CHANGE_TAB = 'CHANGE_TAB';
export const INIT_APP = 'INIT_APP';

export const createNewTab = (newTab, newTabId, initialSessions) => ({
    type: CREATE_NEW_TAB,
    payload: { newTab, newTabId, initialSessions },
});

export const changeTab = (tabId, sessions) => ({
    type: CHANGE_TAB,
    payload: { tabId, sessions },
});

export const initApp = (tabs, initialSessions) => ({
    type: INIT_APP,
    payload: { tabs, initialSessions },
});