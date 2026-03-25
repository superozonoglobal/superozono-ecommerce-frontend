import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';
const token = "2564aab9-1494-42b3-866c-10da2a81685f";

async function test() {
    try {
        console.log("Testing POST /auth/register-password without ANY headers...");
        const res1 = await axios.post(`${API_BASE_URL}/auth/register-password`, { token, password: "NewPassword123!" });
        console.log("Success without headers!");
    } catch (e: any) {
        console.log("Failed without headers:", e.response?.status, JSON.stringify(e.response?.data));
    }
}
test();
