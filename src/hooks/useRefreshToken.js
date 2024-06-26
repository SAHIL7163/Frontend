import axios from '../api/posts';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async () =>
    {
        const response = await axios.get('/refresh',
        {
            withCredentials: true
        })
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            console.log(response.data.roles);
            console.log(response.data.foundUser.username);
            return {
                ...prev , 
                user : response.data.foundUser,
                roles : response.data.roles ,
                accessToken: response.data.accessToken
            }
        })
        return response.data.accessToken;
    }
  return refresh ;
}

export default useRefreshToken