"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import { Image } from "lucide-react";
import { useEffect } from "react";

const EDMComponent = () => {
  const productId = "531"; // Example Product ID
  const customerId = "TestCustomer123"; // Example Customer ID

  const imageList = [
    "https://pngimg.com/uploads/dog/dog_PNG50318.png",
    "https://pngimg.com/uploads/dog/dog_PNG50302.png",
    "https://pngimg.com/uploads/dog/dog_PNG50264.png",
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
              productId: 531, // Example Printful product ID
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
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}

      {/* EDM Container */}
      <div
        id="edm-container"
        className="flex-grow relative bg-white shadow-lg overflow-hidden"
      >
        <Drawer>
          <DrawerTrigger className="absolute top-[0]  lg:top-[25rem] w-[3.7rem] left-[.5rem] hover:bg-zinc-100 py-1 lg:py-4 rounded-lg text-xs opacity-80">
            <Image size="24" className="lg:w-10 w-4  lg:mb-1 text-center mx-auto" />
            Images
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                Select an Image
              </DrawerTitle>
              <DrawerDescription>
                <div className="flex gap-4">
                  {imageList.map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 bg-white p-2 rounded shadow cursor-pointer hover:shadow-lg"
                      onClick={() => addImageToDesign(image)}
                    >
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </DrawerDescription>
            </DrawerHeader>
            {/* <DrawerFooter className={"grid grid-cols-6"}>
              <Button>Select</Button>
              <DrawerClose>
                <Button className="w-full" variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </div>
    </div >
  );
};

export default EDMComponent;

