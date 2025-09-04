// src/components/Logo.jsx
export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM13.8696 19.3822L19.3242 22.0645L22.0065 16.6099L16.5519 13.9276L13.8696 19.3822ZM12.0621 11.4581L9.3798 16.9127L14.8344 19.595L17.5167 14.1404L12.0621 11.4581Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-bold text-2xl text-gray-800 dark:text-gray-100">
        FestSync
      </span>
    </div>
  );
}
