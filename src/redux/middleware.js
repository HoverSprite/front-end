const bypassUndoMiddleware = (store) => {
    return (next) => (action) => {
        const stateBefore = store.getState();

        // Log the state before action
        console.log('State before action:', stateBefore);

        // Check if the action is an undo action
        if (action.type === '@@redux-undo/UNDO') {
            const historyLength = stateBefore.tabs.past.length;

            // Allow undo only if there are more than 2 history states
            if (historyLength > 1) {
                console.log('Allowing undo action.');
                return next(action);
            } else {
                console.log('Undo is not allowed, not enough history states.');
                return stateBefore;
            }
        } else {
            // Proceed with the action
            const result = next(action);

            const stateAfter = store.getState();

            // Log the state after action
            console.log('State after action:', stateAfter);

            // Log the action type if not null
            if (action.type) {
                console.log('Dispatched action:', action.type);
            }

            return result;
        }
    };
};

export default bypassUndoMiddleware;