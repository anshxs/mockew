import type { Metadata } from "next"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our refund policy for products and services",
}

export default function RefundPolicyPage() {
  return (
    <div className="container px-4 md:px-6 py-12 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Refund Policy</h1>
          <p className="text-muted-foreground">Last updated: May 7, 2025</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>We do not provide refunds for any of our products or services.</AlertDescription>
        </Alert>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">No Refund Policy</h2>
            <p>
              All sales are final. Once a purchase is made, we do not offer refunds under any circumstances. By making a
              purchase, you acknowledge and agree to this no-refund policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Rationale</h2>
            <p>Our no-refund policy exists for the following reasons:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our products and services are delivered immediately upon purchase</li>
              <li>We provide detailed descriptions of all products and services before purchase</li>
              <li>We invest significant resources in developing and maintaining our offerings</li>
              <li>This policy helps us maintain competitive pricing</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Before Purchase</h2>
            <p>We strongly encourage all customers to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Carefully review all product/service descriptions</li>
              <li>Contact us with any questions before making a purchase</li>
              <li>Ensure the product or service meets your specific needs</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Customer Support</h2>
            <p>
              While we do not offer refunds, we are committed to customer satisfaction. If you experience issues with
              our products or services, please contact our customer support team at anshsxa@gmail.com. We will make
              reasonable efforts to address your concerns and provide assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Exceptions</h2>
            <p>There are no exceptions to our no-refund policy. All sales are final regardless of the circumstances.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Policy Changes</h2>
            <p>
              We reserve the right to modify this refund policy at any time. Any changes to the policy will be posted on
              this page and will be effective immediately upon posting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p>If you have any questions about our refund policy, please contact us at mockewai@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
