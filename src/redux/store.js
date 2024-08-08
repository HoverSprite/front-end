import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import undoable, { excludeAction } from 'redux-undo';
import tabsReducer from './tabsReducer'; // create this reducer
import { thunk } from 'redux-thunk';
import bypassUndoMiddleware from './middleware';

const rootReducer = combineReducers({
    tabs: undoable(tabsReducer),
});

const store = createStore(rootReducer, applyMiddleware(thunk, bypassUndoMiddleware));

const StoreProvider = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
);

export default StoreProvider;