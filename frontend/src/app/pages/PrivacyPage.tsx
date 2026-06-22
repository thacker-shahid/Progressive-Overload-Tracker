export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1
        className="text-3xl sm:text-4xl font-bold uppercase text-foreground tracking-wider mb-6"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
      >
        Privacy <span className="text-primary">Policy</span>
      </h1>

      <p className="text-muted-foreground text-sm mb-8">
        Last updated: June 21, 2026
      </p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            1. Information We Collect
          </h2>
          <p className="mb-2">We collect the following types of information:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Account information (name, email, password)</li>
            <li>Profile data (age, height, weight, gender)</li>
            <li>Workout logs (exercises, sets, reps, weights)</li>
            <li>Usage data (app interactions, device info)</li>
          </ul>
        </section>

        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>To provide and maintain the GymLog service</li>
            <li>To personalize your experience and show progress analytics</li>
            <li>To communicate with you about updates and support</li>
            <li>To improve our platform and develop new features</li>
          </ul>
        </section>

        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            3. Data Storage & Security
          </h2>
          <p>
            Your data is stored securely on our servers with encryption at rest and in transit.
            We implement industry-standard security measures to protect your personal information.
            Workout data is backed up regularly and you can export or delete your data at any time.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            4. Data Sharing
          </h2>
          <p>
            We do not sell, rent, or share your personal information with third parties for marketing purposes.
            Data may be shared only with service providers who help us operate the platform (hosting, analytics)
            under strict confidentiality agreements.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            5. Your Rights
          </h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and all associated data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
        </section>

        <section>
          <h2
            className="text-lg font-bold uppercase text-foreground tracking-wider mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            6. Contact
          </h2>
          <p>
            If you have questions about this privacy policy, please contact us at{" "}
            <a href="mailto:privacy@gymlog.com" className="text-primary hover:underline">privacy@gymlog.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
