"use client";

import { useEffect } from "react";
import axios from "axios";

const EDMComponent = () => {
  const productId = "679"; // Example Product ID
  const customerId = "TestCustomer123"; // Example Customer ID

  useEffect(() => {
    const initializeEDM = async () => {
      try {
        // Fetch nonce from Next.js API route
        const response = await axios.post("/api/getNonce", {
          externalProductId: productId,
          externalCustomerId: customerId,
        });

        const nonce = response.data.nonce;
        console.log("nonce:", nonce);

        // Dynamically load Printful's embed script
        const script = document.createElement("script");
        script.src = "https://files.cdn.printful.com/embed/embed.js";
        script.onload = () => {
          // Initialize Printful EDM
          new PFDesignMaker({
            elemId: "edm-container",
            nonce: nonce,
            externalProductId: productId,
            initProduct: {
              productId: 649, // Example Printful product ID
            },
            style: {
              variables: {
                "--pf-sys-background": "#ffffff", // Optional: Customize EDM background
              },
            },
            onTemplateSaved: (templateId) => {
              console.log("Template saved with ID:", templateId);
            },
            onError: (error) => {
              console.error("EDM Error:", error);
            },
          });
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Failed to initialize EDM:", error);
      }
    };

    initializeEDM();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div id="edm-container" className="h-full w-full overflow-hidden"></div>
    </div>
  );
};

export default EDMComponent;
