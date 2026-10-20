import { Link } from "@/i18n/navigation";

export default function CookiePolicyPage() {
  return (
    <div className="max-w-[48rem] pb-16 md:pb-24">
      <div className="prose dark:prose-invert max-w-none">
        <h1>Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: October 19, 2026</p>

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
        <p>
          We only use cookies and local storage that are strictly necessary
          for the website to work or that remember a choice you have made.
          We do not use analytics, advertising or tracking cookies, and we do
          not share cookie data with third parties for marketing purposes.
          Because these cookies are exempt from the consent requirement, we
          do not show a cookie banner.
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
            </tbody>
          </table>
        </div>

        <h2>Embedded videos</h2>
        <p>
          Some pages include YouTube videos. We embed them in YouTube&apos;s
          privacy-enhanced mode (youtube-nocookie.com), so YouTube does not
          store cookies on your device just because you view the page. Once
          you play a video, YouTube may store information on your device in
          accordance with{" "}
          <a href="https://policies.google.com/privacy">
            Google&apos;s privacy policy
          </a>
          .
        </p>

        <h2>Managing cookies</h2>
        <p>
          Most web browsers allow you to view, block and delete cookies and
          local storage through their settings, usually under
          &quot;Privacy&quot; or &quot;Preferences&quot;. If you block
          necessary cookies, some parts of the website, such as signing in to
          the dashboard or remembering your language, may not work.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we start using other cookies, for example for analytics, we will
          update this policy and ask for your consent where the law requires
          it.
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
