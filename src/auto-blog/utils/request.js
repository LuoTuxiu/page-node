import axios from 'axios';

const request = axios.create({
	timeout: 1000,
});

export default request;
