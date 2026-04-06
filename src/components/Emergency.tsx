export default function Emergency() {
  return (
    <section id="emergency" className="py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#ffe6e6] p-8 md:p-10 rounded-2xl text-center shadow-[0_0_20px_rgba(255,0,0,0.15)] border border-red-200">
        <h2 className="text-3xl font-bold text-red-600 mb-4">🚨 Need Immediate Help?</h2>
        <p className="text-gray-800 text-lg mb-6">
          If you are feeling overwhelmed or in serious emotional distress, 
          please don't stay alone. Reach out to professional support immediately.
        </p>

        <div className="bg-white/50 rounded-xl p-6 mb-8 space-y-3">
          <p className="text-lg text-gray-800">📞 Kiran Mental Health Helpline: <a href="tel:18005990019" className="font-bold text-red-600 hover:underline">1800-599-0019</a></p>
          <p className="text-lg text-gray-800">📞 AASRA Support: <a href="tel:9820466726" className="font-bold text-red-600 hover:underline">9820466726</a></p>
        </div>

        <a 
          href="https://wa.me/917411837814" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-[#ff4d4d] hover:bg-[#cc0000] text-white font-bold text-lg rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          💬 Talk to VV Solutions Now
        </a>
      </div>
    </section>
  );
}
