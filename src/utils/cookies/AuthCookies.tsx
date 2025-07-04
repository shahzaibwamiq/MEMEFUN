// Cookie Helper Functions
export const setCookie = (name: string, value: unknown, minute = 30) => {
    const expires = new Date(Date.now() + minute * 60 * 60 * 1000).toUTCString();
    const encoded = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${name}=${encoded}; path=/; expires=${expires}; SameSite=Lax; Secure`;
};

export const getCookie = <T = unknown>(name: string): T | null => {
    const cookies = document.cookie.split("; ");
    const match = cookies.find(row => row.startsWith(name + "="));
    if (!match) return null;
    try {
        return JSON.parse(decodeURIComponent(match.split("=")[1]));
    } catch (e) {
        console.warn(`Cookie parse failed for ${name}`, e);
        return null;
    }
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};