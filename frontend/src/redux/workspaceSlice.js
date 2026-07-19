import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    workspace:null,
    messages:null,
    fileData: null,
    userWorkspaces:null,
    deploy:false,
    selectedModel: null,
    refresh:false
}

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers:{
        getWorkspace:(state, action) => {
            state.workspace = action.payload
        },
        getRefresh:(state, action) => {
            state.refresh = !state.refresh
        },
        getMessages: (state, action) => {
            state.messages = action.payload
        },
        getFileData: (state, action) => {
            state.fileData = action.payload
        },
        getUserWorkspaces: (state, action) => {
            state.userWorkspaces = action.payload
        },
        setSelectedModel: (state, action) => {
            state.selectedModel = action.payload
        },
        setDeploy: (state, action) => {
            state.deploy = !state.deploy
        }

    }
})

export const {getRefresh, getWorkspace, getMessages, getFileData, getUserWorkspaces, setSelectedModel, setDeploy} = workspaceSlice.actions
export default workspaceSlice.reducer


