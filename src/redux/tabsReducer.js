import produce from 'immer';
import { CREATE_NEW_TAB, CHANGE_TAB, INIT_APP } from './actions';
const initialState = {
    tabData: [],
    selectedTabId: 1,
    chatBoxSessionsByTab: {},
    isEditing: null,
    newTabName: '',
};

const tabsReducer = produce((draft, action) => {
    console.log(action.type);
    switch (action.type) {
        case 'SET_TAB_DATA':
            draft.tabData = action.payload;
            break;
        case 'SET_SELECTED_TAB_ID':
            draft.selectedTabId = action.payload;
            break;
        case 'SET_CHAT_BOX_SESSIONS':
            console.log(action.payload.tadId)
            draft.chatBoxSessionsByTab[action.payload.tabId] = action.payload.sessions;
            break;
        case 'SET_IS_EDITING':
            draft.isEditing = action.payload;
            break;
        case 'SET_NEW_TAB_NAME':
            draft.newTabName = action.payload;
            break;
        case 'UPDATE_TAB_NAME':
            const tab = draft.tabData.find(tab => tab.id === action.payload.id);
            if (tab) tab.tabName = action.payload.newTabName;
            break;
        case 'MOVE_TAB':
            const [movedTab] = draft.tabData.splice(action.payload.fromIndex, 1);
            draft.tabData.splice(action.payload.toIndex, 0, movedTab);
            break;
        case CREATE_NEW_TAB:
            draft.tabData.push(action.payload.newTab);
            draft.selectedTabId = action.payload.newTabId;
            draft.chatBoxSessionsByTab[action.payload.newTabId] = action.payload.initialSessions;
            break;
        case CHANGE_TAB:
            draft.selectedTabId = action.payload.tabId;
            draft.chatBoxSessionsByTab[action.payload.tabId] = action.payload.sessions;
            break;
        case INIT_APP:
            draft.tabData = action.payload.tabs;
            draft.chatBoxSessionsByTab[1] = action.payload.initialSessions;
            break;
        // Add other cases as needed
        default:
            break;
    }
}, initialState);

export default tabsReducer;