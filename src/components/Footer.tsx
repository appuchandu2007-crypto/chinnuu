export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-pink-900/50 pt-12 pb-8 px-4 mt-20">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
          VV Solutions
        </h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          By using VV Solutions, you trust us with your information, and we are committed to protecting it responsibly.
        </p>
        <div className="flex justify-center gap-6 mb-8 text-gray-300">
          <p>📞 <a href="tel:7411837814" className="hover:text-pink-400">7411837814</a></p>
          <p>📞 <a href="tel:8073801532" className="hover:text-pink-400">8073801532</a></p>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VV Solutions. All rights reserved.</p>
          <p className="text-pink-500/80 font-medium mt-2 md:mt-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 100% Safe and Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
