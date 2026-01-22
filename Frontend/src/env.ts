declare global {
  interface ImportMetaEnv {
    VITE_BACKEND_URL: string;
    VITE_PUBLIC_FOLDER_URL: string;
  }
}
export const backendAddress = import.meta.env.VITE_BACKEND_URL;
export const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER_URL;

console.log(import.meta.env.BASE_URL);
