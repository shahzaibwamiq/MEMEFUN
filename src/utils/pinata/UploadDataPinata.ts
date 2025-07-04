import { Pinata } from '@/utils/pinata/pinata';

interface SocialMedia {
    website?: string;
    telegram?: string;
    twitter?: string;
}

interface IPinata {
    name: string;
    desciption: string;
    tokenImage: Blob;
    socialMedias?: SocialMedia;
}

/**
 * Uploads image and metadata to Pinata and returns the metadata URL.
 */
export const UploadDataPinata = async ({
   name,
   desciption,
   tokenImage,
   socialMedias
}: IPinata): Promise<{
    imageUrl: string;
    metadataUrl: string;
}> => {
    // Step 1: Upload image to Pinata
    const tokenImageFile = new File([tokenImage], `${name}`);
    const tokenImagePinata = await Pinata.upload.public.file(tokenImageFile);
    const tokenImageUrl = await Pinata.gateways.public.convert(tokenImagePinata.cid);

    // Step 2: Create and upload metadata with description included
    const metadataContent = JSON.stringify({
        name,
        description: desciption,  // include description here
        icon: tokenImageUrl,
        ...socialMedias
    });

    const metaDataFile = new File([metadataContent], `${name}.json`, { type: "application/json" });
    const tokenMetaDataPinata = await Pinata.upload.public.file(metaDataFile);
    const tokenMetaDataUrl = await Pinata.gateways.public.convert(tokenMetaDataPinata.cid);

    return {
        imageUrl: tokenImageUrl,
        metadataUrl: tokenMetaDataUrl
    };
};
