import axios from "axios";

export async function getNonce({ externalProductId, externalCustomerId }) {
  try {
    const response = await axios.post(
      "https://api.printful.com/embedded-designer/nonces",
      {
        external_product_id: externalProductId,
        external_customer_id: externalCustomerId,
      },
      {
        headers: {
          Authorization: `Bearer 6klksBmVFyLvd8miVyKYQXlI0JCiEkxS1lv8W0vr`, // Use your environment variable
          "Content-Type": "application/json",
        },
      }
    );
    console.log("first response", response);

    return response.data.result.nonce;
  } catch (error) {
    console.error("Failed to fetch nonce:", error);
    throw new Error("Could not fetch nonce");
  }
}
