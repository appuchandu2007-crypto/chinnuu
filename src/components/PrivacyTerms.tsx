export default function PrivacyTerms() {
  return (
    <section id="privacy-terms" className="py-16 px-4 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-8 text-center">Privacy Policy & Terms</h2>
      
      <div className="bg-slate-900/60 p-8 rounded-3xl border border-pink-500/20 mb-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Privacy Policy</h3>
        <p className="mb-4 leading-relaxed">
          We collect basic information like name, age, contact number, and messages only to provide better emotional support.
          Your data is kept secure and confidential. We do not sell or share your data with third parties.
        </p>
      </div>

      <div className="bg-slate-900/60 p-8 rounded-3xl border border-pink-500/20">
        <h3 className="text-2xl font-semibold text-white mb-4">Terms & Conditions</h3>
        <p className="mb-4 leading-relaxed">
          This platform is for emotional support only and not a replacement for professional help.
          Users must behave respectfully. Any abuse, harassment, or inappropriate behavior is strictly prohibited.
          Strict action will be taken if rules are violated.
        </p>
        <p className="leading-relaxed">
          In case of serious emotional distress, users are encouraged to contact professional helplines immediately.
        </p>
      </div>
    </section>
  );
}
