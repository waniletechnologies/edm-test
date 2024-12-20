"use client";

import { useEffect } from "react";
import axios from "axios";

const EDMComponent = () => {
  const productId = "679"; // Example Product ID
  const customerId = "TestCustomer123"; // Example Customer ID

  const imageList = [
    {
      url: "https://pngimg.com/uploads/dog/dog_PNG50318.png",
      name: "Design 1",
    },
    {
      url: "https://pngimg.com/uploads/dog/dog_PNG50302.png",
      name: "Design 2",
    },
    {
      url: "https://pngimg.com/uploads/dog/dog_PNG50264.png",
      name: "Design 3",
    },
  ];

  useEffect(() => {
    const initializeEDM = async () => {
      try {
        const response = await axios.post("/api/getNonce", {
          externalProductId: productId,
          externalCustomerId: customerId,
        });

        const nonce = response.data.nonce;

        const script = document.createElement("script");
        script.src = "https://files.cdn.printful.com/embed/embed.js";
        script.onload = () => {
          window.designMaker = new PFDesignMaker({
            elemId: "edm-container",
            nonce: nonce,
            externalProductId: productId,
            initProduct: {
              productId: 649, // Example Printful product ID
            },
            style: {
              variables: {
                "--pf-sys-background": "#ffffff",
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

  const addImageToDesign = (imageUrl) => {
    if (window.designMaker) {
      window.designMaker.sendMessage({
        event: "setUrlImageLayer",
        imageUrl: imageUrl,
      });
    } else {
      console.error("EDM instance is not initialized");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-gray-800 text-white text-center font-bold text-lg">
        Design Your Product
      </div>

      {/* Image Selector */}
      <div className="p-4 bg-gray-200 flex gap-4 overflow-auto">
        {imageList.map((image, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 bg-white p-2 rounded shadow cursor-pointer hover:shadow-lg"
            onClick={() => addImageToDesign(image.url)}
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="text-sm font-medium text-gray-700">
              {image.name}
            </div>
          </div>
        ))}
      </div>

      {/* EDM Container */}
      <div
        id="edm-container"
        className="flex-grow w-full bg-white shadow-lg overflow-hidden"
      ></div>
    </div>
  );
};

export default EDMComponent;
