import type { Metadata } from "next";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export const metadata: Metadata = {
  title: "Terms of Service | Viewnear",
  description: "The terms that govern your use of the Viewnear website and services.",
};

export default function TermsPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Legal"
            title={
              <>
                Terms of <span className="text-gradient">Service</span>
              </>
            }
            description="The terms that govern your use of our website and services."
          />
        </div>
      </div>

      <Section>
        <div className="prose-vn max-w-3xl">
          <p className="text-muted">Last updated: 7 June 2026</p>

          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the{" "}
            {theme.brand.name} website and any services we provide through it. By using our
            website you agree to these Terms. If you do not agree, please do not use the site.
          </p>

          <h2>Use of the site</h2>
          <p>
            You may use this website for lawful purposes only. You agree not to misuse the site,
            interfere with its operation, attempt to access it in an unauthorized way, or use it
            to infringe the rights of others.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content on this site (including text, graphics, logos, and the {theme.brand.name}{" "}
            brand) is owned by {theme.brand.name} or its licensors and is protected by applicable
            intellectual-property laws. You may not reproduce, distribute, or create derivative
            works without our prior written permission, except as permitted for personal,
            non-commercial reference.
          </p>

          <h2>Services & engagements</h2>
          <p>
            Information on this site is for general guidance and does not constitute a binding
            offer. Any consulting or delivery engagement is governed by a separate written
            agreement between you and {theme.brand.name}, which sets out scope, fees, timelines,
            and obligations. Where those terms conflict with these, the engagement agreement
            prevails.
          </p>

          <h2>Third-party references</h2>
          <p>
            We reference third-party products and platforms (including Snowflake) for descriptive
            purposes. Those names and marks belong to their respective owners, and their use does
            not imply endorsement beyond any partnership we expressly describe.
          </p>

          <h2>No warranties</h2>
          <p>
            The site and its content are provided &ldquo;as is&rdquo; without warranties of any
            kind, express or implied, including fitness for a particular purpose. We do not
            guarantee that the site will be uninterrupted, error-free, or secure.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {theme.brand.name} will not be liable for any
            indirect, incidental, or consequential damages arising from your use of the site.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Our site may link to third-party websites we do not control. We are not responsible
            for their content or practices, and these Terms do not apply to them.
          </p>

          <h2>Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date above. Continued use of the site after changes take
            effect constitutes acceptance of the revised Terms.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about these Terms? Contact us at{" "}
            <a href={`mailto:${theme.brand.email}`}>{theme.brand.email}</a>.
          </p>
        </div>
      </Section>
    </>
  );
}
