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
import Tooltip from "../tooltips/tooltips";
import {signCreateTokenTx, CreateTokenMsg} from "@/utils/ZigChain/CreateToken/signAndSendTokenTx";
import { UploadDataPinata } from "@/utils/pinata/UploadDataPinata";
import { usePopup } from "@/providers/PopupProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import axios from "axios";
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
      .min(10, "Description must be at least 10 characters")
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



// Define props for the modal component
interface LaunchTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}


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


export default function LaunchTokenModal({
  isOpen,
  onClose,
}: LaunchTokenModalProps) {

  const token = useSelector((state: RootState) => state.auth.token);

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
  const AuthToken: string | null = useSelector((state: RootState) => state.auth.token);

  const [twitterError, setTwitterError] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

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
  const [isAdvancedEnabled, setIsAdvancedEnabled] = useState(false);
  const [tokenBuyValue, setTokenBuyValue] = useState(0);
  const [zigInput, setZigInput] = useState<string>("");


  const handleToggle = () => {
    setIsAdvancedEnabled(prev => !prev);
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (uploadImg) {
        URL.revokeObjectURL(uploadImg);
      }
    };
  }, [uploadImg]);

  useEffect(() => {
    setZigInput("");
    setTokenBuyValue(0);
  }, [isAdvancedEnabled]);

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

      // Pass the buy amount to the batched transaction
      const buyAmount = Number(zigInput) > 0 ? Number(zigInput) : undefined;
      
      const { txHash, buyTxHash } = await signCreateTokenTx({
        msg,
        signer,
        is_seven_percent: isAdvancedEnabled,
        buyAmount: buyAmount
      });

      if(txHash){
        const response = await axios.post(
            `${ApiUrl}/token/create-token`,
            { txId: txHash },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
        );

        const result = response.data;

        if (response.status === 200 && result.success) {
          showPopup("Token created successfully!", "success");
          if(buyTxHash){
            await handleBuyTransaction(buyTxHash, result.token.token)
          }
            // If we bought tokens in the same transaction, notify the user
          if (buyAmount && buyAmount > 0) {
            showPopup(`Token created and ${buyAmount} ZIG worth of tokens purchased successfully!`, "success");
          }
          
          form.setValue("tokenImage", null);
          setUploadImg(null);
          form.reset();
          onClose();
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

  const handleCloseButton = async () => {
    form.setValue("tokenImage", null);
    setUploadImg(null);
    form.reset();
    onClose();
  }

  const handleBuyTransaction = async (txHash: string, tokenData: string) => {
    try{
      const headers = AuthToken ? { Authorization: `Bearer ${AuthToken}` } : {};
      const result = await axios.post(`${ApiUrl}/coin/buy-coin/${txHash}`,
          {
            "base": tokenData
          }, {
            headers: headers
          }
      );
      if (result.status === 201) {
        showPopup(result.data.message, 'success');
      }
    }catch(err){
      const errorMsg =
          typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "Something went wrong while creating your token.";

      showPopup(errorMsg, "error");
    }
  }


  if (!isOpen || !address) return null;

  return (
    <div
      className={`${isOpen ? "isopen" : ""
        } position-fixed launch_token_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50`}
      style={{ zIndex: 1050 }}
    >
      {isLoading && <Loader name={'Creating Token...'}  fixed={true} />}
      {/* Modal Container */}
      <div className="modal-dialog">

        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <Image
              className="modal_logo dark_logo"
              alt=""
              src="/assets/img/logo.png"
              width={395}
              height={154}
            />
            <Image
              className="modal_logo light_logo"
              alt=""
              src="/assets/img/light_logo.png"
              width={395}
              height={154}
            />
            {/* Close Button */}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseButton}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
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
                    <Tooltip text="Choose a name that'll make your audience hit 'follow' faster than a power-up. Alphabet Only!" position="top">
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
                  <Tooltip text="Describe your token, its mission, and why it's worth the investment." position="top">
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
                              ? "Your Twitter Handle"
                              : selectedSocialMedia === "telegram"
                                  ? "Your Telegram Channel"
                                  : "Yourdomain.com"
                        }
                        className="flex-grow-1"
                        value={
                          socialMedias[selectedSocialMedia]
                              .replace(
                                  selectedSocialMedia === "twitter"
                                      ? "https://x.com/"
                                      : selectedSocialMedia === "telegram"
                                          ? "https://t.me/"
                                          : "https://",
                                  ""
                              )
                        }
                        onChange={(e) => {
                          const handle = e.target.value.replace(/\s/g, "");
                          setSocialMediaLinks((prev) => ({
                            ...prev,
                            [selectedSocialMedia]:
                                (selectedSocialMedia === "twitter"
                                    ? "https://x.com/"
                                    : selectedSocialMedia === "telegram"
                                        ? "https://t.me/"
                                        : "https://") + handle,
                          }));

                          // Clear errors
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
                      <span>Advanced Settings</span>
                      <div className="cont">
                        <div className="adva_check">
                          {/* Toggle Switch for Advanced Settings */}
                          <label className="switch" htmlFor="checkbox1">
                            <input
                                type="checkbox"
                                id="checkbox1"
                                checked={isAdvancedEnabled}
                                onChange={handleToggle}
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                        {/* Limit Single Buyer Section */}
                        <div className="cont_right">
                          <strong>7% Single Buyer Limit: </strong>
                          <span>No single wallet can take over the game! Each wallet is limited to buying a maximum of 7% of the total token supply to keep things fair and balanced.</span>
                        </div>
                      </div>
                      <div className="buyyInput">
                        <Tooltip text="Pick a short, snappy symbol that players will remember. Alphabet Only!" position="top">
                          <input
                              type="text"
                              placeholder="Enter amount to purchase token (Optional)"
                              inputMode="decimal"
                              pattern="[0-9.]*"
                              value={zigInput}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const cleaned = raw.replace(/[^0-9.]/g, "");
                                const parts = cleaned.split(".");

                                const PRICE_PER_TOKEN = parseFloat(process.env.NEXT_PUBLIC_PRICE_PER_TOKEN || "0");
                                const max_token_limit_half = Number(process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY) * 0.5;
                                const MAX_TOKEN_LIMIT = isAdvancedEnabled ? process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY_7_PERCENT : max_token_limit_half;
                                const MAX_ZIG_INPUT = Number(MAX_TOKEN_LIMIT) * Number(PRICE_PER_TOKEN);
                                const DECIMALS = isAdvancedEnabled ? 3 : 6;

                                if (parts.length > 2) return;

                                if (parts.length === 2 && parts[1].length > DECIMALS) {
                                  showPopup(`Max ${DECIMALS} decimal places allowed`, "error");
                                  return;
                                }

                                setZigInput(cleaned);

                                if (cleaned === "" || cleaned === "." || cleaned === "0.") return;

                                let zig = parseFloat(cleaned);
                                if (isNaN(zig)) return;

                                if (zig < 1) {
                                  showPopup("Amount must be at least 1 ZIG", "error");
                                  zig = 1;
                                  setZigInput("1");
                                }

                                if (zig > MAX_ZIG_INPUT) {
                                  showPopup(`Only ${MAX_ZIG_INPUT.toFixed(DECIMALS)} ZIG allowed`, "error");
                                  zig = MAX_ZIG_INPUT;
                                  setZigInput(zig.toFixed(DECIMALS));
                                }

                                setTokenBuyValue(zig / PRICE_PER_TOKEN);
                              }}
                          />

                          <p>
                            You&apos;ll receive:{" "}
                            {tokenBuyValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} tokens
                          </p>


                        </Tooltip>
                      </div>
                      {/*/!* Deployment Service Fee *!/*/}
                      <div className="dep_fee">
                        <p><span>One-time deployment fee of 111 ZIG is required to create your token.</span> This helps cover platform services and ensures a smooth and secure token launch.</p>
                      </div>

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
                      {address ? (isLoading ? (
                        <>
                          Creating...
                        </>
                      ) : (
                        "Create Token"
                      )) : "Connect Wallet"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

