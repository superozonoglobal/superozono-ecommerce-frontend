import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function test() {
    try {
        console.log("0. Logging in as Root Admin...");
        const loginResp = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: "root@superozono.com",
            password: "SuperOzono2026!"
        });
        const token = loginResp.data.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const res1 = await axios.post(`${API_BASE_URL}/users`, {
                firstName: "Upsert",
                lastName: "Test",
                email: "upsert@test.com",
                role: "DISTRIBUTOR",
                password: "OldPassword123!"
            }, { headers });
            console.log("User created:", res1.data.data.id);
        } catch (e: any) {
            console.log("Pre-existing user or error:", e.response?.data);
        }

        console.log("2. Upserting user password via POST /users...");
        const res2 = await axios.post(`${API_BASE_URL}/users`, {
            firstName: "Upsert",
            lastName: "Test",
            role: "DISTRIBUTOR",
            email: "upsert@test.com",
            password: "NewPassword123!"
        }, { headers });
        console.log("Upsert result:", res2.status, res2.data);
    } catch (e: any) {
        console.log("Fatal Error:", e.response?.status, JSON.stringify(e.response?.data));
    }
}
test();       