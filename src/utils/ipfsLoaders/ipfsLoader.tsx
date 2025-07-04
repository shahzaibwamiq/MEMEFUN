export const ipfsLoader = ({ src }: { src: string; width?: number; quality?: number }) => {
    // Simply return the original src without adding w= or q= params
    return src;
};