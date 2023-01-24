import axios from 'axios';
import { SERVER_URL } from '../constants';


const Api = axios.create({
    baseURL: SERVER_URL,
    headers: {'Content-Type': 'application/json'},
    timeout: 2000 * 180,
  });


export default Api;
