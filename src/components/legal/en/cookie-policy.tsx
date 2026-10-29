import { CookieDeclaration } from "@/components/analytics/cookie-declaration";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { Link } from "@/i18n/navigation";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";

export function CookiePolicyEn() {
  return (
    <div className="max-w-[48rem] pb-16 md:pb-24">
      <div className="prose dark:prose-invert max-w-none">
        <h1>Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: October 29, 2026</p>

        <p>
          This Cookie Policy explains how Conversion Century Ltd. (VAT No.
          BG203901347, Yakubitsa 19, Sofia, Bulgaria) uses cookies and similar
          technologies on its website.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files placed on your device when you visit a
          website. Similar technologies, such as your browser&apos;s local
          storage, work in the same way. They help the site remember
          information about your visit.
        </p>

        <h2>Which cookies we use</h2>
        <p>We group the cookies on this website into four categories:</p>
        <ul>
          <li>
            <strong>Necessary</strong> – needed for the website to work, for
            example to remember your cookie choices or keep you signed in.
            These are always on.
          </li>
          <li>
            <strong>Preferences</strong> – remember choices you make, such as
            your language or colour scheme.
          </li>
          <li>
            <strong>Statistics</strong> – help us understand how visitors use
            the website, so we can improve it. Set only with your consent.
          </li>
          <li>
            <strong>Marketing</strong> – we don&apos;t currently use marketing
            or advertising cookies. If we start, we will ask for your consent
            first.
          </li>
        </ul>

        <h2>Your consent</h2>
        <p>
          When you first visit the website, a cookie banner asks which
          optional cookies you allow. Nothing except necessary cookies is set
          until you choose. The banner is provided by Cookiebot (Usercentrics
          A/S, Havnegade 39, 1058 Copenhagen, Denmark), which stores your
          choice in the <code>CookieConsent</code> cookie for 12 months and
          keeps an anonymous record of it as proof of consent. You can change
          or withdraw your consent at any time:
        </p>
        <p>
          <CookieSettingsButton label="Change or withdraw your consent" />
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Purpose</th>
                <th className="py-2 pr-4 font-semibold">Type</th>
                <th className="py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">CookieConsent</td>
                <td className="py-2 pr-4">
                  Stores your cookie choices (Cookiebot).
                </td>
                <td className="py-2 pr-4">Cookie, necessary</td>
                <td className="py-2">12 months</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">NEXT_LOCALE</td>
                <td className="py-2 pr-4">
                  Remembers the language you selected for the website.
                </td>
                <td className="py-2 pr-4">Cookie, necessary</td>
                <td className="py-2">Until you close your browser</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">theme</td>
                <td className="py-2 pr-4">
                  Remembers whether you chose the light or dark colour scheme.
                </td>
                <td className="py-2 pr-4">Local storage, preference</td>
                <td className="py-2">Until you clear your browser data</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">payload-token</td>
                <td className="py-2 pr-4">
                  Keeps team members and clients signed in to the dashboard.
                  Only set when you log in.
                </td>
                <td className="py-2 pr-4">Cookie, necessary</td>
                <td className="py-2">Until you log out or the session expires</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">sidebar_state</td>
                <td className="py-2 pr-4">
                  Remembers whether the dashboard sidebar is open or collapsed.
                  Only set for signed-in users.
                </td>
                <td className="py-2 pr-4">Cookie, preference</td>
                <td className="py-2">7 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">_ga</td>
                <td className="py-2 pr-4">
                  Google Analytics: distinguishes visitors with a random ID.
                </td>
                <td className="py-2 pr-4">Cookie, statistics</td>
                <td className="py-2">2 years</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">_ga_&lt;ID&gt;</td>
                <td className="py-2 pr-4">
                  Google Analytics: keeps track of your current visit.
                </td>
                <td className="py-2 pr-4">Cookie, statistics</td>
                <td className="py-2">2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The list below is kept up to date automatically by Cookiebot, which
          regularly scans the website:
        </p>
        <CookieDeclaration locale="en" />

        <h2>Website analytics</h2>
        <p>
          With your consent to statistics cookies, we use Google Analytics 4
          (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
          Ireland) to measure how the website is used: pages viewed, how
          visitors arrive, the device and browser type, and approximate
          location (country or city). We don&apos;t use it to identify you.
        </p>
        <p>
          Analytics data is first sent to our own server-side tagging server,
          on a subdomain of this website and hosted by Stape in the European
          Union, which forwards it to Google. This lets us remove data before
          it reaches Google and set the analytics cookies as our own
          (first-party) cookies.
        </p>
        <p>
          If you decline statistics cookies, no analytics cookies are set.
          Through Google Consent Mode, the website then sends Google only
          limited, cookieless signals: that a page was viewed or a form was
          sent, with the time, the page address and basic browser
          information, but without any cookie or identifier that could
          recognise you or link your visits. Google uses these signals only
          to estimate overall visitor numbers. More information is available
          in our{" "}
          <Link href="/legal/privacy-policy">Privacy Policy</Link>.
        </p>

        <h2>Embedded videos</h2>
        <p>
          Some pages include YouTube videos. We embed them in YouTube&apos;s
          privacy-enhanced mode (youtube-nocookie.com), so YouTube does not
          store cookies on your device just because you view the page. Once
          you play a video, YouTube may store information on your device in
          accordance with{" "}
          <a href="https://policies.google.com/privacy" rel={EXTERNAL_LINK_REL}>
            Google&apos;s privacy policy
          </a>
          .
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can change your cookie choices at any time with the &quot;Cookie
          settings&quot; link at the bottom of every page. Most web browsers
          also allow you to view, block and delete cookies and local storage
          through their settings, usually under &quot;Privacy&quot; or
          &quot;Preferences&quot;. If you block necessary cookies, some parts
          of the website, such as signing in to the dashboard or remembering
          your language, may not work.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We update this policy when the cookies we use change, and ask for
          your consent again where the law requires it. The date at the top
          shows when it was last updated.
        </p>

        <h2>Contact us</h2>
        <p>
          If you have questions about this Cookie Policy, contact us at{" "}
          <a href="mailto:info@conversion-century.com">
            info@conversion-century.com
          </a>{" "}
          or +359 896 150 980. More information about how we process personal
          data is available in our{" "}
          <Link href="/legal/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
