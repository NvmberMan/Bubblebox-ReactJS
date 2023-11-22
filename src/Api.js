import axios from "axios";

export const apiURL = "https://12eb-158-140-191-47.ngrok-free.app"
export const CONFIG =   {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' 
    }
}; 


export const hit_login = async (email, pass) => {
    const data = await axios.post(`${apiURL}/user/login`, {
        'email' : email,
        'password' : pass
    });

    return data;
}

export const hit_register = async (username, email, pass, repass, checkbox) => {
    const data = await axios.post(`${apiURL}/user/register`, {
        'email' : email,
        'username' : username,
        'password' : pass,
        'repassword' : repass,
        'checkbox' : checkbox
    })

    return data
}


export const hit_getAllServer = async (token) => {
    const data = await axios.get(`${apiURL}/server`, {
        headers:{
            Authorization: `Bearer ${token}`,
            ...CONFIG.headers
        }
    });

    return data;
}

export const hit_createServer = async (token, name, tag_line, description,  Image = null) => {
    console.log(Image)
    const data = await axios.post(`${apiURL}/server/create`, {
        name: name,
        tag_line,
        description,
        Image
    }, 
    {
        headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}

export const hit_getServerMember = async (token, server_id) => {
    const data = await axios.post(`${apiURL}/server/member`, {
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
    const data = await axios.post(`${apiURL}/server/leave`, {
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
    const data = await axios.post(`${apiURL}/user/logout`, {}, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}


export const hit_discover = async (token) => {
    const data = await axios.get(`${apiURL}/server/discover`, 
    {
        headers:{
            Authorization: `Bearer ${token}`,
            ...CONFIG.headers
        }
    });

    return data;
}

export const hit_joinServer = async (token, server_id) => {
    const data = await axios.post(`${apiURL}/server/join`, {
        server_id
    },
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}


//MESSAGE

export const hit_sendMessage = async (token, server_id, message) => {
    const data = await axios.post(`${apiURL}/message/send`,{
        server_id,
        message
    },
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_readMessage = async (token, server_id) => {
    const data = await axios.post(`${apiURL}/message/read`,{
        server_id,
    },
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export const hit_getWebData = async (token) => {
    const data = await axios.get(`${apiURL}/message/data`, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...CONFIG.headers
        },
    });
    return data;
}


//USER MANAGEMENT

export const hit_updateUserProfil = async (token, username, phone_number, email, image = null) => {
    const data = await axios.put(`${apiURL}/user/profil`,{
        username,
        phone_number,
        email,
        Image: image
    },
    {
        headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}





