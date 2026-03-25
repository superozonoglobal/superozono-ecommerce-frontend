import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function test() {
    try {
        console.log("Testing GET /foo-bar...");
        await axios.get(`${API_BASE_URL}/foo-bar`);
        console.log("Success foo-bar");
    } catch (e: any) {
        console.log(`Failed foo-bar: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
    }

    try {
        console.log("Testing POST /auth/register-password again...");
        await axios.post(`${API_BASE_URL}/auth/register-password`, {});
        console.log("Success register-password");
    } catch (e: any) {
        console.log(`Failed register-password: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
    }
}
test();
