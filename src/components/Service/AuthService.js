import axios from 'axios';

const url = 'https://api-experdserve.experd.com/api/um/users/login';
export function login(username, password){
    return axios.post(url, { username: username, password: password, appcode:'A002' })
        .then(response => {
            if (response.status === 200) {
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                return response.data;
            }
            return false;
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function isAuthenticate() {
    if (localStorage.getItem('currentUser'))
        return true;
    else
        return false;
}

export function logout(){
    localStorage.clear();
}