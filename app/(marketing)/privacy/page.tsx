import { pageMeta } from "@/lib/seo";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Viewnear collects, uses, and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Legal"
            title={
              <>
                Privacy <span className="text-gradient">Policy</span>
              </>
            }
            description="How we collect, use, and protect your personal information."
          />
        </div>
      </div>

      <Section>
        <div className="prose-vn max-w-3xl">
          <p className="text-muted">Last updated: 6 June 2026</p>

          <p>
          {theme.brand.name} (&ldquo;{theme.brand.name}&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy. This policy
          explains what personal information we collect when you use our website and
          services, how we use it, and the choices you have. By using our website you
          agree to the practices described here.
        </p>

        <h2>Information we collect</h2>
        <p>We collect information in the following ways:</p>
        <ul>
          <li>
            <strong>Information you give us.</strong> When you contact us, request a
            consultation, subscribe to updates, apply for a role, or fill in a form, we
            collect details such as your name, email address, company, and the contents
            of your message.
          </li>
          <li>
            <strong>Information collected automatically.</strong> When you visit our
            site we may automatically collect technical data such as your IP address,
            browser type, device information, pages viewed, and referring URLs.
          </li>
          <li>
            <strong>Information from third parties.</strong> We may receive limited
            information from analytics providers and professional networks where you
            have engaged with us.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your enquiries and provide the services you request;</li>
          <li>Operate, maintain, and improve our website and services;</li>
          <li>Send you updates, content, or marketing where you have opted in;</li>
          <li>Evaluate job applications;</li>
          <li>Comply with legal obligations and protect against misuse.</li>
        </ul>

        <h2>Legal basis for processing</h2>
        <p>
          Where applicable law requires it, we process personal data on the basis of
          your consent, the performance of a contract, our legitimate business
          interests, or compliance with a legal obligation.
        </p>

        <h2>Cookies and similar technologies</h2>
        <p>
          Our website uses cookies and similar technologies to make the site work, to
          remember your preferences, and to understand how the site is used. Essential
          cookies are required for the site to function; analytics cookies help us
          improve it. You can control or disable cookies through your browser settings,
          though some features may not work as intended if you do.
        </p>

        <h2>Sharing your information</h2>
        <p>
          We do not sell your personal information. We may share it with trusted service
          providers who help us operate our website and deliver our services (for
          example hosting and analytics providers), all of whom are bound to protect it.
          We may also disclose information where required by law or to protect our
          rights.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep personal information only for as long as necessary to fulfill the
          purposes described in this policy, or as required to meet legal, accounting,
          or reporting obligations.
        </p>

        <h2>International transfers</h2>
        <p>
          {theme.brand.name} serves clients across {theme.brand.region}. Your
          information may be processed in countries other than your own. Where it is, we
          take steps to ensure it remains protected in line with this policy and
          applicable law.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct,
          delete, or restrict the use of your personal information, and to object to
          certain processing or withdraw consent. To exercise any of these rights,
          contact us using the details below.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect your
          personal information against loss, misuse, and unauthorized access. No method
          of transmission or storage is completely secure, however, and we cannot
          guarantee absolute security.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          Our website and services are not directed at children, and we do not knowingly
          collect personal information from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date above. Material changes will be highlighted on
          this page.
        </p>

        <h2>Contact us</h2>
        <p>
          If you have any questions about this policy or how we handle your information,
          contact us at{" "}
          <a href={`mailto:${theme.brand.email}`}>{theme.brand.email}</a>.
        </p>
        </div>
      </Section>
    </>
  );
}
