import { createSelector } from '@reduxjs/toolkit';

// Базовый селектор для userInterface
export const selectUserInterface = (state) => state.userInterface;

// Селекторы для отдельных полей
export const selectCurItem = createSelector(selectUserInterface, (ui) => ui.curItem);
export const selectCurPage = createSelector(selectUserInterface, (ui) => ui.curPage);
export const selectPopup = createSelector(selectUserInterface, (ui) => ui.popup);
export const selectTab = createSelector(selectUserInterface, (ui) => ui.tab);
export const selectPopupText = createSelector(selectUserInterface, (ui) => ui.popupText);
export const selectPopupSource = createSelector(selectUserInterface, (ui) => ui.popupSource);

// Комбинированный селектор для popup
export const selectPopupState = createSelector(
    selectUserInterface,
    (ui) => ({
        popup: ui.popup,
        popupText: ui.popupText,
        popupSource: ui.popupSource,
    })
);