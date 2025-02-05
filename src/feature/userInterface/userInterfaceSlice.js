import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
    curItem: 'ask-page', // Активный элемент навигации
    curPage: 'ask-page', // Активная страница
    popup: false, // Активация Popup
    tab: 'first', // Табы
    popupText: '', // Текст в Popup
    popupSource: null, // Источник Popup (например, 'success', 'error', 'report-page')
};

// Создаем срез
const userInterfaceSlice = createSlice({
    name: 'userInterface',
    initialState,
    reducers: {
        setCurItem: (state, action) => {
            state.curItem = action.payload;
        },
        setCurPage: (state, action) => {
            state.curPage = action.payload;
        },
        setPopup: (state, action) => {
            state.popup = action.payload;
        },
        setTab: (state, action) => {
            state.tab = action.payload;
        },
        setPopupText: (state, action) => {
            state.popupText = action.payload;
        },
        setPopupSource: (state, action) => {
            state.popupSource = action.payload;
        },
        resetPopup: (state) => {
            state.popup = false;
            state.popupText = '';
            state.popupSource = null;
        },
    },
});

// Экспортируем действия
export const {
    setCurItem,
    setCurPage,
    setPopup,
    setTab,
    setPopupText,
    setPopupSource,
    resetPopup,
} = userInterfaceSlice.actions;

// Экспортируем редюсер
export default userInterfaceSlice.reducer;