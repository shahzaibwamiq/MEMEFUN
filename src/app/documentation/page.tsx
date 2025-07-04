"use client";

import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Documentation() {
  return (
    <>
      {/* Breadcrumb component to show navigation hierarchy */}
      <Breadcrum title="Documentation" />

      <section className="privacy_sec">
        <div className="container">
          <div className="row border_back">
            <div className="col-12">
              <h2>memes.fun Documentation</h2>
              <strong>Last Updated: 4th March 2025</strong>

              {/* Introduction paragraph */}
              <p>
              This documentation provides important information regarding the use of memes.fun and how we manage your data. We strive for transparency and security, ensuring that you understand how your information is collected, used, and protected on our platform.
              </p>

              {/* Section: Personal Data Controller */}
              <strong>Personal Data Controller</strong>
              <p>
              We respect your privacy and are committed to handling your personal data responsibly. The personal data controller for memes.fun is responsible for ensuring that your information is managed in compliance with relevant privacy regulations.
              </p>

              {/* Section: Types of Personal Data Collected */}
              <strong>Types of Personal Data Collected </strong>
              <p>
              We may collect the following types of personal data when you interact with memes.fun:
              </p>

              {/* Unordered list for data collection types */}
              <ul>
                <li>Personal Identifiable Information: Includes your name, email, and contact details.</li>
                <li>Transaction Data: Information about the tokens you create, buy, or sell on the platform.</li>
                <li>Technical Data: Information related to your device, IP address, and interactions with the platform.</li>
              </ul>

              {/* Section: Information We Automatically Collect */}
              <strong>Information We Automatically Collect</strong>
              <p>
              memes.fun automatically collects certain data when you use the platform. This includes:
              </p>
              <ul>
                <li>Browsing Information: Data about how you navigate the site, including pages visited and interactions.</li>
                <li>Cookies: Information collected through cookies to enhance your user experience and improve platform functionality.</li>
              </ul>

              {/* Section: Cookies & Similar Technologies */}
              <strong>Cookies & Similar Technologies</strong>
              <p>
              We use cookies and similar technologies to improve your experience on memes.fun. Cookies help us recognize your preferences, analyze site traffic, and ensure that the platform runs smoothly.
              <br/>
              You can manage your cookie preferences through your browser settings. However, please note that disabling certain cookies may impact the functionality of the platform.
              </p>

              {/* Section: How We Use Cookies */}
              <strong>How We Use Cookies</strong>
              <p>
                Sed ut pers is piciatis unde omnis iste natus error sit volu
                ptatem accusantium doloremque the laud antium, totam rem aperiam
                eaque ipsa quae ab illo inventore veritatis et quasi architect.
                onsequences that are extremely painful. Nor again is there
                anyone who loves or pursues or desires to obtain pain of itself,
                because it is pain, but because occasionally circumstances occur
                in which toil and pain can procure him some great example, which
                of us ever undertakes laborious physical exercise.{" "}
              </p>

              {/* General Information Section */}
              <strong>General</strong>
              <p>
                Sed ut pers is piciatis unde omnis iste natus error sit volu
                ptatem accusantium doloremque the laud antium, totam rem aperiam
                eaque ipsa quae ab illo inventore veritatis et quasi architect.
                onsequences that are extremely painful. Nor again is there
                anyone who loves or pursues or desires to obtain pain of itself,
                because it is pain, but because occasionally circumstances occur
                in which toil and pain can procure him some great example, which
                of us ever undertakes laborious physical exercise.{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
