import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function testAPI() {
    try {
        console.log("Logging in as Root...");
        const loginResp = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: "root@superozono.com",
            password: "SuperOzono2026!"
        });
        
        const token = loginResp.data.data.token;
        console.log("Login successful.");

        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
            '/auth/me',
            '/users',
            '/auth/users',
            '/stores',
            '/auth/create-admin'
        ];

        for (const endpoint of endpoints) {
            console.log(`Testing GET ${endpoint}...`);
            try {
                const resp = await axios.get(`${API_BASE_URL}${endpoint}`, { headers });
                console.log(`SUCCESS ${endpoint}:`, resp.status);
            } catch (e: any) {
                console.error(`FAILED ${endpoint}:`, e.response?.status, e.response?.data?.message || e.message);
            }
        }

    } catch (e: any) {
        console.error("Fatal error during test:", e.response?.data || e.message);
    }
}

testAPI();
