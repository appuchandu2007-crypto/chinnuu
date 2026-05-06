export default function Footer() {
  return (
    <footer className="bg-pink-50 border-t border-pink-200 pt-12 pb-8 px-4 mt-20">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
          VV Solutions
        </h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          By using VV Solutions, you trust us with your information, and we are committed to protecting it responsibly.
        </p>
        <div className="flex justify-center gap-6 mb-8 text-slate-700 font-medium">
          <p>📞 <a href="tel:7411837814" className="hover:text-pink-600">7411837814</a></p>
          <p>📞 <a href="tel:8073801532" className="hover:text-pink-600">8073801532</a></p>
        </div>
        <div className="border-t border-pink-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} VV Solutions. All rights reserved.</p>
          <p className="text-pink-600 font-medium mt-2 md:mt-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 100% Safe and Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
