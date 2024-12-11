import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    // Parse the JSON body from the request
    const { externalProductId, externalCustomerId } = await request.json();

    // Make the server-side request to Printful API
    const response = await axios.post(
      "https://api.printful.com/embedded-designer/nonces",
      {
        external_product_id: externalProductId,
        external_customer_id: externalCustomerId,
      },
      {
        headers: {
          Authorization: `Bearer oRY1n73GEcbTcXSmd33vozaObhoGSzv55hRB4eIA`, // Secure API Key
          "Content-Type": "application/json",
        },
      }
    );
    // Extract nonce from the response
    const nonce = response.data.result.nonce.nonce;

    // Return the nonce back to the client
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error("Error fetching nonce:", error);
    return NextResponse.json(
      { error: "Failed to fetch nonce" },
      { status: 500 }
    );
  }
}
