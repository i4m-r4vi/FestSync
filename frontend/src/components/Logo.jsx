export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <img src="/logo.png" alt="" height={70} width={70}/>
      <span className="font-bold text-2xl text-gray-800 dark:text-gray-100">
        FestSync AI
      </span>
    </div>
  );
}
