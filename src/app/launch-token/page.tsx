"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChain } from "@cosmos-kit/react";
import Tooltip from "@/components/ui/tooltips/tooltips";
import {signCreateTokenTx, CreateTokenMsg} from "@/utils/ZigChain/CreateToken/signAndSendTokenTx";
import { UploadDataPinata } from "@/utils/pinata/UploadDataPinata";
import { usePopup } from "@/providers/PopupProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/common/Loader";



const formSchema = z.object({
  signer: z.string().min(1, "Signer address is required"),

  name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(9, "Name must be at most 9 characters")
      .regex(/^[a-z]+$/, "Name must contain only lowercase letters"),

  symbol: z
      .string()
      .min(3, "Symbol must be at least 3 characters")
      .max(9, "Symbol must be at most 9 characters")
      .regex(/^[a-z]+$/, "Symbol must contain only lowercase letters"),

  description: z
      .string()
      .min(3, "Description must be at least 03 characters")
      .max(500, "Description cannot exceed 500 characters"),

  tokenImage: z
      .union([z.instanceof(File), z.null()])
      .refine((file) => file instanceof File && file.size > 0, {
        message: "Please upload an image (PNG, JPEG, or GIF) before proceeding",
      }),
  agreeToTerms: z
      .boolean()
      .refine(val => val === true, {
        message: "You must agree to the Terms of Use.",
      }),
});




