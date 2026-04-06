export default function HelpButton() {
  return (
    <a 
      href="#emergency" 
      className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] flex items-center justify-center transition-transform hover:scale-110 z-50 font-bold gap-2 border-2 border-red-400"
    >
      <span className="text-xl">🚨</span>
      <span>Help</span>
    </a>
  );
}
