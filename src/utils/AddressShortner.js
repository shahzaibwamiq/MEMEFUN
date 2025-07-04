export const shortenAddress = (bech32) => {
    // Validate input: Check if bech32 is a string and contains the separator "1"
    if (typeof bech32 !== "string" || !bech32.includes("1")) {
        return bech32; // Return as-is if it's not a valid Bech32 address
    }

    // Find the position of the separator "1"
    const i = bech32.indexOf("1");
    const prefix = bech32.slice(0, i); // Extract the prefix (e.g., "cosmos", "bc")
    const address = bech32.slice(i + 1); // Extract the address part after "1"

    // Define the number of characters to keep at the beginning and end of the address
    const headLength = 1;
    const tailLength = 3;

    // If the address part is too short, return it without shortening
    if (address.length <= headLength + tailLength) {
        return bech32;
    }

    // Create a shortened address by keeping only the first and last few characters
    const shortenedAddress = `${address.slice(0, headLength)}...${address.slice(-tailLength)}`;

    // Reconstruct the full shortened address with the prefix
    return `${prefix}1${shortenedAddress}`;
};