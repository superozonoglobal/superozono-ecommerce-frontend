import axios from 'axios';

const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

async function test() {
    try {
        console.log("1. Creating dummy user...");
        const res1 = await axios.post(`${API_BASE_URL}/users`, {
            firstName: "Upsert",
            lastName: "Test",
            email: "upsert@test.com",
            role: "DISTRIBUTOR",
            password: "OldPassword123!"
        });
        console.log("User created:", res1.data.data.id);

        console.log("2. Upserting user password via POST /users...");
        const res2 = await axios.post(`${API_BASE_URL}/users`, {
            email: "upsert@test.com",
            password: "NewPassword123!"
        });
        console.log("Upsert result:", res2.status, res2.data);
    } catch (e: any) {
        console.log("Error:", e.response?.status, JSON.stringify(e.response?.data));
    }
}
test();
