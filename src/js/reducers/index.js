import { ADD_USER, DEL_USER } from "../constants/action-types";

let user = JSON.parse(localStorage.getItem('currentUser'));
const usersStorage = user ? { users:[user] } :
{
  users: new Array()
}

const rootReducer = (state = usersStorage, action) => {
  switch (action.type) {
    case ADD_USER:
    return { ...state, users: state.users.concat(action.payload) };
    case DEL_USER:
    return { ...state, users: state.users.filter(user =>user.username !== action.payload)};
    default:
      return state;
  }
};
export default rootReducer;