import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function test() {
    const endpoints = [
        '/auth/register',
        '/auth/set-password',
        '/auth/reset-password',
        '/auth/forgot-password',
        '/users/password',
        '/auth/password'
    ];
    for (const ep of endpoints) {
        try {
            console.log(`Testing POST ${ep}...`);
            await axios.post(`${API_BASE_URL}${ep}`, { token: "123", email: "test@test.com", password: "123" });
            console.log(`Success ${ep}`);
        } catch (e: any) {
            console.log(`Failed ${ep}: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }
    }
}
test();
