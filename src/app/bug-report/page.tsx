'use client'


import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function BugReport() {
        return (
        <>
         {/* Breadcrumb for navigation */}
            <Breadcrum title="Bug Report" />

            {/* Privacy policy section */}
            <section className="privacy_sec form_sec">
                <div className="container">
                    <div className="row border_back">
                      <div className="col-12">
                          <form action="#" method="post">
    <h1>Bug Hunt Bounty Form</h1>
    <p>If something’s broken, weird, or suspicious, drop it here. You might get rewarded in the future if it&#39;s solid.</p>

    <label htmlFor="wallet">ZIGChain Wallet Address *</label>
    <input type="text" id="wallet" name="wallet" required placeholder="zig1..."/>

    <label htmlFor="bug">What Happened? *</label>
    <textarea id="bug" name="bug" required placeholder="Describe what went wrong and how we can recreate it."></textarea>

    <label>Bug Severity *</label>
    <div className="radio-group">
      <label><input type="radio" name="severity" value="minor" required/> Minor – Small visual issue or typo</label>
      <label><input type="radio" name="severity" value="medium"/> Medium – Something&#39;s not working, but not critical</label>
      <label><input type="radio" name="severity" value="major"/> Major – A key feature is broken</label>
      <label><input type="radio" name="severity" value="critical"/> Critical – Major failure or exploitable bug</label>
    </div>

    <label htmlFor="media">Upload Screenshot or Video</label>
    <input type="file" id="media" name="media[]" accept=".png,.jpg,.jpeg,.gif,.mp4" multiple/>

    <label htmlFor="device">Device & Browser Info</label>
    <input type="text" id="device" name="device" placeholder="e.g. Firefox on Windows, Safari on iPhone"/>

    <label htmlFor="telegram">Telegram Handle (optional)</label>
    <input type="text" id="telegram" name="telegram" placeholder="@username"/>

    <small>Do not share your private keys or seed phrases. We will never ask for them.</small>

    <button type="submit">Submit Bug Report</button>
  </form>
                      </div>
                    </div>
                </div>
            </section>

        </>
    );
};