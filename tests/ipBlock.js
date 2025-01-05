const axios = require("axios");
const https = require("https");

const targetUrl = "https://localhost:3000/login";
const testIp = "192.168.1.100"; 

const sendRequests = async () => {
  const agent = new https.Agent({  
    rejectUnauthorized: false  
  });

  for (let i = 0; i < 10; i++) {
    try {
      const response = await axios.post(
        targetUrl,
        { username: "09129009009", password: "wrongpassword" },
        {
          headers: {
            "X-Forwarded-For": testIp,
          },
          httpsAgent: agent 
        }
      );
      console.log(`Request ${i + 1}: ${response.status}`);
    } catch (error) {
      console.log(`Request ${i + 1}: Failed - ${error.message}`);
    }
  }
};

sendRequests();
