type Action = {
    type: string,
    payload: any,
}

type State = string[]
export const reducer = (state: State, action: Action) {
    switch (action.type) {
        case 'SET_SELECTED_CUSTOMERS':
            return {
                ...state,
                sortBy: action.payload
            }
    }
}