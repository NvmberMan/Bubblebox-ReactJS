import axios from "axios";

export const URL = "http://localhost:3001"

export const hit_login = async (email, pass) => {
    const data = await axios.post(`${URL}/user/login`, {
        'email' : email,
        'password' : pass
    });

    return data;
}

export const hit_register = async (username, email, pass, repass, checkbox) => {
    const data = await axios.post(`${URL}/user/register`, {
        'email' : email,
        'username' : username,
        'password' : pass,
        'repassword' : repass,
        'checkbox' : checkbox
    })

    return data
}


export const hit_getAllServer = async (token) => {
    const data = await axios.get(`${URL}/server`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_createServer = async (token, name, tag_line, description) => {
    const data = await axios.post(`${URL}/server/create`, {
        name: name,
        tag_line,
        description
    }, 
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_getServerMember = async (token, server_id) => {
    const data = await axios.post(`${URL}/server/member`, {
        server_id
    }, 
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_leaveServer = async (token, server_id) => {
    const data = await axios.post(`${URL}/server/leave`, {
        server_id
    }, 
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}


export const hit_logout = async (token) => {
    const data = await axios.post(`${URL}/user/logout`, {}, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}


export const hit_discover = async (token) => {
    const data = await axios.get(`${URL}/server/discover`, 
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_joinServer = async (token, server_id) => {
    const data = await axios.post(`${URL}/server/join`, {
        server_id
    },
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}