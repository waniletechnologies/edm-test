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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";

const EDMComponent = () => {
  const productId = "531"; // Example Product ID
  const customerId = "TestCustomer123"; // Example Customer ID

  const imageList = [
    "https://pngimg.com/uploads/dog/dog_PNG50318.png",
    "https://pngimg.com/uploads/dog/dog_PNG50302.png",
    "https://pngimg.com/uploads/dog/dog_PNG50264.png",
  ];

  const [isEdmLoaded, setIsEdmLoaded] = useState(false);

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

          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                console.log("EDM Loaded");
                setIsEdmLoaded(true);
                observer.disconnect();
                break;
              }
            }
          });

          observer.observe(document.getElementById('edm-container'), { childList: true });
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
        {isEdmLoaded && (
          <>
            {/* laptop view */}
            <Sheet side="left" className="">
              <SheetTrigger side="left" className="hidden lg:block absolute top-[0] lg:top-[24.5rem] w-[3.7rem] lg:left-[8px] left-[calc(50%-2rem)] hover:bg-zinc-100 py-1.5 lg:py-4 rounded-lg text-xs opacity-80">
                <div className="lg:flex-col flex items-center ">
                  <Image size="24" className="lg:w-10 w-4  lg:mb-1 text-center mx-auto" />
                  Images
                </div>
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    Select an Image
                  </SheetTitle>
                  <SheetDescription>
                    <div className="flex gap-4">
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 bg-white p-2 rounded shadow cursor-pointer hover:shadow-lg"
                          onClick={() => addImageToDesign(image)}
                        >
                          <DrawerClose>
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Drawer className="">
              <DrawerTrigger className="lg:hidden absolute top-[0] lg:top-[24.5rem] w-[3.7rem] lg:left-[8px] left-[calc(50%-2rem)] hover:bg-zinc-100 py-1.5 lg:py-4 rounded-lg text-xs opacity-80">
                <div className="lg:flex-col flex items-center ">
                  <Image size="24" className="lg:w-10 w-4  lg:mb-1 text-center mx-auto" />
                  Images
                </div>
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
                          <DrawerClose>
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </>
        )}

      </div>
    </div >
  );
};

export default EDMComponent;

