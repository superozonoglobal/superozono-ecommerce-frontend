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
        console.log("Login successful. Token acquired.");

        const headers = { Authorization: `Bearer ${token}` };

        console.log("Testing GET /auth/users...");
        try {
            const usersResp = await axios.get(`${API_BASE_URL}/auth/users`, { headers });
            console.log("GET /auth/users SUCCESS:", usersResp.data);
        } catch (e: any) {
            console.error("GET /auth/users FAILED:", e.response?.data || e.message);
        }

        console.log("Testing POST /auth/create-admin (as Admin)...");
        try {
            const createResp = await axios.post(`${API_BASE_URL}/auth/create-admin`, {
                firstName: "TEST",
                lastName: "QA",
                email: `test_qa_${Date.now()}@test.com`,
                password: "Password123!",
                role: "ADMIN"
            }, { headers });
            console.log("POST /auth/create-admin SUCCESS:", createResp.data);
        } catch (e: any) {
            console.error("POST /auth/create-admin FAILED:", e.response?.data || e.message);
        }

    } catch (e: any) {
        console.error("Fatal error during test:", e.response?.data || e.message);
    }
}

testAPI();
