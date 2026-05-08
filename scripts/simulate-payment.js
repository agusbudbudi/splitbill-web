async function simulatePayment() {
  const payload = {
    amount: 10000,
    order_id: "SB-260506-9E7331",
    project: "split-bill",
    status: "completed",
    payment_method: "QRIS",
    completed_at: new Date().toISOString()
  };

  try {
    const response = await fetch("http://localhost:8888/api/pakasir-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("Raw Response:", text);
    
    try {
      const data = JSON.parse(text);
      console.log("JSON Response:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("Response is not JSON");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

simulatePayment();