const normalizeAndValidateSocialLinks = (links: { twitter: string; telegram: string; websiteUrl: string; }) => {
  const result = { twitter: "", telegram: "", website: "" };
  if (links.twitter.trim()) {
    let twitter = links.twitter.trim();
    if (!/^https?:\/\//i.test(twitter)) twitter = `https://${twitter}`;
    if (!/^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+$/i.test(twitter)) {
      throw new Error("Invalid Twitter (x.com) link. Use format: https://x.com/yourhandle");
    }
    result.twitter = twitter;
  }
  if (links.telegram.trim()) {
    let telegram = links.telegram.trim();
    if (!/^https?:\/\//i.test(telegram)) telegram = `https://${telegram}`;
    if (!/^https:\/\/t\.me\/[A-Za-z0-9_]+$/i.test(telegram)) {
      throw new Error("Invalid Telegram link. Use format: https://t.me/yourchannel");
    }
    result.telegram = telegram;
  }
  if (links.websiteUrl.trim()) {
    let website = links.websiteUrl.trim();
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
    try {
      new URL(website);
    } catch {
      throw new Error("Invalid Website URL.");
    }
    result.website = website;
  }
  return result;
};


export default function LaunchTokenModalPage() {

  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  const { address, getOfflineSigner } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const [socialMedias, setSocialMediaLinks] = useState({
    twitter: '',
    telegram: '',
    websiteUrl: '',
  });
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<keyof typeof socialMedias>('twitter');
  const { showPopup } = usePopup();
  const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const [twitterError, setTwitterError] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [shouldReset, setShouldReset] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signer: address ?? "",
      name: "",
      symbol: "",
      description: "",
      tokenImage: null,
      agreeToTerms: false,

    },
  });

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (uploadImg) {
        URL.revokeObjectURL(uploadImg);
      }
    };
  }, [uploadImg]);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const signer = await getOfflineSigner();

      setTwitterError("");
      setTelegramError("");
      setWebsiteError("");

      let formattedLinks;
      try {
        formattedLinks = normalizeAndValidateSocialLinks(socialMedias);
      } catch (err) {
        const msg = (err as Error).message;
        if (msg.includes("Twitter")) setTwitterError(msg);
        else if (msg.includes("Telegram")) setTelegramError(msg);
        else if (msg.includes("Website")) setWebsiteError(msg);
        showPopup(msg, "error");
        setIsLoading(false);
        return;
      }

      const { metadataUrl } = await UploadDataPinata({
        name: values.symbol.toLowerCase(),
        desciption: values.description,
        tokenImage: values.tokenImage as File,
        socialMedias: formattedLinks,
      });

      const msg: CreateTokenMsg = {
        create_denom: {
          name: values.name.toLowerCase(),
          symbol: values.symbol.toLowerCase(),
          uri: metadataUrl,
        }
      };
      const { txHash } = await signCreateTokenTx({
        msg,
        signer,
        is_seven_percent: false
      });

      if(txHash){

        const response = await fetch(`${ApiUrl}/token/create-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ txId: txHash })
        });
        const result = await response.json();

        if (response.status === 200 && result.success) {
          showPopup("Token created successfully!", "success");
          form.setValue("tokenImage", null);
          setUploadImg(null);
          form.reset();

        } else {
          showPopup(result.message || "Something went wrong while creating your token.", "error");
        }
      }

    } catch (err) {
      const errorMsg =
          typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "Something went wrong while creating your token.";

      showPopup(errorMsg, "error");
    }finally {
      setIsLoading(false);
    }
  };

  // Handle file selection for image upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      // Allow only specific image formats
      const allowedExtensions = ["image/png", "image/jpeg", "image/gif"];
      if (!allowedExtensions.includes(file.type)) {
        alert("Invalid file type! Please upload a PNG, JPEG, or GIF.");
        return;
      }

      form.setValue("tokenImage", file);

      // Create an object URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setUploadImg(imageUrl);
    }
  };
useEffect(() => {
  if (shouldReset) {
    form.reset();
    setUploadImg(null);
    setShouldReset(false);
  }
}, [shouldReset, form]);

  return (
      <>

        {isLoading && <Loader name={'Creating Token...'} fixed={true} />}
        <div
          className={`launch_token_modal launch_page_container`}
        >

          {/* Modal Container */}
          <div className="">
            <div className="">
              {/* Modal Header */}
              <div className="modal-header">

              </div>

              {/* Modal Body */}
              <div className="modal-body container">
              {/* <Image
                  className="modal_logo"
                  alt=""
                  src="/assets/img/logo.png"
                  width={395}
                  height={154}
                /> */}
                <h5 className="modal-title">Launch Token</h5>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Upload Image Section */}
                  <div className="upload_img">
                    <div className="label">
                      <input type="hidden" value={address} />
                      <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} name="tokenImage" />
                      <Image
                        alt="Uploaded Image"
                        src={uploadImg ?? "/assets/img/upload.png"}
                        width={142}
                        height={142}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/img/upload.png";
                        }}
                      />
                    </div>
                    <span>Time to power up your token! Upload your image (PNG, JPEG, GIF) <br/> and give your coin a custom look that&apos;ll stand out in the marketplace.</span>
                  </div>
                  {form.formState.errors.tokenImage && <p className="text-danger">{form.formState.errors.tokenImage.message}</p>}

                  {/* Input Fields Section */}
                  <div className="fields_div">
                    <div className="row">
                      {/* Token Name Input */}
                      <div className="col-md-6 col-sm-12">
                        <Tooltip text="Choose a name that&apos;ll make your audience hit &apos;follow&apos; faster than a power-up. Alphabet Only!" position="top">
                          <input
                              type="text"
                              placeholder="Token Name"
                              {...form.register("name", {
                                onChange: (e) => {
                                  e.target.value = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                                }
                              })}
                          />
                          {form.formState.errors.name && <p className="text-danger">{form.formState.errors.name.message}</p>}
                        </Tooltip>
                      </div>
                      {/* Token Symbol Input */}
                      <div className="col-md-6 col-sm-12">
                      <Tooltip text="Pick a short, snappy symbol that players will remember. Alphabet Only!" position="top">
                        <input
                            type="text"
                            placeholder="Token Symbol"
                            {...form.register("symbol", {
                              onChange: (e) => {
                                e.target.value = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                              }
                            })}
                        />
                        {form.formState.errors.symbol && <p className="text-danger">{form.formState.errors.symbol.message}</p>}
                      </Tooltip>
                      </div>
                      {/* Token Description Input */}
                      <div className="col-12">
                      <Tooltip text="Describe your token, its mission, and why it&apos;s worth the investment." position="top">
                        <textarea
                          placeholder="Type Description"
                          className="w-full"
                          {...form.register("description")}
                        ></textarea>
                        {form.formState.errors.description && <p className="text-danger">{form.formState.errors.description.message}</p>}
                      </Tooltip>
                      </div>

                      {/* Social Media Links */}
                      <span>Drop your socials (Twitter, Telegram, Website) and keep your followers in the loop!</span>
                      <div className="flex justify-between mt-4 social_icons">
                        <button type="button" className="twit" onClick={() => setSelectedSocialMedia('twitter')}>
                          <FontAwesomeIcon icon={faXTwitter} /> Twitter
                        </button>
                        <button type="button" className="tele" onClick={() => setSelectedSocialMedia('telegram')}>
                          <FontAwesomeIcon icon={faTelegram} /> Telegram
                        </button>
                        <button type="button" className="glob" onClick={() => setSelectedSocialMedia('websiteUrl')}>
                          <FontAwesomeIcon icon={faGlobe} /> Website
                        </button>
                      </div>

                      {/* Token Launch Methodology */}
                      <div className="col-12 token_meth">
                        <input
                          type="text"
                          placeholder={
                            selectedSocialMedia === "twitter"
                                ? "Enter your Twitter link"
                                : selectedSocialMedia === "telegram"
                                    ? "Enter your Telegram link"
                                    : "Enter your Website URL"
                          }
                          className="type_link"
                          value={socialMedias[selectedSocialMedia]}
                          onChange={(e) =>{
                            setSocialMediaLinks((prev) => ({
                              ...prev,
                              [selectedSocialMedia]: e.target.value,
                            }))
                            if (selectedSocialMedia === "twitter") setTwitterError("");
                            if (selectedSocialMedia === "telegram") setTelegramError("");
                            if (selectedSocialMedia === "websiteUrl") setWebsiteError("");
                          }}
                        />
                        {selectedSocialMedia === "twitter" && twitterError && <p className="text-danger">{twitterError}</p>}
                        {selectedSocialMedia === "telegram" && telegramError && <p className="text-danger">{telegramError}</p>}
                        {selectedSocialMedia === "websiteUrl" && websiteError && <p className="text-danger">{websiteError}</p>}
                        <h3 className="">Token Launch Methodology</h3>
                        <h6>Classic Curve :</h6>
                        <p className="">
                        We&apos;re using the Classic Bonding Curve model for a smooth token sale. It&apos;s like a cheat code for fair pricing, with steady growth and controlled market dynamics.
                        </p>

                        {/* Token Sale Settings Dropdown */}
                       {/* <div className="mt-4">*/}
                       {/*   <label className="block text-sm">Token Sale Settings</label>*/}
                       {/*   <h6> Initial Buy:</h6>*/}
                       {/*<p> Set the starting price and limit – you're the game master here!</p>*/}
                       {/*   <select className="w-full p-2 bg-gray-800 rounded text-white mt-1">*/}
                       {/*     <option>Initial Buy</option>*/}
                       {/*     <option>Presale</option>*/}
                       {/*   </select>*/}
                       {/* </div>*/}

                        {/* Advanced Settings Section */}
                        <div className="advan_set">
                          {/*<span>Advanced Settings</span>*/}
                          {/*<div className="cont">*/}
                          {/*  <div className="adva_check">*/}
                          {/*    /!* Toggle Switch for Advanced Settings *!/*/}
                          {/*    <label className="switch" htmlFor="checkbox1">*/}
                          {/*      <input type="checkbox" id="checkbox1" />*/}
                          {/*      <div className="slider round"></div>*/}
                          {/*    </label>*/}
                          {/*  </div>*/}
                          {/*  /!* Limit Single Buyer Section *!/*/}
                          {/*  <div className="cont_right">*/}
                          {/*    <strong>7% Single Buyer Limit: </strong>*/}
                          {/*    <span>No single player can dominate the game! Limit each buyer to 7% of the total supply to keep things balanced.</span>*/}
                          {/*  </div>*/}
                          {/*</div>*/}

                          {/*/!* Deployment Service Fee *!/*/}
                          {/*<div className="dep_fee">*/}
                          {/*  <p>Deploy service fee <span>There's a small fee of 450 ZIG to deploy your token. It's like paying for extra lives – ensuring a secure launch.</span></p>*/}
                          {/*</div>*/}

                          {/* Terms & Conditions Agreement */}
                          <div className="term_agre mb-3">
                            <input
                                type="checkbox"
                                id="checkbox"
                                {...form.register("agreeToTerms")}
                            />
                            <span>By launching your token, you agree to memes.fun&apos;s <a href="#">Terms of Use</a>. It&apos;s your ticket to playing fair and square.</span>
                          </div>
                          {form.formState.errors.agreeToTerms && (
                              <p className="text-danger">{form.formState.errors.agreeToTerms.message}</p>
                          )}
                        </div>

                        {/* Connect Wallet Button */}
                        <button type="submit" className="w-full submit_btn" disabled={isLoading}>
                          {address ?
                              (isLoading ? (
                              <>
                                Creating...
                              </>
                            ) : (
                              "Create Token"
                            )
                          ) : "Connect Wallet"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
        );
};

