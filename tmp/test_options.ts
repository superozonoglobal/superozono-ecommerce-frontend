import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function test() {
    try {
        console.log("Testing OPTIONS /auth/register-password...");
        const res = await axios.options(`${API_BASE_URL}/auth/register-password`);
        console.log("Allowed methods:", res.headers['allow']);
    } catch (e: any) {
        console.log("Failed OPTIONS:", e.response?.status, e.response?.data);
    }
}
test();
