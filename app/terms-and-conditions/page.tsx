import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using our services",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="container px-4 md:px-6 py-12 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last updated: May 7, 2025</p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p>
              Welcome to our website. By accessing and using this website, you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on our website for personal,
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>
                Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
              </li>
              <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">3. Disclaimer</h2>
            <p>
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">4. Limitations</h2>
            <p>
              In no event shall our company or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on our website, even if we or an authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on our website could include technical, typographical, or photographic errors. We
              do not warrant that any of the materials on its website are accurate, complete or current. We may make
              changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">6. Links</h2>
            <p>
              We have not reviewed all of the sites linked to its website and is not responsible for the contents of any
              such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such
              linked website is at the user's own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">7. Modifications</h2>
            <p>
              We may revise these terms of service for its website at any time without notice. By using this website you
              are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you
              irrevocably submit to the exclusive jurisdiction of the courts in Jammu and Kashmir, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
          }
