import { ADD_USER, DEL_USER } from "../constants/action-types";

export const addUser = user => ({ type: ADD_USER, payload: user });
export const delUser = username => ({ type: DEL_USER, payload: username });